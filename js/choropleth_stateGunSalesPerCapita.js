//Load in data on states.

d3.csv('https://raw.githubusercontent.com/dieterholger/US-Gun-Manufacturing-Interactive/master/data/choropleth_data.csv', function(data) {


  data.forEach(function(d) {
    d.Manufactured = +d.Manufactured;
    d.Sales = +d.Sales;
    d['Sales per 100,000 People'] = +d['Sales per 100,000 People'];
  });

  //Set the color scale

  var colorScale = d3.scaleSequential(d3.interpolateOranges)
    .domain([d3.min(data, function(d) {
        return d['Sales per 100,000 People'];
      }),
      d3.max(data, function(d) {
        return d['Sales per 100,000 People'];
      })
    ]);


  //Load GeoJSON data and merge with states.

  d3.json('https://raw.githubusercontent.com/dieterholger/US-Gun-Manufacturing-Interactive/master/data/us_states.json', function(json) {

    //Loop through each state data value.
    for (var i = 0; i < data.length; i++) {

      //Grab state name
      var dataState = data[i].State;

      //Grab data value
      var dataValue = data[i]['Sales per 100,000 People'];

      //Find corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {

        var jsonState = json.features[j].properties.NAME;

        if (dataState == jsonState) {

          //Copy the data value into the JSON
          json.features[j].properties.value = dataValue;

          //Stop looking through the json
          break;

        }
      }
    }

    //Sets dimensions
    var width = 960,
      height = 500

    //Tells the map what projection to use
    var projection = d3.geoAlbersUsa();

    //Tells the map how to draw the paths from the projection
    var path = d3.geoPath().projection(projection);

    //Appends SVG to page
    var svg = d3.select('#gunSalesPerCapitaMap')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g');

    //Draws the map and its attributes
    var map = svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', function(d) {

        var value = d.properties.value;

        return colorScale(value);
      })
      .style('opacity', 0.7)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)

      // Mouse over and mouse out effects.

      .on('mouseover', function(d) {
        d3.select(this).transition().duration(300).style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition().duration(300)
          .style('opacity', 0.7);
      });

  })
})
