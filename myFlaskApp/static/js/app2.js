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
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[labelXaxis]));
    // .attr("cy", d => newYScale(d[labelYaxis]));

  return circlesGroup;
}

// function renderCirclesText(circlesText, newXScale, labelXaxis) {

//   circlesText.transition()
//     .duration(1000)
//     .attr("x", d => newXScale(d[labelXaxis]))
//     // .attr("y", d => newYScale(d[labelYaxis]));

//   return circlesText;
// }

// function used for updating circles group with new tooltip
function updateToolTip(labelXaxis, circlesGroup) {

  
  var label;

  if (labelXaxis === "TitleCount") {
     label = "Number of titles: ";

  }
  else if(labelXaxis == "TotalRevenue") {
    label = "TotalRevenue";

  }
  else if (labelXaxis == "TotalBudget") {
    label = "Budget"
  }

  var toolTip = d3.tip()
  
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.Country}<br>${label} ${d[labelXaxis]}`);
    });
  circlesGroup.call(toolTip)
    //mouseover event
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
var parseTime = d3.timeParse("%Y")


 //Retrieve data from the CSV file and execute everything below
function buildPlot (filterYear) {
    var chartGroup = init_svg ()
        data = d3.json("/api/v1.0/country_year_budget_revenue").then(function(CountryData, err){
            if (err) throw err;
            var panel = d3.select("#graph-metadata");
            panel.html("");
            panel.append("h6").text("The graph shows the Number of titles per Country, budget and revenue each year.");
          
            CountryData.forEach(function(data) {

              // Parser through the data and cast as numbers
                data.Budget = +data.Budget;
                data.Revenue = + data.Revenue;
                data.Country= data.Country;
                data.TitleCount = + data.TitleCount;
                data.TotalBudget = +data.TotalBudget;
                data.TotalRevenue = +data.TotalRevenue;
                data.ReleaseYear = data.ReleaseYear;
                
              
              });
              var TitleData = CountryData.filter(d => d.ReleaseYear == filterYear)
        
               console.log(CountryData);

            // xLinearScale and yLinearScale 
            // xLinearScale and yLinearScale function above csv import

            var xLinearScale = xScale(TitleData, labelXaxis);
            var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(TitleData, (d,i) => i )])
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
            // .attr("transform", `translate(0, 0-${height})`)
              .call(leftAxis);

            // append initial circles
            var circlesGroup = chartGroup.selectAll("circle")
              .data(TitleData)
              .enter()
              .append("circle")
              .attr("cx", d => xLinearScale(d[labelXaxis]))
              .attr("cy", (d,i) => yLinearScale(i))
              .attr("r", 10)
              .attr("fill", "red");
              circlesGroup = renderCircles(circlesGroup, xLinearScale, labelXaxis);


          // append initial circle labels
          //missing the first states in the list

            // var circlesTextGroup= chartGroup.append("g")

            // var circlesText = circlesTextGroup.selectAll("text")
            //   .data(TitleData)
            //   .enter()
            //   .append("text")
            //   .attr("x", d => xLinearScale(d[labelXaxis]))
            //   // .attr("y", d => yLinearScale(d[labelYaxis]))
            // // .attr("dy", "1em")
            //   .text(d => d.abbr)
            //   .classed("stateText", true);

          // Create group for  3 x-axis labels
              var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

            var TitCntLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "TitleCount") // value to grab for event listener
            .classed("active", true)
            .text("Number of Titles");

            var RevenueLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "TotalRevenue") // value to grab for event listener
            .classed("inactive", true)
            .text("Total revenue ($)");

            var TotalbudgetLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "TotalBudget") // value to grab for event listener
            .classed("inactive", true)
            .text("Total Budget ($)");

             // append y axis
            chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Country");

          // updateToolTip function above csv import
          var circlesGroup = updateToolTip(labelXaxis, circlesGroup);

          // x axis labels event listener
          labelsGroup.selectAll("text")
          .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== labelXaxis) {

              // replaces chosenXAxis with value
              labelXaxis = value;

              // console.log(chosenXAxis)

              // functions here found above csv import
              // updates x scale for new data
              xLinearScale = xScale(TitleData, labelXaxis);

              // updates x axis with transition
              xAxis = renderAxes(xLinearScale, xAxis);

              // updates circles with new x values
              circlesGroup = renderCircles(circlesGroup, xLinearScale, labelXaxis);

              //update circle text with new x values
              // circlesText = renderCirclesText(circlesText, xLinearScale, labelXaxis)
              
              // updates tooltips with new info
              circlesGroup = updateToolTip(labelXaxis, circlesGroup);

              

              //    changes classes to change bold text for x axis
              if (labelXaxis === "TotalRevenue") {
                RevenueLabel
                  .classed("active", true)
                  .classed("inactive", false);
                TitCntLabel
                  .classed("active", false)
                  .classed("inactive", true);
                TotalbudgetLabel 
                  .classed("active", false)
                  .classed("inactive", true);

              } 
              else if (labelXaxis === "TitleCount") {
                RevenueLabel
                .classed("active", false)
                .classed("inactive", true);
                TitCntLabel
                .classed("active", true)
                .classed("inactive", false);
                TotalbudgetLabel 
                .classed("active", false)
                .classed("inactive", true);

              }
              else if  (labelXaxis === "TotalBudget") {
                RevenueLabel
                .classed("active", false)
                .classed("inactive", true);
                TitCntLabel
                .classed("active", false)
                .classed("inactive", true);
              TotalbudgetLabel
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

    d3.json("/api/v1.0/country_year_budget_revenue").then((data) => {
        
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



