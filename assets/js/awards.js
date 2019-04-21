// D3 Script

var AWARD_SIZE = {'width': 25, 'height': 30}

async function set_awards(d) {
	var game = d;
	await d3.json("assets/data/info_extra.json").then(data => {
		title_awards = data[game.game_id].awards;
	});

	if (title_awards.length == 0) {
		awards_svg.style("display", "none");
		return;
	}

	awards_svg.style("display", "block");

	awards_svg.selectAll(".awards").remove();
	awards_svg.selectAll("image").remove();

	var awards = awards_svg.selectAll(".awards")
			  .data(title_awards).enter()
			  .append("svg:image")
		      .attr('x', (_, i) => 60 + (AWARD_SIZE.width + 10) * i)
		  	  .attr('y', 10)
		  	  .attr('width', 0)
		      .attr('height', 0)
		      .attr("xlink:href", "assets/icons/award.png")
		      .on("mouseover", function(d) {
		      	d3.select(".award-tooltip")
		      	          .style("display", "block")
		      	          .style("left", d3.event.pageX + 10 + "px")
		      	          .style('top', d3.event.pageY - 120 + 'px')
		      	          .html("Award:" + "<br/>" + d);
		      })
		      .on("mousemove", function(d) {
		      	d3.select(".award-tooltip")
		      	          .style("display", "block")
		      	          .style("left", d3.event.pageX + 10 + "px")
		      	          .style('top', d3.event.pageY - 120 + 'px')
		      	          .html("Award:" + "<br/>" + d);
		      })
		      .on("mouseout", function(d) {
		      	d3.select(".award-tooltip")
		      	          .style("display", "none");
		      });


	awards.transition().duration(250)
		  .attr('width', AWARD_SIZE.width)
		  .attr('height', AWARD_SIZE.height);
	return;
};

var awards_svg = d3.select("#description")
			   .append("svg")
			   .attr("width", 400)
			   .attr("height", 50);

awards_svg.append("text")
	  .attr("transform", "translate(0, 30)")
	  .text("Awards: ")
	  .style("font-family", "Roboto Condensed")
	  .style("font-weigth", "700")
	  .style("fill", "#386FB5");

var awards = awards_svg.selectAll(".awards")
                       .data([]).enter()
					   .append("svg:image")
					   .attr('x', (_, i) => 60 + (AWARD_SIZE.width + 10) * i)
					   .attr('y', 10)
					   .attr('width', AWARD_SIZE.width)
					   .attr('height', AWARD_SIZE.height)
					   .attr("xlink:href", "assets/icons/award.png");

var award_tootltip = d3.select("body").append("div")
							   .attr("class", "award-tooltip");