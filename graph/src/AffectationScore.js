import { ColorPalette } from "./ColorPalette.js";
import { Streamgraph } from "./Streamgraph.js";

export class AffectationScore{
    constructor(graph, method, colorPalette){
        this.importance = graph.importance(method);
        this.distance   = colorPalette.computeDistanceMatrix();
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
}