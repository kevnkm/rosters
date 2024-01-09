// Sample data - Nodes and Links
const nodes = [
    { id: 1, name: "Node 1" },
    { id: 2, name: "Node 2" },
    { id: 3, name: "Node 3" },
    { id: 4, name: "Node 4" },
  ];
  
  const links = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
  ];
  
  const svg = d3.select("svg");
  
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(300, 200));
  
  const link = svg.selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke", "black");
  
  const node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 20)
    .attr("fill", "skyblue")
    .call(drag(simulation));
  
  node.append("title")
    .text(d => d.name);
  
  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  });
  
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
  
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
  
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }