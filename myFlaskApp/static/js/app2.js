



  
  


  
    
    



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

// updateToolTip function above csv import
var circlesGroup = updateToolTip(labelXaxis, labelYaxis, circlesGroup);

// x axis labels event listener
labelsGroupX.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== labelXaxis) {

      // replaces chosenXAxis with value
      labelXaxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(Data, labelXaxis);

      // updates x axis with transition
      xAxis = renderAxesX(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, labelXaxis, yLinearScale, labelYaxis);

      //update circle text with new x values
      circlesText = renderCirclesText(circlesText, xLinearScale, labelXaxis, yLinearScale, labelYaxis)
      
      // updates tooltips with new info
      circlesGroup = updateToolTip(labelXaxis, labelYaxis, circlesGroup);

      

      // changes classes to change bold text for x axis
      if (labelXaxis === "Budget") {
        BudgetLabel
          .classed("active", true)
          .classed("inactive", false);
        RevenueLabel
          .classed("active", false)
          .classed("inactive", true);
        TotalbudgetLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (labelXaxis === "Revenue") {
        BudgetLabel
        .classed("active", true)
        .classed("inactive", false);
       RevenueLabel
        .classed("active", false)
        .classed("inactive", true);
       TotalbudgetLabel
        .classed("active", false)
        .classed("inactive", true);
      }
      else if (labelXaxis === "Total_budget") {
        BudgetLabel
        .classed("active", true)
        .classed("inactive", false);
        RevenueLabel
        .classed("active", false)
        .classed("inactive", true);
        TotalbudgetLabel
        .classed("active", false)
        .classed("inactive", true);
      }
    }
  });



// y axis labels event listener
labelsGroupY.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== labelYaxis) {

      // replaces chosenYAxis with value
      labelYaxis= value;

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(Data, labelYaxis);
    
      // updates y axis with transition
      yAxis = renderAxesY(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, labelXaxis, yLinearScale, labelYaxis);

      //update circle text with new y values
      circlesText = renderCirclesText(circlesText, xLinearScale, labelXaxis, yLinearScale, labelYaxis)
      
      // updates tooltips with new info
      circlesGroup = updateToolTip(labelXaxis, labelYaxis, circlesGroup);

      

      // changes classes to change bold text for x axis
      if (labelYaxis === "obesity") {
        ObesityLabel
          .classed("active", true)
          .classed("inactive", false);
        SmokesLabel
          .classed("active", false)
          .classed("inactive", true);
        HealthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (labelYaxis  === "smokes") {
        ObesityLabel
          .classed("active", false)
          .classed("inactive", true);
        SmokesLabel
          .classed("active", true)
          .classed("inactive", false);
        HealthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (labelYaxis  === "healthcare") {
        ObesityLabel
          .classed("active", false)
          .classed("inactive", true);
        SmokesLabel
          .classed("active", false)
          .classed("inactive", true);
        HealthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });


});
