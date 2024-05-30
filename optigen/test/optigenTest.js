import { Optigen } from "../src/Optigen.js";
import { Permutation } from "../src/Permutation.js";
import { Population } from "../src/Population.js";

import { OptigenBoxPlot } from "../../stat/BoxPlot.js";
import * as obj from "../../global.js";

//SCORE COMPUTING to test the genetic optimisation
function bestScoreIfOrdered(array) {
    let sum = 0;
    for(let i=0; i<array.length; sum += i*array[i++]);
    return sum;
};

function bestScoreIfEvenFirst(array){
    let score = 0;
    for(let i=0; i<array.length; i++){
        if(array[i]%2 === 0){
            score += array[i] / ((i+1)**2);
        }else{
            score += array[i] * ((i+1)**2);
        }
    }

    return score;
}

const score = bestScoreIfEvenFirst;

//INITIALISATION --------------------------------------------------------------------------------
const default_dimensions = {limit: 30, generation: 200, individual: 20};
const default_factors    = {reproduction: 0.6, mutation: 0.5, selection: 0.5};

let optigen = new Optigen(score, default_dimensions, default_factors);

console.time('a');
let result = optigen.execute();
console.timeEnd('a');

let popfin = result.last;

console.log("\nPopulation Finale :");
popfin.poplog();

console.log("Meilleur élément : ", popfin.members[0].genome, " | ", popfin.members[0].score);

let boxplot = new OptigenBoxPlot(result, default_dimensions, default_factors, "optigen");
boxplot.draw();

let meilleur = [18,16,14,12,10,8,6,4,2,0,1,3,5,7,9,11,13,15,17,19];
console.log("Score maximum : ",meilleur,"|",score(meilleur));

//------------------------------------------------------------------------

window.executeOptimisation = () => {
    var limit = document.getElementById("number-gen").value;
    var generation = document.getElementById("size-pop").value;
    var individual = document.getElementById("size-individual").value;
    var repro = document.getElementById("percent-repro").value;
    var selec = document.getElementById("percent-selec").value;
    var mutation = document.getElementById("percent-mut").value;

    let dimensions = {
        limit: (limit === "") ? default_dimensions.limit : limit,
        generation: (generation === "") ? default_dimensions.generation : generation,
        individual: (individual === "") ? default_dimensions.individual : individual
    };

    let factors = {
        reproduction: (repro === "") ? default_factors.reproduction : repro,
        mutation: (mutation === "") ? default_factors.mutation : mutation,
        selection: (selec=== "") ? default_factors.selection : selec
    };

    console.log(dimensions); console.log(factors);
    optigen = new Optigen(score, dimensions, factors);

    var start = new Date().getTime();
    result = optigen.execute();
    var end = new Date().getTime();
    var duration = start - end;

    renewElement("optigen");
    let boxplot = new OptigenBoxPlot(result, dimensions, factors, "optigen");
    boxplot.draw();

    document.getElementById("optigen").innerHTML += "Executé en : "+duration+" ms";
}