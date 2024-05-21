import {ColorPalette} from "../graph/src/ColorPalette.js";
import {Streamgraph} from "../graph/src/Streamgraph.js";
import * as method from "../graph/src/computationMethod.js";

import { Optigen } from "../optigen/src/Optigen.js";
import { score } from "../optigen/src/utilitaire.js";
import { Permutation } from "../optigen/src/Permutation.js";

import { HeatMap } from "../stat/HeatMap.js";
import { OptigenBoxPlot } from "../stat/BoxPlot.js";

import * as dataset from "./dataset.js";
import { Affectation } from "../graph/src/Affectation.js";


//INITIATING GLOBAL PALETTE ----------------------------------------------------
window.globalPalette = ColorPalette.largeGraphPalette(d3.interpolateMagma);
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
 * Create a new html element of given type and class if the given id return
 * an undefined reference to the element, else set the content of the element to emtpy. 
 * @param {*} id of the element to get
 * @param {*} elemType kind of html element to create : div / p / h1 ...
 * @param {*} elemClass the class of the element
 * @returns a referecence to this new or old element empty
 */
window.renewElement = (id, elemType, elemClass) => { 
    let element = document.getElementById(id);

    if(element == undefined){
        element = document.createElement(elemType);
        if(elemClass != undefined) element.classList.add(elemClass);
        element.id = id;
        document.body.appendChild(element);
    }else{
        element.innerHTML = ""; 
    }
    
    return element;
}

/**
 * Remove an element given by its id
 * @param {*} id 
 */
window.removeElement = (id) => {
    let element = document.getElementById(id);
    if(element != undefined) element.remove();
}

/**
 * Change color of the global palette and draw it into
 * the corresponding div section of the html page 
 * @param {*} divID 
 */
window.changeGlobalPalette = (divID) => {
    let interpol = allInterpol[(++count)%allInterpol.length];
    globalPalette.changeColor(interpol);

    if(divID !== undefined){
        renewElement(divID);
        globalPalette.draw(divID);
    }
}

/**
 * Change palette of current graph
 * @param {*} divPalette 
 */
window.changeGraphPalette = (divPalette) => {
    changeGlobalPalette();
    let categories = streamchart.graph.getCategories();

    streamchart.palette = globalPalette.paletteSample(categories.length);
    streamchart.affectation.setPalette(streamchart.palette);

    console.log(streamchart);
    
    renewElement(divPalette);

    streamchart.graph.draw(streamchart.palette.colors);
    streamchart.palette.draw(divPalette, categories);
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

export const defaultStreamgraph = new Streamgraph(dataStreamgraph[currentSG]);
export const defaultPalette = globalPalette.paletteSample(defaultStreamgraph.getCategories().length);
export const defaultAffect = new Affectation(defaultStreamgraph, method.impMaxInverse, defaultPalette);

window.streamchart = {
    graph: defaultStreamgraph,
    palette: defaultPalette,
    affectation: defaultAffect
};

/**
 * Set the current streamgraph on data with given number
 * @param {*} num 
 * @param {*} divID 
 */
window.setStreamChart = (num, divGraph, divPalette) => {
    currentSG = num%dataStreamgraph.length;
    let graph = new Streamgraph(dataStreamgraph[currentSG]);
    let palette = globalPalette.paletteSample(graph.getCategories().length);
    let affectation = new Affectation(graph, method.impMaxInverse, palette);
    streamchart = { graph : graph, palette : palette, affectation : affectation };
    
    console.log(streamchart);
    streamchart.graph.draw(streamchart.palette.colors, divGraph);

    renewElement(divPalette);
    streamchart.palette.draw(divPalette, streamchart.graph.getCategories());
}

// CHANGE THE COLOR OF THE GRAPH TO DISPLAY ------------------------------------------------------
/**
 * 
 * @param {*} graph 
 * @param {*} palette 
 * @param {*} divGraph 
 * @param {*} divPalette 
 */
window.optimizeColor = (divGraph, divPalette) => {
    let graph = streamchart.graph;
    let affect = streamchart.affectation;

    renewElement(divPalette);
    let categories = graph.getCategories();

    let optigen = new Optigen(
        affect.score.bind(affect),
        {limit: 50, generation: 200, individual: categories.length}
    );
    let result = optigen.execute()
    let best = result.last.members[0];
    let newPalette = new ColorPalette(affect.getColor(best.genome), undefined);

    graph.draw(newPalette.colors, divGraph);
    newPalette.draw(divPalette, categories);

    renewElement("correlogram", "div", "square-container");
    renewElement("optigen-stat", "div", "boxplot-container");

    new OptigenBoxPlot(result).draw("optigen-stat");
    document.getElementById("correlogram").innerHTML = affect.generateSVG(best.genome, 700);
}

/**
 * 
 * @param {*} graph 
 * @param {*} palette 
 * @param {*} divGraph 
 * @param {*} divPalette 
 */
window.randomColor = (divGraph, divPalette) => {
    let graph = streamchart.graph;
    let palette = streamchart.palette;
    let affect = streamchart.affectation;

    renewElement(divPalette);
    removeElement("optigen-stat");

    let randomColor = Permutation.copyShuffle(palette.colors);

    graph.draw(randomColor, divGraph);
    new ColorPalette(randomColor, undefined).draw(divPalette, graph.getCategories());

    let permutation = affect.getPermutation(randomColor);
    console.log(affect);
    console.log(permutation);

    renewElement("correlogram", "div", "square-container");
    document.getElementById("correlogram").innerHTML = affect.generateSVG(permutation, 700);
}

/**
 * @param {*} divGraph 
 * @param {*} divPalette 
 */
window.resetColor = (divGraph, divPalette) => {
    let graph = streamchart.graph;
    let palette = streamchart.palette;
    let affect = streamchart.affectation;

    renewElement(divPalette);
    removeElement("optigen-stat");

    graph.draw(palette.colors, divGraph);
    palette.draw(divPalette, graph.getCategories());

    renewElement("correlogram", "div", "square-container");
    document.getElementById("correlogram").innerHTML = affect.generateSVG(affect.getPermutation(palette.colors), 700);
}