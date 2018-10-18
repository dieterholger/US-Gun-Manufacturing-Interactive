d3.json('https://raw.githubusercontent.com/dieterholger/US-Gun-Manufacturing-Interactive/master/data/us_states.json', function(geo_data) {

  var width = 960,
    height = 500

  var svg = d3.select('#gunManufacturingCitiesMap')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');

  var formatComma = d3.format(",");

  var projection = d3.geoAlbersUsa();

  var path = d3.geoPath().projection(projection);

  var map = svg.selectAll('path')
    .data(geo_data.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .attr('fill', 'orange')
    .style('opacity', 0.7)
    .on('mouseover', function(d) {
      d3.select(this).transition().duration(300).style('opacity', 1);
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition().duration(300)
        .style('opacity', 0.7);
    });


  // Settings for tooltip text and content.

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<p><strong><font size='2rem'>" + d.city + ", " + d.state + "</p></strong></font>" + "<p><font size='2rem'><strong>Guns Manufactured: </strong>" + formatComma(d.guns) + "</p>" +
        "<p><strong>Top Manufacturer:</strong> " + d.manufacturer +
        "</p></font>";
    })

  svg.call(tip);

  d3.csv('https://raw.githubusercontent.com/dieterholger/US-Gun-Manufacturing-Interactive/master/data/top100cities.csv', function(error, data) {

    // Converts strings in csv to integers so they can be used.

    data.forEach(function(d) {
      return d.guns = +d.guns;
    });

    var guns_extent = d3.extent(data, function(d) {
      return d.guns;
    });

    var radius = d3.scaleSqrt()
      .domain(guns_extent)
      .range([2, 40]);

    var bubbles = svg.append('g')
      .attr('class', 'bubble')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return projection([d.lon, d.lat])[0];
      })
      .attr('cy', function(d) {
        return projection([d.lon, d.lat])[1];
      })

    // Separate out the animation and mouseover so the mousover works, per: https://stackoverflow.com/questions/22645162/d3-when-i-add-a-transition-my-mouseover-stops-working-why
    bubbles.attr('r', 0)
      .transition()
      .duration(1000)
      .attr('r', function(d) {
        return radius(d.guns);
      })
      .attr('fill', 'rgba(189, 189, 189, 0.5)')
      .attr('stroke', 'black');

    bubbles.on('mouseover', function(d) {
        tip.show(d);
        return d3.select(this).attr('fill', 'rgba(189, 189, 189, 0.9');
      })
      .on('mouseout', function(d) {
        tip.hide(d);
        return d3.select(this).attr('fill', 'rgba(189, 189, 189, 0.5)');
      });

    // Legend adapted from Mike Bostock's example here: https://bl.ocks.org/mbostock/9943478

    var legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (width - 60) + ',' + (height - 10) + ')')
      .selectAll('g')
      .data([500000, 2000000])
      .enter()
      .append('g');

    legend.append('circle')
      .attr('cy', function(d) {
        return -radius(d);
      })
      .attr('r', radius);

    legend.append('text')
      .attr('y', function(d) {
        return -1.9 * radius(d);
      })
      .attr('dy', '1.3em')
      .text(d3.format('.1s'));

  });
});
