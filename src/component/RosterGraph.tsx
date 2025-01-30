import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import React, { useEffect, useRef } from 'react';

interface RosterGraphProps {
    leagueName: string;
}

interface Node extends SimulationNodeDatum {
    id: string;
    r: number;
}

const nodes: Node[] = [
    { id: "A", r: 10 },
    { id: "B", r: 10 },
    { id: "C", r: 10 },
    { id: "D", r: 10 },
    { id: "E", r: 10 },
];

const RosterGraph: React.FC<RosterGraphProps> = ({ leagueName }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/src/data/nba/roster.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log('Fetched data:', data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();

    // const nodes: Node[] = jsonData.map((item: any) => {
    //     return { id: item.id } as Node;
    // });




    // const context = DOM.context2d(width, height);


    // function ticked() {
    //     context.clearRect(0, 0, width, height);
    //     context.save();
    //     context.translate(width / 2, height / 2);
    //     for (let i = 1; i < nodes.length; ++i) {
    //         const d = nodes[i];
    //         context.beginPath();
    //         context.moveTo(d.x + d.r, d.y);
    //         context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
    //         context.fillStyle = color(d.group);
    //         context.fill();
    //     }
    //     context.restore();
    // }



    useEffect(() => {

        const svg = d3.select(svgRef.current);
        if (!svg) {
            console.log('svg not found');
            return;
        };

        // const canvas = canvasRef.current;
        // if (!canvas) {
        //     console.log('canvas not found');
        //     return;
        // };

        // const parent = canvas.parentElement;
        // if (!parent) return;

        // canvas.width = parent.clientWidth;
        // canvas.height = parent.clientHeight;

        const simulation = d3.forceSimulation(nodes)
            .force("collide", d3.forceCollide<Node>().radius(d => d.r + 1).iterations(3))
            .alphaTarget(0.3)
            .velocityDecay(0.1)
            .force("x", d3.forceX().strength(0.01))
            .force("y", d3.forceY().strength(0.01))
            .force('charge', d3.forceManyBody().strength(-5))
            .force('center', d3.forceCenter(150, 150))
        // .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 2 / 3))
        // .on("tick", ticked);

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
        // <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />

        <div className="p-4 w-full h-full">
            <svg ref={svgRef} className="w-full h-full bg-yellow-500"></svg>
        </div>
    );
}

export default RosterGraph;
