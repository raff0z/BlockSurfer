//---------------------------------- VARS ----------------------------------

var myJSON;

var width = 960;
var height = 500;

var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height);

var nodes = [];

var edges = [];

var nodes_to_draw = [];

var edges_to_draw = [];

var transaction;

var historyGraph = [];

//Finestra temporale di 5 secondi
var temporal_window = 5000;

var force = d3.layout.force()
.nodes(nodes)
.links(edges)
.size([width, height])
.linkDistance(120)
.charge(-300);


//------------------------------- HELPER FUNCTIONS --------------------------

function isInArray(node, arrayNodes) {

	return arrayNodes.some(function(element, index, array) {
		return (element.id == node.id);
	});
}

function contains(edge, arrayEdges) {

	return arrayEdges
	.some(function(element, index, array) {
		return (element.source.id == edge.source.id && element.target.id == edge.target.id);
	});
}

//funzione per verificare se un nodo é pozzo
function isSink(node) {

	var sink = true;

	for (var i = 0; i < edges.length; ++i) {
		if (edges[i].source.id == node.id) {

			sink = false;
			return sink;
		}
	}

	return sink;
}

//funzione per verificare se un nodo é sorgente
function isSource(node) {

	var source = true;

	for (var i = 0; i < edges.length; ++i) {
		if (edges[i].target.id == node.id) {

			source = false;
			return source;
		}
	}

	return source;
}

//funzione che verifica se un nodo é isolato
function isIsolated(node) {
	return !(isSink(node) || isSource(node));
}

function getChildren(node) {

	var children = [];

	for (var i = 0; i < edges.length; ++i) {
		if (edges[i].source.id == node.id) {

			children.push(edges[i].target);
		}
	}

	return children;
}

//funzione che rimuove l'edge dall'array edges
function remove_from_edges(edge_to_remove, edges) {
	var index = -1;
	for(var i =0; i<edges.length; i++) {
		if(edges[i].source.id == edge_to_remove.source.id
				&& edges[i].target.id == edge_to_remove.target.id) {
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

function recalculate_height(length) {
	if((height/length) >= 50) {
		return;
	}

	//Se la distanza tra i nodi nel layer é troppo stretta, estendo la height
	else {
		height =+ height*1.5;
		recalculate_height(length);
	}
}

function colorByTime(id) {

	var node = find_node_by_id(id);

	d3.selectAll("circle").each(function(elem){

		if(!elem.notYetRedeemed) {

			// rossi i precedenti
			if(node.date - elem.date > temporal_window) {

				d3.select(this).attr("fill", "#FF0000");

				// blu i successivi
			} else if(node.date - elem.date < -temporal_window) {

				d3.select(this).attr("fill", "#009999");
			} else {
				d3.select(this).attr("fill", "#9FEE00");
			}
		}
	});
}

function amount2radius(amount) {

	if(amount<=0) {
		return 10;
	} else if (amount >= 10){
		return 20; 
	} else {
		return (amount) + 10;
	}
}

//------------------------------- FUNCTIONS ---------------------------------

function update() {
	var state = {};
	state.nodes = nodes.slice(0);
	state.edges = edges.slice(0);

	historyGraph.push(state);
	
	loadJson(transaction);

	draw(false);
}

function draw(revert) {
	if(revert){
		d3.select("svg").remove();
	
		svg = d3.select("body").append("svg").attr("width", width).attr("height",
				height);
		
		force = d3.layout.force()
		.nodes(nodes)
		.links(edges)
		.size([width, height])
		.linkDistance(120)
		.charge(-300);
	}
	
	var link = svg.selectAll(".link");
	
	link = link.data(force.links(), function(d) {
		return d.source.id + "-" + d.target.id;
	});

	link.enter().insert("line",".node").attr("class", "link").attr("marker-end", "url(#end)");

	link.exit().remove();
	
	var nodesSvg = svg.selectAll(".node");

	nodesSvg = nodesSvg.data(force.nodes(), function(d) {
		return d.id;
	});
	

	nodesSvg.enter()
	.append("g").attr("class", "node")
	.on("mouseover",mouseover)
	.on("mouseout", mouseout)
	.call(force.drag)
	.insert("circle")
	.attr("r", function(d) {
		return amount2radius(d.totalIn);
	}).attr("fill", function(d) {
		return (d.notYetRedeemed) ? "grey" : "#354F00";
	}).style("stroke", function(d) {
		return "black";
	}).style("stroke-width", function(d) {
		return 2;
	}).on("click", function(d) {
		click(d);
	});

	nodesSvg.append("text").text(function(d) {return d.notYetRedeemed ? "Not yet redeemed" : "" + d.id;});
	
	nodesSvg.exit().remove();
	
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
	
	force.on("tick", tick);

	force.start();
}

function loadJson(transaction) {
	var node = transaction;
	node.date = new Date(node.date);

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
			parent.date = new Date(parent.date);

			if (!isInArray(parent, nodes)) {
				nodes.push(parent);
			}else{
				parent = find_node_by_id(parent.id);
			}

			var edge = {};
			edge.source = parent;
			edge.target = node;
			if (!contains(edge, edges))
				edges.push(edge);
		}
	}

	if (children != null) {
		for (var i = 0; i < children.length; ++i) {

			var child = children[i];
			child.date = new Date(child.date);

			if (!isInArray(child, nodes)) {
				nodes.push(child);
			}else{
				child = find_node_by_id(child.id);
			}

			var edge = {};
			edge.source = node;
			edge.target = child;
			if (!contains(edge, edges))
				edges.push(edge);
		}
	}
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
	if(!d.notYetRedeemed){
		colorByTime(d.id);
		d3.select(this).select(".circle")
		.style("stroke", "black")
		.style("stroke-width", 5);

		//800 è la lunghezza della tooltip
		d3.select("#tooltip")
		.style("left", function(){
			var position = d.x - 400;
			if(d.x + 400 >= width)
				position = d.x - 800;
			if(position < 0)
				position = 0;
			return position + "px";
		})
		.style("top", 0 + "px");

		d3.select("#txhash")
		.html("<p><strong>" + d.hash + "</strong></p>");

		d3.select("#value")
		.style("font-size","11px")
		.html("id: "+ d.id + "<br/>" +
				"total input: " + d.totalIn + "<br/>" +
				"total output: " + d.totalOut + "<br/>" +
				"date: " + d.date + "<br/>" 
		);

		d3.select("#tooltip").classed("hidden", false);
	}
}

function mouseout(d) {
	if(!d.isDummy){
		d3.select(this).select(".circle")
		.style("stroke", "black")
		.style("stroke-width", 2);

		d3.selectAll("circle").each(function(elem){
			if(!elem.isDummy) {
				if(!elem.notYetRedeemed) {
					d3.select(this).attr("fill", "#354F00");
				} else {
					d3.select(this).attr("fill", "grey");
				}
			}

		});
		d3.select("#tooltip").classed("hidden", true);

	}

}

function tick() {
	var node = svg.selectAll(".node");
	var link = svg.selectAll(".link");
	
	  link
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}

function init(id){
	var json = "/BlockSurfer/jsontransaction.do?id=" + id ;
	d3.json(json, function(error, element) {
		transaction = element;
		update();
	});

}

function revert(){
	if(historyGraph.length > 1){
		var state = historyGraph.pop();
	
		nodes = state.nodes.slice(0);
		edges = state.edges.slice(0);
		
		draw(true);
	}
}