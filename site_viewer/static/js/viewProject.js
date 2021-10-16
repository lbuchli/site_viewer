import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import {GLCanvas} from "/js/util.js";
import { getSite, idGET } from "/js/urlhandler.js";

export async function showXR() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    let glcanvas = await GLCanvas.create(canvas);
    glcanvas.addLight();
    glcanvas.selectReference("https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf", .8, (pos) => {
        let id = idGET(window.location.search);
        let site = getSite(id);
        let qr_relative = JSON.parse(site.qr_relative);
        let vec = new THREE.Vector3(qr_relative.x, qr_relative.y, qr_relative.z);
        glcanvas.addGLTF(site.model, .5, vec.add(pos));
    });
    glcanvas.draw();
}

window.showXR = showXR;
