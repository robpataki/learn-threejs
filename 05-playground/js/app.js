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
    this.scene.rotation.y = THREE.MathUtils.degToRad(300);

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      10,
      1000
    );
    this.camera.position.z = 300;
    this.camera.position.y = 100;

    this.camera.fov = 2 * Math.atan(this.height / 2 / 500) * (180 / Math.PI);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.intersectingObject = null;
    this.activeObject = null;

    this.basicMaterialOptions = {
      color: "#ff0000",
      wireframe: true,
    };
    this.basicMaterial = new THREE.MeshBasicMaterial(this.basicMaterialOptions);
    this.doubleSidedMaterial = new THREE.MeshBasicMaterial({
      ...this.basicMaterialOptions,
      side: THREE.DoubleSide,
    });

    this.activeMaterialOptions = {
      color: "#000000",
      wireframe: true,
    };

    this.addHelpers();
    this.interactiveObjects = [];
    this.pointer.set(-100000, 100000);
    this.addObjects();
    this.handleResize();
    this.setupEvents();
    this.render();
  }

  addHelpers() {
    const axesHelper = new THREE.AxesHelper(100);
    this.scene.add(axesHelper);

    const lowerPlaneGeometry = new THREE.PlaneGeometry(
      this.shapeSize * 500,
      this.shapeSize * 500,
      10,
      10
    );
    const lowerPlaneMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: "#ff0000",
      transparent: true,
      opacity: 0.1,
    });
    const lowerPlane = new THREE.Mesh(lowerPlaneGeometry, lowerPlaneMaterial);
    lowerPlane.rotation.x = THREE.MathUtils.degToRad(90);
    lowerPlane.position.y = -400;
    this.scene.add(lowerPlane);
  }

  addObjects() {
    // Sphere
    const sphereGeometry = new THREE.SphereGeometry(this.shapeSize, 10, 10);
    this.sphere = new THREE.Mesh(sphereGeometry, this.basicMaterial.clone());
    this.sphere.name = "sphere";
    this.scene.add(this.sphere);
    this.interactiveObjects.push(this.sphere);

    // Capsule
    const capsuleGeometry = new THREE.CapsuleGeometry(
      this.shapeSize,
      this.shapeSize,
      4,
      8
    );
    this.capsule = new THREE.Mesh(capsuleGeometry, this.basicMaterial.clone());
    this.capsule.position.x = -this.shapeDistance;
    this.capsule.name = "capsule";
    this.scene.add(this.capsule);
    this.interactiveObjects.push(this.capsule);

    // Torus
    const torusGeometry = new THREE.TorusGeometry(this.shapeSize, 5, 10, 20);
    this.torus = new THREE.Mesh(torusGeometry, this.basicMaterial.clone());
    this.torus.position.x = this.shapeDistance;
    this.torus.name = "torus";
    this.scene.add(this.torus);
    this.interactiveObjects.push(this.torus);

    // Cone
    const coneGeometry = new THREE.ConeGeometry(
      this.shapeSize,
      this.shapeSize * 3,
      10,
      10
    );
    this.cone = new THREE.Mesh(coneGeometry, this.basicMaterial.clone());
    this.cone.position.z = -this.shapeDistance;
    this.cone.name = "cone";
    this.scene.add(this.cone);
    this.interactiveObjects.push(this.cone);

    // Circle
    const circleGeometry = new THREE.CircleGeometry(this.shapeSize, 10);
    this.circle = new THREE.Mesh(
      circleGeometry,
      this.doubleSidedMaterial.clone()
    );
    this.circle.position.x = -this.shapeDistance;
    this.circle.position.z = -this.shapeDistance;
    this.circle.name = "circle";
    this.scene.add(this.circle);
    this.interactiveObjects.push(this.circle);

    // Cylinder
    const cylinderGeometry = new THREE.CylinderGeometry(
      this.shapeSize,
      this.shapeSize,
      this.shapeSize * 3,
      10,
      10
    );
    this.cylinder = new THREE.Mesh(
      cylinderGeometry,
      this.basicMaterial.clone()
    );
    this.cylinder.position.x = this.shapeDistance;
    this.cylinder.position.z = -this.shapeDistance;
    this.cylinder.name = "cylinder";
    this.scene.add(this.cylinder);
    this.interactiveObjects.push(this.cylinder);

    // Plane
    const planeGeometry = new THREE.PlaneGeometry(
      this.shapeSize,
      this.shapeSize,
      1,
      1
    );
    this.plane = new THREE.Mesh(
      planeGeometry,
      this.doubleSidedMaterial.clone()
    );
    this.plane.position.x = -this.shapeDistance;
    this.plane.position.z = this.shapeDistance;
    this.plane.name = "plane";
    this.scene.add(this.plane);
    this.interactiveObjects.push(this.plane);

    // Dodecahedron
    const dodecahedronGeometry = new THREE.DodecahedronGeometry(this.shapeSize);
    this.dodecahedron = new THREE.Mesh(
      dodecahedronGeometry,
      this.basicMaterial.clone()
    );
    this.dodecahedron.position.z = this.shapeDistance;
    this.dodecahedron.name = "dodecahedron";
    this.scene.add(this.dodecahedron);
    this.interactiveObjects.push(this.dodecahedron);

    // Icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(this.shapeSize);
    this.icosahedron = new THREE.Mesh(
      icosahedronGeometry,
      this.basicMaterial.clone()
    );
    this.icosahedron.position.z = this.shapeDistance;
    this.icosahedron.position.x = this.shapeDistance;
    this.icosahedron.name = "icosahedron";
    this.scene.add(this.icosahedron);
    this.interactiveObjects.push(this.icosahedron);

    // Octahedron
    const octahedronGeometry = new THREE.OctahedronGeometry(this.shapeSize);
    this.octahedron = new THREE.Mesh(
      octahedronGeometry,
      this.basicMaterial.clone()
    );
    this.octahedron.position.y = this.shapeDistance;
    this.octahedron.name = "octahedron";
    this.scene.add(this.octahedron);
    this.interactiveObjects.push(this.octahedron);

    // Ring
    const ringGeometry = new THREE.RingGeometry(this.shapeSize);
    this.ring = new THREE.Mesh(ringGeometry, this.doubleSidedMaterial.clone());
    this.ring.position.y = this.shapeDistance;
    this.ring.position.x = this.shapeDistance;
    this.ring.name = "ring";
    this.scene.add(this.ring);
    this.interactiveObjects.push(this.ring);

    // Tetrahedron
    const tetrahedronGeometry = new THREE.TetrahedronGeometry(this.shapeSize);
    this.tetrahedron = new THREE.Mesh(
      tetrahedronGeometry,
      this.basicMaterial.clone()
    );
    this.tetrahedron.position.y = this.shapeDistance;
    this.tetrahedron.position.x = -this.shapeDistance;
    this.tetrahedron.name = "tetrahedron";
    this.scene.add(this.tetrahedron);
    this.interactiveObjects.push(this.tetrahedron);

    // TorusKnot
    const torusKnot = new THREE.TorusKnotGeometry(
      this.shapeSize,
      this.shapeSize * 0.2
    );
    this.torusKnot = new THREE.Mesh(
      torusKnot,
      new THREE.MeshBasicMaterial(this.basicMaterialOptions)
    );
    this.torusKnot.position.y = -this.shapeDistance;
    this.torusKnot.name = "torusKnot";
    this.scene.add(this.torusKnot);
    this.interactiveObjects.push(this.torusKnot);
  }

  setupEvents() {
    window.addEventListener("resize", this.handleResize.bind(this));
    window.addEventListener("pointermove", this.handlePointerMove.bind(this));
  }

  render() {
    this.time += 0.005;
    this.renderer.render(this.scene, this.camera);

    this.scene.rotation.y += 0.0005;

    // changing objects based on pointer interaction
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.interactiveObjects,
      false
    );
    if (intersects.length > 0) {
      if (
        this.activeObject !== null &&
        this.activeObject.name !== intersects[0].object.name
      ) {
        this.activeObject.material.color.set(this.basicMaterialOptions.color);
      }

      this.activeObject = intersects[0].object;
      this.activeObject.material.color.set(this.activeMaterialOptions.color);
    } else {
      if (this.activeObject !== null) {
        this.activeObject.material.color.set(this.basicMaterialOptions.color);
      }
      this.activeObject = null;
    }

    this.interactiveObjects.map((interactiveObject) => {
      interactiveObject.position.y +=
        0.1 * Math.sin(this.time * 10 + interactiveObject.name.length);
    });

    window.requestAnimationFrame(this.render.bind(this));
  }

  handleResize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  handlePointerMove(event) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    this.pointer.x = (event.clientX / this.width) * 2 - 1;
    this.pointer.y = -(event.clientY / this.height) * 2 + 1;
  }
}

new Playground({
  container: document.querySelector("#container"),
});
