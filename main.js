/* import * as fs from "fs"; */
/* import * as d3 from "d3"; */
import * as method from "./graph/src/computationMethod.js";

import {score} from "./optigen/src/utilitaire.js";
import * as jeu from "./data/data.js";

import { Streamgraph } from "./graph/src/Streamgraph.js";
import { HeatMap } from "./stat/HeatMap.js";
import { ColorPalette } from "./graph/src/ColorPalette.js";

import { OptigenBoxPlot } from "./stat/BoxPlot.js";
import { Optigen } from "./optigen/src/Optigen.js";



var site = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv";
var othersite = "http://localhost:8000/package-func-test/datatest.csv"

//-----------------------------------------------------------
//Testing steamgraph class

console.log("Testing");

let palette = ColorPalette.largeGraphPalette(d3.interpolateViridis);
palette.draw("color-palette", []);
HeatMap.colorDistanceHeatMap("color-dist-global-palette", palette).draw();

// MUSIC DRAW ------------------------------------------------------------
let graphDayMusique = new Streamgraph("#streamgraph1", jeu.dmFilterAlternative);
let music           = graphDayMusique.getCategories();
let colorMusic      = palette.paletteSample(graphDayMusique.getCategories().length).shuffle();

let CDMMusic = HeatMap.colorDistanceHeatMap("color-dist-music-palette", colorMusic, music);
let IMMusic1 = HeatMap.importanceHeatMap("heatmapMusic-1", graphDayMusique, method.impMaxInverse);
let IMMusic2 = HeatMap.importanceHeatMap("heatmapMusic-2", graphDayMusique, method.impAverage);

graphDayMusique.draw(colorMusic.colors);
colorMusic.draw("color-music", music);

CDMMusic.draw();
IMMusic1.draw();
IMMusic2.draw();

// US NAMES DRAW ---------------------------------------------------------
let graphUsaNames = new Streamgraph("#streamgraph2", jeu.usaNames);
let names         = graphUsaNames.getCategories();
let colorNames    = palette.paletteSample(graphUsaNames.getCategories().length).shuffle();

let CDMNames = HeatMap.colorDistanceHeatMap("color-dist-names-palette", colorNames, names);
let IMNames1 = HeatMap.importanceHeatMap("heatmapNames-1", graphUsaNames, method.impMaxInverse);
let IMNames2 = HeatMap.importanceHeatMap("heatmapNames-2", graphUsaNames, method.impAverage);

graphUsaNames.draw(colorNames.colors);
colorNames.draw("color-names", names);

CDMNames.draw();
IMNames1.draw();
IMNames2.draw();

// OPTIGEN DRAW ---------------------------------------------------------
let obg = new OptigenBoxPlot('optigen', Optigen.optigen(score));
obg.draw();

//-----------------------------------------------------------------------
console.log("fin de programme");