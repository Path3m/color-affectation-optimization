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

let dimensions = {limit: 30, generation: 200, individual: 20};
let factors    = {reproduction: 0.6, mutation: 0.5, selection: 0.5};

let optigen = new Optigen(score, dimensions, factors);

console.time('a');
let result = optigen.execute();
console.timeEnd('a');

let popfin = result.last;

console.log("\nPopulation Finale :");
popfin.poplog();

console.log("Meilleur élément : ", popfin.members[0].genome, " | ", popfin.members[0].score);

let boxplot = new OptigenBoxPlot(result, "optigen");
boxplot.draw(dimensions, factors, popfin.members[0]);

let meilleur = [18,16,14,12,10,8,6,4,2,0,1,3,5,7,9,11,13,15,17,19];
console.log("Score maximum : ",meilleur,"|",score(meilleur));

console.log("\non termine là ***************************************************");