import { ColorPalette } from "./ColorPalette.js";
import { Streamgraph } from "./Streamgraph.js";

export class AffectationScore{
    constructor(graph, method, colorPalette){
        this.importance = graph.importance(method);
        this.distance   = colorPalette.computeDistanceMatrix();

        const categories = graph.getCategories();
        this.colorMap = {}, this.categorieMap = {};
        for(let i=0; i<categories.length; i++){
            this.colorMap[i]     = colorPalette.colors[i];
            this.categorieMap[i] = categories[i];
        }

        console.log(this.categorieMap);
        console.log(this.colorMap);
    }

    score(permutation){
        let sum = 0;

        for(let i=0; i<permutation.length; i++){
            for(let j=i+1; j<permutation.length; j++){
                let cat1 = permutation[i];
                let cat2 = permutation[j];

                let color1 = i;
                let color2 = j;

                sum += this.importance.global[cat1][cat2] * this.distance[color1][color2];
            }
        }

        return 2*sum;
    }

    /**
     * Given a permutation, affect the color to each categories
     * @param {Array} permutation 
     * @returns the array of new colors
     */
    affectTo(permutation){
        let newcolors = new Array(permutation.length);

        for(let i=0; i<permutation.length; i++){
            let catInd = permutation[i];
            let colorInd = i;

            newcolors[catInd] = this.colorMap[colorInd];
        }
        console.log(newcolors);

        return newcolors;
    }
}