 // @TODO: YOUR CODE HERE!
 var svgWidth = 960;
 var svgHeight = 500;
 var margin = {
   top: 20,
   right: 30,
   bottom: 80,
   left: 100
 };
 
 // Define Dimensions of the Chart Area
 var width = svgWidth - margin.left - margin.right;
 var height = svgHeight - margin.top - margin.bottom;
 
 // Create an SVG wrapper, append an SVG group that will hold our chart,
 // and shift the latter by left and top margins.
 
 function onlyUnique(value, index, self) {
   return self.indexOf(value) === index;
   }  
 function init_svg ()

 {

  var svg = d3
    .select("#bar")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
 return chartGroup
 }

  // Parameters

  var labelXaxis = "TitleCount";
  // var labelXaxis = "TotalRevenue";
  // var factor = 100000000

// function used for updating X-Scale var upon click
 function xScale(TitleData, labelXaxis) {
   // create scales
   var xLinearScale = d3.scaleLinear()
   .domain([d3.min(TitleData, d => d[labelXaxis])* 0.1, 
   d3.max(TitleData, d => d[labelXaxis]) * 1.2])
   .range([0, width]);

   return xLinearScale;
 }

 // function used for updating y-scale var upon click on axis label
// function yScale(data,labelYaxis) {
  // create scales 
 
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// // function used for updating yAxis var upon click on axis label
// function renderAxesY(newYScale, yAxis) {
//   var leftAxis = d3.axisLeft(newYScale);

//   yAxis.transition()
//     .duration(1000)
//     .call(leftAxis);

// //   return yAxis;
// }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, labelXaxis) {