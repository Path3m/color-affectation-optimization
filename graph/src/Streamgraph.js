import * as util from "./utilitaire.js";

export class Streamgraph {

    /**
     * 
     * @param {string} divID 
     * @param {string | any} data 
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

    /**
     * 
     * @returns the streamchart categories
     */
    getCategories(){
      return this.data.columns.slice(1);
    }

    //-------------------------------------------------------------------
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

    //-------------------------------------------------------------------
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
        
        return x;
    }

    //-------------------------------------------------------------------
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

    //-------------------------------------------------------------------
    /**
     * Draw the graph according to its data and a given set of color
     * @param {*} colors
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

    //-----------------------------------------------------
    /**
     * Compute and store for each pair of categories the elementary importance
     * at each instant of the streamgraph
     * @param {*} func 
     * @returns a map containing the table of elementary importance between two categories
     */
    computeElementaryImportance(func){
      let keys = util.getKeys(this.data[0]).slice(1);
      let hauteur = this.data;

      /* soit |keys| le nombre de catégories on a donc : 
      |keys|*(|keys|-1) / 2 : nombre de tableaux d'importance élémentaire à remplir 
      chaque tableau est de taille 'f' avec 'f' le nombre total d'instant échantilloné dans le streamgraph*/
      let impElem = new Map();
      for(let i=0; i<keys.length; i++){
        for(let j=i+1; j<keys.length; j++){
            impElem.set(keys[i]+keys[j], new Float32Array(hauteur.length).fill(0));
        }
      }

      for(let t=0; t<hauteur.length; t++){ //pour chaque instant des données
        var categorie= 0;
        var voisin = 1;

        while (categorie< keys.length && voisin < keys.length){
          //besoin de de contraste ssi la hauteur des deux catégories n'est pas nulle, et les catégories sont différentes
          if      (categorie== voisin || hauteur[t][keys[voisin]] == 0){ voisin++;}
          else if (hauteur[t][keys[categorie]] == 0)                   { categorie++; }

          else{ //sinon, il y a besoin de contraste entre les catégories
            var hcategorie = hauteur[t][keys[categorie]];
            var hvoisin = hauteur[t][keys[voisin]];

            impElem.get(keys[categorie]+keys[voisin])[t] = func(hcategorie, hvoisin);
            categorie++; voisin++;
          }
        }
      }

      return impElem;
    }

    /**
     * Given the d3 representation of a streamgraph, and the elementary 
     * importance, compute the matrix of global importance
     * @param {*} funcGlobal function to compute the global importance from an array of elementary importance
     * @param {*} funcElem function to compute each elementary importance
     * @returns the matrix of global importance between categories
     */
    computeGlobalImportance(funcGlobal, funcElem){
      let elementaire = this.computeElementaryImportance(funcElem);

      let keys = util.getKeys(this.data[0]).slice(1);
      let importance = util.nullMatrix(keys.length, keys.length, Float32Array);

      for(let categorie=0; categorie<keys.length; categorie++){
        for(let voisin=categorie+1; voisin<keys.length; voisin++){
          importance[categorie][voisin] = funcGlobal(elementaire.get(keys[categorie]+keys[voisin]));
          importance[voisin][categorie] = importance[categorie][voisin];
        }
      }
      return {elementaire: elementaire, global:importance};
    }

    //---------------------------------------------------------------
    /**
     * GIVEN THE D3 REPRESNETATION OF A STEAMGRAPH
     *  - compute the importance matrix of the streamgraph
     * @returns the importance matrix of a streamgraph
     */
    computeImportanceMatrixInPlace(func){

      //TODO : use library to determine which representation is in used and compute the matrix accordingly

      var keys = util.getKeys(this.data[0]).slice(1);
      var hauteur = this.data;
      var importance = util.nullMatrix(keys.length, keys.length, Float32Array);

      for(let t = 0; t < hauteur.length; t++){ //parcours de l'echelle de temps

        var categorie = 0;
        var voisin    = 1;

        while (categorie < importance.length && voisin < importance.length){
          //besoin de de contratste ssi la hauteur des deux catégories n'est pas nulle, et les catégories sont différentes

          if      (categorie == voisin || hauteur[t][keys[voisin]] == 0){ voisin++;    }
          else if (hauteur[t][keys[categorieorie]] == 0)                    { categorie++; }

          else{ //sinon, il y a besoin de contraste entre les catégories
            var importancePrecedente = importance[categorieorie][voisin];
            var hauteurCategorie     = hauteur[t][keys[categorie]];
            var hauteurVoisin        = hauteur[t][keys[voisin]];

            importance[categorie][voisin] = func(importancePrecedente, hauteurCategorie, hauteurVoisin);
            
            //matrice symmétrique
            importance[voisin][categorie] = importance[categorie][voisin];
            categorie++; voisin++;
          }
        }
      }

      return importance;
    }

    /**
     * Compute matrix importance according to the given method
     * @param {ImportanceMethod} method 
     * @returns the elementary importance if defined, the global imortance always
     */
    importance(method){
      if(method.isAccumulateMethod()){
        return {elementaire: undefined, global: this.computeImportanceMatrixInPlace(method.accumulate)};
      }else{
        return this.computeGlobalImportance(method.global, method.local); 
      }
    }
}