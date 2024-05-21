import { ColorPalette } from "./ColorPalette.js";
import { Streamgraph } from "./Streamgraph.js";
import * as util from "./utilitaire.js";

export class Affectation{
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
     * Set a new color palette to affect to the graph
     * @param {*} colorPalette 
     */
    setPalette(colorPalette){
        this.distance = colorPalette.computeDistanceMatrix();
        this.colorMap = {};
        for(let i=0; i<colorPalette.colors.length; this.colorMap[i] = colorPalette.colors[i++]);
    }

    /**
     * Set a new graph to match the color palette
     * @param {*} graph 
     * @param {*} method 
     */
    setGraph(graph, method){
        this.importance = graph.importance(method);
        const categories = graph.getCategories();
        this.categorieMap = {};
        for(let i=0; i<categories.length; this.categorieMap[i] = categories[i++]);
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
     * @returns a permutation
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
     * @param {Array} permutation corresponding to an affectation of colors on the categories
     * @returns a string that contains all the information of the svg
     */
    generateSVG(permutation, size){
        let margin = 200; 
        let svg = '<svg width="'+(size+margin)+'" height="'+(size+margin)+'" version="1.1" xmlns="http://www.w3.org/2000/svg">\n';

        let rangeImp  = util.matrixRangeValue(this.importance.global);
        let rangeDist = util.matrixRangeValue(this.distance);

        let sizeRange = size / permutation.length;
        let radiusRange = [0, sizeRange/2];

        let x = 0; let y = 0;

        for(let i=0; i<permutation.length-1; i++){
            y = i*sizeRange + sizeRange / 2 + margin;
            let color1 = permutation[i]; 

            for(let j=i+1; j<permutation.length; j++){
                x = j*sizeRange + sizeRange / 2;
                let color2 = permutation[j];

                if(i==0) {
                    svg += '<text x="'+x+'" y="'+(margin-sizeRange)+'" transform="rotate(-90, '+x+', '+(margin-sizeRange)+')" fill="black">'+this.categorieMap[j]+'</text>\n';
                    svg += '<rect width="'+sizeRange+'" height="'+sizeRange+'" x="'+(x-sizeRange/2)+'" y="'+(margin-sizeRange)+'"'
                            +'style="fill:'+this.colorMap[color2]+';stroke-width:3;stroke:white" />\n';
                }

                let radiusDist = util.interpolate(this.distance[color1][color2], rangeDist, radiusRange);
                let radiusImp = util.interpolate(this.importance.global[i][j], rangeImp, radiusRange);

                svg +=  '<circle cx="'+x+'" cy="'+y+'" r="'+radiusImp+'" fill="orange"/>\n';
                svg +=  '<circle cx="'+x+'" cy="'+y+'" r="'+radiusDist+'" fill="green" fill-opacity="0.5"/>\n';
            }

            console.log(this.colorMap[color1]); 

            svg += '<text x="'+(size+sizeRange)+'" y="'+y+'" fill="black">'+this.categorieMap[i]+'</text>\n';
            svg += '<rect width="'+sizeRange+'" height="'+sizeRange+'" x="'+size+'" y="'+(y-sizeRange/2)+'"'
                    +'style="fill:'+this.colorMap[color1]+';stroke-width:3;stroke:white" />\n';
        }

        let score_stat = "Score permutation : \n"+this.score(permutation).toString(6)+"\n"

        return svg
            +'<text x="'+(0.10*size)+'" y="'+(0.70*size+margin)+'" fill="black">'+score_stat+'</text>\n'
            +'</svg>\n';
    }
}