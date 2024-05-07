import {ColorPalette} from "../graph/src/ColorPalette.js";
import {Streamgraph} from "../graph/src/Streamgraph.js";
import * as method from "../graph/src/computationMethod.js";

import { Optigen } from "../optigen/src/Optigen.js";
import { score } from "../optigen/src/utilitaire.js";

import { HeatMap } from "../stat/HeatMap.js";
import { OptigenBoxPlot } from "../stat/BoxPlot.js";

import * as dataset from "./dataset.js";


//INITIATING GLOBAL PALETTE ----------------------------------------------------
export const globalPalette = ColorPalette.largeGraphPalette(d3.interpolateViridis);
export const CDMGlobal     = HeatMap.colorDistanceHeatMap(globalPalette);

// MUSIC Graph info ------------------------------------------------------------
export const graphDayMusique = new Streamgraph(dataset.dmFilterAlternative);
export const music           = graphDayMusique.getCategories();
export var colorMusic        = globalPalette.paletteSample(music.length).shuffle();

export const CDMMusic = HeatMap.colorDistanceHeatMap(colorMusic, music);
export const IMMusic1 = HeatMap.importanceHeatMap(graphDayMusique, method.impMaxInverse);
export const IMMusic2 = HeatMap.importanceHeatMap(graphDayMusique, method.impAverage);


// US NAMES Graph Info ---------------------------------------------------------
export const graphUsaNames = new Streamgraph(dataset.usaNames);
export const names         = graphUsaNames.getCategories();
export var colorNames      = globalPalette.paletteSample(names.length).shuffle();

export const CDMNames = HeatMap.colorDistanceHeatMap(colorNames, names);
export const IMNames1 = HeatMap.importanceHeatMap(graphUsaNames, method.impMaxInverse);
export const IMNames2 = HeatMap.importanceHeatMap(graphUsaNames, method.impAverage);

// OPTIGEN box plot ---------------------------------------------------------
export const obg = new OptigenBoxPlot(Optigen.optigen(score));

//CHANGE COLOR PALETTE ------------------------------------------------------
let count = 0;
const allInterpol = [
    d3.interpolateMagma,
    d3.interpolateCool,
    d3.interpolateViridis,
    d3.interpolateSpectral
];

function clearcontent(elementID) { 
    document.getElementById(elementID).innerHTML = ""; 
}

export function changePalette(divID){
    let interpol = allInterpol[count];
    globalPalette.changeColor(interpol);

    colorMusic = globalPalette.paletteSample(music.length).shuffle();
    colorNames = globalPalette.paletteSample(names.length).shuffle();

    clearcontent(divID);
    globalPalette.draw(divID);

    count = (count+1)%allInterpol.length;
}