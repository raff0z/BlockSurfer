var width = window.innerWidth;
var height = window.innerHeight;

var iterator_number = 200;

var elastic_factor = 7;
var spring_length = 100;
var electric_factor = 7;
var forces_factor = 0.5;

var alpha = 0.1;
var beta = 0.7;
var magnetic_factor = 10;

var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).call(d3.behavior.zoom().on("zoom", zoomed)).on("dblclick.zoom",null);

svg = svg.append('g');

var nodes = [];

var edges = [];

var transaction;

var historyGraph = [];

//Finestra temporale di 5 secondi
var temporal_window = 5000;

//---------------------------------- HELPER FUNCTIONS
//----------------------------------

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

//formula per il calcolo della x di ogni nodo
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

function maxNumNodesPerLayer() {
	var map = {};
	var max = 1;
	nodes.forEach(function(d) {
		if(map[d.layer] != null) {
			map[d.layer] += 1;
			max = Math.max(max, map[d.layer]);
		}
		else {
			map[d.layer] = 1;
		}
	});

	return max;
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

		if(!elem.isDummy && !elem.notYetRedeemed) {

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

//---------------------------------- FUNCTIONS
//----------------------------------

function init(id) {
	myJSON = "/BlockSurfer/jsontransaction.do?id=" + id;
	d3.json(myJSON, function(error, element) {
		transaction = element;
		update();
	});
}


function update() {
	var state = {};
	state.nodes = nodes.slice(0);
	state.edges = edges.slice(0);
	state.nodeId = transaction.id; 

	historyGraph.push(state);

	loadJson(transaction);

	spring_embedding();
	
	fit_graph();
	
	draw();
}

function draw() {

	d3.select("svg").remove();

	svg = d3.select("body").append("svg").attr("width", width).attr("height",
			height).call(d3.behavior.zoom().on("zoom", zoomed)).on("dblclick.zoom",null);;

	svg = svg.append('g');

	var nodesSvg = svg.selectAll(".nodes").data(nodes).enter().append("g");
	
	nodesSvg.append("circle").attr("class", "circle")
	.on("mouseover",mouseover)
	.on("mouseout", mouseout)
	.attr("r", function(d){
		return amount2radius(d.totalIn);
	})
	.attr("cx", function(d) {return d.x;})
	.attr("cy", function(d) {return d.y;}).attr("fill", function(d){
		return (d.notYetRedeemed) ? "grey" : "#354F00";
	}).style("stroke", function(d){
		return "black";})
		.style("stroke-width", function(d){
			return 2;})
			.on("dblclick", function(d){
				click(d);
			});

	nodesSvg.append("text").text(function(d) {return d.notYetRedeemed ? "Not yet redeemed" : "" + d.id;})
	.attr("x",function(d){return d.x-15;})
	.attr("y",function(d){return d.isDummy ? null : d.y +amount2radius(d.totalIn) + 11;});


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


		svg.insert("line","g").attr("x1", d.source.x).attr("y1", d.source.y)
		.attr("x2", d.target.x)
		.attr("y2", d.target.y).attr("stroke-width", 2)
		.attr("stroke", "black")
		.attr("marker-end", "url(#end)");

	});
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

			if(child.notYetRedeemed){
				child.id = idNYR;
				idNYR--;
			}

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
	if(!d.isDummy && !d.isClicked){
		d.isClicked = true;
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

function revert(){
	if(historyGraph.length > 1){
		var state = historyGraph.pop();

		nodes = state.nodes.slice(0);
		edges = state.edges.slice(0);

		var nodeClicked = find_node_by_id(state.nodeId);
		nodeClicked.isClicked = false;
		
		spring_embedding();
		draw();
	}
}

function zoomed() {
	svg.attr("transform",
			"translate(" + d3.event.translate + ")"
			+ " scale(" + d3.event.scale + ")");
}

function spring_embedding() {
	random_places();
	for(var i = 0; i<iterator_number; i++) {
		calculate_forces();
		move_verteces();
	}

}


function random_places() {
	first_layerization();
	second_layerization();

	recalculate_height(maxNumNodesPerLayer());

	nodes.map(function(d){
		y_coordinate(d);
	});


	// nodes.forEach(function(node) {
	// 	node.x = Math.random()*width;
	// 	node.y = Math.random()*height;

	// 	//adjust_coordinate(node);
	// });

	// 	if(isSource(node)) {
	// 		node.x = 0;
	// 	}

	// 	if(isSink(node)) {
	// 		node.x = width;
	// 	}

	// 	// node.x = 0;
	// 	// node.y = 0;
	// // 	console.log("posizioni");
	// // console.log(node.x);
	// // console.log(node.y);


}

function calculate_forces() {
	nodes.forEach(function(node) {
		total_force(node);
	});

	edges.forEach(function(edge) {
		magnetic_force(edge);
	});
}

function total_force(node1) {
	var force_x = 0;
	var force_y = 0;
	nodes.filter(function(d) {
		return d.id != node1.id;
	}).forEach(function(node2) {
		force_x += calculate_force_x(node1, node2);
		force_y += calculate_force_y(node1, node2);
	});

//	console.log("forze");
//	console.log(force_x);
//	console.log(force_y);
	node1.force_x = force_x;
	node1.force_y = force_y;
}

function calculate_force_x(node1, node2) {
	var d = distance(node1, node2);
	var hook_force = 0;
	var electric_force = 0;

	if(d == 0) {
		node1.x += 50;
		adjust_coordinate(node1);
		return 0;
	}

	if(contains_edge_by_nodes(node1, node2)) {
		//hook_force = kh*(d-l)*(node2.x - node1.x)/d;
		hook_force = elastic_factor*Math.log(d/spring_length)*(node2.x - node1.x)/d;
	}


	//electric_force = (ke/Math.pow(d,2))*((node1.x - node2.x)/d);
	electric_force = (electric_factor/Math.sqrt(d))*((node1.x - node2.x)/d);
	// console.log("hook/elec "+node1.id+"-> "+node2.id);
	// console.log(hook_force);
	// console.log(electric_force);
	return electric_force + hook_force;
}

function calculate_force_y(node1, node2) {
	var d = distance(node1, node2);
	var hook_force = 0;
	var electric_force = 0;

	if(d == 0) {
		node1.y += 50;
		adjust_coordinate(node1);
		return 0;
	}

	if(contains_edge_by_nodes(node1, node2)) {
		hook_force = elastic_factor*Math.log(d/spring_length)*(node2.y - node1.y)/d;
	}

	electric_force = (electric_factor/Math.sqrt(d))*((node1.y - node2.y)/d);

	return electric_force + hook_force;
}

function distance(node1, node2) {
	var x1 = node1.x;
	var y1 = node1.y;
	var x2 = node2.x;
	var y2 = node2.y;

	return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function magnetic_force(edge) {
	var d = distance(edge.source, edge.target);
	var th = theta(edge.source, edge.target);
	var magnetic_force = Math.abs(Math.pow(d, alpha)*Math.pow(th, beta));
	// console.log("d: "+d);
	// console.log("th: "+th);
	// console.log("force: "+magnetic_force);
	// console.log("magn "+edge.source.id+"-> "+edge.target.id);
	// console.log(magnetic_force);
	var force_x = magnetic_factor*magnetic_force*((edge.source.x - edge.target.x)/d);
	// console.log(force_x);

	if(force_x<0) {
		edge.source.force_x += force_x;
		edge.target.force_x -= force_x;
	}
	else {
		edge.source.force_x -= force_x;
		edge.target.force_x += force_x;
	}

	var force_y = magnetic_factor*magnetic_force*((edge.source.y - edge.target.y)/d)/height;
	//console.log(force_y);

	if(force_y < 0) {
		edge.source.force_y += force_y;
		edge.target.force_y -= force_y;
	}
	else {
		edge.source.force_y -= force_y;
		edge.target.force_y += force_y;
	}


}

function theta(node1, node2) {
	var m = (node2.y -node1.y)/(node2.x -node1.x);
	var theta = Math.atan(m);

	if((node1.x > node2.x) && (node1.y < node2.y)) {
		return Math.PI - Math.abs(theta);
	}

	if((node1.x > node2.x) && (node1.y > node2.y)){
		return Math.PI - Math.abs(theta);
	}

	if((node1.x < node2.x) && (node1.y > node2.y)){
		return Math.abs(theta);
	} 


	return theta;
}


function move_verteces() {
	nodes.forEach(function(node) {

		node.x += forces_factor*node.force_x;

		node.y += forces_factor*node.force_y;

		//adjust_coordinate(node);
	});
}

function adjust_coordinate(node) {
	if(node.x < 20) {
		node.x = 20;
	}

	if(node.x > width-20) {
		node.x = width-20;
	}

	if(node.y < 20) {
		node.y = 20;
	}

	if(node.y > height-20) {
		node.y = height-20;
	}
}


//funzione ricorsiva per il calcolo del cammino massimo di un nodo
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

//funzione per assegnare ai vertici il proprio layer usando longest-path
function first_layerization() {

	for (var i = 0; i < nodes.length; ++i) {

		var node = nodes[i];

		var n = longest_path(node);

		node.layer = n;
		node.x = n;

	}
}

//funzione che inverte i layer dei nodi e setta le coordinate degli archi
function second_layerization() {

	var max = max_layer();

//	//Se la distanza tra i nodi sulla coordinata x é troppo stretta, estendo la width
//	if((width/max) < 200)
//	width =+ width*1.5;

	nodes.map(function(d) {
		var x = max - d.x + 1;

		d.layer = x;

		d.x = calculate_x(x, width, max);

	});
}

function contains_edge_by_nodes(node1, node2) {

	return edges
	.some(function(element, index, array) {
		return (element.source.id == node2.id && element.target.id == node1.id);
	});
}

function fit_graph() {
	
	var min_x = nodes[0].x;
	var min_y = nodes[0].y;
	
	nodes.forEach(function(d) {
		if(d.x < min_x) {
			min_x = d.x;
		}
		
		if(d.y < min_y) {
			min_y = d.y;
		}
	});
	
	nodes.forEach(function(d) {
		d.x -= min_x - 25;
		
		d.y -= min_y - 35;
	});
	
	
}