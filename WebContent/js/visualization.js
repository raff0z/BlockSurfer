var margin = {
	top : 20,
	right : 120,
	bottom : 20,
	left : 120
}, width = 960 - margin.right - margin.left, height = 800 - margin.top
		- margin.bottom;

var i = 0, duration = 750, root;

var tree = d3.layout.tree().nodeSize([ 180, 180 ]).size([ height, width ]);

var depth;

var nodeCount;

var diagonal = d3.svg.diagonal().projection(function(d) {
	return [ d.y, d.x ];
});

var triangleSx = [-10.0,0.0,
                  0.0,-5.0,
                  0.0,5.0];

var triangleDx = [20.0,0.0,
	              10.0,-5.0,
	              10.0,5.0];

var svg = d3.select("body").append("svg").attr("width",
		width + margin.right + margin.left).attr("height",
		height + margin.top + margin.bottom).append("g").attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

function init(idTr) {
	depth = 1;
	nodeCount = 0;
	
	var json = "/BlockSurfer/jsontransaction.do?id=" + idTr;
	d3.json(json, function(error, transaction) {
		transaction.idTr = idTr;
		root = transaction;
		root.x0 = height / 2;
		root.y0 = 0;

		function collapse(d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		}

		root.children.forEach(collapse);
		update(root);
	});
	
	d3.select(self.frameElement).style("height", "800px");
}

function update(source) {

	//Increase the width when the depth increases
    d3.select("svg").attr("width", ((250*depth)+180));
    
    //Incraese the height when nodes increases
    d3.select("svg").attr("height", Math.max(height, 360+(nodeCount*80)));
	tree.size([ Math.max(height, 360+(nodeCount*80)),width]);
	
	// Compute the new tree layout.
	var nodes = tree.nodes(root).reverse(), links = tree.links(nodes);

	// Normalize for fixed-depth.
	nodes.forEach(function(d) {
		d.y = d.depth * 180;
	});

	// Update the nodes…
	var node = svg.selectAll("g.node").data(nodes, function(d) {
		return d.id || (d.id = ++i);
	});

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("g").attr("class", "node").attr(
			"transform", function(d) {
				return "translate(" + source.y0 + "," + source.x0 + ")";
			}).on("click", click)
			.on("mouseover", mouseover)
			.on("mouseout", mouseout);
	
	
	nodeEnter.append("rect").attr("y", -5).attr("width", 10).attr("height", 10).style("fill", function(d) {
		return d._children ? "lightsteelblue" : "#fff";
	});
		
	nodeEnter.append("polygon").attr("x", -10).attr("width", 10).attr("height", 10).attr("points", triangleSx);
	
	nodeEnter.append("polygon").attr("x", 10).attr("width", 10).attr("height", 10).attr("points", triangleDx);
	
	nodeEnter.append("text").attr("x", function(d) {
		return d.children || d._children ? -10 : 10;
	}).attr("dy", ".35em").attr("text-anchor", function(d) {
		return d.children || d._children ? "end" : "start";
	}).text(function(d) {
		return d.idTr;
	}).style("fill-opacity", 1e-6);

	// Transition nodes to their new position.
	var nodeUpdate = node.transition().duration(duration).attr("transform",
			function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			});

	nodeUpdate.select("rect").attr("y", -5).attr("width", 10).attr("height", 10).style("fill", function(d) {
		return d._children ? "lightsteelblue" : "#fff";
	});

	nodeUpdate.select("text").style("fill-opacity", 1);

	// Transition exiting nodes to the parent's new position.
	var nodeExit = node.exit().transition().duration(duration).attr(
			"transform", function(d) {
				return "translate(" + source.y + "," + source.x + ")";
			}).remove();

	nodeExit.select("rect").attr("y", -5).attr("width", 10).attr("height", 10);

	nodeExit.select("text").style("fill-opacity", 1e-6);

	// Update the links…
	var link = svg.selectAll("path.link").data(links, function(d) {
		return d.target.id;
	});

	// Enter any new links at the parent's previous position.
	link.enter().insert("path", "g").attr("class", "link").attr("d",
			function(d) {
				var o = {
					x : source.x0,
					y : source.y0
				};
				return diagonal({
					source : o,
					target : o
				});
			});

	// Transition links to their new position.
	link.transition().duration(duration).attr("d", diagonal);

	// Transition exiting nodes to the parent's new position.
	link.exit().transition().duration(duration).attr("d", function(d) {
		var o = {
			x : source.x,
			y : source.y
		};
		return diagonal({
			source : o,
			target : o
		});
	}).remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});
}

function mouseover(d) {
    d3.select(this).append("text")
        .attr("class", "hover")
        .attr('transform', function(d){ 
            return 'translate(5, -10)';
        })
        .text(d.hash);
}

//Toggle children on click.
function mouseout(d) {
    d3.select(this).select("text.hover").remove();
}

// Toggle children on click.
function click(d) {
	function doClick(d) {
		if (d.children) {
			if (d.depth == depth-1){
                --depth;
			}
			d._children = d.children;
			d.children = null;
		} else {
			if (d.depth == depth){
				++depth;
			}
			d.children = d._children;
			d._children = null;
		}

		update(d);
	};
	
	function collapse(d) {
		if (d.children) {
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	}

	var json = "/BlockSurfer/jsontransaction.do?id=" + d.idTr;
	if (!d.loaded) {
		d3.json(json, function(error, transaction) {
			d._children = transaction.children;
			
			nodeCount += d._children.length;
			
			d._children.forEach(collapse);
			d.loaded = true;
			doClick(d);
		});
	} else {
		doClick(d);
	}
}