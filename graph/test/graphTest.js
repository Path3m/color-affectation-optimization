import { Streamgraph } from "../src/Streamgraph.js";
import { ColorPalette } from "../src/ColorPalette.js";
import * as obj from "../../data/build.js";
import { AffectationScore } from "../src/AffectationScore.js";
import * as method from "../src/computationMethod.js";
import { Permutation } from "../../optigen/src/Permutation.js";

let affscore = new AffectationScore(obj.graphDayMusique, method.impMaxInverse, obj.colorMusic);
console.log(affscore.score(
    Permutation.index(21)
));



