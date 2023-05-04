import { reactive } from "vue";

const config_url = (import.meta.env.DEV) ? "/local.config.json" : "config.json";

const config = reactive({
    api_base: "/",
    listing_path: "/councils.json"
});

function getJSON(url) {
    let req = new Request(url);
    return fetch(req, { method: "GET", headers: { "Content-Type": "application/json" } }).then(r => {
        if (r.status == 403) {
            throw new Error("Forbidden Access to Resource");
        } else if (r.status == 405) {
            throw new Error("HTTP Access Verb Unsupported");
        } else if (r.status == 404) {
            throw new Error("Resource Not Found on Server");
        } else if (r.status != 200) {
            throw r;
        }

        return r.json()
    })
}

function loadConfig() {

    return getJSON(config_url).then(data => {
        if (data.boundaryBase) {
            config.api_base = data.boundaryBase;
        } else {
            throw new Error("Config File Missing boundaryBase. Defaulting to \"/\"");
        }

        if (data.boundaryListing) {
            config.listing_path = data.boundaryListing;
        } else {
            throw new Error("Config File Missing boundaryListing. Defaulting to \"/councils.json\"");
        }
    }).catch(console.error);
}

export { config, getJSON, loadConfig };