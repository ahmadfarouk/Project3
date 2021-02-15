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

  function renderCirclesText(circlesText, newXScale, labelXaxis, newYScale, labelYaxis) {

    circlesText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[labelXaxis]))
      .attr("y", d => newYScale(d[labelYaxis]));
  
    return circlesText;
}

// function used for updating circles group with new tooltip
function updateToolTip(labelXaxis, labelYaxis, circlesGroup) {

    if (labelXaxis === "Budget") {
      var labelX = "Budget: ";
    }
    else if (labelXaxis==="Total_budget"){
      var labelY="Total_budget: ";
  
    }
  
      else if (labelXaxis==="budget"){
        var labelY="budget: ";
    }
    if (labelYaxis==="Revenue"){
      var labelY="Revenue: "
    }
    else if (labelYaxis==="PG_rating"){
      var labelY="PG_rating: ";
  
    }
    else if (labelYaxis==="country_name"){
      var labelY="country_name: ";
    } 
  
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, 0])
    .html(function(d) {
      return (`${d.state}<br>${labelX} ${d[labelXaxis]}<br>${labelY} ${d[labelYaxis]}`);
    });

  circlesGroup.call(toolTip)
    //mouseover event
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
    });

  return circlesGroup;
}

//Retrieve data from the CSV file and execute everything below
d3.json("/api/v1.0/budget_revenue_rating_country").then(function(Data){
    Data.forEach(function(data) {

      // Parser through the data and cast as numbers
        data.Budget = +data.Budget;
        data.Revenue = + data.Revenue;
        data.PG_Rating= data.PG_rating;
        data.Total_budget = +data.Total_budget;
        data.budget = +data.budget;
        data.country_name = data.country_name;
       

      
      
     });
    console.log(Data);



    // xLinearScale and yLinearScale 
// xLinearScale and yLinearScale function above csv import

var xLinearScale = xScale(Data, labelXaxis);
var yLinearScale= yScale(Data, labelYaxis)

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
var yAxis= chartGroup.append("g")
  // .attr("transform", `translate(0, 0-${height})`)
  .call(leftAxis);

// append initial circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(Data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[labelXaxis]))
  .attr("cy", d => yLinearScale(d[labelXaxis]))
  .attr("r", 20)
  .classed("stateCircle", true);

// append initial circle labels
//missing the first states in the list

var circlesTextGroup= chartGroup.append("g")

var circlesText = circlesTextGroup.selectAll("text")
.data(Data)
.enter()
.append("text")
.attr("x", d => xLinearScale(d[labelXaxis]))
.attr("y", d => yLinearScale(d[labelYaxis]))
// .attr("dy", "1em")
.text(d => d.abbr)
.classed("stateText", true);

// Create group for  3 x-axis labels
var labelsGroupX = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

var BudgetLabel = labelsGroupX.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "Budget") // value to grab for event listener
.classed("active", true)
.text("($)");

var Revenuelabel = labelsGroupX.append("text")
.attr("x", 0)
.attr("y", 40)
.attr("value", "Revenue") // value to grab for event listener
.classed("inactive", true)
.text("($)");

var TotalBudgetabel = labelsGroupX.append("text")
.attr("x", 0)
.attr("y", 60)
.attr("value", "Total budget") // value to grab for event listener
.classed("inactive", true)
.text("$");

// Create group for  3 y-axis labels
var labelsGroupY = chartGroup.append("g")
.attr("transform", `translate(${margin.left}, ${(height / 2)})`);

var ObesityLabel = labelsGroupY.append("text")
.attr("transform", "rotate(-90)")
.attr("x", 0)
.attr("y", -170)
// .attr("dy", "1em")
.attr("value", "obesity") // value to grab for event listener
.classed("active", true)
.text("Obese (%)");

var SmokesLabel = labelsGroupY.append("text")
.attr("transform", "rotate(-90)")
.attr("x", 0)
.attr("y", -150) 
// .attr("dy", "1em")
.attr("value", "smokes") // value to grab for event listener
.classed("inactive", true)
.text("Smokes (%)");

var HealthcareLabel = labelsGroupY.append("text")
.attr("transform", "rotate(-90)")
.attr("x", 0)
.attr("y", -130)
// .attr("dy", "1em")
.attr("value", "healthcare") // value to grab for event listener
.classed("inactive", true)
.text("Lacks Healthcare (%)");

  