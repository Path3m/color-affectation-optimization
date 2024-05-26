import { Optigen } from "../src/Optigen.js";
import { Permutation } from "../src/Permutation.js";
import { Population } from "../src/Population.js";

import { OptigenBoxPlot } from "../../stat/BoxPlot.js";

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

console.clear();
console.log("on commence ici *************************************************\n");

let dimensions = {limit: 20, generation: 100, individual: 10};
let factors    = {reproduction: 0.6, mutation: 0.4, selection: 0.4};

let optigen = new Optigen(score, dimensions, factors);

console.time('a');
let result = optigen.execute();
console.timeEnd('a');

let popfin = result.last;

console.log("\nPopulation Finale :");
popfin.poplog();

let boxplot = new OptigenBoxPlot(result, "optigen");
boxplot.draw();

console.log("\non termine là ***************************************************");