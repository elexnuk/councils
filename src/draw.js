/**
 * Manages the draw state
 */
import { reactive } from "vue";

export const drawState = reactive({

    // Map the ward identifier to the colouring
    wardColouring: {},

    // Meta information about boundaries
    councilMeta: {
        name: "",
        boundary: ""
    },

    // Current Pen
    pen: {},

    // Custom Pens a map of name to pen definitions
    customPens: {},

    // Map of the default pens for the default parties you can't remove
    defaultPens: {
        "Con": {"label": "Con",  "fill": "#0087DC"},
        "Lab": {"label": "Lab",  "fill": "#E4003B"},
        "LD": {"label": "LD",   "fill": "#FAA61A"},
        "Grn": {"label": "Grn",  "fill": "#8dc63f"},
        "PC": {"label": "PC",   "fill": "#005B54"},
        "SNP": {"label": "SNP",  "fill": "#FDF38E"},
        "TUSC": {"label": "TUSC", "fill": "#EC008C"},
        "Ref": {"label": "Ref",  "fill": "#12B6CF"},
        "UKIP": {"label": "UKIP", "fill": "#6D3177"},
        "Ind": {"label": "Ind",  "fill": "#DDDDDD"},
        "Oth": {"label": "Oth",  "fill": "#475569"}
    },

    getWardColouring() {
        return this.wardColouring;
    },

    getCouncilMeta() {
        return this.councilMeta;
    }, 

    clearPen() {
        this.pen = {};
    },

    selectPen(label) {
        if (this.defaultPens[label]) {
            this.pen = this.defaultPens[label];
        } else if (this.customPens[label]) {
            this.pen = this.customPens[label];
        } 
        // else quite frankly im not sure what it is
    },

    // Add a new pen to the custom pens
    addPen(label, fill) {
        let suffix = 1;
        while (this.customPens[label]) {
            label = `${label}${suffix}`;
            suffix++;
        }
        this.customPens[label] = { label, fill };
        this.savePens();
    },

    editPenColour(label, newColour) {
        this.customPens[label].fill = newColour;
        this.savePens();
    },

    removePen(label) {
        if (this.pen.label == label) {
            this.selectPen("Oth");
        }

        delete this.customPens[label];
        this.savePens();
    },

    getPen(label) {
        return this.customPens[label];
    },

    // Save custom pens to localstorage
    savePens() {
        if (localStorage) {
            localStorage.setItem("customPens", JSON.stringify(this.customPens));
        }
    },

    // Load pens from localStorage
    loadPens() {
        if (localStorage) {
            let storedPens = JSON.parse(localStorage.getItem("customPens"));
            this.customPens = { ...this.customPens, ...storedPens };
        }
    }
});

/**
 * 
 * Pen Structure:
 * 
 * {
 *  fill: "",
 *  label: ""
 * }
 * then for simple colour it's just label = party, fill = fill colour
 * for a pattern background it's label = pen name, fill = url(#pen name)
 */