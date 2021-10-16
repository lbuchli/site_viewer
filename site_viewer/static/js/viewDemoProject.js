import {GLCanvas} from "/js/util.js";
import { getSite, idGET } from "/js/urlhandler.js";
import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";

export async function showXR() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    let glcanvas = await GLCanvas.create(canvas);
    glcanvas.addLight();
    glcanvas.selectReference("models/flat_marker.gltf", .1, (pos) => {
        let x = 0.37503696978092194;
        let y = -0.07038331031799316;
        let z = -0.22887301445007324;
        let qr_relative = new THREE.Vector3(x, y, z);
        glcanvas.addGLTF("models/bench_1.gltf", .5, qr_relative.add(pos));
    });
    glcanvas.draw();
}

window.showXR = showXR;
