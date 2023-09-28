import * as THREE from "three";
import imagesLoaded from "imagesloaded";
import FontFaceObserver from "fontfaceobserver";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import ocean from "../img/ocean.jpg";

export default class Sketch {
  constructor(options) {
    this.time = 0;
    this.container = options.dom;
    this.scene = new THREE.Scene();
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      100,
      2000
    );
    this.camera.position.z = 600;

    /*
      Control exactly how big rendered objects should appear (in this case,
      the 100x100px object will measure 100x100px when rendered in the browser)
    */
    this.camera.fov = 2 * Math.atan(this.height / 2 / 600) * (180 / Math.PI);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.images = [...document.querySelectorAll("img")];

    const fontOpen = new Promise((resolve) => {
      new FontFaceObserver("Open Sans").load().then(() => {
        resolve();
      });
    });

    const fontPlayFair = new Promise((resolve) => {
      new FontFaceObserver("Playfair Display").load().then(() => {
        resolve();
      });
    });

    const preloadImages = new Promise((resolve, reject) => {
      imagesLoaded(
        document.querySelectorAll("img"),
        { background: true },
        resolve
      );
    });

    const allDone = [fontOpen, fontPlayFair, preloadImages];
    this.currentScroll = 0;

    Promise.all(allDone).then(() => {
      this.addImages();
      this.setPosition();
      this.resize();
      this.setupResize();
      this.addObjects();
      this.render();

      window.addEventListener("scroll", () => {
        console.log(window.scrollY);
      });
    });
  }

  addImages() {
    this.imageStore = this.images.map((img) => {
      let bounds = img.getBoundingClientRect();
      let { top, left, width, height } = bounds;

      let geometry = new THREE.PlaneGeometry(width, height, 1, 1);
      let texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      let material = new THREE.MeshBasicMaterial({
        // color: "#ff0000",
        map: texture,
      });
      let mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);

      return {
        img,
        ...{ top, left, width, height },
        mesh,
      };
    });
  }

  setPosition() {
    this.imageStore.forEach((o) => {
      o.mesh.position.y = -o.top + this.height / 2 - o.height / 2;
      o.mesh.position.x = o.left - this.width / 2 + o.width / 2;
    });
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(100, 100, 10, 10);
    // this.geometry = new THREE.SphereGeometry(0.5, 40, 40);
    this.material = new THREE.MeshNormalMaterial();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        oceanTexture: {
          value: new THREE.TextureLoader().load(ocean),
        },
      },
      side: THREE.DoubleSide,
      fragmentShader: fragment,
      vertexShader: vertex,
      wireframe: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  render() {
    // this.time += 0.05;
    // this.mesh.rotation.x = this.time / 2000;
    // this.mesh.rotation.y = this.time / 1000;
    // this.material.uniforms.time.value = this.time;

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({ dom: document.getElementById("container") });
