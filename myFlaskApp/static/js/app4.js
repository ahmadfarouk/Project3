var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

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

// Initial Params
var chosenXAxis = "TitleCount";
var chosenXAxis = "director_name";
var factor = 100000000

// function used for updating x-scale var upon click on axis label
function xScale(DirectorData,chosenXAxis) {
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

  if (chosenXAxis == "TitleCount") {
    label = "Number of Titles:";
  }
  else {
    label = "Revenue:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.Director_Name}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

var parseTime = d3.timeParse("%Y")

// Retrieve data from the CSV file and execute everything below
function buildPlot (filterYear) {
    
    var chartGroup = init_svg ()

    data = d3.json("/api/v1.0/directors_count_revenue").then(function(AllDirectorData, err) {
        if (err) throw err;
      
        var panel = d3.select("#graph-metadata");
        panel.html("");
    
        panel.append("h6").text("The graph shows the Number of titles per director and revenue each year.");

        // parse data
      
        AllDirectorData.forEach(function(data) {
          data.Director_Name = data.Director_Name;
          data.ReleaseYear = data.ReleaseYear;
          data.TitleCount = +data.TitleCount;
          data.Revenue = +data.Revenue;
         });
      
         var DirectorData=AllDirectorData.filter(d => d.ReleaseYear == filterYear)
      
        // xLinearScale function above csv import
        var xLinearScale = xScale(DirectorData, chosenXAxis);
      
        // Create y scale function
        var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(DirectorData, (d,i) => i)])
          .range([height, 0]);
      
        // Create initial axis functions
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
      
        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
          .data(DirectorData)
          .enter()
          .append("circle")
          .attr("cx", function (d) {xLinearScale(d[chosenXAxis])})
          .attr("cy", (d,i) => yLinearScale(i))
          .attr("r", 2)
          .attr("fill", "red")
      
        // Create group for two x-axis labels
        var labelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 20})`);
      
        var TitCntLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "TitleCount") // value to grab for event listener
          .classed("active", true)
          .text("Number of titles");
      
        var RevLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("value", "Revenue") // value to grab for event listener
          .classed("inactive", true)
          .text("Revenue");
      
        // append y axis
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .classed("axis-text", true)
          .text("Director Name");
      
        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
      
        console.log (DirectorData);
      
        // x axis labels event listener
        labelsGroup.selectAll("text")
          .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
      
              // replaces chosenXAxis with value
              chosenXAxis = value;
      
              // console.log(chosenXAxis)
      
              // functions here found above csv import
              // updates x scale for new data
              xLinearScale = xScale(DirectorData, chosenXAxis);
      
              // updates x axis with transition
              xAxis = renderAxes(xLinearScale, xAxis);
      
              // updates circles with new x values
              circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
      
              // updates tooltips with new info
              circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
      
              // changes classes to change bold text
              if (chosenXAxis === "Revenue") {
                RevLabel
                  .classed("active", true)
                  .classed("inactive", false);
                TitCntLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
              else {
                  RevLabel
                  .classed("active", false)
                  .classed("inactive", true);
                  TitCntLabel
                  .classed("active", true)
                  .classed("inactive", false);
              }
            }
          });
      }).catch(function(error) {
        console.log(error);
      });     
}

var mainForm = d3.select("#selDataset");
mainForm.on("change", formChange)

function formChange () {
  d3.event.preventDefault ();

  var SelectDrawingArea = d3.select("#bar");
  SelectDrawingArea.html("");

  enter_otu_id = d3.select("#selDataset")
  filter_date_value = enter_otu_id.property("value");
//   console.log(filter_date_value)

  buildPlot(filter_date_value);
}

function init ()
 {

    drop_down=d3.select('#selDataset');
    menu_list = [] ;

    d3.json("/api/v1.0/directors_count_revenue").then((data) => {
        
        data.forEach((item)=>
        {
            menu_list.push (item.ReleaseYear)
        });

        menu_list = menu_list.filter(onlyUnique);
        menu_list.sort(function(a, b) {
            return b - a;
          })
        menu_list.forEach((item) => {
            drop_down.append('option').text(item).property("value", item);
        })
        
        firstPlayer_name=data[0].ReleaseYear
        buildPlot(firstPlayer_name);
    })
 }

 init ()
