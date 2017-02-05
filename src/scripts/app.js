
"use strict"
import * as d3 from "d3"
import styles from '../styles/app.sass'
import {data} from './content/manifest'

console.log('first data log', data)
let svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height")

let color = d3.scaleOrdinal(d3.schemeCategory20)

let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(100).strength(0.5))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))


let nodes = data.nodes,
    nodeById = d3.map(nodes, d => d.id ),
    links = data.links,
    bilinks = []

links.forEach(link => {
  let s = link.source = nodeById.get(link.source),
      t = link.target = nodeById.get(link.target),
      i = {} // intermediate node
  nodes.push(i)
  links.push({source: s, target: i}, {source: i, target: t})
  bilinks.push([s, i, t])
})

let link = svg.selectAll(".link")
  .data(bilinks)
  .enter().append("path")
    .attr("class", "link")


let node = svg.selectAll(".node")
  .data(nodes.filter(d => d.id ))
  .enter().append("g")
    .attr("class", "node")
    .attr('fill', '#ccc')
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

node.append("title")
    .text(d => d.id )

node.append('circle')
  .attr("r", 20)
    .attr("fill", d => color(d.group) )
    .attr("x", "10px")
    .attr("y", "-15px")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
/*text must be added t ogroup element "g" to be visible*/
node.append("text")
  .attr('class', 'nodeText')
  .attr("x", 0)
  .attr("y", "40px")
  .text(function(d) { return d.id });

simulation
    .nodes(nodes)
    .on("tick", ticked)

simulation.force("link")
    .links(links)








function ticked() {
  link.attr("d", positionLink)
  node.attr("transform", positionNode)
}


function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
       + "S" + d[1].x + "," + d[1].y
       + " " + d[2].x + "," + d[2].y
}

function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")"
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x, d.fy = d.y
}

function dragged(d) {
  d.fx = d3.event.x, d.fy = d3.event.y
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0)
  d.fx = null, d.fy = null
}