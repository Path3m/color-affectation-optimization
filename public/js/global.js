const ColorPalette = cidcao.ColorPalette;

//CHANGE COLOR PALETTE ------------------------------------------------------
const allInterpol = [
    d3.interpolateViridis,
    d3.interpolateCool,
    d3.interpolateMagma,
    d3.interpolateSpectral,
    d3.interpolateRainbow,
    d3.interpolateSinebow,
    d3.interpolateBrBG,
    d3.interpolatePiYG,
    d3.interpolateRdBu
];

let count = 0;

// GLOBAL PALETTE ----------------------------------------------------
window.globalPalette = ColorPalette.buildPalette(1000, {min:0.05, max:0.95}, allInterpol[count]);

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
window.changeGlobalPalette = (inc, divID) => {
    count = (count == 0 && inc < 0) ? 
        allInterpol.length-1 :
        (count+inc)%allInterpol.length;

    let interpol = allInterpol[count];
    globalPalette.changeColor(interpol);

    if(divID !== undefined){
        renewElement(divID);
        globalPalette.draw(divID);
    }
}