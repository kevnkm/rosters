// components/TeamGraph.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type PlayerNode = d3.SimulationNodeDatum & {
    id: string;
    label: string;
    team: string;
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
    { id: "tatum", label: "J. Tatum", team: "Celtics" },
    { id: "brown", label: "J. Brown", team: "Celtics" },
];

const RADIUS = 36;

const TEAM_COLORS: Record<string, string> = {
    Warriors: "#1D428A",
    Lakers: "#552583",
    Celtics: "#007A33",
    default: "#666666",
};

const getTeamColor = (team: string): string =>
    TEAM_COLORS[team] || TEAM_COLORS.default;

const TeamGraph: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const simulationRef = useRef<d3.Simulation<PlayerNode, undefined> | null>(null);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        const container = containerRef.current;
        const svg = d3.select(svgRef.current);

        const getSize = () => container.getBoundingClientRect();
        let { width, height } = getSize();
        svg.attr("width", width).attr("height", height);

        const teams = Array.from(new Set(NODES.map((n) => n.team)));

        const calculateTeamCenters = (
            teamList: string[],
            w: number,
            h: number
        ): Record<string, { x: number; y: number }> => {
            const centerX = w / 2;
            const centerY = h / 2;

            const baseRadius = Math.min(w, h) * 0.35;
            const radius = baseRadius * Math.max(0.6, 1 - (teamList.length - 2) * 0.05);

            return teamList.reduce((acc, team, i) => {
                const angle = (i / teamList.length) * 2 * Math.PI - Math.PI / 2;
                acc[team] = {
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle),
                };
                return acc;
            }, {} as Record<string, { x: number; y: number }>);
        };

        // === NODES ===
        let teamCenters = calculateTeamCenters(teams, width, height);

        const nodeGroup = svg
            .selectAll<SVGGElement, PlayerNode>("g.node")
            .data(NODES, d => d.id)
            .join("g")
            .attr("class", "node cursor-grab");

        nodeGroup
            .selectAll("circle")
            .data((d) => [d])
            .join("circle")
            .attr("r", RADIUS)
            .attr("fill", (d) => getTeamColor(d.team))
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("opacity", 0.9);

        nodeGroup
            .selectAll("text")
            .data((d) => [d])
            .join("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "#fff")
            .attr("class", "text-[11px] font-semibold pointer-events-none select-none")
            .text((d) => d.label);

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

        // Custom force: attract nodes to their team center
        const teamCenterForce = (strength = 0.08) => {
            return (alpha: number) => {
                for (const node of NODES) {
                    const center = teamCenters[node.team];
                    if (!center) continue;
                    node.vx! += (center.x - (node.x ?? 0)) * strength * alpha;
                    node.vy! += (center.y - (node.y ?? 0)) * strength * alpha;
                }
            };
        };

        // Custom force: gently clamp nodes from drifting too far from their team
        const MAX_DISTANCE_FROM_CENTER = 220;
        const clampForce = () => {
            for (const node of NODES) {
                const center = teamCenters[node.team];
                if (!center || node.x === undefined || node.y === undefined) continue;

                const dx = node.x - center.x;
                const dy = node.y - center.y;
                const dist = Math.hypot(dx, dy);

                if (dist > MAX_DISTANCE_FROM_CENTER) {
                    const pullStrength = (dist - MAX_DISTANCE_FROM_CENTER) * 0.15;
                    node.vx! -= (dx / dist) * pullStrength;
                    node.vy! -= (dy / dist) * pullStrength;
                }
            };
        };

        // === SIMULATION ===
        const simulation = d3
            .forceSimulation<PlayerNode>(NODES)
            .force("charge", d3.forceManyBody().strength(-80))
            .force("collision", d3.forceCollide(RADIUS + 10))
            .force("team-center", teamCenterForce())
            .force("clamp", clampForce)
            .velocityDecay(0.5)
            .on("tick", () => {
                nodeGroup.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
            });

        simulationRef.current = simulation;

        const handleResize = () => {
            ({ width, height } = getSize());
            svg.attr("width", width).attr("height", height);

            teamCenters = calculateTeamCenters(teams, width, height);
            simulation.alpha(0.5).restart();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
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