



            
            
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
