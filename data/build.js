import {ColorPalette} from "../graph/src/ColorPalette.js";
import {Streamgraph} from "../graph/src/Streamgraph.js";
import * as method from "../graph/src/computationMethod.js";

import { Optigen } from "../optigen/src/Optigen.js";
import { score } from "../optigen/src/utilitaire.js";
import { Permutation } from "../optigen/src/Permutation.js";

import { HeatMap } from "../stat/HeatMap.js";
import { OptigenBoxPlot } from "../stat/BoxPlot.js";

import * as dataset from "./dataset.js";
import { AffectationScore } from "../graph/src/AffectationScore.js";


//INITIATING GLOBAL PALETTE ----------------------------------------------------
window.globalPalette = ColorPalette.largeGraphPalette(d3.interpolateViridis);
window.CDMGlobal     = HeatMap.colorDistanceHeatMap(globalPalette);

// MUSIC Graph info ------------------------------------------------------------
window.graphDayMusique = new Streamgraph(dataset.dmFilterAlternative);
window.music           = graphDayMusique.getCategories();
window.colorMusic      = globalPalette.paletteSample(music.length);

// US NAMES Graph Info ---------------------------------------------------------
window.graphUsaNames = new Streamgraph(dataset.usaNames);
window.names         = graphUsaNames.getCategories();
window.colorNames    = globalPalette.paletteSample(names.length);

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

/**
 * Change color of the global palette and draw it into
 * the corresponding div section of the html page 
 * @param {*} divID 
 */
export function changePalette(divID){
    let interpol = allInterpol[count];
    globalPalette.changeColor(interpol);

    colorMusic = globalPalette.paletteSample(music.length);
    colorNames = globalPalette.paletteSample(names.length);

    clearcontent(divID);
    globalPalette.draw(divID);

    count = (count+1)%allInterpol.length;
}

// CHANGE THE COLOR OF THE GRAPH TO DISPLAY ------------------------------------------------------
/**
 * 
 * @param {*} graph 
 * @param {*} palette 
 * @param {*} divGraph 
 * @param {*} divPalette 
 */
window.optimizeColor = (graph, palette, divGraph, divPalette) =>{
    clearcontent(divPalette);
    let categories = graph.getCategories();

    let affect = new AffectationScore(graph, method.impAverage, palette);
    let optigen = new Optigen(
        affect.score.bind(affect),
        {limit: 50, generation: 200, individual: categories.length}
    );
    let best = optigen.getBestIndividual();
    let newPalette = new ColorPalette(affect.affectTo(best.genome), undefined);

    graph.draw(newPalette.colors, divGraph);
    newPalette.draw(divPalette, categories);

    clearcontent("color-dist-palette"); clearcontent("color-dist-affect"); clearcontent("importance");
    HeatMap.colorDistanceHeatMap(palette).draw("color-dist-palette");
    HeatMap.colorDistanceHeatMap(newPalette, categories).draw("color-dist-affect");
    HeatMap.importanceHeatMap(graph, method.impAverage).draw("importance");
}

/**
 * 
 * @param {*} graph 
 * @param {*} palette 
 * @param {*} divGraph 
 * @param {*} divPalette 
 */
window.randomColor = (graph, palette, divGraph, divPalette) =>{
    clearcontent(divPalette);

    let randomColor = Permutation.copyShuffle(palette.colors);

    graph.draw(randomColor, divGraph);
    new ColorPalette(randomColor, undefined).draw(divPalette, graph.getCategories());
}

/**
 * 
 * @param {*} graph 
 * @param {*} palette 
 * @param {*} divGraph 
 * @param {*} divPalette 
 */
window.resetColor = (graph, palette, divGraph, divPalette) => {
    clearcontent(divPalette);

    graph.draw(palette.colors, divGraph);
    new ColorPalette(palette.colors, undefined).draw(divPalette, graph.getCategories());
}

// CHANGE THE GRAPH TO DISPLAY -----------------------------------------------------------------
let graph_palette = [
    {graph:graphDayMusique, palette:colorMusic},
    {graph:graphUsaNames, palette:colorNames}
];

window.currentStreamChart = graph_palette[0];

window.setStreamChart = (num, divID) => {
    currentStreamChart = graph_palette[num%graph_palette.length];
    console.log(currentStreamChart);

    currentStreamChart.graph.draw(currentStreamChart.palette.colors, divID);
}