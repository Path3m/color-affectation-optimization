import * as util from "../utility.js";
import * as culori from "culori";

//NB : to use in accordance with a factory class ?

export class ColorPalette{

    /**
     * 
     * @param {*} x 
     * @returns 
     */
    static interpolateBuRd = x => culori.formatHex(culori.interpolate(['blue','white','red'])(x));

    /**
     * 
     * @param {*} x 
     * @returns 
     */
    static interpolateDark = x => culori.formatHex(culori.interpolate(['#000000','#aaaaaa'])(x));

    /**
     * 
     * @param {Array<any>} colors
     */
    constructor(colors, builder){
        this.builder = builder;
        this.colors = colors;
    }

    /**
     * 
     * @param {*} count 
     * @param {*} range 
     * @param {*} colorInterpol 
     * @returns an array of colors from a continuous color scale
     */
    static buildPalette(count, range, colorInterpol){
        const colors = new Array(count);
        for(let i=0; i<count; i++) colors[i] = colorInterpol((i/count)*(range.max-range.min)+range.min);
        return new ColorPalette(colors, colorInterpol);
    }

    /**
     * Change the color in the palette
     * @param {*} colorInterpol 
     * @returns 
     */
    changeColor(colorInterpol){
        let tmpPalette = ColorPalette.buildPalette(this.colors.length, {min:0.3, max:0.7}, colorInterpol);
        this.colors = tmpPalette.colors;
        this.builder = colorInterpol;
        return this;
    }

    /**
     * 
     * @param {*} colorInterpol 
     * @returns a ColorPalette of a hundred colors
     */
    static largeGraphPalette(colorInterpol){
        return this.buildPalette(100, {min:0.2, max:0.8}, colorInterpol);
    }

    /**
     * 
     * @param {*} count 
     * @returns an array of color evenly spread from the palette
     */
    subPalette(percentage){
        let count = this.colors.length * percentage;
        if(typeof percentage === 'number'){
            if(util.isInt(percentage) && percentage > 0 && percentage <= 100){
                count = Math.floor(count / 100);
            }else if(percentage > 0 && percentage <= 1){
                count = Math.floor(count);
            }
        }else{
            throw new Error("No good percentage where given for subpalette creation.");
        }

        return this.paletteSample(count);
    }

    /**
     * Return a new palette with the exact count of color given
     * @param {*} count 
     * @returns 
     */
    paletteSample(count){
        let colors = new Array(count);

        for(let i = 0; i < count; i++){
            colors[i] = this.colors[
                i * Math.floor(this.colors.length / count)
            ];
        }

        return new ColorPalette(colors, this.builder);
    }

    /**
     * Shuffle the colors in the palette
     * @return a reference to the color palette
     */
    shuffle(){
        this.colors.sort((a,b) => 0.5 - Math.random())
            .reverse()
            .sort((a,b) => 0.5 - Math.random());
        return this;
    }

    /**
     * Draw the color palette by creating a svg and append it to the document
     * @param {string} container the div in which the palette will be drawn
     * @param {Array | undefined} categories the categories corresponding to the color if given
     */
    draw(container, categories){
        let size = util.closestProduct(this.colors.length);
        let line = size[0]; let column = size[1];
        let sizeRange = 100;

        let svg = '<svg width="'+(column*sizeRange)+'" height="'+(line*sizeRange)+'" version="1.1" xmlns="http://www.w3.org/2000/svg">\n';

        for(let i=0; i<line; i++){
            let y = (0.5+i)*sizeRange;

            for(let j=0; j<column; j++){
                let x = (0.5+j)*sizeRange;
                let k = i * column + j;
                let cat = (categories == undefined || categories[k] == undefined) ?
                    k.toString()  :   categories[k];

                let sizeText = (cat.length < 11) ? 16 : 1.75 * sizeRange / cat.length;
                let fontColor = (culori.converter('lab')(this.colors[k]).l < 30) ? "white" : "black";

                svg += '<rect width="'+sizeRange+'" height="'+sizeRange+'" x="'+(x-sizeRange/2)+'" y="'+(y-sizeRange/2)+'"'
                    +'style="fill:'+this.colors[k]+';stroke-width:3;stroke:white" />\n';
                svg += '<text x="'+(x-9*sizeRange/20)+'" y="'+y+'" fill="'+fontColor+'" font-size="'+sizeText+'px">'+cat+'</text>\n';
            }
        }
        
        svg += "</svg>\n";
        if(container != undefined) document.getElementById(container).innerHTML = svg;
        return svg;
    }

    /**
     * Compute the distance between two color in the CIELAB color space
     * given the ciede2000 formula
     * @param {*} color1 
     * @param {*} color2 
     * @returns 
     */
    static distance(color1, color2){
        let lab     = culori.converter('lab');
        let formula = culori.differenceCiede2000(1,1,1);
        return formula(lab(color1),lab(color2));
    }

    /**
     * Compute the color distance matrix according to the ciede2000 formula
     * on the palette color range
     * @returns a matrix of number where i, j is the color distance between color i and color j 
     */
    computeDistanceMatrix(){
        let distance = util.nullMatrix(this.colors.length, this.colors.length, Float32Array);

        for(let i=0; i<this.colors.length; i++){
            for(let j=i+1; j<this.colors.length; j++){
                distance[i][j] = ColorPalette.distance(this.colors[i], this.colors[j]);
                distance[j][i] = distance[i][j];
            }
        }

        return distance;
    }
}