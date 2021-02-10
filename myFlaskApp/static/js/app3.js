function buildPlot(data, filter_value) { 

    var panel = d3.select("#graph-metadata");
    panel.html("");

    panel.append("h6").text("The graph shows the number of titles produced by each country per release year");

    var filtered_data=data.filter(d => d.release_year == filter_value)
    //console.log (filtered_data)

    x_axis = []
    y_axis = []

    filtered_data.forEach ((d)=>
    {
        x_axis.push(d.country_name)
        y_axis.push(d.Count_of_Titles)
    });

    //console.log (x_axis)
    //console.log (y_axis)

    var trace1 = {
        x: x_axis,
        y: y_axis,
        text:"Count of Titles by Countries Per Year",
        type: "bar",
        orientation: "v"
    };
    var plot_data = [trace1];

    var layout ={
        title: "Count of Titles by Countries Per Year",
        barmode: "group",
        //yaxis: {tickmode:"linear"}
    };
    Plotly.newPlot("bar", plot_data, layout)   
    
    


   
}

var mainForm = d3.select("#selDataset");
mainForm.on("change", formChange)

function formChange () {
  d3.event.preventDefault ();
  var SelectMenu = d3.select(".svg-container");
  SelectMenu.html("");

  enter_otu_id = d3.select("#selDataset")
  filter_date_value = enter_otu_id.property("value");
  console.log(filter_date_value)

  d3.json("/api/v1.0/titles_country").then((data) => {buildPlot(data, filter_date_value);})
}

function readData(sample){

    // Use `d3.json` to Fetch the Metadata for a Sample
        d3.json("samples.json").then(function(data) {
    
            //console.log(data)
            var resultArray=data.metadata.filter(sampleObj => sampleObj.id==sample);
            //console.log(resultArray)

            // use .html("") to clear any existing Data
            var panel = d3.select("#graph-metadata");
            panel.html("");
    
            // Use object.entries to add Each key value pair to the panel
    
            Object.entries(resultArray[0]).forEach(([key, value]) =>{
    
            panel.append("h6").text(`${key}: ${value}`);
            //console.log(key, value)
    
            // use d3 to append new tags for Each-Value in the MetaData
            });
            // Bonus: build gauge Chart 
            
            
        });
    };
    //readData();
    
function init() {
    drop_down=d3.select('#selDataset');

    d3.json("/api/v1.0/titles_country").then((data) => {
        //loop through ids_selection and append option to drop_down
        data.forEach((item)=>
        {
            drop_down.append('option').text(item.release_year).property("value", item.release_year);
        });

        //grab the first sample and build the charts on the page for page load
        firstRelease_year=data[0].release_year
        //console.log(firstCountry)
        buildPlot(data, firstRelease_year);
        // readData(firstSample);
        // buildGauge(firstSample);
    })
}


//call init for page load
init();
