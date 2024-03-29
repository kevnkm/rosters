import * as d3 from "d3";
import { SimulationNodeDatum } from "d3";
import React, { useEffect, useRef } from 'react';

interface RosterGraphProps {
    leagueName: String;
}

interface Node extends SimulationNodeDatum {
    id: string;
}

interface Edge {
    source: string;
    target: string;
}

const nodes: Node[] = [
    { id: "A" },
    { id: "B" },
    { id: "C" },
    { id: "D" },
    { id: "E" }
];

const edges: Edge[] = [
    { source: "A", target: "B" },
    { source: "B", target: "C" },
    { source: "C", target: "D" },
    { source: "D", target: "E" },
    { source: "E", target: "A" }
];

const RosterGraph: React.FC<RosterGraphProps> = ({ leagueName }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(edges).id(d => (d as any).id))
            .force('charge', d3.forceManyBody().strength(-100))
            .force('center', d3.forceCenter(200, 150));

        svg.selectAll<SVGLineElement, typeof edges>("line")
            .data(edges)
            .enter()
            .append("line")
            .style("stroke", "black")
            .style("stroke-width", "2");

        const node = svg.selectAll<SVGCircleElement, typeof nodes>("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .style("fill", "steelblue");

        node.call(d3.drag<SVGCircleElement, any>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        simulation.on("tick", () => {
            node.attr("cx", d => (d as any).x)
                .attr("cy", d => (d as any).y);

            svg.selectAll<SVGLineElement, Edge>("line")
                .attr("x1", d => (d.source as any).x)
                .attr("y1", d => (d.source as any).y)
                .attr("x2", d => (d.target as any).x)
                .attr("y2", d => (d.target as any).y);
        });

        function dragstarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, []);

    return (
        <div className="p-4 w-full">
            <svg ref={svgRef} width="400" height="250"></svg>
        </div>
    );
}

export default RosterGraph;