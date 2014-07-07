//Vars

var color = d3.scale.category10();

var width = 960,
height = 500;


var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

//build the arrow.
svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 18.5)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var links = [];
var nodes = [];

var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(60)
    .charge(-300);

var node = svg.selectAll(".node"),
link = svg.selectAll(".link");


//Functions

function tick() {
	  link
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}

function mouseover() {
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 16);
}

function mouseout() {
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 8);
}

function addNode(transaction) {
//	var transaction =  {id: '' + id + ''};
	var id = transaction.id;
	transaction.id = transaction.id; 
	
	Array.prototype.contains = function ( id ) {
		   for (i in this) {
		       if (this[i].id == id) return true;
		   }
		   return false;
	};
	
	if(!nodes.contains(transaction.id)){
		nodes.push(transaction);
//		update();
	}
}

function addLink(source, target) {
	var link = {source: source , target: target };
	
	//TODO OUR FUNCTION
	Array.prototype.contains = function ( sourceTarget ) {
		   for (i in this) {
			   if ((this[i].source == sourceTarget[0] ) && (this[i].target == sourceTarget[1] )){
				   return true;
			   }
		   }
		   return false;
	};
	if(!links.contains([source, target])){
		links.push(link);
//		update();
	}
	
}
	
function update() {
	
	link = link.data(force.links(), function(d) {
		return d.source.id + "-" + d.target.id;
	});
	
	link.enter().insert("line",".node").attr("class", "link").attr("marker-end", "url(#end)");

	link.exit().remove();
	
	node = node.data(force.nodes(), function(d) {
		return d.id;
	});
	
	node.enter().append("g").attr("class", "node").on("mouseover", mouseover)
			.on("mouseout", mouseout).call(force.drag).insert("circle").attr(
					"r", 8).on("click", click);

	node.exit().remove();
	
	force.on("tick", tick);

	force.start();
}

//Toggle children on click.
function click(node) {
	var json = "/BlockSurfer/jsontransaction.do?id=" + node.id;
		d3.json(json, function(error, transaction) {
			
			var children = transaction.children;
			
			for(i in children){
				addNode(children[i]);
				addLink(transaction, children[i]);
			}
			
			update();
		});
}

function init(id){
	var json = "/BlockSurfer/jsontransaction.do?id=" + id ;
	d3.json(json, function(error, transaction) {
		addNode(transaction);
		update();
	});

}
