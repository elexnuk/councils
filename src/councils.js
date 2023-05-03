import { reactive, shallowReactive } from "vue";

export const councils = reactive({

    // key of the current council the app is looking at
    currentCouncil: {
        name: "",
        boundary: ""
    },

    // listing of all councils the app has
    councilListing: {},

    // GeoJSON boundaries of the council the app is looking at
    councilBoundaries: shallowReactive({ data: {} }),

    // Load the listing of councils from the data source
    loadCouncilListing() {
        let req = new Request("/councils.json");
        
        fetch(req, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then(res => res.json())
        .then(resp => {
            this.councilListing = resp;
        })
        .catch(console.error);
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

        let req = new Request(boundFile.url);
        fetch(req, { method: "GET", headers: { "Content-Type": "application/json" }})
        .then(r => r.json())
        .then(resp => {
            console.log(resp);
            this.councilBoundaries.data = resp;
        }).catch(console.error);
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