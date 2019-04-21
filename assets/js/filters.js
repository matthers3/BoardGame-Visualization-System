
// Script

var center_mechanics = [];

/////////////////////////////////// Bubble Chart /////////////////////////////////////////

async function set_bubble_filters() {
	var data = await d3.csv('assets/data/BGG-2018-06-v2.csv');

	var mechanic_list_b =  d3.select("#mechanic-list-bubble")
	  						 .on("change", function() {change_bubble_data(d3.select("#mechanic-list-bubble")
		  									  				  .property("value"))});

	d3.selectAll(".deletable-option-b").remove();
	var mechanic_list_b = mechanic_list_b.selectAll(".optionb")
	 					.data(mechanics).enter()
	 					.append("option")
	 					.attr("value", d => d)
						.attr("class", "deletable-option-b")
						.text(d => d);

}

set_bubble_filters();


async function change_bubble_data(m){
	var data = await d3.csv('assets/data/BGG-2018-06-v2.csv');
	var arr = []
	//console.log("here")
	for (var key in data) {
		if (m == "None") {
			var arr = data;
			break;
		}
		if (typeof data[key].mechanic === "undefined") {
			break;
		}
		if (data[key].mechanic.indexOf(m) >= 0) {
			arr.push(data[key]);
		}
	}
	var final_data = process_data(arr, "avg_rating", 601);
	final_data = final_data.slice(1, final_data.length);
	update_bubble_data(final_data);
}



//////////////////////////////////  Force Graph  /////////////////////////////////////////

function set_mechanics(m) {
	//console.log(m);
	d3.selectAll(".deletable-option").remove();
	var mechanic_list = d3.select("#mechanic-list")
					  .on('change', function() {
					  	var value = d3.select("#mechanic-list").property("value");
					  	highlight_mechanic(value);
					  });

	var mechanic_list = mechanic_list.selectAll(".option")
				 .data(m).enter()
				 .append("option")
				 .attr("value", d => d)
				 .attr("class", "deletable-option")
				 .text(d => d);
}

async function highlight_mechanic(m) {
	d3.selectAll('.node-circle')
      .style('opacity', 1);
      
	if (m == "None") {
		return;
	}
	var data = await d3.csv('assets/data/BGG-2018-06-v2.csv');
	var filtered = d3.selectAll('.node-circle')
        			 .filter(function(d) {return !check_mechanic(m, d, data);})
        			 .style('opacity', 0.2);
    return;

}

function check_mechanic(m, d, data) {
	var focus = d.id;
	for (var key in data){
      if (focus == data[key].rank){
          return data[key].mechanic.indexOf(m) >= 0;
      }
    }
}