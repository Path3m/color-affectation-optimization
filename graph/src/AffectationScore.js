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
     * Given a permutation, affect the color to each categories
     * @param {Array} permutation 
     * @returns the array of new colors
     */
    affectTo(permutation){
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
     * Generate the svg representation of the corellogram used to check
     * result between importance and color distance
     * @param {*} permutation 
     * @returns a string that contains all the information of the svg
     */
    generateSVG(permutation, size){
        let margin = 100; 
        let svg = '<svg width="'+(size+margin)+'" height="'+(size+margin)+'" version="1.1" xmlns="http://www.w3.org/2000/svg">';

        let rangeImp = [
            this.importance.global.reduce((acc, curr) => { return Math.max(acc, Math.max(...curr)); }, this.importance.global[0][0]),
            this.importance.global.reduce((acc, curr) => { return Math.min(acc, Math.min(...curr)); }, this.importance.global[0][0])
        ];

        let rangeDist = [
            this.distance.reduce((acc, curr) => { return Math.max(acc, Math.max(...curr)); }, this.distance[0][0]),
            this.distance.reduce((acc, curr) => { return Math.min(acc, Math.min(...curr)); }, this.distance[0][0])
        ];

        let sizeRange = size / permutation.length;
        let radiusRange = [0, sizeRange/2];

        let interpolate = (number, range1, range2) => {
            let y1 = Math.min(...range2); let y2 = Math.max(...range2);
            let x1 = Math.min(...range1); let x2 = Math.max(...range1);

            let a = (y2-y1)/(x2-x1);
            let b = y1-a*x1;

            return number * a + b;
        };

        let x = 0; let y = 0;

        for(let i=0; i<permutation.length; i++){
            y = i*sizeRange + sizeRange / 2 + margin;

            for(let j=i; j<permutation.length; j++){
                x = j*sizeRange + sizeRange / 2;

                if(i==0) svg += '<text x="'+x+'" y="95" transform="rotate(-90, '+x+', 95)" fill="black">'+this.categorieMap[j]+'</text>';

                let color1 = permutation[i]; 
                let color2 = permutation[j];

                let radiusDist = interpolate(this.distance[color1][color2], rangeDist, radiusRange);
                let radiusImp = interpolate(this.importance.global[i][j], rangeImp, radiusRange);

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