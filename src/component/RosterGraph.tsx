import * as d3 from "d3";
import { SimulationNodeDatum } from "d3";
import React, { useEffect, useRef } from 'react';

function RosterGraph() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {

    }, []);

return (
    <div className="p-4 w-full bg-yellow-500">
        <svg ref={svgRef} width="400" height="250"></svg>
    </div>
);
}

export default RosterGraph;