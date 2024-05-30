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

function evenNumberOnLeft(size){
    let enol = new Array(size);
    let middle = Math.ceil(size/2);
    let rest = size-middle;

    for(let i=0; i<middle; enol[middle-1-i] = 2*i++);
    for(let i=0; i<rest; enol[i+middle] = (2*i++)+1);

    return enol;
}

//INITIALISATION --------------------------------------------------------------------------------
const default_dimensions = {limit: 30, generation: 200, individual: 20};
const default_factors    = {reproduction: 0.6, mutation: 0.5, selection: 0.5};

window.executeOptimisation = () => {
    var limit = parseInt(document.getElementById("number-gen").value);
    var generation = parseInt(document.getElementById("size-pop").value);
    var individual = parseInt(document.getElementById("size-individual").value);
    var repro = parseFloat(document.getElementById("percent-repro").value);
    var selec = parseFloat(document.getElementById("percent-selec").value);
    var mutation = parseFloat(document.getElementById("percent-mut").value);

    let dimensions = {
        limit: (isNaN(limit)) ? default_dimensions.limit : limit,
        generation: (isNaN(generation)) ? default_dimensions.generation : generation,
        individual: (isNaN(individual)) ? default_dimensions.individual : individual
    };

    let factors = {
        reproduction: (isNaN(repro)) ? default_factors.reproduction : repro,
        mutation: (isNaN(mutation)) ? default_factors.mutation : mutation,
        selection: (isNaN(selec)) ? default_factors.selection : selec
    };

    console.log(dimensions); console.log(factors);
    let optigen = new Optigen(score, dimensions, factors);

    var start = new Date().getTime();
    let result = optigen.execute();
    var end = new Date().getTime();

    renewElement("optigen");
    new OptigenBoxPlot(result, dimensions, factors, "optigen").draw();

    let bestscore = score(result.last.members[0].genome);
    let maxscore = score(evenNumberOnLeft(dimensions.individual));
    document.getElementById("optigen").innerHTML += 
        "Executé en : "+(end - start)+" ms<br>"+
        "Score permutation : "+bestscore.toFixed(3)+"<br>"+
        "Score maximal : "+maxscore.toFixed(3)+"<br>"+
        "Erreur Absolue : "+(maxscore-bestscore).toFixed(3)+" || Erreur relative : "+(100*(maxscore-bestscore)/bestscore).toFixed(3)+"%"
    ;
}

window.executeOptimisation();