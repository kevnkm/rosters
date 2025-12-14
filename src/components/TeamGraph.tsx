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

const WIDTH = 800;
const HEIGHT = 500;
const RADIUS = 36;

const TeamGraph: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const simulationRef = useRef<d3.Simulation<PlayerNode, undefined> | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);

        // === TEAM COLORS ===
        const teamColors: Record<string, string> = {
            Warriors: "#1D428A",
            Lakers: "#552583",
        };

        // === CREATE NODE GROUPS ONCE ===
        const nodeGroup = svg
            .selectAll<SVGGElement, PlayerNode>("g.node")
            .data(NODES, d => d.id)
            .join("g")
            .attr("class", "node cursor-grab active:cursor-grabbing");

        nodeGroup
            .append("circle")
            .attr("r", RADIUS)
            .attr("fill", d => teamColors[d.team] || "#666")
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

        // === DRAG BEHAVIOR ===
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

        // === CUSTOM FORCE FOR TEAM ATTRACTION ===
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

        // === FORCE SIMULATION ===
        const simulation = d3
            .forceSimulation<PlayerNode>(NODES)
            .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("collision", d3.forceCollide(RADIUS + 10))
            .force("teamAttraction", teamAttractionForce)
            .velocityDecay(0.4)
            .on("tick", () => {
                nodeGroup.attr(
                    "transform",
                    d => `translate(${d.x ?? WIDTH / 2}, ${d.y ?? HEIGHT / 2})`
                );
            });

        simulationRef.current = simulation;

        return () => {
            simulation.stop();
        };
    }, []);

    return (
        <div className="w-full">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            />
        </div>
    );
};

export default TeamGraph;