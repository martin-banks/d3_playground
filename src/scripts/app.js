
"use strict"
import * as d3 from "d3"
import styles from '../styles/app.sass'
import {data} from './content/manifest'



let svg = d3.select("svg")
svg.attr('width', window.innerWidth)
  .attr('height', window.innerHeight)
let width = +svg.attr("width")
let height = +svg.attr("height")
let color = d3.scaleOrdinal(d3.schemeCategory10);

/*let a = {id: "a"}
let b = {id: "b"}
let c = {id: "c"}*/
let newNodes = {
  chapterA: [
    {
      id: "extra1A", 
      group: 9
    },
    {
      id: "extra2A", 
      group: 9
    },
    {
      id: "extra3A", 
      group: 9
    }
  ],

  chapterB: [
    {
      id: "extra1B", 
      group: 8
    },
    {
      id: "extra2B", 
      group: 8
    },
    {
      id: "extra3B", 
      group: 8
    }
  ],

  chapterC: [
    {
      id: "extra1C", 
      group: 7
    },
    {
      id: "extra2C", 
      group: 7
    },
    {
      id: "extra3C", 
      group: 7
    }
  ]


}
let newLinks =  {

  chapterA: [
    {
      "source": 'chapterA',
      "target": 'extra1A',
      "value": 1
    },
    {
      "source": 'chapterA',
      "target": 'extra2A',
      "value": 1
    },
    {
      "source": 'chapterA',
      "target": 'extra3A',
      "value": 1
    },
  ],
   chapterB: [
    {
      "source": 'chapterB',
      "target": 'extra1B',
      "value": 1
    },
    {
      "source": 'chapterB',
      "target": 'extra2B',
      "value": 1
    },
    {
      "source": 'chapterB',
      "target": 'extra3B',
      "value": 1
    },
  ],
   chapterC: [
   {
      "source": 'chapterC',
      "target": 'extra1C',
      "value": 1
    },
    {
      "source": 'chapterC',
      "target": 'extra2C',
      "value": 1
    },
    {
      "source": 'chapterC',
      "target": 'extra3C',
      "value": 1
    },
  ]

}

let nodes = data.nodes 
let nodeById = d3.map(nodes, d => d.id )
let links = data.links
let bilinks = []


links.forEach(link => {
  //console.log('foreach link', link)
  if(!!link.target && !!link.target){
    let s = link.source = nodeById.get(link.source)
    let t = link.target = nodeById.get(link.target)
    let i = {} // intermediate node
   // console.log('s', s, '\nt', t, '\ni', i)
    nodes.push(i)
    //links.push({source: s, target: i}, {source: i, target: t})
    bilinks.push([s, i, t])
  }
})


/*start force linked chart and set options*/
let simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink(links).distance(200).strength(0.5))

    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaTarget(1)
    .on("tick", ticked)

/*add style attributes*/
let g = svg.append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

/*add style attributes*/
let link = g.append("g")
  .attr("stroke", "#000")
  .attr("stroke-width", 1.5)
  .selectAll(".link")

/*add style attributes*/
let node = g.append("g")
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .selectAll(".node")


restart()






function addTestNode(){
  simulation.on("tick", ticked)
  //console.log('this node', d3.select(this).attr('id'))
  let newId = d3.select(this).attr('id')
  
  newNodes[newId].map(newNode => {
    nodes.push(newNode)
  })
  nodeById = d3.map(nodes, d => d.id )
  
  //let addLinks = newLinks[newId]
  newLinks[newId].map(addLink => {
    //console.log('addLink', addLink)
    
    let s = addLink.source = nodeById.get(addLink.source)
    let t = addLink.target = nodeById.get(addLink.target)
    let i = {} // intermediate node
    //console.log('s', s, '\nt', t, '\ni', i)
    nodes.push(i)
    bilinks.push([s, i, t])

    links.push(addLink)
  })

  console.log('restarting chart')
  restart()
}










function restart() { /*render node and add content elements and attributes*/
  node = node.data(nodes.filter(d => d.id ))
    .enter()
    .append("text")
    .attr('class', 'nodeText')
    .attr("x", '10px')
    .attr("y", 0)
    .text(d => d.id )
    .attr("fill", data => color(data.group))
    /*.append("circle")
    
    .attr("r", 8)*/
    .attr('id', d=>d.id)
   
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on('click', addTestNode)
     .merge(node)
 
  // Apply the general update pattern to the links.
  link = link.data(links, d => {
    //console.log('d', d)
    return d.source.id + "-" + d.target.id 
  })
  link.exit().remove()
  link = link.enter()
    .append("line")
    .merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes)
 
  simulation.force("link")
    .links(links)
  
  simulation.alpha(1)
    .restart()

  /*setTimeout(function() {
    simulation.on("tick", null)
  }, 2000);*/
  

  //console.log('nodes:', nodes, '\nlinks:', links)

}




function ticked() {
  /*node.attr( "cx", d => d.x )
      .attr( "cy", d => d.y )*/
      node.attr("transform", positionNode)
 
  link.attr( "x1", d => d.source.x )
      .attr( "y1", d => d.source.y )
      .attr( "x2", d => d.target.x )
      .attr( "y2", d => d.target.y )
} 



function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")"
}

/* node drag functions */
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