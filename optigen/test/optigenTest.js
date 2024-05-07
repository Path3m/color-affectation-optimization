import { score } from "../src/utilitaire.js";
import { Optigen } from "../src/Optigen.js";
import { Permutation } from "../src/Permutation.js";
import { Population } from "../src/Population.js";

console.clear();
console.log("on commence ici *************************************************\n");

let dimensions = {limit: 20, generation: 100, individual: 4};
let factors    = {reproduction: 0.6, mutation: 0.4, selection: 0.4};

let optigen = new Optigen(score, dimensions, factors);

console.time('a');
let popfin = optigen.execute().last;
console.timeEnd('a');

console.log("\nPopulation Finale :");
popfin.poplog();

console.log("\non termine là ***************************************************");