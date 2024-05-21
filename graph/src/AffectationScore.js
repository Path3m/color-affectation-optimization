import { ColorPalette } from "./ColorPalette.js";
import { Streamgraph } from "./Streamgraph.js";
import * as util from "./utilitaire.js";

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

    /**
     * Compute the score of a permutation
     * using the importance and distance matrix
     * @param {*} permutation 
     * @returns 
     */
    score(permutation){
        let sum = 0;

        for(let i=0; i<permutation.length; i++){
            for(let j=i+1; j<permutation.length; j++){
                let color1 = permutation[i];
                let color2 = permutation[j];

                let cat1 = i;
                let cat2 = j;

                sum += this.importance.global[cat1][cat2] * this.distance[color1][color2];
            }
        }

        return sum;
    }

    /**
     * Given a permutation, get the corresponding set of color
     * from the color map.
     * @param {Array} permutation 
     * @returns the array of new colors
     */
    getColor(permutation){
        let newcolors = new Array(permutation.length);

        for(let i=0; i<permutation.length; i++){
            let colorInd = permutation[i];
            let catInd = i;

            newcolors[catInd] = this.colorMap[colorInd];
        }
        console.log(newcolors);

        return newcolors;
    }

    /**
     * Given a set of color, return the corresponding permutation 
     * @param {*} colorSet 
     * @returns 
     */
    getPermutation(colorSet){
        let permutation = new Array(colorSet.length);

        for(let i=0; i<colorSet.length; i++){
            let index = 0;
            while(index < colorSet.length && this.colorMap[index] != colorSet[i]) index++;
            permutation[i] = index;
        }

        return permutation;
    }

    /**
     * Generate the svg representation of the corellogram used to check
     * result between importance and color distance
     * @param {*} permutation 
     * @returns a string that contains all the information of the svg
     */
    generateSVG(permutation, size){
        let margin = 100; 
        let svg = '<svg width="'+(size+margin)+'" height="'+(size+margin)+'" version="1.1" xmlns="http://www.w3.org/2000/svg">';

        let rangeImp  = util.matrixRangeValue(this.importance.global);
        let rangeDist = util.matrixRangeValue(this.distance);

        let sizeRange = size / permutation.length;
        let radiusRange = [0, sizeRange/2];

        let x = 0; let y = 0;

        for(let i=0; i<permutation.length; i++){
            y = i*sizeRange + sizeRange / 2 + margin;

            for(let j=i; j<permutation.length; j++){
                x = j*sizeRange + sizeRange / 2;

                if(i==0) svg += '<text x="'+x+'" y="95" transform="rotate(-90, '+x+', 95)" fill="black">'+this.categorieMap[j]+'</text>';

                let color1 = permutation[i]; 
                let color2 = permutation[j];

                let radiusDist = util.interpolate(this.distance[color1][color2], rangeDist, radiusRange);
                let radiusImp = util.interpolate(this.importance.global[i][j], rangeImp, radiusRange);

                svg +=  '\n<circle cx="'+x+'" cy="'+y+'" r="'+radiusImp+'" fill="orange"/>\n';
                svg +=  '\n<circle cx="'+x+'" cy="'+y+'" r="'+radiusDist+'" fill="green" fill-opacity="0.5"/>\n';
            }

            svg += '<text x="'+(size+sizeRange)+'" y="'+y+'" fill="black">'+this.categorieMap[i]+'</text>';
        }

        svg += "\n</svg>\n";

        console.log(svg);

        return svg;
    }
}