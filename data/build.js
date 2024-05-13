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

//CHANGE COLOR PALETTE ------------------------------------------------------
let count = 0;
const allInterpol = [
    d3.interpolateMagma,
    d3.interpolateCool,
    d3.interpolateViridis,
    d3.interpolateSpectral
];

/**
 * 
 * @param {*} id 
 * @param {*} elemType 
 * @param {*} elemClass 
 * @returns a referecence to this new or old element empty
 */
function renewElement(id, elemType, elemClass) { 
    let element = document.getElementById(id);

    if(element == undefined){
        element = document.createElement(elemType);
        element.classList.add(elemClass);
        element.id = id;
        document.body.appendChild(element);
    }else{
        element.innerHTML = ""; 
    }
    
    return element;
}

/**
 * Change color of the global palette and draw it into
 * the corresponding div section of the html page 
 * @param {*} divID 
 */
export function changePalette(divID){
    let interpol = allInterpol[(++count)%allInterpol.length];
    globalPalette.changeColor(interpol);

    colorMusic = globalPalette.paletteSample(music.length);
    colorNames = globalPalette.paletteSample(names.length);

    clearcontent(divID);
    globalPalette.draw(divID);
}

// CHANGE THE COLOR OF THE GRAPH TO DISPLAY ------------------------------------------------------
/**
 * 
 * @param {*} graph 
 * @param {*} palette 
 * @param {*} divGraph 
 * @param {*} divPalette 
 */
window.optimizeColor = (graph, palette, divGraph, divPalette) => {
    renewElement(divPalette);
    let categories = graph.getCategories();

    let affect = new AffectationScore(graph, method.impAverage, palette);
    let optigen = new Optigen(
        affect.score.bind(affect),
        {limit: 50, generation: 200, individual: categories.length}
    );
    let result = optigen.execute()
    let best = result.last.members[0];
    let newPalette = new ColorPalette(affect.affectTo(best.genome), undefined);

    graph.draw(newPalette.colors, divGraph);
    newPalette.draw(divPalette, categories);

    renewElement("optigen-stat", "div", "boxplot-container");
    renewElement("color-dist-palette", "div", "heatmap-container"); 
    renewElement("color-dist-affect", "div", "heatmap-container"); 
    renewElement("importance", "div", "heatmap-container");
    
    HeatMap.colorDistanceHeatMap(palette).draw("color-dist-palette");
    HeatMap.colorDistanceHeatMap(newPalette, categories).draw("color-dist-affect");
    HeatMap.importanceHeatMap(graph, method.impAverage).draw("importance");

    new OptigenBoxPlot(result).draw("optigen-stat");
}

/**
 * 
 * @param {*} graph 
 * @param {*} palette 
 * @param {*} divGraph 
 * @param {*} divPalette 
 */
window.randomColor = (graph, palette, divGraph, divPalette) => {
    renewElement(divPalette);

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
    renewElement(divPalette);

    graph.draw(palette.colors, divGraph);
    new ColorPalette(palette.colors, undefined).draw(divPalette, graph.getCategories());
}

// CHANGE THE GRAPH TO DISPLAY -----------------------------------------------------------------
let dataStreamgraph = [
    dataset.dmFilterAlternative,
    dataset.usaNames,
    dataset.dm10layers, 
    dataset.dm11layers,
    dataset.binary,
    dataset.truc    
];
window.currentSG = 0;

const defaultStreamgraph = new Streamgraph(dataStreamgraph[currentSG]);
const defaultPalette = globalPalette.paletteSample(defaultStreamgraph.getCategories().length);

window.streamchart = {
    graph: defaultStreamgraph,
    palette: defaultPalette
};

/**
 * Set the current streamgraph on data with given number
 * @param {*} num 
 * @param {*} divID 
 */
window.setStreamChart = (num, divID) => {
    currentSG = num%dataStreamgraph.length;
    let graph = new Streamgraph(dataStreamgraph[currentSG]);
    let palette = globalPalette.paletteSample(graph.getCategories().length);
    streamchart = { graph : graph, palette : palette };
    
    console.log(streamchart);
    streamchart.graph.draw(streamchart.palette.colors, divID);
}