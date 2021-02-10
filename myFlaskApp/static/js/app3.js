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


