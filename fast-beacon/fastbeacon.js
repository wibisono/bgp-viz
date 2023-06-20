 var graphData = {
                nodes: new vis.DataSet([]),
                edges: new vis.DataSet([]),
};

// Create options for the visualization
var options = {};

// Create a new network instance
var container = document.getElementById("network");
var network = new vis.Network(container, graphData, options);

const client = new WebSocket('wss://ris-live.ripe.net/v1/ws/?client=js-example-1');

const params = {
    moreSpecific: true,
    type: 'UPDATE',
    prefix: '84.205.66.0/24',
    socketOptions: {
        includeRaw: true,
        acknowledge: true
    }
};

//  Maybe add options: 
// - beacons => ipv6 or ipv4.
// - multipath or width (createEdgeId with peer or not)

const urlParams = new URLSearchParams(window.location.search);
const MAX_PATH_LEN = parseInt(urlParams.get('maxPathLen')) || 3;


const createEdgeId = function (cur, next) {
    return cur + "-" + next;
}

const renderAnnouncedPath = function (path) {

    let cur = String(path[0]);

    for (let x=1; x < path.length; x++) {

        let next = String(path[x]);
        if (!graphData.nodes.get(cur)) {
            var nodeColor = cur == path[0] ? "red" : "blue";
            graphData.nodes.add({
                id: cur,
                label: cur,
                color: nodeColor,
                font: {
                    color: "#FFFFFF"
                }
            });
        }

        if (!graphData.nodes.get(next)) {
            graphData.nodes.add({
                id: next,
                label: next,
                color: "blue",
                font: {
                    color: "#FFFFFF"
                }
            });
        }

        let edgeId = createEdgeId(cur, next);

        if (!graphData.edges.get(edgeId)) {
            graphData.edges.add({
                id: edgeId,
                from: cur,
                to: next,
                width: 1,
                count: 1
            });
            console.log("\tAdded edge: ", cur, next);
        } else {
            let curEdge = graphData.edges.get(edgeId);
            let curCount = curEdge.count + 1;
            let curWidth = curCount < 15 ? curCount : 15;
            graphData.edges.update({
                id: edgeId,
                from: cur,
                to: next,
                width: curWidth,
                count: curCount
            });
        }
        cur = next;
    }
}

const removeWithdrawnPath = function (path) {

    let cur = String(path[0]);

    for (let x=1; x < path.length; x++) {

        let next = String(path[x]);
        let edgeId = createEdgeId(cur, next);
        let curEdge = graphData.edges.get(edgeId);

        if (curEdge.count > 1) {

            let curCount = curEdge.count - 1;
            let curWidth = curCount >= 15 ? 15 : curCount;

            graphData.edges.update({
                id: edgeId,
                from: cur,
                to: next,
                width: curWidth,
                count: curCount
            });
            console.log("\tDecrease edge width ", cur, next, curEdge.width);
        } else {
            var removed = graphData.edges.remove(edgeId);
            console.log("\tRemove edge ", cur, next, removed);
            if (network.getConnectedEdges(cur).length == 0) {
                graphData.nodes.remove(cur);
                console.log("\tRemove node", cur);
            }
        }
        cur = next;
    }
	if (network.getConnectedEdges(cur).length == 0) {
		graphData.nodes.remove(cur);
		console.log("\tRemove node", cur);
    }

    console.log("Withdrawn", path);
}

var announcedPaths = [];
client.onopen = function () {
    client.send(JSON.stringify({
        type: 'ris_subscribe',
        data: params
    }));
};

client.onmessage = function (message) {

    const msg = JSON.parse(message.data).data;
    
    // Peer ASN is string while path contains ints.
    const curPeerAsn = parseInt(msg.peer_asn);

    if (msg.announcements.length > 0) {

        let curPath = msg.path;

        if (curPath.length <= MAX_PATH_LEN) {

            announcedPaths.push(curPath);
            console.log('New Path: ', curPath);

            renderAnnouncedPath(curPath);
        }

    } else if (msg.withdrawals.length > 0) {

        let remainingPaths = [];

        for(const curPath of announcedPaths){

            if (curPath.includes(curPeerAsn)) {

                console.log('Withdraw path containing : ', curPeerAsn, curPath);
                removeWithdrawnPath(curPath);

            } else {
                remainingPaths.push(curPath);
            }
        }

        console.log("Paths counts before, after", announcedPaths.length, remainingPaths.length);
        announcedPaths = remainingPaths;
    }
};


