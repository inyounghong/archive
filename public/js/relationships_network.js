// Returns an array of the characters in the given relationship string
function parseChars(str) {
    var chars = [];
    if (str.indexOf("/") != -1) {
        chars.push(str.split("/")[0]);
        chars.push(str.split("/")[1]);
    } else if (str.indexOf("&") != -1) {
        chars.push(str.split(" & ")[0]);
        chars.push(str.split(" & ")[1]);
    } else {
        console.log("Cannot parse: " + str);
    }
    return chars;
}

$(document).ready(function(){
    $.get('http://localhost:3000/data', {}, function(data){
        $("#results").text(JSON.stringify(data, null, '\t'));
        console.log(data);

        var graph = {
            "nodes": [], //{ "_id": "Draco Malfoy/Harry Potter", "count": 15309 },
            "links": [],
        }

        var charSet = new Set();

        // Loop through relationship data and create graph
        for (var i = 0; i < data.nodes.length; i++) {
            var chars = parseChars(data.nodes[i]._id);


            // Add to charSet
            charSet.add(chars[0]);
            charSet.add(chars[1]);

            // Add to links
            graph.links.push({"source": chars[0], "target": chars[1], "value": data.nodes[i].count});
        }

        // Add nodes
        for (value of charSet) {
            graph.nodes.push({"_id": value, "count": 5});
        }

        console.log(graph);

        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");


        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d._id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        console.log(data.nodes);

        var linkScale = d3.scaleSqrt()
           .domain([0, 15000])
           .range([0, 10]);

      var link = svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width", function(d) { return linkScale(d.value); });

        var node = svg.selectAll(".node")
              .data(graph.nodes).enter()
              .append("g")
              .attr("class", "node")
              .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));



          var circle = node.append("circle")
            //   .attr("r", function(d) { return countScale(d.count) })
             .attr("r", function(d) { return d.count})
            //   .style("fill", function (d) { return color(d.group); })
            .style("fill", "rgb(149, 207, 234)");

          var text = node.append("text")
            .attr("x", 10)
            .attr("y", 5)
             .text(function(d) { return d._id; });

          simulation
              .nodes(graph.nodes)
              .on("tick", ticked);

          simulation.force("link")
              .links(graph.links);

          function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"})
                // .attr("cx", function(d) { return d.x; })
                // .attr("cy", function(d) { return d.y; });

          }

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

    });
});
