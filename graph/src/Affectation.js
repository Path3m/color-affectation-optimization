import { ColorPalette } from "./ColorPalette.js";
import { Streamgraph } from "./Streamgraph.js";
import { StreamgraphContrastImportance } from "./StreamgraphContrastImportance.js";
import * as util from "./utilitaire.js";

export class Affectation{

    /**
     * Build an affectation according to a graph and a palette,
     * using the method to compute contrast importance of the graph
     * @param {*} graph 
     * @param {ImportanceMethod} method 
     * @param {ColorPalette} colorPalette 
     */
    constructor(graph, method, colorPalette){
        this.importance = new StreamgraphContrastImportance(graph.data, method);
        this.distance   = colorPalette.computeDistanceMatrix();

        const categories = this.importance.categories;
        this.colorMap = {}, this.categorieMap = {};
        for(let i=0; i<categories.length; i++){
            this.colorMap[i]     = colorPalette.colors[i];
            this.categorieMap[i] = categories[i];
        }
    }

    /**
     * Set a new color palette to affect to the graph
     * @param {ColorPalette} colorPalette 
     * @return a reference to the current object
     */
    setPalette(colorPalette){
        this.distance = colorPalette.computeDistanceMatrix();
        this.colorMap = {};
        for(let i=0; i<colorPalette.colors.length; this.colorMap[i] = colorPalette.colors[i++]);
        return this;
    }

    /**
     * Set a new graph to match the color palette
     * @param {*} graph 
     * @param {ImportanceMethod} method to compute importance matrix
     * @return a reference to the current object
     */
    setGraph(graph, method){
        this.importance = new StreamgraphContrastImportance(graph.data, method);
        const categories = this.importance.categories;
        this.categorieMap = {};
        for(let i=0; i<categories.length; this.categorieMap[i] = categories[i++]);
        return this;
    }

    /**
     * Compute the score of a permutation
     * using the importance and distance matrix
     * @param {*} permutation 
     * @returns a number, the score of the permutation
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
     * @param {number} size of the svg object
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
                    svg += '<text x="'+x+'" y="'+(margin-31)+'" transform="rotate(-90, '+x+', '+(margin-31)+')" fill="black">'+this.categorieMap[j]+'</text>\n';
                    svg += '<rect width="'+sizeRange+'" height="'+30+'" x="'+(x-sizeRange/2)+'" y="'+(margin-30)+'"'
                            +'style="fill:'+this.colorMap[color2]+';stroke-width:3;stroke:white" />\n';
                }

                let radiusDist = util.interpolate(this.distance[color1][color2], rangeDist, radiusRange);
                let radiusImp = util.interpolate(this.importance.global[i][j], rangeImp, radiusRange);

                svg +=  '<circle cx="'+x+'" cy="'+y+'" r="'+radiusImp+'" fill="orange"/>\n';
                svg +=  '<circle cx="'+x+'" cy="'+y+'" r="'+radiusDist+'" fill="green" fill-opacity="0.5"/>\n';
            }

            svg += '<text x="'+(size+31)+'" y="'+y+'" fill="black">'+this.categorieMap[i]+'</text>\n';
            svg += '<rect width="'+30+'" height="'+sizeRange+'" x="'+size+'" y="'+(y-sizeRange/2)+'"'
                    +'style="fill:'+this.colorMap[color1]+';stroke-width:3;stroke:white" />\n';
        }

        let score_stat = "Score permutation : \n"+this.score(permutation).toFixed(3)+"\n";

        let legend = (
            '<rect width="'+30+'" height="'+30+'" x="'+(0.05*size)+'" y="'+(0.625*size+margin)+'" fill="orange" />\n'
            +'<text x="'+(0.06*size+30)+'" y="'+(0.65*size+margin)+'" fill="black">Importance de contraste</text>\n'
            +'<rect width="'+30+'" height="'+30+'" x="'+(0.05*size)+'" y="'+(0.63*size+margin+30)+'" fill="green" />\n'
            +'<text x="'+(0.06*size+30)+'" y="'+(0.66*size+margin+30)+'" fill="black">Distance entre couleur</text>\n'
        );

        return svg
            +'<text x="'+(0.05*size)+'" y="'+(0.67*size+margin+2*30)+'" fill="black">'+score_stat+'</text>\n'
            + legend
            +'</svg>\n';
    }

    /**
     * Create a csv string with the data from the elementary importance.
     * The categories without positive values will be ignored.
     * @returns a string containing all the information about the csv that now can be download
     */
    elementaryToCsv(){
        let csvContent = "data:text/csv;charset=utf-8,";

        //getting the right data (values aren't null)
        let matrix = new Array();
        matrix.push(["instant"]);

        this.importance.elementary.forEach((value, key, map) => {
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