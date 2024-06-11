/**
 * @description Helper class to generate streamgraph with d3.js.
 * Created from a script on @see {@link https://d3-graph-gallery.com/graph/streamgraph_basic.html | d3-graph-gallery}
 * by @see {@link https://www.yan-holtz.com/ | Yann Holtz}
 * 
 * @date june 2024
 * @author Aurel Hamon
 * @contact aurel.hamon@etu.univ-nantes.fr
 */

export class Streamgraph {

    /**
     * Build a streamchart/streamgraph according to a set of data
     * @param {string | any} data a csv file or a csv string containing the data to use, where the first column is the x values, and the first line the categories
     * @param {string | undefined } divID optional : a div in which the graph will be drawn
     */
    constructor(data, divID){
        // set the dimensions and margins of the graph
        this.margin = {top: 20, right: 30, bottom: 30, left: 60};
        this.width = 1200 - this.margin.left - this.margin.right;
        this.height = this.width/3 - this.margin.top - this.margin.bottom;

        this.data = (data instanceof String || typeof data === 'string') ? 
          d3.csvParse(data) : 
          data;

        if(divID == undefined){
          this.svg = undefined;
          this.divID = undefined;
        }else{
          this.svg = this.initSVG(divID);
          this.divID = divID;
        }
    }

    //--------------------------------------------------------------------------------------------------------------
    /**
     * Select in the data the set of categories of the graph
     * @returns an array containing the categories
     */
    getCategories(){
      return this.data.columns.slice(1);
    }

    /**
     * Get the values of the categories identified by its name
     * @param {*} name 
     * @returns 
     */
    getCategorie(name){
      let values = new Array();
      this.data.forEach(current => {
        values.push(Number(current[name]));
      });
      return {name: name, values: values};
    }

    //--------------------------------------------------------------------------------------------------------------
    /**
     * Initialize the string containing an svg object informations
     * @param {*} divID the div in the html page
     */
    initSVG(divID) {
        //TODO : implement a function that uses a css container to init the svg object ?    
    
        // append the svg object to the body of the page
        return d3.select("#"+divID)
        .append("svg")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
          .attr("transform",
              "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    //--------------------------------------------------------------------------------------------------------------
    /**
     * Create the x axis to append to an svg object 
     * @param {*} scaleX 
     * @returns 
     */
    addAbscissa(scaleX){
        let x = d3.scaleLinear()
          .domain(d3.extent(this.data, function(d) { return d[scaleX]; }))
          .range([ 0, this.width ]);

        this.svg.append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3.axisBottom(x).ticks(20));

        this.svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", this.width)
          .attr("y", this.height-30 )
          .text("Time ("+scaleX+")");
        
        return x;
    }

    //--------------------------------------------------------------------------------------------------------------
    /**
     * Create the y axis to append to the svg object
     * @param {*} categories 
     * @returns 
     */
    addOrdinate(categories){
      let Ywidth = d3.extent(this.data, function(d) {
        let sum = 0;
        categories.forEach(function(current){ sum += parseInt(d[current]); });
        return sum; 
      });

      let maxWidth = Math.max(...Ywidth);
      let rangeY = [-(maxWidth/2), (maxWidth/2)];
    
      let y = d3.scaleLinear()
        .domain(rangeY)
        .range([this.height, 0]);

      this.svg.append("g")
        .call(d3.axisLeft(y));

      return y;
    }

    //--------------------------------------------------------------------------------------------------------------
    /**
     * Draw the graph according to its data and a given set of color
     * @param {Array} colors
     * @param {string | undefined} divID the id of the container in which the graph will be drawn : if undefined, the 'this' divId will be used
     */
    draw(colors, divID) {
      if(divID != undefined){
        document.getElementById(divID).innerHTML = "";
        this.svg   = this.initSVG(divID);
        this.divID = divID;
      }else{
        document.getElementById(this.divID).innerHTML = "";
        this.svg = this.initSVG(this.divID);
      }

      // List of categories = header of the csv files
      var keys = this.getCategories();
      var Xscale = (this.data.columns)[0]; //scale of the x axe
      // Add X and Y axis
      var x = this.addAbscissa(Xscale);
      var y = this.addOrdinate(keys);
      // color palette
      var color = d3.scaleOrdinal().domain(keys).range(colors);
      //stack the data
      var stackedData = d3.stack()
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)
        (this.data);

      var area = d3.area()
        .x(function(d, i) { return x(d.data[Xscale]); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
        .curve(d3.curveMonotoneX);
    
      // Show the areas
      this.svg.selectAll("mylayers").data(stackedData)
        .enter().append("path")
          .style("fill", function(d) { return color(d.key); })
          .attr("d", area);
    }
}