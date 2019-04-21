// D3 Script

var ICON_SIZE = {'width': 20, 'height': 24}

const char_positions = {1: 30, 2: 60, 3: 110}
var stats = d3.select("#icons-container")
			  .append("svg")
			  .attr("width", 200)
			  .attr("height", 500);


function adjust_players(max_players) {
	if (max_players < 4) {	
		return [1, 'Few players'];
	}
	else if (max_players < 6) {
		return [2, 'Moderate players'];
	}
	else {
		return [3, 'Many players'];
	}
};

function adjust_complexity(weight) {
	if (weight < 1.74) {
		return [1, 'Low complexity'];
	}
	else if (weight < 2.89) {
		return [2, 'Medium complexity'];
	}
	else {
		return [3, 'High complexity'];
	}
};

function adjust_time(time) {
	if (time < 30) {
		return [1, 'Brief'];
	}
	else if (time < 120) {
		return [2, 'Average'];
	}
	else {
		return [3, 'Long Run'];
	}
};

function set_color(d) {
	if (d == 1) {
		return "#8AA2D4";
	}
	else if (d == 2) {
		return "#74C6CB" ;
	}
	else {
		return "#386FB5";
	}
}

function adjust_icons (data) {
	var TIME = 250;
	var [n_players, players_text] = adjust_players(data.max_players);
	var [complexity, complexity_text] = adjust_complexity(data.weight);
	var [time, time_text] = adjust_time(data.avg_time);

	// Labels
	players_label.text(players_text + ": " + data.min_players + " - " + data.max_players)
			     .style("fill", set_color(n_players));
	complexity_label.text(complexity_text)
					.style("fill", set_color(complexity));
	time_label.text(time_text + ": " + data.avg_time + "mins")
			  .style("fill", set_color(time));

	// Icons
	players.filter(d => d != n_players).transition().duration(TIME).attr("opacity", 0.15);
	players.filter(d => d == n_players).transition().duration(TIME).attr("opacity", 1);
	complexity_engine.filter(d => d != complexity).transition().duration(TIME).attr("opacity", 0.15);
	complexity_engine.filter(d => d == complexity).transition().duration(TIME).attr("opacity", 1);
	time_index.filter(d => d != time).transition().duration(TIME).attr("opacity", 0.15);
	time_index.filter(d => d == time).transition().duration(TIME).attr("opacity", 1);

};

var players = stats.selectAll(".players")
					.data([1, 2, 3]).enter()
					.append("svg:image")
					.attr('x', d => char_positions[d])
					.attr('y', d => 80 + ICON_SIZE.height * (1 - d))
					.attr('width', d => ICON_SIZE.width * d)
					.attr('height', d => ICON_SIZE.height * d)
					.attr("xlink:href", d => "assets/icons/char" + d + ".png");

var players_label = stats.append("text")
						 .style("text-anchor", "middle")
						 .attr("transform", "translate(100, 130)")
						 .text("")
						 .style("font-family", "Roboto Condensed")
						 .style("font-weigth", "700");

var complexity_engine = stats.selectAll(".engines")
					.data([1, 2, 3]).enter()
					.append("svg:image")
					.attr('x', d => char_positions[d])
					.attr('y', d => 200 + ICON_SIZE.height * (1 - d))
					.attr('width', d => ICON_SIZE.width * d)
					.attr('height', d => ICON_SIZE.height * d)
					.attr("xlink:href", d => "assets/icons/weigth" + d + ".png");

var complexity_label = stats.append("text")
						 .style("text-anchor", "middle")
						 .attr("transform", "translate(100, 245)")
						 .text("")
						 .style("font-family", "Roboto Condensed")
						 .style("font-weigth", "700");

var time_index = stats.selectAll(".time")
					.data([1, 2, 3]).enter()
					.append("svg:image")
					.attr('x', d => char_positions[d])
					.attr('y', d => 330 + ICON_SIZE.height * (1 - d))
					.attr('width', d => ICON_SIZE.width * d)
					.attr('height', d => ICON_SIZE.height * d)
					.attr("xlink:href", d => "assets/icons/time" + d + ".png");

var time_label = stats.append("text")
						 .style("text-anchor", "middle")
						 .attr("transform", "translate(100, 380)")
						 .text("")
						 .style("font-family", "Roboto Condensed")
						 .style("font-weigth", "700");
