import * as THREE from "three";

export interface SceneResources {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  rootGroup: THREE.Group;
}

export function createScene(container: HTMLElement): SceneResources {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.3, 25);
  camera.position.set(3.8, 1.9, 5.2);
  camera.lookAt(0, 0.7, 0);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  return { scene, camera, renderer, rootGroup };
}

export function addLighting(rootGroup: THREE.Group) {
  const ambientLight = new THREE.AmbientLight("#fdf5ec", 0.6);
  rootGroup.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight("#ffe8d6", "#3a1f1f", 0.5);
  rootGroup.add(hemisphereLight);

  const keyLight = new THREE.DirectionalLight("#ffffff", 2.8);
  keyLight.position.set(6, 8, 2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.camera.left = -6;
  keyLight.shadow.camera.right = 6;
  keyLight.shadow.camera.top = 6;
  keyLight.shadow.camera.bottom = -2;
  keyLight.shadow.bias = -0.0003;
  keyLight.shadow.normalBias = 0.02;
  rootGroup.add(keyLight);

  const rimLight = new THREE.DirectionalLight("#ffd5c2", 1.4);
  rimLight.position.set(-3, 2, -4);
  rootGroup.add(rimLight);
}

export function handleResize(container: HTMLElement, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
