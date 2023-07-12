import { reactive, version } from "vue";
import { councils } from "./councils";
import { drawState } from "./draw";

// File Schema
// {
//   version: String, - File Version
//   name: String, - File Name
//   date: String, - Date of File Creation
//   council: {
//       name: String, - Name of Council
//       boundary: String, - Boundary of Council
//   }
//   pens: {}, - Custom pens used in the File
//   wards: {}, - Wards and their colourings. Map of ward identifier to pen identifier
// }

export const storage = reactive({
    // Returns a JSON string of the current state of the map
    createFile() {
        let { name, boundary } = drawState.getCouncilMeta();

        if (name == "" || boundary == "") {
            throw new Error("Council is not fully selected");
        }

        let colouring = drawState.getWardColouring();
        let date = new Date();

        let file = {
            version: 0,
            name: `${name}-${boundary}-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
            date: new Date().toISOString(),
            council: { name, boundary },
            pens: drawState.customPens,
            wards: colouring
        };

        return JSON.stringify(file);
    },

    // Loads a file (JSON string) into the map
    async loadFile(file) {
        let data = JSON.parse(file);
        let { name, boundary } = data.council;

        if (name == "" || boundary == "") {
            throw new Error("Council is not fully selected");
        }

        console.log("Loading File with Boundaries for ", name, boundary);

        councils.setCurrentCouncilName(name);
        await councils.setCurrentCouncilBoundary(boundary);

        if (data.version == 0) {
            let colouring = data.wards;
            drawState.wardColouring = colouring;    
        } else {
            throw new Error("File Version Not Supported");
        }
    },

    saveFileToLocalStorage(name) {
        let file = this.createFile();
        localStorage.setItem(`savedFile-${name}`, file);
    },

    saveFileToFileSystem(name) {
        let file = this.createFile();
        let blob = new Blob([file], { type: "application/json;charset=utf-8" });
        let blobURL = window.URL.createObjectURL(blob);

        (function (href, name) {
            let link = document.createElement("a");
            link.download = name;
            link.href = href;

            link.style.opacity = 0;
            link.style.position = "absolute";
            document.body.appendChild(link);
            link.click();
            link.remove();
        })(blobURL, `${name}.json`);
    },

    loadFileFromLocalStorage(name) {
        let file = localStorage.getItem(`savedFile-${name}`);
        if (!file) {
            throw new Error("File Not Found");
        }

        this.loadFile(file);
    },
});