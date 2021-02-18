function buildPlot(data) { 

    var panel = d3.select("#graph-metadata");
    panel.html("");

    panel.append("h6").text("The Graph shows Count of Titles by Countries Per Year");

    var filtered_data=data.filter(d => d.Count != 0)
    // console.log (filtered_data)

    x_axis = []
    y_axis = []

    filtered_data.forEach ((d)=>
    {
        x_axis.push(d.Count)
        y_axis.push(d.Listed_in_name)
    });

    // console.log (x_axis)
    // console.log (y_axis)

    // var plot_data = [{
    //     values: [19, 26, 55],
    //     labels: ['Residential', 'Non-Residential', 'Utility'],
    //     type: 'pie'
    //   }];
      
       var layout = {
        height: 400,
        width: 500
      };
    


    var trace1 = {
        labels: y_axis,
        values: x_axis,
        text:"Count of Titles by Countries Per Year",
        type: "pie"
    };
    var plot_data = [trace1];

    Plotly.newPlot("bar", plot_data, layout)   
    
  
}

  d3.json("/api/v1.0/listedin_count").then((data) => {buildPlot(data);})

