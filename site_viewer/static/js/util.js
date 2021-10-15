import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js";

class GLCanvas {

  constructor(canvas, session, referenceSpace, viewerSpace, hitTestSource) {
    this.gl = canvas.getContext("webgl", {xrCompatible: true});
    this.session = session;
    this.referenceSpace = referenceSpace;
    this.viewerSpace = viewerSpace;
    this.hitTestSource = hitTestSource;
    this.scene = new THREE.Scene();
    this.gltfloader = new GLTFLoader();
    this.reference = new THREE.Matrix4();
    this.drawers = [];

    this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        preserveDrawingBuffer: true,
        canvas: canvas,
        context: this.gl
    });
    this.renderer.autoClear = false;

    this.camera = new THREE.PerspectiveCamera();
    this.camera.matrixAutoUpdate = false;


    this.session.updateRenderState({
      baseLayer: new XRWebGLLayer(this.session, this.gl)
    });

    let baseDrawF = (time, frame) => {
        // Queue up the next draw request.
        session.requestAnimationFrame(this.draw);

        // Bind the graphics framebuffer to the baseLayer's framebuffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.session.renderState.baseLayer.framebuffer)

        // Retrieve the pose of the device.
        // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
        const pose = frame.getViewerPose(referenceSpace);
        if (pose) {
            // In mobile AR, we only have one view.
            const view = pose.views[0];

            const viewport = session.renderState.baseLayer.getViewport(view);
            renderer.setSize(viewport.width, viewport.height)

            // Use the view's transform matrix and projection matrix to configure the THREE.camera.
            this.camera.matrix.fromArray(view.transform.matrix)
            this.camera.projectionMatrix.fromArray(view.projectionMatrix);
            this.camera.updateMatrixWorld(true);
        }
    }
  }

  static async create(canvas) {
    let session = await navigator.xr.requestSession("immersive-ar", {requiredFeatures: ['hit-test']});
    let referenceSpace = await session.requestReferenceSpace('local');
    let viewerSpace = await session.requestReferenceSpace('viewer');
    let hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

    return new GLCanvas(canvas, session, referenceSpace, viewerSpace, hitTestSource);
  }

  addGLTF(path, transform = new THREE.Matrix4()) {
    this.gltfloader.load(path, (gltf) => {
      let object = gltf.scene;
      object.matrix = transform; // TODO multiply with reference
      object.visible = false;
      this.scene.add(object);
    })
  }

  selectReference(iconpath, refcallback) {
    gltfloader.load(iconpath, (gltf) => {
      let cursor = gltf.scene;
      cursor.visible = false;
      scene.add(cursor);

      let drawf = (time, frame) => {
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length > 0 && cursor) {
            const hitPose = hitTestResults[0].getPose(referenceSpace);
            cursor.visible = true;
            cursor.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
            cursor.updateMatrixWorld(true);
        }
      }
      this.drawers.push(drawf);

      let selected = false;
      this.session.addEventListener("select", (event) => {
          if (cursor && !selected) {
            refcallback(cursor.matrix);
            this.scene.remove(cursor);
            this.drawers.remove(drawf);
            selected = true;
          }
      });
    })
  }

  draw(time, frame) {
    this.drawers.forEach((drawf) => {
      drawf(time, frame);
    });
    renderer.render(this.scene, this.camera);
  }
}

export { GLCanvas }
