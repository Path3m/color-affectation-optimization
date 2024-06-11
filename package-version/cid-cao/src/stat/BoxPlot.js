import { Permutation } from "../optigen/Permutation.js";
import { ColorPalette } from "../affectation/ColorPalette.js";
import * as Plotly from "plotly.js-dist";

export class OptigenBoxPlot{
    /**
     * Build the data of the box plot and set it ready to be drawn
     * @param {*} div 
     * @param {*} geneticResult 
     */
    constructor(geneticResult, dimensions, factors, container){
        let palette = ColorPalette.buildPalette(
            20,{min:0.1,max:0.9},
            ColorPalette.interpolateDark
        );
        let dataOnBuild = this.buildData(geneticResult.statistic, palette.colors);

        let meilleur = " [ " + geneticResult.last.members[0].genome.reduce((acc, current) => acc + " - "+ current) + " ] ";
        let paramOptigen = 
            "Nombre maximale de génération : "+dimensions.limit+
            " ; Taille de la population : "+dimensions.generation+" individus ; "+
            "Taille d'un individu de la population : "+dimensions.individual+"<br>"+
            "Pourcentage autorisé à la reproduction : "+(100*factors.reproduction)+"% ; "+
            "Pourcentage de mutation : "+(100*factors.mutation)+"% ; "+
            "Pourcentage de selection : "+(100*factors.selection)+"% <br>"+
            "Meilleur individu : "+meilleur;

        this.container = (container == undefined) ? undefined : container;
        this.data = dataOnBuild.data;
        this.layout = this.buildLayout(dataOnBuild.range, paramOptigen);
    }

    /**
     * Build the data
     * @param {*} statGenerations 
     * @returns 
     */
    buildData(generationDatas, colors){
        console.log(generationDatas);

        var xData = Permutation.index(generationDatas.length);
        var data = [], max = 0, min = 0;

        for ( var i = 0; i < xData.length; i ++ ) {
            max = Math.max(max, Math.max(...generationDatas[i]));
            min = Math.min(max, Math.min(...generationDatas[i]));
            var result = { type: 'box', boxmean: true, boxpoints: false,
                line:{color: colors[(i+5)%colors.length]},
                y: generationDatas[i],
                name: "Gen "+xData[i]};
            data.push(result);
        };

        return {data:data, range:{max:max,min:min}};
    }

    /**
     * Build the layout
     * @param {*} yRange 
     * @returns 
     */
    buildLayout(yRange, title){
        var layout = {
            title: title,
            yaxis: {
                range: yRange,
                showgrid: true,
                zeroline: true,
                dtick: Math.ceil((yRange.max-yRange.min)/20),
                gridcolor: 'rgb(255, 255, 255)',
                gridwidth: 1,
                zerolinecolor: 'rgb(255, 255, 255)',
                zerolinewidth: 2
            },
            margin: { l: 40, r: 30, b: 80, t: 100 },
            paper_bgcolor: 'rgb(243, 243, 243)',
            plot_bgcolor: 'rgb(243, 243, 243)',
            showlegend: false
        };

        return layout;
    }
    
    /**
     * Draw the box plot
     */
    draw(container){
        this.container = (this.container == undefined) ? container : this.container;

        console.log(this.layout.title);

        Plotly.newPlot(
            this.container, 
            this.data, 
            this.layout
        );
    }
}
