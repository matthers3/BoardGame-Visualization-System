// D3 Script

const rsvg = d3.select(".bar_chart")
			  .append("svg")
			  .attr("class", "br_chart")
			  .attr("width", 450)
			  .attr("height", 300)


const ordinalScale = d3.scaleOrdinal()
					   .domain(["","Average Time", "Min Time", "Max Time", ""])
					   .range([0, 75, 150, 225, 300]);

const barYScale = d3.scaleLinear()
					.domain([0, 150])
					.range([300, 50]);

const barXAxis = rsvg.append("g")
                     .attr("class", "bar-x-axis") 
                     .attr("transform", "translate(75, " + (barYScale(0) - 25) +")")
                     .call(d3.axisBottom(ordinalScale))
                     .selectAll(".tick")
                     .select("text")
                     .attr("margin-top", 10)
                     .attr("transform", "rotate(-20)");

const barYAxis = rsvg.append("g")
                     .attr("class", "bar-y-axis") 
                     .attr("transform", "translate(75, -25)")
                     .call(d3.axisLeft(barYScale));

const yLabel = rsvg.append("text")
                   .text("Minutos")
                   .attr("text-anchor", "center")
                   .attr("x", -175)
                   .attr("y", 35)
                   .attr("transform", "rotate(-90)");

function set_bar_data(d) {
	parse_data = [["Average Time", d.avg_time], ["Min Time", d.min_time], 
			["Max Time", d.max_time]];
	max_value = Math.max(d.avg_time, d.min_time, d.max_time)
	
	barYScale.domain([0, max_value + 10])
             .range([300, 50]);
    
  barYAxis.transition().duration(500)
          .call(d3.axisLeft(barYScale));

	minRects.data(parse_data);
	minRects.exit().remove();
	minRects.enter();
	minRects.transition().duration(500)
			.attr('x', d => 60 + ordinalScale(d[0]))
            .attr('y', d => barYScale(d[1]) - 25)
            .attr('height', d => barYScale(0) - barYScale(d[1]));

}

const minRects = rsvg.selectAll('.minRect')
                   .data([["Average Time", 0], ["Min Time", 0], 
						  ["Max Time", 0]]).enter()
                   .append('rect')
                   .attr('x', d => 60 + ordinalScale(d[0]))
                   .attr('y', d => barYScale(d[1]) - 25)
                   .attr('width', 30)
                   .attr('height', d => barYScale(0) - barYScale(d[1]))
                   .attr('fill', '#004747');