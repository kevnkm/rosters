import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import React, { useEffect, useRef } from 'react';

interface RosterGraphProps {
    leagueName: string;
}

interface Node extends SimulationNodeDatum {
    id: string;
}

const nodes: Node[] = [
    { id: "A" },
    { id: "B" },
    { id: "C" },
    { id: "D" },
    { id: "E" }
];

const RosterGraph: React.FC<RosterGraphProps> = ({ leagueName }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(-5))
            .force('center', d3.forceCenter(150, 150));

        const node = svg.selectAll<SVGCircleElement, typeof nodes>("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .style("fill", "steelblue");

        simulation.on("tick", () => {
            node.attr("cx", d => (d as any).x)
                .attr("cy", d => (d as any).y);
        });

        return () => {
            simulation.stop();
        };
    }, []);

    return (
        <div className="p-4 w-full h-full">
            <svg ref={svgRef} className="w-full h-full bg-yellow-500"></svg>
        </div>
    );
}

export default RosterGraph;
