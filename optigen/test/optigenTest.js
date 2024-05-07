import { score } from "../src/utilitaire.js";
import { Optigen } from "../src/Optigen.js";
import { Permutation } from "../src/Permutation.js";
import { Population } from "../src/Population.js";

console.clear();
console.log("on commence ici *************************************************\n");

/* let popfin = Optigen.optigen(score).last;
console.log("\nPopulation Finale :");
popfin.poplog(); */

console.time('generating_permutation');
let population = Population.fullpop(8, score);
console.timeEnd('generating_permutation');

population.sortByScore().poplog();

console.log("\non termine là ***************************************************");