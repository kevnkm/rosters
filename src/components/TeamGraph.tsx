// components/TeamGraph.tsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type PlayerNode = d3.SimulationNodeDatum & {
    id: string;
    label: string;
    team: string;
    teamAbbr: string;
};

interface TeamGraphProps {
    isPointerMode?: boolean; // true (default): drag individual nodes → move own team; false: pan all clusters
}

const RADIUS = 36;
const DEFAULT_COLOR = "#666666";
const DATA_URL = "https://cdn.jsdelivr.net/gh/kevnkm/rosters-data@main/nba/2025-26.json";

interface Athlete {
    id: string;
    shortName?: string;
    fullName: string;
}

interface Roster {
    athletes: Athlete[];
}

interface TeamInfo {
    abbreviation: string;
    displayName: string;
    color: string;
}

interface TeamData {
    team_info: TeamInfo;
    roster: Roster;
}

interface RosterData {
    teams: Record<string, TeamData>;
}

const TeamGraph: React.FC<TeamGraphProps> = ({ isPointerMode = true }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const simulationRef = useRef<d3.Simulation<PlayerNode, undefined> | null>(null);
    const [nodes, setNodes] = useState<PlayerNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Base fixed centers (hexagonal layout, recalculated on resize)
    const baseTeamCentersRef = useRef<Record<string, { x: number; y: number }>>({});
    // User-defined offset per team (only modified when dragging a node in pointer mode)
    const teamOffsetRef = useRef<Record<string, { x: number; y: number }>>({});
    // Global pan offset (only used and modified in pan mode: isPointerMode=false)
    const globalOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Effective center = base + teamOffset + globalOffset
    const getEffectiveCenter = (team: string) => {
        const base = baseTeamCentersRef.current[team] || { x: 0, y: 0 };
        const teamOffset = teamOffsetRef.current[team] || { x: 0, y: 0 };
        return {
            x: base.x + teamOffset.x + globalOffsetRef.current.x,
            y: base.y + teamOffset.y + globalOffsetRef.current.y,
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(DATA_URL);
                if (!response.ok) throw new Error("Failed to fetch roster data");
                const data: RosterData = await response.json();

                const newNodes: PlayerNode[] = [];
                const teamColors: Record<string, string> = {};

                const selectedTeams = ["GS", "LAL", "BOS", "MIA", "PHX", "MIL", "NYK"];

                Object.values(data.teams)
                    .filter((teamData) => selectedTeams.includes(teamData.team_info.abbreviation))
                    .forEach((teamData) => {
                        const info = teamData.team_info;
                        const teamName = info.displayName;
                        const hex = info.color;
                        const fullHex = hex ? `#${hex.toUpperCase()}` : DEFAULT_COLOR;
                        teamColors[teamName] = fullHex;

                        teamData.roster.athletes.forEach((athlete) => {
                            const label = athlete.shortName || athlete.fullName || "Unknown";
                            newNodes.push({
                                id: athlete.id,
                                label,
                                team: teamName,
                                teamAbbr: info.abbreviation,
                            });
                        });
                    });

                setNodes(newNodes);
                (window as any).__teamColors = teamColors;
            } catch (err) {
                console.error(err);
                setError("Failed to load NBA roster data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (loading || error || nodes.length === 0 || !containerRef.current || !svgRef.current) return;

        const container = containerRef.current;
        const svg = d3.select(svgRef.current);

        const getSize = () => container.getBoundingClientRect();
        let { width, height } = getSize();
        svg.attr("width", width).attr("height", height);

        const teams = Array.from(new Set(nodes.map((n) => n.team)));

        const calculateBaseTeamCenters = (
            teamList: string[],
            w: number,
            h: number
        ): Record<string, { x: number; y: number }> => {
            const centerX = w / 2;
            const centerY = h / 2;
            const spacing = Math.min(w, h) * 0.4;
            const positions = [
                { x: 0, y: 0 },
                { x: spacing, y: 0 },
                { x: spacing / 2, y: (spacing * Math.sqrt(3)) / 1 },
                { x: -spacing / 2, y: (spacing * Math.sqrt(3)) / 1 },
                { x: -spacing, y: 0 },
                { x: 0, y: -spacing },
                { x: spacing / 2, y: -(spacing * Math.sqrt(3)) / 1 },
            ].slice(0, teamList.length);

            return teamList.reduce((acc, team, i) => {
                acc[team] = {
                    x: centerX + positions[i].x,
                    y: centerY + positions[i].y,
                };
                return acc;
            }, {} as Record<string, { x: number; y: number }>);
        };

        // Reset base centers and offsets on data/load
        baseTeamCentersRef.current = calculateBaseTeamCenters(teams, width, height);
        teamOffsetRef.current = {}; // clear individual team offsets
        globalOffsetRef.current = { x: 0, y: 0 };

        const getTeamColor = (team: string): string =>
            (window as any).__teamColors?.[team] || DEFAULT_COLOR;

        // === NODES ===
        const nodeGroup = svg
            .selectAll<SVGGElement, PlayerNode>("g.node")
            .data(nodes, (d) => d.id)
            .join("g")
            .attr("class", "node")
            .classed("cursor-grab", isPointerMode);

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

        // Custom force: attract to effective team center
        const teamCenterForce = (strength = 0.08) => {
            return (alpha: number) => {
                for (const node of nodes) {
                    const center = getEffectiveCenter(node.team);
                    node.vx ??= 0;
                    node.vy ??= 0;
                    node.vx += (center.x - (node.x ?? 0)) * strength * alpha;
                    node.vy += (center.y - (node.y ?? 0)) * strength * alpha;
                }
            };
        };

        const MAX_DISTANCE_FROM_CENTER = 220;
        const clampForce = () => {
            for (const node of nodes) {
                const center = getEffectiveCenter(node.team);
                if (!center || node.x === undefined || node.y === undefined) continue;
                const dx = node.x - center.x;
                const dy = node.y - center.y;
                const dist = Math.hypot(dx, dy);
                if (dist > MAX_DISTANCE_FROM_CENTER) {
                    const pullStrength = (dist - MAX_DISTANCE_FROM_CENTER) * 0.15;
                    node.vx ??= 0;
                    node.vy ??= 0;
                    node.vx -= (dx / dist) * pullStrength;
                    node.vy -= (dy / dist) * pullStrength;
                }
            };
        };

        // === DRAG BEHAVIOR ===
        // Clear any previous drag handlers
        nodeGroup.on(".drag", null);
        svg.on(".drag", null);

        if (isPointerMode) {
            // Pointer mode: drag individual nodes → move only that team
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

                    // Update only this team's offset
                    const base = baseTeamCentersRef.current[d.team];
                    if (base) {
                        teamOffsetRef.current[d.team] = {
                            x: event.x - base.x - globalOffsetRef.current.x,
                            y: event.y - base.y - globalOffsetRef.current.y,
                        };
                    }
                    simulationRef.current?.alphaTarget(0.5);
                })
                .on("end", (event, d) => {
                    if (!event.active) simulationRef.current?.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                });

            nodeGroup.call(drag);
        } else {
            // Pan mode: drag anywhere → move global offset
            const panDrag = d3
                .drag<SVGSVGElement, unknown>()
                .on("start", () => {
                    svg.attr("cursor", "grabbing");
                })
                .on("drag", (event) => {
                    globalOffsetRef.current.x += event.dx;
                    globalOffsetRef.current.y += event.dy;
                    simulationRef.current?.alpha(0.5).restart();
                })
                .on("end", () => {
                    svg.attr("cursor", "grab");
                });

            svg.call(panDrag);
            svg.attr("cursor", "grab");
        }

        // === SIMULATION ===
        const simulation = d3
            .forceSimulation<PlayerNode>(nodes)
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
            baseTeamCentersRef.current = calculateBaseTeamCenters(teams, width, height);
            simulation.alpha(0.5).restart();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            simulation.stop();
        };
    }, [nodes, loading, error, isPointerMode]);

    if (loading) {
        return <div className="w-full h-full flex items-center justify-center text-gray-500">Loading NBA rosters...</div>;
    }

    if (error) {
        return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
};

export default TeamGraph;