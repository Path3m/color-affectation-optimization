import {Streamgraph} from "./graph/Streamgraph.js";
import * as dataset from "./data/dataset.js";

import * as obj from "./global.js";

const ColorPalette = cidcao.ColorPalette;
const Affectation = cidcao.Affectation;
const method = cidcao.method;
const StreamgraphContrastImportance = cidcao.StreamgraphContrastImportance;

const Optigen = cidcao.Optigen;
const Permutation = cidcao.Permutation;

const OptigenBoxPlot = cidcao.OptigenBoxPlot;
const hm = cidcao.HeatMap;


// ---------------------------------------------------------------------------------------------
// DEFINING THE STREAMGRAPH TO DISPLAY ---------------------------------------------------------
// ---------------------------------------------------------------------------------------------
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
const defaultImportance = new StreamgraphContrastImportance(defaultStreamgraph.data, method.impMaxInverse);
const defaultPalette = globalPalette.paletteSample(defaultStreamgraph.getCategories().length);
const defaultAffect = new Affectation(defaultImportance, defaultPalette);

window.streamchart = {
    graph: defaultStreamgraph,
    importance: defaultImportance,
    palette: defaultPalette,
    affectation: defaultAffect
};

streamchart.graph.draw(streamchart.palette.colors, "streamgraph1");
streamchart.palette.draw("color-graph", streamchart.graph.getCategories());

/**
 * Helper function to renew the streamchart when new data are used.
 * Also display the streamchart, its color palette, and the  corresponding correlogram.
 * @param {*} data the graph data
 */
function renewStreamchart(data){
    renewElement("streamgraph1");
    renewElement("color-graph");
    renewElement("correlogram", "div", "square-container");

    removeElement("optigen-stat");

    streamchart.graph = new Streamgraph(data);
    streamchart.importance = new StreamgraphContrastImportance(streamchart.graph.data, method.impMaxInverse);
    streamchart.palette = globalPalette.paletteSample(streamchart.graph.getCategories().length);
    streamchart.affectation = new Affectation(streamchart.importance, streamchart.palette);

    streamchart.graph.draw(streamchart.palette.colors, "streamgraph1");
    streamchart.palette.draw("color-graph", streamchart.importance.categories);
    document.getElementById("correlogram").innerHTML = 
        streamchart.affectation.generateSVG(Permutation.index(
            streamchart.importance.categories.length
        ), 700);
}

/* DISPLAY HEATMAP
let hmColor = hm.colorDistanceHeatMap(streamchart.palette);
let hmCat   = hm.importanceHeatMap(streamchart.graph.data, method.impAverage);

renewElement("hmColor", "div",  "heatmap-container");
renewElement("hmCat", "div",  "heatmap-container");

hmColor.draw("hmColor");
hmCat.draw("hmCat"); */

//----------------------------------------------------------------------------------------------
/**
 * Set the current streamgraph on data with given number
 * @param {number} num the index of the data to use (@see {data\dataset.js} )
 */
window.setStreamChart = (num) => {
    currentSG = num%dataStreamgraph.length;
    renewStreamchart(dataStreamgraph[currentSG]);
}

// READ LOCAL FILE --------------------------------------------------------------------
window.readSingleFile = (path) => {
    var file = path.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(path) {
      var contents = path.target.result;
      renewStreamchart(contents);
    };
    reader.readAsText(file);
}

document.getElementById('file-input').addEventListener('change', readSingleFile, false);

// CHANGE THE AFFECTATION OF COLOR  --------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
/**
 * Execute the genetic optimisation and change the color
 * of the displayed graph
 * @param {*} divGraph id of the div element where the graph is displayed
 * @param {*} divPalette id of the div element where the graph palette is displayed
 */
window.optimizeColor = (divGraph, divPalette) => {
    let graph = streamchart.graph;
    let affect = streamchart.affectation;

    renewElement(divPalette);
    let categories = graph.getCategories();

    let dimensions = {limit: 50, generation: 200, individual: categories.length};
    let factors = {reproduction: 0.6, mutation: 0.4, selection: 0.4};

    let optigen = new Optigen(
        affect.score.bind(affect),
        dimensions, factors
    );
    let result = optigen.execute()
    let best = result.last.members[0];
    let newPalette = new ColorPalette(affect.getColor(best.genome), undefined);

    graph.draw(newPalette.colors, divGraph);
    newPalette.draw(divPalette, categories);

    renewElement("correlogram", "div", "square-container");
    renewElement("optigen-stat", "div", "boxplot-container");

    new OptigenBoxPlot(result, dimensions, factors, "optigen-stat").draw();
    document.getElementById("correlogram").innerHTML = 
        affect.generateSVG(best.genome, 700);
}

//---------------------------------------------------------------------------------------------
/**
 * Randomly affect the palette color to the graph categories
 * @param {*} divGraph id of the div element where the graph is displayed
 * @param {*} divPalette id of the div element where the graph palette is displayed
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
    document.getElementById("correlogram").innerHTML = 
        affect.generateSVG(permutation, 700);
}

//---------------------------------------------------------------------------------------------
/**
 * Bitmap affectation of the palette's color to the graph categories
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
    document.getElementById("correlogram").innerHTML = 
        affect.generateSVG(affect.getPermutation(palette.colors), 700);
}

//---------------------------------------------------------------------------------------------
/**
 * Change palette of current graph
 * @param {*} divPalette the div where the new colors will be displayed
 */
window.changeGraphPalette = (inc, divPalette) => {
    changeGlobalPalette(inc);
    let categories = streamchart.graph.getCategories();

    streamchart.palette = globalPalette.paletteSample(categories.length);
    streamchart.affectation.setPalette(streamchart.palette);

    console.log(streamchart);
    
    renewElement(divPalette);

    streamchart.graph.draw(streamchart.palette.colors);
    streamchart.palette.draw(divPalette, categories);
}

//---------------------------------------------------------------------------------------------
/**
 * Download the elementary importance in a csv file, with the same convention
 * used for streamchart
 * @param {string} nameFile
 */
window.downloadCSVelementaire = (nameFile) => {
    let csvContent = streamchart.affectation.elementaryToCsv();
    var encodedUri = encodeURI(csvContent);
    var link = renewElement("downloadCSVelementaire", "a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", nameFile+".csv");

    link.click();
}