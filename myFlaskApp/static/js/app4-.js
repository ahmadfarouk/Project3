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
var chosenYAxis = "revenue";
var chosenXAxis = "director_name";
var DataSetNumber = 1;
var factor = 100000000

// function used for updating x-scale var upon click on axis label

function xScale(DirectorData, x_index, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
  .domain([0,DirectorData[x_index].length * 1.2])
  .range([0, width]);
  console.log (DirectorData[x_index].length * 1.2)
  console.log (xLinearScale)
  return xLinearScale;
}

function yScale(DirectorData, y_index, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([0, Math.round(d3.max(DirectorData[y_index], d => d[chosenYAxis] ))])
    .range([height, 0]);
  
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

  var toolTip = d3.tip()
  var label;

  if (chosenXAxis == "DirectorsName") {
    label = "Number of Titles:";
    toolTip
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.DirectorsName}<br>${label} ${d[chosenYAxis]}`);
    });
  }
  else {
    label = "Revenue";
    toolTip
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
        return (`${d.director_name}<br>${label} ${d[chosenYAxis]}`);
        });
  }


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

  if (chosenXAxis == "DirectorsName") {factor = 1}
  console.log ("factor = ", factor)

  DirectorsData[0].forEach(function(d1) {
      d1.DirectorsName = d1.DirectorsName;
      d1.ReleaseYear = parseTime(d1.ReleaseYear)
      d1.TitleCount = +d1.TitleCount
      //console.log(d1.TitleCount)
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
    .attr("transform", `translate(50, ${height - 20} )`)
    .call(bottomAxis);

    xAxis.append("text")
    .attr("x", width /2 )
    .attr("y", 20 )
    .attr("dy", "1em")
    .classed("active", true)
    .text("Director Name");    

  // append y axis
  chartGroup.append("g")
    .attr("transform", `translate(50, -20)`)
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(DirectorsData[DataSetNumber])
    .enter()
    .append("circle")
    .attr("transform", `translate(50, 0)`)
    .attr("cx", function (d,i) {
            //console.log(xLinearScale(i));
            return xLinearScale(i) + 50; 
          })
    .attr("cy", function (d) {
            console.log (yLinearScale(d));
            return yLinearScale(d); 
          })
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var NumberOfTitlesLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "NumOfTitleLabel") // value to grab for event listener
    .classed("active", true)
    .text("Number of Titles");

  var RevenueLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "RevLabal") // value to grab for event listener
    .classed("inactive", true)
    .text("Revenue");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

}).catch(function(error) {
  console.log(error);
});
