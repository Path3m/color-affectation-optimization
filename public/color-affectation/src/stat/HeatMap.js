import { ColorPalette } from "../affectation/ColorPalette.js";
import {Streamgraph} from "../graph/Streamgraph.js";
import {ImportanceMethod} from "../affectation/computationMethod.js";
import { StreamgraphContrastImportance as sci} from "../affectation/StreamgraphContrastImportance.js";

export class HeatMap{
    /**
     * Constructor
     * @param {*} graph the data vizualisation from which we get the importance matrix
     * @param {*} func the function over which the importance will be computed
     * @param {*} title 
     * @param {*} container an html container to display on the page
     */
    constructor(dataMatrix, dataCategories, title, container){

        this.palette = ColorPalette.largeGraphPalette( ColorPalette.interpolateBuRd );
        this.data = this.heatMapData(dataMatrix, dataCategories);

        this.heatmap = anychart.heatMap(this.data);
        this.heatmap.title(title);

        if(container != undefined) this.heatmap.container(container);
    }

    /**
     * Build the heatmap data from a symmetric matrix and a set of categories,
     * where matrix[i,j] is the heat for the pair of categorie {i,j}
     * @param {Array<Array<number>>} matrix containing the heat values
     * @param {Array<any>} dataCategories the different catgeories 
     * @returns correct set of data to build the heatmap
     */
    heatMapData(matrix, dataCategories){
        let line = matrix.length;
        let column = matrix[0].length;
        var dataHeatMap = new Array(line*column);

        for(let i=0; i < line; i++){
          for(let j=0; j < column; j++){
            dataHeatMap[i * column + j] = { 
              x: dataCategories[i], 
              y: dataCategories[j], 
              heat: matrix[i][j]
            };
          }
        }

        return dataHeatMap;
    }

    /**
     * Return the corresponding heatmap from an importance matrix
     * @param {*} container 
     * @param {*} graph 
     * @param {*} computeMethod 
     * @returns 
     */
    static importanceHeatMap(graphData, computeMethod, container){
        let importance = new sci(graphData, computeMethod);

        return new HeatMap(
            importance.global, importance.categories, "Importance : "+computeMethod.name(), container
        );
    }

    /**
     * Return the corresponding heatmap from a color distance matrix
     * @param {*} container 
     * @param {*} colorRange 
     */
    static colorDistanceHeatMap(colorPalette, categories, container){
        let distance = colorPalette.computeDistanceMatrix();
        return new HeatMap(
            distance, 
            (categories == undefined)? colorPalette.colors : categories,
            "Distance couleur",
            container
        );
    }

    /**
     * Compute the range of values of the data heat
     * @returns the min and max values for the heatmap
     */
    getRangeValue(){
        var max = this.data[0].heat, 
            min = this.data[0].heat;

        this.data.forEach( current => { 
            max = (current.heat > max) ? current.heat : max;
            min = (current.heat < min) ? current.heat : min;
        });

        return {min: min, max: max};
    }

    /**
     * @param {*} colors the range of color of the heatmap
     */
    setColorScale(colors){
        var range = this.getRangeValue();

        var colorScale = anychart.scales.linearColor();
        colorScale.colors(colors);
        colorScale.minimum(range.min);
        colorScale.maximum(range.max);

        this.heatmap.colorScale(colorScale);
    }

    /**
     * Draw the heatmap
     */
    draw(container){
        this.setColorScale(this.palette.colors);
        if(container != undefined) this.heatmap.container(container);
        this.heatmap.draw();
    }
}