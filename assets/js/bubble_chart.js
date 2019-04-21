// D3 Script
fix = 0.8
let my_WIDTH = Math.trunc(700 * fix)
let my_HEIGHT = Math.trunc(425 * fix)
const SVG_MARGIN = {top: 5, right: 5, bottom: 30, left: 40};
var rdivide = 25;



const bsvg = d3.select(".bubble_chart")
			  .append("svg")
			  .attr("class", "b_chart")
			  .attr("width", my_WIDTH)
			  .attr("height", my_HEIGHT)

function process_data(data, x, amount) {

	let list = [];
	for (var key in data) {
		list.push(data[key])
	}
	list.sort(function(a){return a[x]})
	list.reverse();
	//console.log(list);
	return list.slice(0, amount);
}

const ordinal_scale = d3.scaleOrdinal();

let xScale = null;

let x_axis = null;

let yScale = null;

let y_axis = null; 


d3.csv('assets/data/BGG-2018-06-v2.csv').then(d => {
	let datos = process_data(d, "avg_rating", 800);

	// datos = datos.slice(1, datos.length);
	//console.log(datos);

	var extreme = get_extreme_values(datos);
	var ratings_ext = get_extreme_ratings(datos);

	yScale = d3.scaleLinear()
			   .domain(ratings_ext)
			   .range([my_HEIGHT - SVG_MARGIN.bottom, SVG_MARGIN.top]);

	xScale = d3.scaleLinear()
		       .domain(extreme)
		       .range([SVG_MARGIN.left, my_WIDTH - SVG_MARGIN.right]);

	xAxis = d3.axisBottom(xScale).ticks(5);  // para zoom
	yAxis = d3.axisLeft(yScale);

    x_axis = bsvg.append("g")
			 .attr("class", "x axis")
			 .attr("transform", "translate(0, "+ yScale(ratings_ext[0])+")")
			 .call(xAxis);
			 //.selectAll(".tick")
			 //.select("line")
			 //.attr("y2", yScale(9.5) - yScale(6))
			 //attr("stroke-width", 0.1);


	y_axis = bsvg.append("g")
			 .attr("class", "y axis")
			 .attr("transform", "translate(" + SVG_MARGIN.left + ", 0)")
			 .call(yAxis);
			 // .selectAll(".tick")
			 // .select("line")
			 // .attr("x2", my_WIDTH - 125)
			 // .attr("stroke-width", 0.1);

	const y_axis_text = bsvg.append("text")
				  .text("Average rating")
				  .style("text-anchor", "middle")
				  .style("font-weight", "bold")
				  .attr("x", (-1) * my_HEIGHT/2)
				  .attr("y", 12)
				  .attr("transform", "rotate(-90)");

	const x_axis_text = bsvg.append("text")
				  .text("Year of release")
				  .attr("class", "axis_text")
				  .style("text-anchor", "middle")
				  .style("font-weight", "bold")
				  .attr("x", my_WIDTH/2)
			      .attr("y", my_HEIGHT);

	let circles = bsvg.selectAll(".circles")
	             .data(datos).enter()
	             .append("circle")
	             .attr("cx", data => xScale(data.year))
	             .attr("cy", data => yScale(data.avg_rating))
	             .attr("r", data => (Math.sqrt(parseInt(data.owned)) / rdivide) * fix)
	             .attr("fill", "#386FB5")
	             .attr("opacity", 0.45)
	             .attr("class", "game-circle")
	             .on("mouseover", data  => {
	             	highlight_bubble(data);
	             	set_focus(data);})
	             .on("click", data => {set_center(data, "bubble");})
	             .on('mouseout', data => unhighlight_bubble(data));
});


function unhighlight_bubble(data) {
	d3.selectAll('.game-circle')
	  .attr('opacity', 0.45)
	  .attr('fill', '#386FB5')
	  .attr('stroke-width', 0);
}

function highlight_bubble(data) {
	d3.selectAll('.game-circle')
	  .filter(d => {return data.rank == d.rank})
	  .attr('opacity', 1)
	  .attr('fill', 'red')
	  .attr('stroke', 'black')
      .attr('stroke-width', 1);

	d3.selectAll('.game-circle')
	  .filter(d => {return !(data.rank == d.rank)})
	  .attr('opacity', 0.2)
	  .attr('fill', '#386FB5');
}

async function add_circle(data) {
	var actual_data = [];

	bsvg.selectAll(".game-circle")
		.filter(d => {
			actual_data.push(d);
			return false;
		});
	var dataset = await d3.csv('assets/data/BGG-2018-06-v2.csv');
	for (i in dataset) {
		if (dataset[i].rank == data.id) {
			var selected = dataset[i];
			break
		}
	}
	actual_data.push(selected);

	update_bubble_data(actual_data);
	return;
}

function update_bubble_data(d) {

	bsvg.selectAll(".game-circle").remove();
	var extreme = get_extreme_values(d);
	var ratings_ext = get_extreme_ratings(d);

	xScale.domain(extreme);
    yScale.domain(ratings_ext);
	
	// para que resetee el zoom
	bsvg.call(zoom.transform, d3.zoomIdentity);

	let circles = bsvg.selectAll(".circles")
	             .data(d).enter()
	             .append("circle")
	             .attr("cx", d => xScale(d.year))
	             .attr("cy", d => yScale(d.avg_rating))
	             .attr("r", d => (Math.sqrt(parseInt(d.owned)) / rdivide) * fix)
	             .attr("fill", "#386FB5")
				 .attr("opacity", 0.45)
				 .attr("class", "game-circle")
	             .on("mouseover", d  => {
	             	highlight_bubble(d);
	             	set_focus(d);})
	             .on("click", d => {set_center(d, "bubble");})
	             .on('mouseout', d => unhighlight_bubble(d));
}

function get_extreme_values(d) {
	let arr = []
	for (var key in d) {
		var value = parseInt(d[key].year, 10);
		if (!Number.isNaN(value)){
			arr.push(value);
		}
	}
	let min = Math.min.apply(null, arr);
	let max = Math.max.apply(null, arr);
	return [min - 2, max];
}

function get_extreme_ratings(d) {
	let arr = []
	for (var key in d) {
		var value = Number(d[key].avg_rating);
		if (!Number.isNaN(value)){
			arr.push(value);
		}
	}
	let min = Math.min.apply(null, arr);
	let max = Math.max.apply(null, arr);
	return [min, max];
}

function set_focus(d) {
	d3.select(".focus_image").attr("src", d.image_url);
	d3.select(".Name").text(d.names);
	d3.select(".Author").text(d.designer + " " + d.year);
	d3.select(".Mechanics").html("Mecánicas:" + d.mechanic);
	d3.select(".Players").text("Jugadores: " + d.min_players + " a " + d.max_players);
	d3.select(".Descriptions").html("Descripción: " + d.description);
	adjust_icons(d);
	set_awards(d);
}

//---------------------------------
// para ZOOM
var zoom = d3.zoom()
	.scaleExtent([1, 8])
	.translateExtent([[-40, 0], [my_WIDTH, my_HEIGHT + 40]])
	.on("zoom", zoomed);

function zoomed() {
	var t = d3.event.transform;
	x_axis.call(xAxis.scale(t.rescaleX(xScale)));
	y_axis.call(yAxis.scale(t.rescaleY(yScale)));
	bsvg.selectAll(".game-circle").attr("transform", t)
		.filter(function(d){
			var g = d3.select(this);
			var tx = parseFloat(g.attr("cx"))* parseFloat(t["k"]) + parseFloat(t["x"]);
			var ty = parseFloat(g.attr("cy"))* parseFloat(t["k"]) + parseFloat(t["y"]);
			return tx < 43 || ty > 310;})
		.attr("display", "none")
	;
	bsvg.selectAll(".game-circle").attr("transform", t)
		.filter(function(d){
			var g = d3.select(this);
			var tx = parseFloat(g.attr("cx"))* parseFloat(t["k"]) + parseFloat(t["x"]);
			var ty = parseFloat(g.attr("cy"))* parseFloat(t["k"]) + parseFloat(t["y"]);
			return tx > 43 && ty < 310;})
		.attr("display", "block")
	;
	
}
bsvg.call(zoom);
//---------------------------------

