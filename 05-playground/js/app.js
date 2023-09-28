import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Playground {
  constructor(options) {
    this.time = 0;

    this.shapeDistance = 200;
    this.shapeSize = 20;

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
    this.camera.position.y = 100;

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

    const planeGeometry = new THREE.PlaneGeometry(
      this.shapeSize * 100,
      this.shapeSize * 100,
      10,
      10
    );
    const planeMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: "#0099ff",
      transparent: true,
      opacity: 0.1,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = THREE.MathUtils.degToRad(90);
    this.scene.add(plane);
  }

  addObjects() {
    const basicMaterial = new THREE.MeshBasicMaterial({
      color: "#000000",
      wireframe: true,
    });

    // Sphere
    const sphereGeometry = new THREE.SphereGeometry(this.shapeSize, 10, 10);
    this.sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    this.scene.add(this.sphere);

    // Capsule
    const capsuleGeometry = new THREE.CapsuleGeometry(
      this.shapeSize,
      this.shapeSize,
      4,
      8
    );
    this.capsule = new THREE.Mesh(capsuleGeometry, basicMaterial);
    this.capsule.position.x = -this.shapeDistance;
    this.scene.add(this.capsule);

    // Torus
    const torusGeometry = new THREE.TorusGeometry(this.shapeSize, 5, 10, 20);
    this.torus = new THREE.Mesh(torusGeometry, basicMaterial);
    this.scene.add(this.torus);
    this.torus.position.x = this.shapeDistance;

    // Cone
    const coneGeometry = new THREE.ConeGeometry(
      this.shapeSize,
      this.shapeSize * 3,
      10,
      10
    );
    this.cone = new THREE.Mesh(coneGeometry, basicMaterial);
    this.cone.position.z = -this.shapeDistance;
    this.scene.add(this.cone);

    // Circle
    const circleGeometry = new THREE.CircleGeometry(this.shapeSize, 10);
    this.circle = new THREE.Mesh(circleGeometry, basicMaterial);
    this.circle.position.x = -this.shapeDistance;
    this.circle.position.z = -this.shapeDistance;
    this.scene.add(this.circle);

    // Cylinder
    const cylinderGeometry = new THREE.CylinderGeometry(
      this.shapeSize,
      this.shapeSize,
      this.shapeSize * 3,
      10,
      10
    );
    this.cylinder = new THREE.Mesh(cylinderGeometry, basicMaterial);
    this.cylinder.position.x = this.shapeDistance;
    this.cylinder.position.z = -this.shapeDistance;
    this.scene.add(this.cylinder);

    // Plane
    const planeGeometry = new THREE.PlaneGeometry(
      this.shapeSize,
      this.shapeSize,
      1,
      1
    );
    this.plane = new THREE.Mesh(planeGeometry, basicMaterial);
    this.plane.position.x = -this.shapeDistance;
    this.plane.position.z = this.shapeDistance;
    this.scene.add(this.plane);

    // Dodecahedron
    const dodecahedronGeometry = new THREE.DodecahedronGeometry(this.shapeSize);
    this.dodecahedron = new THREE.Mesh(dodecahedronGeometry, basicMaterial);
    this.dodecahedron.position.z = this.shapeDistance;
    this.scene.add(this.dodecahedron);

    // Icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(this.shapeSize);
    this.icosahedron = new THREE.Mesh(icosahedronGeometry, basicMaterial);
    this.icosahedron.position.z = this.shapeDistance;
    this.icosahedron.position.x = this.shapeDistance;
    this.scene.add(this.icosahedron);

    // Octahedron
    const octahedronGeometry = new THREE.OctahedronGeometry(this.shapeSize);
    this.octahedron = new THREE.Mesh(octahedronGeometry, basicMaterial);
    this.octahedron.position.y = this.shapeDistance;
    this.scene.add(this.octahedron);

    // Ring
    const ringGeometry = new THREE.RingGeometry(this.shapeSize);
    this.ring = new THREE.Mesh(ringGeometry, basicMaterial);
    this.ring.position.y = this.shapeDistance;
    this.ring.position.x = this.shapeDistance;
    this.scene.add(this.ring);

    // Tetrahedron
    const tetrahedronGeometry = new THREE.TetrahedronGeometry(this.shapeSize);
    this.tetrahedron = new THREE.Mesh(tetrahedronGeometry, basicMaterial);
    this.tetrahedron.position.y = this.shapeDistance;
    this.tetrahedron.position.x = -this.shapeDistance;
    this.scene.add(this.tetrahedron);

    // TorusKnot
    const torusKnot = new THREE.TorusKnotGeometry(
      this.shapeSize,
      this.shapeSize * 0.2
    );
    this.torusKnot = new THREE.Mesh(torusKnot, basicMaterial);
    this.torusKnot.position.y = -this.shapeDistance;
    this.scene.add(this.torusKnot);
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

    this.scene.rotation.y += 0.0005;

    window.requestAnimationFrame(this.render.bind(this));
  }

  setSize() {}
}

new Playground({
  container: document.querySelector("#container"),
});
