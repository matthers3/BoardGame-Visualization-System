// D3 Script

const fix = 1
const WIDTH = 280;
const HEIGHT = 300 * fix;
const MARGIN = { TOP: 20, BOTTOM: 20, LEFT: 25, RIGHT: 25 };
const RADIUS = 8 * fix;
const COLOR = 0.3;

const width = WIDTH - MARGIN.RIGHT - MARGIN.LEFT;
const height = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

const FILEPATH = 'assets/data/distances_both.json';

var queue = [];
var center = null;
var all_data = null;
var little_data = null;
var games_displayed = 20;
var progress = null;
var data = null;

async function fetch_db(){
  little_data = await d3.csv('assets/data/BGG-2018-06-v2.csv');
};

const progress_container = d3.select('.radial_layout')
  .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
  .append('g')
    .attr('transform',
        `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
    .attr('stroke', 'black')
    .attr('stroke-width', fix);

progress_container.append("text")
                  .attr("transform", "translate(100, 100)")
                  .style("font-family", "Roboto Condensed")
                  .style("font-weigth", "700")
                  .style("fill", "#386FB5")
                  .text("Path");

const container = d3.select('.radial_layout')
  .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
  .append('g')
    .attr('transform',
        `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
    .attr('stroke', 'black')
    .attr('stroke-width', fix);

container.append("rect")
         .attr("x", 0)
         .attr("y", 0)
         .attr("width", WIDTH - 2 * MARGIN.LEFT)
         .attr("height", HEIGHT - 2 * MARGIN.TOP)
         .attr("fill", "none")
         .attr("stroke", "grey")
         .attr("stroke-width", 1);

progress_container.append("rect")
         .attr("x", 0)
         .attr("y", 75)
         .attr("width", WIDTH - 2 * MARGIN.LEFT)
         .attr("height", HEIGHT - 2 * MARGIN.TOP - 150)
         .attr("fill", "none")
         .attr("stroke", "grey")
         .attr("stroke-width", 1);

container.append("svg:defs").selectAll("marker")
    .data(["end"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 35)
    .attr("refY", 0)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto-start-reverse")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

function reduce_db(data, amount, origin) {
	var arr = {}
    arr["nodes"] = [];
    arr["links"] = data.links;
	arr.links.sort(function(a, b) {return a.distance - b.distance});
	arr.links = arr.links.slice(0, amount);

  new_links = [];
  for (relation in arr.links) {
    if (isNaN(arr.links[relation].target)) {
      //console.log("yay");
      new_links.push({'source': arr.links[relation].source.id,
                      'target': arr.links[relation].target.id,
                      'distance': arr.links[relation].distance})
    }
    else {
      new_links.push(arr.links[relation])
    }
  }
  arr.links = new_links;
  //console.log(arr.links);

	arr.nodes.push({"id": origin});
	for (relation in arr.links) {
    if (isNaN(arr.links[relation].target)) {
      arr.nodes.push({"id": arr.links[relation].target.id})
    }
    else {
      arr.nodes.push({"id": arr.links[relation].target})
    }
	}
	return arr 
}

const ticked = () => {
// Cada tick aumenta el alpha en (alphaTarget - alpha) × alphaDecay
// alpha = alpha + (alphaTarget - alpha) × alphaDecay
// alphaTarget parte como 0, alpha como 1 y alphaDecay como 0.0228
// Los ticks acaban cuando alpha es menor a una cota. Por defecto esa cota es  0.001

container.selectAll('.node')
    .attr('transform', node => `translate(${node.x}, ${node.y})`);

    container.selectAll('line')
             .attr('x1', link => link.source.x)
             .attr('y1', link => link.source.y)
             .attr('x2', link => link.target.x)
             .attr('y2', link => link.target.y)
             .attr('stroke', "grey")
             .attr('stroke-width', 0.4 * fix);

    let all_nodes = simulation.nodes()

    all_nodes.forEach((node) => {

      if (node.x < MARGIN.LEFT) {
        node.x = MARGIN.LEFT;
        node.vx = 0;
      }

      else if (node.x > WIDTH - 2 * MARGIN.LEFT - 20) {
        node.x = WIDTH - 2 * MARGIN.LEFT - 20;
        node.vx = 0;
      }

      if (node.y < MARGIN.TOP) {
        node.y = MARGIN.TOP;
        node.vy = 0;
      }

      if (node.y > HEIGHT - 2 * MARGIN.TOP - 20) {
        node.y = HEIGHT - 2 * MARGIN.TOP - 20;
        node.vy = 0;
      }

})
};

const simulation = d3.forceSimulation()
                     .force('ceronter', d3.forceCenter(width/2, height/2))
                     .force('collision', d3.forceCollide(0.001))
                     .force('charge', d3.forceManyBody().strength(-400 * fix))
                     .force('link', d3.forceLink().id(node => node.id));

var links = null;


d3.json(FILEPATH).then(async function(dataset) {

    await fetch_db();

    all_data = dataset;

    dataset = reduce_db(dataset[1], games_displayed, 1);

    center = 1;

    var center_mechanics = await get_center_data(dataset);
    set_mechanics(center_mechanics);

    simulation.nodes(dataset.nodes)
              .on('tick', ticked)
              .force('link')
              .links(dataset.links)
              .distance(d => d.distance);

    links = dataset.links;


    container.selectAll('line')
             .data(dataset.links)
             .enter()
             .append('line')
             .attr('x1', link => link.source.x)
             .attr('y1', link => link.source.y)
             .attr('x2', link => link.target.x)
             .attr('y2', link => link.target.y)
             .attr("marker-end", "url(#end)");

    let nodes = container.selectAll('.node')
                           .data(dataset.nodes)
                           .enter()
                           .append('g')
                           .attr('class', 'node');

    nodes.append('circle')
         .attr('r', RADIUS)
         .attr('fill', "#386FB5")
         .attr('class', 'node-circle')
         .on('mouseover', d => {
          highlight_game(d);
          display_game(d);})
         .on('click', d => {set_center(d, "graph")})
         .on('mouseout', d => {unhighlight_game(d)});
});

function unhighlight_game(data) {
  d3.selectAll('.node-circle')
    .attr('fill', "#386FB5");

  d3.selectAll('.paths')
    .select('circle')
    .attr('fill', '#386FB5');

  d3.selectAll('.game-circle')
    .attr('fill', '#386FB5')
    .attr('opacity', '0.45')
    .attr('stroke', 'black')
    .attr('stroke-width', 0);
}

async function highlight_game(data) {
  var inbubble = false;

  d3.selectAll('.node-circle')
    .filter(d => {return d.id == data.id})
    .attr('fill', 'red');

  d3.selectAll('.game-circle')
    .filter(d => {
      var verdict = d.rank == data.id;
      if (verdict == true) {
        inbubble = true;
      }
      return verdict;})
    .attr('fill', 'red')
    .attr('opacity', '1')
    .attr('stroke', 'black')
    .attr('stroke-width', 1);

  if (inbubble == false) {
    await add_circle(data);

    d3.selectAll('.game-circle')
    .filter(d => {
      var verdict = d.rank == data.id;
      if (verdict == true) {
        inbubble = true;
      }
      return verdict;})
    .attr('fill', 'red')
    .attr('opacity', '1')
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
  }

  d3.selectAll('.game-circle')
    .filter(d => {return !(d.rank == data.id)})
    .attr('opacity', '0.1')
    .attr('stroke-width', 0);

}

function display_game(d) {
  let dataset = little_data;
  for (var key in dataset){
    if (d.id == dataset[key].rank){
        set_focus(dataset[key]);
        break
    } 
  }
}

function get_center_data(d) {
    //console.log(d);
    //console.log(d.links[0]);
    var r = d.links[0].source;
    if (isNaN(r)) {
      r = r.id;
    }
    var base = little_data;
    for (var key in base){
      if (r == base[key].rank){
          return base[key].mechanic.split(", ");
      }
    }
  }

function find_node(e) {
    container.selectAll('.node').filter(function(d){ 
      return d.id == e.id})
             .each(d => {
              //console.log(d);
              set_center(d, "circle")});
  };

function get_distance(node, links){
  for (var link in links){
    //console.log('debug', link, links[link], node, node.id, links[link].target, links[link].target.id == node.id)
    if (links[link].target == node.id){
      //console.log('debug2', link, links[link])
      return links[link].distance;
    };
  };
  return 1;
};

async function set_center(d, source) {

    if (d.id == center) {
      //console.log(d);
      //console.log(center);
      return;
    }

    if (source != "circle") {
        queue.push(d); 
        //console.log(queue);
        center = d.id;
        if (isNaN(center)) {
          center = d[""];
        }
    }
    else {
      queue = queue.slice(0, queue.indexOf(d) + 1);
    }
    unhighlight_game(d);
    if (source == "bubble"){
      d['id'] = d[""];
      queue = [d];
      data = reduce_db(all_data[d.rank], games_displayed, parseInt(d.rank, 10));
    }
    else if (source == "search"){
      queue = [d];
      data = reduce_db(all_data[d.rank], games_displayed, parseInt(d.rank, 10));
    }
    else {
      data = reduce_db(all_data[d.id], games_displayed, parseInt(d.id, 10));
      //console.log(data);
    }

    if (queue.length == 8) {
      queue = [queue[queue.length - 1]];
    }

    var center_mechanics = get_center_data(data);
    set_mechanics(center_mechanics);

    links = data.links;

    container.selectAll('line').remove();

    container.selectAll('line').data(data.links).enter()
                               .append('line')
                               .attr('x1', link => link.source.x)
                               .attr('y1', link => link.source.y)
                               .attr('x2', link => link.target.x)
                               .attr('y2', link => link.target.y)
                               .attr("marker-end", "url(#end)");

    container.selectAll('.node').remove();

    let nodes = container.selectAll('.node')
                         .data(data.nodes)
                         .enter()
                         .append('g')
                         .attr('class', 'node')
                         .append('circle')
                         .attr('r', RADIUS)
                         .attr('fill', "#386FB5")
                         .attr('class', 'node-circle')
                         .on('mouseover', d => {
                          highlight_game(d);
                          display_game(d);})
                         .on('click', d => {
                          set_center(d, "graph")})
                         .on('mouseout', d => {unhighlight_game(d)});

    progress_container.selectAll("circle").remove();

    progress_container.selectAll(".paths").data(queue).enter()
                      .append("circle").attr("cx", (_, i) => 25 + i * 30)
                                       .attr("cy", 135)
                                       .attr("r", 10)
                                       .attr("fill", "#386FB5")
                                       .on('mouseover', d => {
                                        highlight_game(d);
                                        display_game(d);})
                                       .on('click', d => set_center(d, "circle"))
                                       .on('mouseout', d => {unhighlight_game(d)});;

    //nodes.filter(function(d){ return queue.includes(d.id)}).attr("r", 20);

    simulation.nodes(data.nodes)
              .on('tick', ticked)
              .force('link')
              .links(data.links)
              .distance(d => 20 * d.distance);

    simulation.alphaTarget(0.3).restart();
    await new Promise(resolve => setTimeout(resolve, 2000));
    simulation.alphaTarget(0).restart();

}