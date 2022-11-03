const graph = require('ngraph.generators').path(1);
const renderGraph = require('ngraph.pixel');

const asns = new Set();
const links = new Set();
let topAsns = new Map();

addNewLink(3356, 1299);

const physicsSettings = {
  springLength: 30,
  springCoeff: 0.00001,
  gravity: -10.2,
  timeStep: 20,
};


const graphContainer = document.getElementById('graph-container');

const renderer = renderGraph(graph, 
{
    container: graphContainer,
    physics: physicsSettings,
    link: renderLink,
    node: renderNode,
});

// From ngraph.graph code
function getLinkId(fromId, toId) {
  return fromId.toString() + '👉 ' + toId.toString();
}

function renderNode(n) {
  let nSize = 5;
  if(n && n.links && n.links.length) {
      nSize  = n.links.length;
  }
  return {
    color: Math.random() * 0xFFFFFF | 0,
    size:  nSize
  };
}

function renderLink(l) {
  return {
    fromColor: 0xFF0000,
    toColor: 0x0000FF
  };
}
let ws = new WebSocket("wss://ris-live.ripe.net/v1/ws/?client=js-example-1");
let params = {
    moreSpecific: true,
    host: "rrc21",
    type: "UPDATE",
    socketOptions: {
        includeRaw: true
    } 
};


function extendingPath(path){
    for(const element of path) {
        if (asns.has(element)) return true;
    }
    return false;
}


function updateTopTwenty(nId){

	let n = graph.getNode(nId);
	let nDegree = 0
	if(n.links && n.links.length) nDegree = n.links.length;

	if(topAsns.size < 20 || topAsns.has(nId)){
		topAsns.set(nId, nDegree);
	} else 
	{
		topAsns.set(nId, nDegree);
		let sorted = [...topAsns].sort((a,b) => {return b[1] - a[1]});
		sorted.pop();
		topAsns = new Map(sorted);
	}
	console.log(topAsns);
}

// If node is there, increase from/to node size
// No idea how to do multi graph, or change link size
function addNewLink(from, to){
    const linkId = getLinkId(from, to);

    if(!asns.has(from)){
        asns.add(from);
        graph.addNode(from);
    }
    if(!asns.has(to)){
        asns.add(to);
        graph.addNode(to);
    }
    if(!links.has(linkId)){
        links.add(linkId);
        graph.addLink(from, to);

    } 
	updateTopTwenty(from);
	updateTopTwenty(to);
}
ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    let path = message.data.path;

    if (Math.random() < 0.1) {
        if (path) {
            if (extendingPath(path)) {
                for (let i = 1; i < path.length; i++) {
                    let s = path[i - 1];
                    let t = path[i];
                    addNewLink(s, t);
                }
            }
        }
    }
};

ws.onopen = function() {
    graph.removeNode(0);
    ws.send(JSON.stringify({
        type: "ris_subscribe",
        data: params
    }));
};
