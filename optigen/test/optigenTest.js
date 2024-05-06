import * as util from "../src/utilitaire.js";
import { Optigen } from "../src/Optigen.js";

console.clear();
console.log("on commence ici *************************************************\n");

let popfin = Optigen.optigen(util.score).last;
console.log("\nPopulation Finale :");
popfin.poplog();

console.log("on termine là ***************************************************");