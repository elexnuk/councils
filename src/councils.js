import { reactive, shallowReactive } from "vue";
import { getJSON, config } from "./api";

export const councils = reactive({
    
    // key of the current council the app is looking at
    currentCouncil: {
        name: "",
        boundary: ""
    },

    // listing of all councils the app has
    councilListing: {},

    // GeoJSON boundaries of the council the app is looking at
    councilBoundaries: shallowReactive({ data: {}, error: false }),

    // Load the listing of councils from the data source
    loadCouncilListing() {
        getJSON(config.listing_path).then(data => {
            this.councilListing = data;
        }).catch(e => {
            console.error("Server Error:", e);
            alert("Error loading listing of council boundary data. Please refresh to try again.")
        });
    },

    // Load the council boundaries from the data source
    loadCouncilBoundaries() {
        console.log(`Loading Boundaries for ${this.currentCouncil.name} - ${this.currentCouncil.boundary}`);
        if (!this.isCouncilSelected()) {
            throw new Error("Council is not fully selected");
        }

        let boundFile = this.getCurrentCouncil().boundaries.find(el => el.slug == this.currentCouncil.boundary);
        if (!boundFile || !boundFile.url) {
            throw new Error("Council boundary not found");
        }

        getJSON(config.api_base + boundFile.url).then(data => {
            this.councilBoundaries.data = data;
            this.councilBoundaries.error = false;
        }).catch(e => {
            console.error("Sever Error:", e);
            alert(`Server Error Loading Boundaries: ${e}. Perhaps try again later.`)
            this.councilBoundaries.error = true;
        });
    },

    isCouncilLoaded() {
        return this.councilBoundaries != {};
    },

    isCouncilSelected() {
        return this.currentCouncil.name != "" && this.currentCouncil.boundary != "";
    },

    setCurrentCouncilName(name) {
        this.currentCouncil.name = name;
        this.currentCouncil.boundary = "";
    },

    setCurrentCouncilBoundary(bound) {
        this.currentCouncil.boundary = bound;
        this.loadCouncilBoundaries();
    },

    // Return the listing object of the current council. Returns undefined for no selection
    getCurrentCouncil() {
        if (this.currentCouncil.name != "") {
            return this.councilListing[this.currentCouncil.name];
        } else {
            return undefined;
        }
    }
});