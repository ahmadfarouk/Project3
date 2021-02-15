// @TODO: YOUR CODE HERE!


var svgWidth = 1000;
var svgHeight = 600;
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Define Dimensions of the Chart Area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // Parameters

  var labelXaxis = "Budget";
  var labelYaxis = "Revenue"

// function used for updating X-Scale var upon click
function xScale(data, labelXaxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d=> d[labelXaxis])*0.9,  d3.max(data, d => d[labelXaxis])*1.1])
    .range([0, width]);
    return xLinearScale;
  }
 
  // function used for updating y-scale var upon click on axis label
 function yScale(data, labelYaxis) {
   // create scales
   var yLinearScale = d3.scaleLinear()
     .domain([d3.min(data, d => d[labelYaxis])*0.9, d3.max(data, d => d[labelYaxis])*1.1])
     .range([height, 0]);
 
   return yLinearScale; 
}
// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, labelXaxis, newYScale, labelYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[labelXaxis]))
      .attr("cy", d => newYScale(d[labelYaxis]));
  
    return circlesGroup;
  }
  