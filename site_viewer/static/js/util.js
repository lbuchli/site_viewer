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
      // Bind the graphics framebuffer to the baseLayer's framebuffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.session.renderState.baseLayer.framebuffer)

        // Retrieve the pose of the device.
        // XRFrame.getViewerPose can return null while the session attempts to establish tracking.
        const pose = frame.getViewerPose(this.referenceSpace);
        if (pose) {
            // In mobile AR, we only have one view.
            const view = pose.views[0];

            const viewport = this.session.renderState.baseLayer.getViewport(view);
            this.renderer.setSize(viewport.width, viewport.height)

            // Use the view's transform matrix and projection matrix to configure the THREE.camera.
            this.camera.matrix.fromArray(view.transform.matrix)
            this.camera.projectionMatrix.fromArray(view.projectionMatrix);
            this.camera.updateMatrixWorld(true);
        }
    }
    this.drawers.push(baseDrawF);
  }

  static async create(canvas) {
    let session = await navigator.xr.requestSession("immersive-ar", {requiredFeatures: ['hit-test']});
    let referenceSpace = await session.requestReferenceSpace('local');
    let viewerSpace = await session.requestReferenceSpace('viewer');
    let hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

    return new GLCanvas(canvas, session, referenceSpace, viewerSpace, hitTestSource);
  }

  addGLTF(path, scale, pos = new THREE.Vector3()) {
    this.gltfloader.load(path, (gltf) => {
      let object = gltf.scene;
      object.position.set(pos.x, pos.y, pos.z);
      object.scale.multiplyScalar(scale);
      this.scene.add(object);
      console.log("Add");
    })
  }

  addLight(position = new THREE.Vector3(0, 0, 0), strength = 3) {
    const light = new THREE.AmbientLight(0xffffff, strength);
    light.position.set(position.x, position.y, position.z);
    this.scene.add(light);
  }

  selectReference(iconpath, scale, refcallback) {
    this.gltfloader.load(iconpath, (gltf) => {
      let cursor = gltf.scene;
      cursor.scale.multiplyScalar(scale);
      cursor.visible = false;
      this.scene.add(cursor);

      let drawf = (time, frame) => {
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);
        if (hitTestResults.length > 0 && cursor) {
          const hitPose = hitTestResults[0].getPose(this.referenceSpace);
            cursor.visible = true;
            cursor.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z)
            cursor.updateMatrixWorld(true);
        }
      }
      this.drawers.push(drawf);

      let selected = false;
      this.session.addEventListener("select", (event) => {
          if (cursor && !selected) {
            refcallback(cursor.position);
            this.scene.remove(cursor);
            selected = true;

            // remove from drawers
            const index = this.drawers.indexOf(drawf);
            if (index > -1) {
                this.drawers.splice(index, 1);
            }
          }
      });
    })
  }

  draw(time, frame) {
    // Queue up the next draw request.
    this.session.requestAnimationFrame((t, f) => this.draw(t, f));

    this.drawers.forEach((drawf) => {
      drawf(time, frame);
    });
    this.renderer.render(this.scene, this.camera);
  }
}

export { GLCanvas }
