// ---------------------------------- VARS ----------------------------------

var myJSON;

var width = 960;
var height = 500;

var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height);

var nodes = [];

var edges = [];

var transaction;

// ---------------------------------- HELPER FUNCTIONS
// ----------------------------------

function isInArray(node, arrayNodes) {

	return arrayNodes.some(function(element, index, array) {
		return (element.id == node.id);
	});
}

function contains(edge, arrayEdges) {

	return arrayEdges
			.some(function(element, index, array) {
				return (element.fromNode.id == edge.fromNode.id && element.toNode.id == edge.toNode.id);
			});
}

// funzione per verificare se un nodo é pozzo
function isSink(node) {

	var sink = true;

	for (var i = 0; i < edges.length; ++i) {
		if (edges[i].fromNode.id == node.id) {

			sink = false;
			return sink;
		}
	}

	return sink;
}

// funzione per verificare se un nodo é sorgente
function isSource(node) {

	var source = true;

	for (var i = 0; i < edges.length; ++i) {
		if (edges[i].toNode.id == node.id) {

			source = false;
			return source;
		}
	}

	return source;
}

// funzione che verifica se un nodo é isolato
function isIsolated(node) {
	return !(isSink(node) || isSource(node));
}

function getChildren(node) {

	var children = [];

	for (var i = 0; i < edges.length; ++i) {
		if (edges[i].fromNode.id == node.id) {

			children.push(edges[i].toNode);
		}
	}

	return children;
}

function max_layer() {

	var max = 0;

	for (var i = 0; i < nodes.length; ++i) {

		var layer = nodes[i].layer;

		if (max < layer) {
			max = layer;
		}
	}

	return max;
}

// formula per il calcolo della x di ogni nodo
function calculate_x(layer, width, maxLayer) {
	return layer * width / maxLayer - width / (maxLayer * 2);
}

//funzione che calcola la coordinata y per i nodi del grafo
function y_coordinate(node) {

	var same_layer = nodes.filter(function(element) {
		return element.layer == node.layer;
	});

	var length = same_layer.length;

	for(var i = 0; i < length; ++i) {

		if(same_layer[i].id == node.id) {

			var y = (((i)*height/length) + (height/(length*2)));

			node.y = y;
		}
	}

	return -1;
}


//funzione che rimuove l'edge dall'array edges
function remove_from_edges(edge_to_remove) {
	var index = -1;
	for(var i =0; i<edges.length; i++) {
		if(edges[i].fromNode.id == edge_to_remove.fromNode.id
				&& edges[i].toNode.id == edge_to_remove.toNode.id) {
			index = i;
			break;
		}
	}
	edges.splice(index, 1);
}

//funzione che trova un nodo in base all'id
function find_node_by_id(id) {
	for(var i =0; i<nodes.length; i++) {
		if(nodes[i].id == id)
		{
			return nodes[i];
		}
	}
	return null;
}

// ---------------------------------- FUNCTIONS
// ----------------------------------

function init(id) {
	myJSON = "/BlockSurfer/jsontransaction.do?id=" + id;
	d3.json(myJSON, function(error, element) {
		transaction = element;
		update();
	});
}

function update() {
	loadJson(transaction);
	first_layerization();
	second_layerization();

//	resolve_edges();
	
	nodes.map(function(d){
		y_coordinate(d);
	});
	
	// filtro i nodi che sono dummy
//	nodes = nodes.filter(function(node) {
//		return !node.isDummy;
//	});
	
	d3.select("svg").remove();
	
	svg = d3.select("body").append("svg").attr("width", width).attr("height",
			height);
	
	var nodesSvg = svg.selectAll(".nodes").data(nodes).enter().append("g");

	nodesSvg.append("circle").attr("class", "circle").attr("r", function(d){
		return d.isDummy ? 8.5 : 15;
	})
	.attr("cx", function(d) {return d.x;})
	.attr("cy", function(d) {return d.y;}).attr("fill", function(d){
		return d.isDummy ? "grey" : "green";
	}).on("click", function(d){
		click(d);
	}).on("mouseover", mouseover)
	.on("mouseout", mouseout);

	nodesSvg.append("text").text(function(d) {return d.isDummy ? "" : d.id;}).attr("x",function(d){return d.x-15;})
	.attr("y",function(d){return d.y +25;});

	//build the arrow.
	svg.append("svg:defs").selectAll("marker")
	    .data(["end"])      // Different link/path types can be defined here
	    .enter().append("svg:marker")    // This section adds in the arrows
	    .attr("id", String)
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 20)
	    .attr("refY", 0)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	    .append("svg:path")
	    .attr("d", "M0,-5L10,0L0,5");


	//disegno i links
	edges.map(function(d) {

		if(d.isToDummy) {
			svg.insert("line","g").attr("x1", d.fromNode.x).attr("y1", d.fromNode.y)
			.attr("x2", d.toNode.x)
			.attr("y2", d.toNode.y).attr("stroke-width", 2)
			.attr("stroke", "black")
		}

		else {
			svg.insert("line","g").attr("x1", d.fromNode.x).attr("y1", d.fromNode.y)
			.attr("x2", d.toNode.x)
			.attr("y2", d.toNode.y).attr("stroke-width", 2)
			.attr("stroke", "black")
			.attr("marker-end", "url(#end)");
		}
	});

}

function loadJson(transaction) {
	var node = transaction;
	var parents = node.parents;
	var children = node.children;

	if (!isInArray(node, nodes)) {
		nodes.push(node);
	}else{
		node = find_node_by_id(node.id);
		node.parents = parents;
		node.children = children;
	}



	if (parents != null) {
		for (var i = 0; i < parents.length; ++i) {

			var parent = parents[i];

			if (!isInArray(parent, nodes)) {
				nodes.push(parent);
			}else{
				parent = find_node_by_id(parent.id);
			}

			var edge = {};
			edge.fromNode = parent;
			edge.toNode = node;
			if (!contains(edge, edges))
				edges.push(edge);
		}
	}

	if (children != null) {
		for (var i = 0; i < children.length; ++i) {

			var child = children[i];

			if (!isInArray(child, nodes)) {
				nodes.push(child);
			}else{
				child = find_node_by_id(child.id);
			}

			var edge = {};
			edge.fromNode = node;
			edge.toNode = child;
			if (!contains(edge, edges))
				edges.push(edge);
		}
	}
}

// funzione ricorsiva per il calcolo del cammino massimo di un nodo
function longest_path(node) {

	if (isSink(node)) {

		return 1;

	} else {

		var children = getChildren(node);

		var max = 0;

		children.forEach(function(element) {

			var n = longest_path(element);

			max = Math.max(max, n);
		});

		return 1 + max;

	}
}

// funzione per assegnare ai vertici il proprio layer usando longest-path
function first_layerization() {

	for (var i = 0; i < nodes.length; ++i) {

		var node = nodes[i];

		var n = longest_path(node);

		node.layer = n;
		node.x = n;

	}
}

// funzione che inverte i layer dei nodi e setta le coordinate degli archi
function second_layerization() {

	var max = max_layer();

	nodes.map(function(d) {
		var x = max - d.x + 1;

		d.layer = x;

		d.x = calculate_x(x, width, max);

	});
}

//funzione che crea i dummynode e gli archi tra essi quando 2 nodi sono a distanza maggiore di 2 
//ed elimina il vecchio arco
function resolve_edges() {

	// copio l'array di edges
	var copyEdges = edges.slice(0);
	copyEdges.forEach(function(edge){
		var distance = edge.toNode.layer - edge.fromNode.layer;

		// controllo gli archi che legano nodi a distanza di layer >1
		if(distance >1) {
			remove_from_edges(edge);

			for(var i = 1; i<distance; i++) {

				// serve per iterazioni in cui devo fare una arco tra 2 dummynode
				var olderDummyNode = dummyNode;
				var dummyNode = {};

				// creo il dummyNode e lo inserisco nei node2layers
				dummyNode.isDummy = true;
				dummyNode.id = "dummy"+edge.fromNode.id+edge.toNode.id+i;
				dummyNode.layer = edge.fromNode.layer+i;
				dummyNode.x = calculate_x(dummyNode.layer, width, max_layer());
				if(!isInArray(dummyNode, nodes))
					nodes.push(dummyNode);

				// creo l'arco che va verso il dummyNode
				var dummyEdge = {};
				dummyEdge.isToDummy = true;

				// se l'arco deve andare dal vero nodo fromNode a un dummyNode
				if(i==1) {
					dummyEdge.fromNode = edge.fromNode;
					dummyEdge.toNode = dummyNode;
				}

				// se l'arco deve andare dal dummyNode precedente (olderDummyNode) a un dummyNode
				else {
					dummyEdge.fromNode = olderDummyNode;
					dummyEdge.toNode = dummyNode;
				}

				// se sto all'ultimo passo devo creare un ulteriore arco che va dal dummyNode verso il 
				// vero nodo toNode
				if(i==distance-1) {
					var finalDummyEdge = {};
					finalDummyEdge.fromNode = dummyNode;
					finalDummyEdge.toNode = edge.toNode;
					if(!contains(finalDummyEdge, edges))
						edges.push(finalDummyEdge);
				}
				if(!contains(dummyEdge, edges))
					edges.push(dummyEdge);
			}

		}
	});
}

function click(d){
	if(!d.isDummy){
		var json = "/BlockSurfer/jsontransaction.do?id=" + d.id;
		d3.json(json, function(error, element) {
			transaction = element;
			update();
		});
	}
}

function mouseover(d) {
	if(!d.isDummy){
	    d3.select(this)
	        .style("stroke", "black")
	  		.style("stroke-width", 5);
	}
}

function mouseout(d) {
	if(!d.isDummy){
	    d3.select(this)
	    .style("stroke", null)
		.style("stroke-width", null);
	}
}
