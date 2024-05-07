import * as util from "../src/utilitaire.js";
import { Optigen } from "../src/Optigen.js";
import { Permutation } from "../src/Permutation.js";

console.clear();
console.log("on commence ici *************************************************\n");

let popfin = Optigen.optigen(util.score).last;
console.log("\nPopulation Finale :");
popfin.poplog();

console.time('generating_permutation');
let all = Permutation.createAll(10);
console.timeEnd('generating_permutation');

console.log(all);

console.log("\non termine là ***************************************************");