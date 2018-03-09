function plotPoints(data) {

  var nested = d3.nest()
    .key(function(d) {
      return d['City']
    })
    .rollup(function(leaves) {
      var total = d3.sum(leaves, function(d) {
        return d['Guns'];
      });

      var coords = leaves.map(function(d) {
        return projection([+d.long, +d.lat]);
      });

      // How to get the x and y coordinates from coords and return them?

      return {
        'Guns': total
      }

    })
    .entries(data);

  svg.append('g')
    .attr('class', 'bubble')
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle');

  // Need to add attr selectors based upon the returned x and y values.

};


g.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', function(d) {
    return projection([d.lon, d.lat]);
  })
  .attr('cy', function(d) {
    return projection([d.lon, d.lat]);
  })
  .attr('r', 20)
  .style('fill', 'rgba(103, 65, 114, 0.5)');
