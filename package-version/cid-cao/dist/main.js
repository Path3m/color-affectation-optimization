let interpol = cidCao.ColorPalette.interpolateBuRd;

let palette = cidCao.ColorPalette.buildPalette(
    20, {min:0, max:1}, interpol
);

function component1(){
    const element = document.createElement("div");
    element.setAttribute("id", "color-palette");
    document.body.appendChild(element);

    element.innerHTML += palette.draw("color-palette");
}

component1();