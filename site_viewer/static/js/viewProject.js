import {GLCanvas} from "/js/util.js";
import { getSite, idGET } from "/js/urlhandler.js";

export async function showXR() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    let glcanvas = await GLCanvas.create(canvas);
    glcanvas.addLight();
    glcanvas.selectReference("models/flat_marker.gltf", .1, (pos) => {
        let id = idGET(window.location.search);
        let site = getSite(id);
        console.log(site);
        glcanvas.addGLTF(site.model, .5, site.qr_relative.add(pos));
    });
    glcanvas.draw();
}

window.showXR = showXR;
