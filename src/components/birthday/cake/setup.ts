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
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const aspect = container.clientWidth / container.clientHeight;
  const isPortrait = aspect < 1.0;
  const fov = isPortrait ? 52 : 40;

  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.3, 25);
  if (isPortrait) {
    camera.position.set(3.0, 2.3, 5.6);
  } else {
    camera.position.set(3.8, 1.9, 5.2);
  }
  camera.lookAt(0, 0.65, 0);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  return { scene, camera, renderer, rootGroup };
}

export function addLighting(rootGroup: THREE.Group) {
  // Soft, warm candlelit ambient light
  const ambientLight = new THREE.AmbientLight("#FAF0E6", 0.7);
  rootGroup.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight("#FFE8D6", "#2C1B18", 0.6);
  rootGroup.add(hemisphereLight);

  const keyLight = new THREE.DirectionalLight("#FFF8EE", 2.2);
  keyLight.position.set(5, 7, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.bias = -0.0003;
  keyLight.shadow.normalBias = 0.02;
  rootGroup.add(keyLight);

  // Warm golden rim light mimicking nearby candlelight glow
  const rimLight = new THREE.DirectionalLight("#FFAA66", 1.2);
  rimLight.position.set(-4, 2.5, -3);
  rootGroup.add(rimLight);
}

export function handleResize(
  container: HTMLElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) {
  const aspect = container.clientWidth / container.clientHeight;
  camera.aspect = aspect;
  camera.fov = aspect < 1.0 ? 52 : 40;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
