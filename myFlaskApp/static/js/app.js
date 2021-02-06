// d3.json("/api/v1.0/titles").then(function(data) {
//     console.log(data)
// })

// Netflix - Plotly.js
function buildPlot(sample) { 
    d3.json("/api/v1.0/titles").then(function(data) {
        console.log(data)
   // var sampledata=data.sample.filter(sample => sample.id == filter_otu_id)
   var samples = data.samples;
   var resultArray =samples.filter(sampleObj => sampleObj.id==sample);
   var result = resultArray[0]
   //console.log(data)
    
    //console.log(data) data.samples.filter(sampleobject => sampleobject.id ==sample).otu_ids
    var ids = result.otu_ids
    //console.log(ids);
    var sampleValues = result.sample_values
    //console.log(sampleValues);
    var  labels = result.otu_labels;
    //console.log(labels);
    //display the top 10 OTUs found in that individual.
    var otu_top10 = ids.slice(0,10).reverse();
    var top10sampleValues = sampleValues.slice(0,10).reverse();
    var  top10labels = labels.slice(0,10)
    
    // get the otu id's to the plot
    var otu_id = otu_top10.map(d => "OTU " + d);
    //console.log(`OTU IDS: ${otu_id}`)

    var trace1 = {
        x: top10sampleValues,
        y: otu_id,
        text:top10labels,
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];

    var layout ={
        title: "Top 10 OTU",
        barmode: "group",
        yaxis: {tickmode:"linear"}
    };
    Plotly.newPlot("bar", data, layout)   
    
    

    //the bubble chart

    var trace2 ={

        x: ids,
        y: sampleValues,
        text:labels,
        mode: "markers",
        marker: {
            size: sampleValues,
            color: ids,
            colorscale: "Earth"          
        },
        
    }
    var data2 =[trace2]

    var layout2 = {
        xaxis:{title: "OTU ID"},
        showlegend: true,
        height: 600,
        width: 1000

    };
    Plotly.newPlot("bubble", data2, layout2)
})
    // Bonus: build gauge Chart 
   
}

function readData(sample){

    // Use `d3.json` to Fetch the Metadata for a Sample
        d3.json("samples.json").then(function(data) {
    
            //console.log(data)
            var resultArray=data.metadata.filter(sampleObj => sampleObj.id==sample);
            //console.log(resultArray)

            // use .html("") to clear any existing Data
            var panel = d3.select("#sample-metadata");
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
            drop_down.append('option').text(item.country_name).property("value", item.country_name);
        });

        //grab the first sample and build the charts on the page for page load
        //firstSample=ids_selection[0]
        // buildPlot(firstSample);
        // readData(firstSample);
        // buildGauge(firstSample);
    })
}

function optionChanged (newSample){
    //Fetch New Data Each time a New sample is selcted
    buildPlot(newSample);
    readData(newSample);
    buildGauge(newSample);
}

//call init for page load
init();
