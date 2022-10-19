var query = require('query-string').parse(window.location.search.substring(1));
var graph = require('ngraph.generators').path(1);
var renderGraph = require('ngraph.pixel');

var asns = new Set();
var links = new Set();

addNewNode(3356, asns, graph);
addNewLink(3356, 1299, links, graph);

var renderer = renderGraph(graph, {
  link: renderLink,
  node: renderNode
});

// From ngraph.graph code
function getLinkId(fromId, toId) {
  return fromId.toString() + '👉 ' + toId.toString();
};

function renderNode(/* node */) {
  return {
    color: Math.random() * 0xFFFFFF | 0,
    size: Math.random() * 21 + 10
  };
}

function renderLink(/* link */) {
  return {
    fromColor: 0xFF0000,
    toColor: 0x00FF00
  };
}

function getGraphFromQueryString(query) {
  var graphGenerators = require('ngraph.generators');
  var createGraph = graphGenerators[query.graph] || graphGenerators.grid;
  return createGraph(1,1,1);
}

function getNumber(string, defaultValue) {
  var number = parseFloat(string);
  return (typeof number === 'number') && !isNaN(number) ? number : (defaultValue || 10);
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


function extendingPath(path, asns){
	for(let i=0;i<path.length;i++){
		if(asns.has(path[i])) return true;
	}
	return false;
}

// If node is there increase the size
function addNewNode(node, asns, graph){
	if(!asns.has(node)){
	   asns.add(node);
	   var id = graph.addNode(node);
	} else {
		var nodeUI = renderer.getNode(node);
		nodeUI.size = nodeUI.size + 1;	
	}
};

// If node is there, increase from/to node size
// No idea how to do multi graph, or change link size
function addNewLink(from, to, links, graph){
	var linkId = getLinkId(from,to);
	if(!links.has(linkId)){
		links.add(linkId);
		graph.addLink(from, to);
	} else {
		var nodeUI = renderer.getNode(from);
		nodeUI.size = nodeUI.size + 1;	
		nodeUI = renderer.getNode(to);
		nodeUI.size = nodeUI.size + 1;	
	}
};
ws.onmessage = function(event) {
    var message = JSON.parse(event.data);
    let path = message.data.path;

	if(Math.random() < 0.1)    
    if(path){
			if(extendingPath(path, asns)){
			    addNewNode(path[0], asns, graph);	
				for(let i=1; i<path.length; i++){
					let s = path[i-1];
					let t = path[i];
			    	addNewNode(t, asns, graph);	
					addNewLink(s, t, links, graph);
				}
			}
     }
};

ws.onopen = function() {
    ws.send(JSON.stringify({
        type: "ris_subscribe",
        data: params
    }));
};
