var svgWidth = 960;
var svgHeight = 500;

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
  .select("#bar")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenYAxis = "TitleCount";
var chosenXAxis = "DirectorsName";
var DataSetNumber = 0;

// function used for updating x-scale var upon click on axis label

function xScale(DirectorData, x_index, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
  .domain([0,DirectorData[x_index].length * 1.2])
  .range([0, width]);
  console.log (DirectorData[x_index].length * 1.2)
  return xLinearScale;
}

function yScale(DirectorData, y_index, chosenYAxis) {
  // create scales
  var factor = 10000
  if (chosenYAxis != "DirectorsName") {factor = 1}

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Math.round(DirectorData[y_index], d => d[chosenYAxis]) * 0.8),
      Math.round(d3.max(DirectorData[y_index], d => d[chosenYAxis]) * 1.2 / factor)
    ])
    .range([height, 0]);
  
  console.log(Math.round(d3.max(DirectorData[y_index], d => d[chosenYAxis]) * 1.2 / factor))
  return yLinearScale;
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
      console.log(d1.TitleCount)
    });

  DirectorsData[1].forEach(function(d2) {
      d2.director_name = d2.director_name;
      d2.release_year = parseTime(d2.release_year)
      d2.revenue = +d2.revenue
    });

    var xLinearScale = xScale(DirectorsData, DataSetNumber, chosenXAxis);

    var yLinearScale = yScale(DirectorsData, DataSetNumber, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(DirectorsData[DataSetNumber])
    .enter()
    .append("circle")
    .attr("cx", function (d) {
            xLinearScale(d[chosenXAxis]); 
            //console.log(d[chosenXAxis])
          })
    .attr("cy", function (d) {
            yLinearScale(d[chosenYAxis]); 
            //console.log(d[chosenYAxis])
          })
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var DirectorsNameLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "DirectorsName") // value to grab for event listener
    .classed("active", true)
    .text("Director Name");

  var DirectorNameLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "TitleCount") // value to grab for event listener
    .classed("inactive", true)
    .text("Number of Titles");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Number of Titles");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

}).catch(function(error) {
  console.log(error);
});
