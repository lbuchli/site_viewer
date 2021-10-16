import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { GLCanvas } from "/js/util.js";
import { postSite } from "/js/urlhandler.js";


export async function showXR() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    let glcanvas = await GLCanvas.create(canvas);
    glcanvas.addLight();
    glcanvas.selectReference("models/flat_marker.gltf", .1, (qrpos) => {
        glcanvas.selectReference("models/bench_1.gltf", .5, (objpos) => {
            let qrposc = new THREE.Vector3(qrpos.x, qrpos.y, qrpos.z);
            let objposc = new THREE.Vector3(objpos.x, objpos.y, objpos.z);
            let relpos = objposc.add(qrposc.multiplyScalar(-1));
            console.log(relpos);
            postSite(relpos);
            glcanvas.addGLTF("models/bench_1.gltf", .5, objpos);
        })
    });
    glcanvas.draw();
}

window.showXR = showXR;
