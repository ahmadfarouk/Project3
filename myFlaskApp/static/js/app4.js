var svgWidth = window.width;
var svgHeight = window.height;

var margin = {
  top: 20,
  right: 30,
  bottom: 20,
  left: 30
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenYAxis = "DirectorCount";
var chosenXAxis = "Directors";

// function used for updating x-scale var upon click on axis label
function xScale(DirectorData, chosenXAxis) {
  // create scales
  
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(DirectorData, d => d[chosenXAxis]) * 0.8,
      d3.max(DirectorData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "hair_length") {
    label = "Hair Length:";
  }
  else {
    label = "# of Albums:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

var parseTime = d3.timeParse("%Y")

// Retrieve data from the CSV file and execute everything below
d3.json("/api/v1.0/directors_count_revenue").then(function(DirectorsData, err) {
  if (err) throw err;

  DirectorsData[0].forEach(function(d1) {
      d1.DirectorsName = d1.DirectorsName;
      d1.ReleaseYear = parseTime(d1.ReleaseYear)
      d1.TitleCount = +d1.TitleCount
      console.log(d1)
    });

  DirectorsData[1].forEach(function(d2) {
      d2.director_name = d2.director_name;
      d2.release_year = parseTime(d2.release_year)
      d2.revenue = +d2.revenue
      console.log(d2)
    });

}).catch(function(error) {
  console.log(error);
});
