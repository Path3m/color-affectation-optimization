import { Permutation } from "../optigen/src/Permutation.js";

export class OptigenBoxPlot{
    static DEFAULT_COLORS = [
        "rgb(0,0,0)",
        "rgb(255,0,0)",
        "rgb(0,255,0)",
        "rgb(0,0,255)",
    ];

    /**
     * Build the data of the box plot and set it ready to be drown
     * @param {*} div 
     * @param {*} geneticResult 
     */
    constructor(div, geneticResult){
        let tmp = this.buildData(geneticResult.statistic);
        let data = tmp.data;
        let range = tmp.range;

        this.div = div;
        this.data = data;
        this.layout = this.buildLayout(range);
    }

    /**
     * Build the data
     * @param {*} statGenerations 
     * @returns 
     */
    buildData(generationDatas){
        var colors = OptigenBoxPlot.DEFAULT_COLORS;
        console.log(generationDatas);

        var xData = Permutation.index(generationDatas.length);
        var data = [], max = 0, min = 0;

        for ( var i = 0; i < xData.length; i ++ ) {
            max = Math.max(max, Math.max(...generationDatas[i]));
            min = Math.min(max, Math.min(...generationDatas[i]));
            var result = { type: 'box', boxmean: true, boxpoints: false,
                line:{color:colors[i%colors.length]},
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
    buildLayout(yRange){
        var layout = {
            title: 'Genetic Optimisation',
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
    draw(){
        Plotly.newPlot(this.div, this.data, this.layout);
    }
}
