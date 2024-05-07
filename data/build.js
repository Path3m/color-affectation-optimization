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
export const colorMusic      = globalPalette.paletteSample(graphDayMusique.getCategories().length).shuffle();

export const CDMMusic = HeatMap.colorDistanceHeatMap(colorMusic, music);
export const IMMusic1 = HeatMap.importanceHeatMap(graphDayMusique, method.impMaxInverse);
export const IMMusic2 = HeatMap.importanceHeatMap(graphDayMusique, method.impAverage);


// US NAMES Graph Info ---------------------------------------------------------
export const graphUsaNames = new Streamgraph(dataset.usaNames);
export const names         = graphUsaNames.getCategories();
export const colorNames    = globalPalette.paletteSample(graphUsaNames.getCategories().length).shuffle();

export const CDMNames = HeatMap.colorDistanceHeatMap(colorNames, names);
export const IMNames1 = HeatMap.importanceHeatMap(graphUsaNames, method.impMaxInverse);
export const IMNames2 = HeatMap.importanceHeatMap(graphUsaNames, method.impAverage);

// OPTIGEN box plot ---------------------------------------------------------
export const obg = new OptigenBoxPlot(Optigen.optigen(score));