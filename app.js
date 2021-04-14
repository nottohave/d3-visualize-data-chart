// fix bug not allowed to load local resources
new BrowserWindow({
  webPreferences: {
    webSecurity: false
  }
});
// import json file
let url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest()

// create data, values, height scale, xscale, x axis scale and y axis scale for inversion
let data
// values will be data.data. set it to an empty array to include the data inside data.
let values = []

let heightScale
let xScale
let xAxisScale
let yAxisScale

// declare width and height and padding to create the canvas dimension
let width = 1000;
let height = 600;
let padding = 55;

// declare svg with d3 select
let svg = d3.select("svg")

let drawCanvas = function() {
  svg.attr("width", width)
  svg.attr("height", height)
}
// set width and height of svg canvas using svg

// create scales for data on graph
let dataScale = function() {
      // scale of height of a bar
      heightScale = d3.scaleLinear()
                      .domain([0, d3.max(values, (item) => {  // values = [data.data] then take one of the item in the array
                          return item[1];
                      })])
                      .range([0, height - (2*padding)])

      xScale = d3.scaleLinear()
                 .domain([0, values.length -1]) //domain of the x axis below the bar chart
                 .range([padding, width - padding])

      // convert the dates values to actual dates
      let datesArray = values.map((item) => {
        return new Date(item[0]);
      })

      xAxisScale = d3.scaleTime()
                     .domain([d3.min(datesArray), d3.max(datesArray)])
                     .range([padding, width - padding])

      yAxisScale = d3.scaleLinear()
                     .domain([0, d3.max(values, (item) => {
                       return item[1];
                     })])
                     .range([height - padding, padding])
}
let drawBars = function() {

  //set tooltip for mouse hover over to display information
  let tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")
                  .style("visibility", "hidden")
                  .style("width", "auto")
                  .style("height", "auto")

  svg.selectAll("rect")
      .data(values)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", (width - (2* padding)) / values.length) //seperate each bar with equal width
      .attr("data-date", (item) => {
        return item[0];
      })
      .attr("data-gdp", (item) => {
        return item[1];
      })
      .attr("height", (item) => {
        return heightScale(item[1]);
      })
      .attr("x", (item, index) => {
        return xScale(index); // push the bar to the right passing in the index values
      })
      .attr("y", (item) => {
        return (height - padding) - heightScale(item[1])  //push bar down then push it up by the height of the bar. Invert the bars
      })
      .on("mouseover", (values, item) => {
        tooltip.transition()
                .style("visibility", "visible")
                .text(item[0] + ", $" + item[1] + " billions"  )

        document.querySelector("#tooltip").setAttribute("data-date", item[0])
      })
      .on("mouseout", (values, item) => {
        tooltip.transition()
               .style("visibility", "hidden")
      })
}

// generate x and y axis
let generateAxes = function() {
  let xAxis = d3.axisBottom(xAxisScale)

  svg.append("g")
     .call(xAxis)
     .attr("id", "x-axis")
     .attr("transform", "translate(0, " + (height - padding) + ")" )

  let yAxis = d3.axisLeft(yAxisScale)

  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr("transform", "translate(" + padding + ", 0)")
}
// open the http request and send back with data.
req.open("GET", url, true);
req.send();
req.onload = function() {
  data = JSON.parse(req.responseText)
  values = data.data
  drawCanvas()
  dataScale()
  generateAxes()
  drawBars()
}
