import { Affectation } from "./affectation/Affectation.js";
import { ColorPalette } from "./affectation/ColorPalette.js";
import { StreamgraphContrastImportance } from "./affectation/StreamgraphContrastImportance.js";
import * as method from "./affectation/computationMethod.js";

import {Permutation} from "./optigen/Permutation.js";
import {Individual} from "./optigen/Individuals.js";
import {Population} from "./optigen/Population.js";
import {Optigen} from "./optigen/Optigen.js";

import * as util from "./utility.js";

import {HeatMap} from "./stat/HeatMap.js";
import {OptigenBoxPlot} from "./stat/BoxPlot.js";

/* let streamchart = new Streamgraph(data.dm10layers);
let categories = streamchart.getCategories();
let palette = ColorPalette.buildPalette(categories.length, {min:0, max:1}, d3.interpolateViridis);

function component1(){
    const element = document.createElement("div");
    element.setAttribute("id", "color-palette");
    document.body.appendChild(element);

    element.innerHTML += palette.draw("color-palette", categories);
}

function component2(){
    const element = document.createElement("div");
    element.setAttribute("id", "streamchart");
    document.body.appendChild(element);
    
    console.log(streamchart);
    console.log(element);

    streamchart.draw(palette.colors, "streamchart");
}

component1();
component2(); */

export { Permutation, Individual, Population, Optigen }; /*genetic optimisation*/
export { Affectation, ColorPalette, StreamgraphContrastImportance }; /*affectation*/
export {HeatMap, OptigenBoxPlot}; /*statistics*/
export { method }; // computation of importance
export {util}; //utility function