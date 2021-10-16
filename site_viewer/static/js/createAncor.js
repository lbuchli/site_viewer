import { GLCanvas } from "/js/util.js";

export async function showXR() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    let glcanvas = await GLCanvas.create(canvas);
    glcanvas.addLight();
    glcanvas.selectReference("models/flat_marker.gltf", .1, (qrpos) => {
        glcanvas.selectReference("models/bench_1.gltf", .5, (objpos) => {
            glcanvas.addGLTF("models/bench_1.gltf", .5, objpos);
        })
    });
    glcanvas.draw();
}

window.showXR = showXR;