import * as d3 from "d3";
import { drawState } from "./draw";
import { councils } from "./councils";

const width = 700;
const height = 600;

const zoom = d3.zoom();

function loadBoundaries(boundaries, options, mouseover, mousedown) {

    document.getElementById("d3-svg").innerHTML = "";

    const map = d3.select("svg#d3-svg").attr("viewBox", [[0, 0], [width, height]]);
    const zoomLayer = map.append("g");
    const geoGenerator = d3.geoPath()
        .projection(d3.geoMercator().fitExtent([[0, 0], [width, height]], boundaries));

    map.call(
        zoom.on("zoom", e => {
            zoomLayer.attr("transform", e.transform);
        }).scaleExtent([1, 8])
        .translateExtent([[0, 0], [width, height]])
    );

    // console.log(boundaries);

    zoomLayer.attr("transform", "translate(0 0) scale(1)");
    zoomLayer.selectAll("g")
        .data(boundaries.features)
        .enter()
            .append("path")
            .attr("d", geoGenerator)
            .attr("data-tag", feature => feature.properties[options.key])
            .attr("stroke", "#1E293B")
            .attr("stroke-width", "0.05%")
            .attr("stroke-linejoin", "round")
            .attr("fill", feature => {
                drawState.wardColouring[feature.properties[options.key]] = "#dddddd";
                return "#dddddd";
            })
            .on("mouseover", mouseover)
            .on("mousedown", mousedown);
}

function downloadSVG() {
    return new Promise((accept, reject) => {
        let svg = document.getElementById("d3-svg");
        let { svgWidth, svgHeight } = svg.getBBox(); // Could do tighter cropping here?
        let width = 1920, height = 1080;
        let clone = svg.cloneNode(true);
        clone.setAttribute("width", width);
        clone.setAttribute("height", height);

        let blob = new Blob([clone.outerHTML], { type: "image/svg+xml;charset=utf-8" });
        let blobURL = window.URL.createObjectURL(blob);

        console.log("Download blob", blobURL);

        (function (href, name) {
            let link = document.createElement("a");
            link.download = name;
            link.href = href;

            link.style.opacity = 0;
            link.style.position = "absolute";
            document.body.appendChild(link);
            link.click();
            link.remove();
        })(blobURL, `${councils.currentCouncil.name}-${councils.currentCouncil.boundary}-boundary.svg`);
        
        accept(svg);
    });
}

function downloadPNG() {
    return new Promise((accept, reject) => {
        let svg = document.getElementById("d3-svg");
        let width = 1920, height = 1080;
        let clone = svg.cloneNode(true);
        clone.setAttribute("width", width);
        clone.setAttribute("height", height);

        let blob = new Blob([clone.outerHTML], { type: "image/svg+xml;charset=utf-8" });
        let blobURL = window.URL.createObjectURL(blob);

        let image = new Image();
        image.onload = () => {
            let canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            let context = canvas.getContext("2d");
            setDPI(canvas, 300);
            context.drawImage(image, 0, 0, width, height);

            let png = canvas.toDataURL();
            console.log("Download PNG", png);
            (function (href, name) {
                let link = document.createElement("a");
                link.download = name;
                link.href = href;
    
                link.style.opacity = 0;
                link.style.position = "absolute";
                document.body.appendChild(link);
                link.click();
                link.remove();
            })(png, `${councils.currentCouncil.name}-${councils.currentCouncil.boundary}-boundary.png`)
            
            accept(png);
        }
        image.src = blobURL;
    })
}

function setDPI(canvas, dpi) {
    canvas.style.width = canvas.style.width || canvas.width + 'px';
    canvas.style.height = canvas.style.height || canvas.height + 'px';

    // Resize canvas and scale future draws.
    var scaleFactor = dpi / 96;
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
}

export { loadBoundaries, downloadPNG, downloadSVG };