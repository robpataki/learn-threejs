import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Playground {
  constructor(options) {
    this.time = 0;
    this.container = options.container;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      10,
      1000
    );
    this.camera.position.z = 100;

    this.camera.fov = 2 * Math.atan(this.height / 2 / 500) * (180 / Math.PI);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.addHelpers();
    this.addObjects();
    this.resize();
    this.setupResize();
    this.render();
  }

  addHelpers() {
    const axesHelper = new THREE.AxesHelper(100);
    this.scene.add(axesHelper);
  }

  addObjects() {
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: "#ff0000",
      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = 90;
    this.scene.add(plane);

    const sphereGeometry = new THREE.SphereGeometry(25, 25, 10);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      wireframe: true,
    });
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(this.sphere);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.time += 0.005;
    this.renderer.render(this.scene, this.camera);

    this.sphere.rotation.y += 0.01;
    this.sphere.rotation.x += 0.01;

    window.requestAnimationFrame(this.render.bind(this));
  }

  setSize() {}
}

new Playground({
  container: document.querySelector("#container"),
});
