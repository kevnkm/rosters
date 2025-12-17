// components/TeamGraph.tsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type PlayerNode = d3.SimulationNodeDatum & {
    id: string;
    label: string;
    fullName: string;
    team: string;
    teamAbbr: string;
    jersey?: string;
};

const RADIUS = 36;
const DEFAULT_COLOR = "#666666";
const DEFAULT_ALTERNATE = "#000000";
const DATA_URL = "https://cdn.jsdelivr.net/gh/kevnkm/rosters-data@main/nba/2025-26.json";

interface Athlete {
    id: string;
    shortName?: string;
    fullName: string;
    jersey?: string;
}

interface Roster {
    athletes: Athlete[];
}

interface TeamInfo {
    abbreviation: string;
    displayName: string;
    color: string;
    alternateColor?: string;
    logo: string;
}

interface TeamData {
    team_info: TeamInfo;
    roster: Roster;
}

interface RosterData {
    teams: Record<string, TeamData>;
}

interface TeamGraphProps {
    selectedTeamAbbrs?: string[];
}

const TeamGraph: React.FC<TeamGraphProps> = ({ selectedTeamAbbrs }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    const simulationRef = useRef<d3.Simulation<PlayerNode, undefined> | null>(null);

    const [nodes, setNodes] = useState<PlayerNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Base fixed centers (hexagonal layout, recalculated on resize)
    const baseTeamCentersRef = useRef<Record<string, { x: number; y: number }>>({});
    // User-defined offset per team
    const teamOffsetRef = useRef<Record<string, { x: number; y: number }>>({});
    // Global pan offset
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
                const teamAlternateColors: Record<string, string> = {};
                const teamLogos: Record<string, string> = {};

                // Only show teams if selectedTeamAbbrs is provided and has items
                const teamsToShow = selectedTeamAbbrs && selectedTeamAbbrs.length > 0
                    ? selectedTeamAbbrs
                    : [];

                Object.values(data.teams)
                    .filter((teamData) => teamsToShow.includes(teamData.team_info.abbreviation))
                    .forEach((teamData) => {
                        const info = teamData.team_info;
                        const teamName = info.displayName;
                        const hex = info.color;
                        const fullHex = hex ? `#${hex.toUpperCase()}` : DEFAULT_COLOR;
                        teamColors[teamName] = fullHex;
                        const altHex = info.alternateColor
                            ? `#${info.alternateColor.toUpperCase()}`
                            : DEFAULT_ALTERNATE;
                        teamAlternateColors[teamName] = altHex;
                        teamLogos[teamName] = info.logo;

                        teamData.roster.athletes.forEach((athlete) => {
                            const label = athlete.shortName || athlete.fullName || "Unknown";
                            newNodes.push({
                                id: athlete.id,
                                label,
                                fullName: athlete.fullName,
                                team: teamName,
                                teamAbbr: info.abbreviation,
                                jersey: athlete.jersey,
                            });
                        });
                    });

                setNodes(newNodes);
                (window as any).__teamColors = teamColors;
                (window as any).__teamAlternateColors = teamAlternateColors;
                (window as any).__teamLogos = teamLogos;
            } catch (err) {
                console.error(err);
                setError("Failed to load NBA roster data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedTeamAbbrs]);

    useEffect(() => {
        if (loading || error || nodes.length === 0 || !containerRef.current || !svgRef.current || !gRef.current) return;

        const container = containerRef.current;
        const svg = d3.select(svgRef.current);
        const contentG = d3.select(gRef.current);

        const tooltip = d3.select("body")
            .append("div")
            .attr("id", "player-tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.92)")
            .style("color", "#fff")
            .style("padding", "10px 14px")
            .style("border-radius", "8px")
            .style("font-size", "15px")
            .style("font-weight", "700")
            .style("pointer-events", "none")
            .style("z-index", "10000")
            .style("box-shadow", "0 4px 12px rgba(0,0,0,0.4)")
            .style("opacity", "0")
            .style("transition", "opacity 0.2s ease");

        const getSize = () => container.getBoundingClientRect();
        let { width, height } = getSize();
        svg.attr("width", width).attr("height", height);

        const teams = Array.from(new Set(nodes.map((n) => n.team)));

        const getTeamColor = (team: string): string =>
            (window as any).__teamColors?.[team] || DEFAULT_COLOR;

        const getTeamAlternateColor = (team: string): string =>
            (window as any).__teamAlternateColors?.[team] || DEFAULT_ALTERNATE;

        const getTeamLogo = (team: string): string =>
            (window as any).__teamLogos?.[team] || "";

        // === CLEANUP PREVIOUS CONTENT ===
        contentG.selectAll("*").remove();
        svg.selectAll("defs").remove();

        // === RE-CREATE DEFS FOR GRADIENTS ===
        const defs = svg.append("defs");
        teams.forEach((team) => {
            const gradId = `gradient-${team.replace(/\s+/g, '-')}`;
            const color = getTeamColor(team);
            const alternateColor = getTeamAlternateColor(team);

            const gradient = defs.append("radialGradient")
                .attr("id", gradId)
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "100%")
                .attr("fx", "50%")
                .attr("fy", "50%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", color)
                .attr("stop-opacity", 0.8);

            gradient.append("stop")
                .attr("offset", "30%")
                .attr("stop-color", alternateColor)
                .attr("stop-opacity", 0.8);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", alternateColor)
                .attr("stop-opacity", 0);
        });

        // === RECALCULATE BASE CENTERS ===
        const GLOW_RADIUS = 280;
        const MIN_CENTER_DISTANCE = GLOW_RADIUS * 3;
        const FIXED_BASE_SPACING = 300;

        const calculateBaseTeamCenters = (
            teamList: string[],
            w: number,
            h: number
        ): Record<string, { x: number; y: number }> => {
            const centerX = w / 2;
            const centerY = h / 2;
            const numTeams = teamList.length;

            if (numTeams === 0) return {};

            const positions: { x: number; y: number }[] = [];

            // Center position
            positions.push({ x: 0, y: 0 });

            if (numTeams === 1) {
                // only center
            } else {
                let placed = 1;
                let ring = 1;

                while (placed < numTeams) {
                    const pointsInRing = 6 * ring;
                    const toAdd = Math.min(pointsInRing, numTeams - placed);

                    // Enforce minimum distance by scaling ring radius
                    const desiredRadius = ring * FIXED_BASE_SPACING;
                    const minRadiusForThisRing = (ring * MIN_CENTER_DISTANCE) / Math.sqrt(3); // Approx hexagonal min
                    const radius = Math.max(desiredRadius, minRadiusForThisRing);

                    for (let i = 0; i < toAdd; i++) {
                        const angle = (i / pointsInRing) * 2 * Math.PI + Math.PI / 6; // 30° offset for hex alignment
                        const px = radius * Math.cos(angle);
                        const py = radius * Math.sin(angle);
                        positions.push({ x: px, y: py });
                    }

                    placed += toAdd;
                    ring += 1;
                }
            }

            // Assign and shift to container center
            return teamList.reduce((acc, team, i) => {
                const pos = positions[i];
                acc[team] = {
                    x: centerX + pos.x,
                    y: centerY + pos.y,
                };
                return acc;
            }, {} as Record<string, { x: number; y: number }>);
        };

        baseTeamCentersRef.current = calculateBaseTeamCenters(teams, width, height);
        teamOffsetRef.current = {}; // Reset individual offsets
        globalOffsetRef.current = { x: 0, y: 0 };

        // === TEAM GLOW CIRCLES (BEHIND EVERYTHING) ===
        const teamGlowGroup = contentG.append("g").attr("class", "team-glows");

        const glowCircles = teamGlowGroup
            .selectAll<SVGCircleElement, string>("circle.glow")
            .data(teams, (d) => d)
            .join(
                enter => enter.append("circle")
                    .attr("class", "glow")
                    .attr("r", GLOW_RADIUS)
                    .attr("fill", (team) => `url(#gradient-${team.replace(/\s+/g, '-')})`)
                    .attr("pointer-events", "none")
                    .attr("cx", (team) => getEffectiveCenter(team).x)
                    .attr("cy", (team) => getEffectiveCenter(team).y),
                update => update
                    .attr("fill", (team) => `url(#gradient-${team.replace(/\s+/g, '-')})`)
                    .transition().duration(300)
                    .attr("cx", (team) => getEffectiveCenter(team).x)
                    .attr("cy", (team) => getEffectiveCenter(team).y),
                exit => exit.remove()
            );

        // === TEAM LOGOS ===
        const LOGO_SIZE = 360;

        const logoGroup = contentG.append("g").attr("class", "team-logos");

        const logos = logoGroup
            .selectAll<SVGImageElement, string>("image.logo")
            .data(teams, (d) => d)
            .join("image")
            .attr("class", "logo")
            .attr("href", getTeamLogo)
            .attr("x", (team) => getEffectiveCenter(team).x - LOGO_SIZE / 2)
            .attr("y", (team) => getEffectiveCenter(team).y - LOGO_SIZE / 2)
            .attr("width", LOGO_SIZE)
            .attr("height", LOGO_SIZE)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("opacity", 0.18)
            .attr("pointer-events", "none")

        // === NODES (on top of glows and logos) ===
        const nodeGroup = contentG.append("g").attr("class", "nodes")
            .selectAll<SVGGElement, PlayerNode>("g.node")
            .data(nodes, (d) => d.id)
            .join("g")
            .attr("class", "node");

        // Background circle
        nodeGroup.append("circle")
            .attr("r", RADIUS)
            .attr("fill", (d) => getTeamColor(d.team))
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("opacity", 0.9);

        // Jersey number
        nodeGroup.append("text")
            .attr("class", "jersey")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "#ffffff")
            .attr("fill-opacity", 0.20)
            .attr("font-size", "48px")
            .attr("font-weight", "900")
            .attr("pointer-events", "none")
            .text((d) => d.jersey ?? "");

        // Player label
        nodeGroup.append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("dy", "-4px")
            .attr("fill", "#fff")
            .attr("font-size", "11px")
            .attr("font-weight", "600")
            .attr("pointer-events", "none")
            .text((d) => d.label);

        // === TOOLTIP HANDLERS ===
        nodeGroup
            .on("mouseenter", function (event, d) {
                tooltip
                    .html(`
                        <div style="text-align:center;">
                        <div style="font-size:18px;">${d.jersey ? `#${d.jersey}` : ""} ${d.fullName}</div>
                        <div style="font-size:13px; opacity:0.8; margin-top:4px;">${d.team}</div>
                        </div>
                    `)
                    .style("left", `${event.pageX + 20}px`)
                    .style("top", `${event.pageY - 15}px`)
                    .transition()
                    .duration(150)
                    .style("opacity", "1");
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", `${event.pageX + 20}px`)
                    .style("top", `${event.pageY - 15}px`);
            })
            .on("mouseleave", () => {
                tooltip.transition().duration(200).style("opacity", "0");
            })
            .style("cursor", "pointer");

        // === FORCES ===
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
            }
        };

        // === DRAG (moves whole team) ===
        const drag = d3.drag<SVGGElement, PlayerNode>()
            .on("start", (event, d) => {
                if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;

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

        // === SIMULATION ===
        const simulation = d3.forceSimulation<PlayerNode>(nodes)
            .force("charge", d3.forceManyBody().strength(-80))
            .force("collision", d3.forceCollide(RADIUS + 10))
            .force("team-center", teamCenterForce())
            .force("clamp", clampForce)
            .velocityDecay(0.5)
            .on("tick", () => {
                nodeGroup.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);

                glowCircles
                    .attr("cx", (team) => getEffectiveCenter(team).x)
                    .attr("cy", (team) => getEffectiveCenter(team).y);

                logos
                    .attr("x", (team) => getEffectiveCenter(team).x - LOGO_SIZE / 2)
                    .attr("y", (team) => getEffectiveCenter(team).y - LOGO_SIZE / 2);
            });

        simulationRef.current = simulation;

        // === ZOOM ===
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 4])
            .on("zoom", (event) => {
                contentG.attr("transform", event.transform.toString());
            });

        svg.call(zoom);

        // === RESIZE HANDLER ===
        const handleResize = () => {
            ({ width, height } = getSize());
            svg.attr("width", width).attr("height", height);

            // Re-calculate only the centering offset
            baseTeamCentersRef.current = calculateBaseTeamCenters(teams, width, height);
            simulation.alpha(0.5).restart();
        };

        window.addEventListener("resize", handleResize);

        // === CLEANUP ===
        return () => {
            window.removeEventListener("resize", handleResize);
            simulation.stop();
            d3.select("#player-tooltip").remove();
        };
    }, [nodes, loading, error]);

    if (loading) {
        return <div className="w-full h-full flex items-center justify-center text-gray-500">Loading NBA rosters...</div>;
    }

    if (error) {
        return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>;
    }

    // Show message when no teams are selected
    if (nodes.length === 0) {
        return <div className="w-full h-full flex items-center justify-center text-gray-500">Select teams to visualize</div>;
    }

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef} className="w-full h-full">
                <g ref={gRef} />
            </svg>
        </div>
    );
};

export default TeamGraph;