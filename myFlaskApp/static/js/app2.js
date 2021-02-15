



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

/*function optionChanged (newSample){
    //Fetch New Data Each time a New sample is selcted
    buildPlot(newSample);
    readData(newSample);
    buildGauge(newSample);
}*/

//call init for page load
init();
