// components/TeamGraph.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type PlayerNode = {
    id: string;
    label: string;
    team: string;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
};

const NODES: PlayerNode[] = [
    { id: "curry", label: "S. Curry", team: "Warriors" },
    { id: "thompson", label: "K. Thompson", team: "Warriors" },
    { id: "green", label: "D. Green", team: "Warriors" },
    { id: "wiggins", label: "A. Wiggins", team: "Warriors" },
    { id: "looney", label: "K. Looney", team: "Warriors" },
    { id: "lebron", label: "L. James", team: "Lakers" },
    { id: "davis", label: "A. Davis", team: "Lakers" },
    { id: "reaves", label: "A. Reaves", team: "Lakers" },
];

const RADIUS = 36;

const TeamGraph: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const simulationRef = useRef<d3.Simulation<PlayerNode, undefined> | null>(null);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const container = containerRef.current;

        // === TEAM COLORS ===
        const teamColors: Record<string, string> = {
            Warriors: "#1D428A",
            Lakers: "#552583",
        };

        // === NODES ===
        const nodeGroup = svg
            .selectAll<SVGGElement, PlayerNode>("g.node")
            .data(NODES, d => d.id)
            .join("g")
            .attr("class", "node cursor-grab");

        nodeGroup
            .append("circle")
            .attr("r", RADIUS)
            .attr("fill", d => teamColors[d.team])
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("opacity", 0.8);

        nodeGroup
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("class", "text-[11px] font-semibold pointer-events-none")
            .attr("fill", "#fff")
            .text(d => d.label);

        // === DRAG ===
        const drag = d3
            .drag<SVGGElement, PlayerNode>()
            .on("start", (event, d) => {
                if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulationRef.current?.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });

        nodeGroup.call(drag);

        // === TEAM ATTRACTION FORCE ===
        const teamAttractionForce = () => {
            NODES.forEach(nodeA => {
                NODES.forEach(nodeB => {
                    if (nodeA.id !== nodeB.id && nodeA.team === nodeB.team) {
                        const dx = (nodeB.x ?? 0) - (nodeA.x ?? 0);
                        const dy = (nodeB.y ?? 0) - (nodeA.y ?? 0);
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance > 0) {
                            const strength = 0.01;
                            const force = strength * distance;

                            nodeA.vx = (nodeA.vx ?? 0) + (dx / distance) * force;
                            nodeA.vy = (nodeA.vy ?? 0) + (dy / distance) * force;
                        }
                    }
                });
            });
        };

        // === INITIAL SIZE ===
        const resize = () => {
            const { width, height } = container.getBoundingClientRect();

            svg.attr("width", width).attr("height", height);

            simulationRef.current
                ?.force("center", d3.forceCenter(width / 2, height / 2))
                ?.alpha(0.5)
                ?.restart();
        };

        const { width, height } = container.getBoundingClientRect();

        // === SIMULATION ===
        const simulation = d3
            .forceSimulation<PlayerNode>(NODES)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("collision", d3.forceCollide(RADIUS + 10))
            .force("team", teamAttractionForce)
            .velocityDecay(0.35)
            .on("tick", () => {
                nodeGroup.attr(
                    "transform",
                    d => `translate(${d.x ?? 0}, ${d.y ?? 0})`
                );
            });

        simulationRef.current = simulation;

        resize();
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
            simulation.stop();
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
};

export default TeamGraph;