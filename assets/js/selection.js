// D3 Script

const image = d3.select(".focus_image")
				.attr("width", 100)
				.attr("height", 100);


async function search() {
  	var data = await d3.csv('assets/data/BGG-2018-06-v2.csv'); 
 	let name = document.getElementById("auto_complete_game").value
  	for (var key in data) {
  		if (name == data[key].names) {
  			var focus_rank = data[key];
  			break;
  			}
		}
	set_center(focus_rank, 'search');
	set_focus(focus_rank);
  }


