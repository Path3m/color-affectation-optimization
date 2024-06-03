import * as util from "../utilitaire.js";

export class StreamgraphContrastImportance{
    /**
     * 
     * @param {*} data 
     * @param {*} method 
     */
    constructor(data, method){
        this.categories = data.columns.slice(1);
        this.data = data;

        let tmpImportance = this.importance(method);
        this.elementary = tmpImportance.elementary;
        this.global = tmpImportance.global;
    }

    /**
     * Compute and store for each pair of categories the elementary importance
     * at each instant of the streamgraph
     * @param {*} func 
     * @returns a map containing the table of elementary importance between two categories
     */
    computeElementaryImportance(func){
        let keys = this.categories;
        let hauteur = this.data;
  
        /* soit |keys| le nombre de catégories on a donc : 
        |keys|*(|keys|-1) / 2 : nombre de tableaux d'importance élémentaire à remplir 
        chaque tableau est de taille 'f' avec 'f' le nombre total d'instant échantilloné dans le streamgraph*/
        let impElem = new Map();
        for(let i=0; i<keys.length; i++){
          for(let j=i+1; j<keys.length; j++){
              impElem.set(keys[i]+"-"+keys[j], new Float32Array(hauteur.length).fill(0));
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
  
              impElem.get(keys[categorie]+"-"+keys[voisin])[t] = func(hcategorie, hvoisin);
              categorie++; voisin++;
            }
          }
        }
  
        return impElem;
      }
  
      //--------------------------------------------------------------------------------------------------------------
      /**
       * Given the d3 representation of a streamgraph, and the elementary 
       * importance, compute the matrix of global importance
       * @param {*} funcGlobal function to compute the global importance from an array of elementary importance
       * @param {*} funcElem function to compute each elementary importance
       * @returns the matrix of global importance between categories
       */
      computeGlobalImportance(funcGlobal, funcElem){
        let elementaire = this.computeElementaryImportance(funcElem);
  
        let keys = this.categories;
        let importance = util.nullMatrix(keys.length, keys.length, Float32Array);
  
        for(let categorie=0; categorie<keys.length; categorie++){
          for(let voisin=categorie+1; voisin<keys.length; voisin++){
            importance[categorie][voisin] = funcGlobal(elementaire.get(keys[categorie]+"-"+keys[voisin]));
            importance[voisin][categorie] = importance[categorie][voisin];
          }
        }
        return {elementary: elementaire, global:importance};
      }
  
      //--------------------------------------------------------------------------------------------------------------
      /**
       * Compute the importance matrix of the streamgraph
       * @returns the importance matrix of a streamgraph
       */
      computeImportanceMatrixInPlace(func){
        var keys = this.categories;
        var hauteurs = this.data;
        var importance = util.nullMatrix(keys.length, keys.length, Float32Array);
  
        for(let t = 0; t < hauteurs.length; t++){ //parcours de l'echelle de temps
  
          var categorie = 0;
          var voisin    = 1;
  
          while (categorie < importance.length && voisin < importance.length){
            //besoin de de contratste ssi la hauteur des deux catégories n'est pas nulle, et les catégories sont différentes
  
            if      (categorie == voisin || hauteurs[t][keys[voisin]] == 0){ voisin++;    }
            else if (hauteurs[t][keys[categorie]] == 0)                    { categorie++; }
  
            else{ //sinon, il y a besoin de contraste entre les catégories
              var importancePrecedente = importance[categorie][voisin];
              var hauteurCategorie     = hauteurs[t][keys[categorie]];
              var hauteurVoisin        = hauteurs[t][keys[voisin]];
  
              importance[categorie][voisin] = func(importancePrecedente, hauteurCategorie, hauteurVoisin);
              
              //matrice symmétrique
              importance[voisin][categorie] = importance[categorie][voisin];
              categorie++; voisin++;
            }
          }
        }
  
        return importance;
      }
  
      //--------------------------------------------------------------------------------------------------------------
      /**
       * Compute matrix importance according to the given method
       * @param {ImportanceMethod} method 
       * @returns the elementary importance if defined, the global imortance always
       */
      importance(method){
        if(method.isAccumulateMethod()){
          return {elementary: undefined, global: this.computeImportanceMatrixInPlace(method.accumulate)};
        }else{
          return this.computeGlobalImportance(method.global, method.local); 
        }
      }

      /**
       * Set the elementary importance under the csv format, with data organized
       * as if it were a streamgraph itself
       * @returns a string containing all the information concerning the csv file
       */
      impElementaryToCSV(){
        let csvContent = "data:text/csv;charset=utf-8,";

        //getting the right data (values aren't null)
        let matrix = new Array();
        matrix.push(["instant"]);

        this.elementary.forEach((value, key) => {
            if(value.reduce((acc, current) => acc || (current != 0), false)){
                let line = new Array();
                line.push(key); line.push(...value);
                matrix.push(line);
            }
        });

        for(let i=0; i<matrix[1].length-1; matrix[0].push(i++));

        console.log(matrix);

        //(convering to csv format)
        for(let j=0; j<matrix[0].length; j++){
            for(let i=0; i<matrix.length-1; i++){    
                csvContent += matrix[i][j] + ","
            }
            csvContent += matrix[matrix.length-1][j] + "\n";
        }

        console.log(csvContent);

        return csvContent;
      }  
}