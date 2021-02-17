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

 