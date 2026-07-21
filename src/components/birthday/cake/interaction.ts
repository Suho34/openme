import * as THREE from "three";

export interface InteractionState {
  isDragging: boolean;
  previousMouseX: number;
}

export function setupInteraction(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  rootGroup: THREE.Group,
  candlesGroup: THREE.Group,
  onCandleClick: (index: number) => void
): InteractionState & { cleanup: () => void } {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const state: InteractionState = { isDragging: false, previousMouseX: 0 };

  const handleIntersect = (clientX: number, clientY: number) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(candlesGroup.children, true);
    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && obj.parent !== candlesGroup && !obj.name.startsWith("candle-")) {
        obj = obj.parent;
      }
      if (obj && obj.name.startsWith("candle-")) {
        const index = parseInt(obj.name.split("-")[1]);
        onCandleClick(index);
      }
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    state.isDragging = true;
    state.previousMouseX = e.clientX;
    handleIntersect(e.clientX, e.clientY);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!state.isDragging) return;
    const deltaX = e.clientX - state.previousMouseX;
    rootGroup.rotation.y += deltaX * 0.006;
    state.previousMouseX = e.clientX;
  };

  const onMouseUp = () => { state.isDragging = false; };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 0) return;
    state.isDragging = true;
    state.previousMouseX = e.touches[0].clientX;
    handleIntersect(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!state.isDragging || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - state.previousMouseX;
    rootGroup.rotation.y += deltaX * 0.006;
    state.previousMouseX = e.touches[0].clientX;
  };

  renderer.domElement.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: false } as EventListenerOptions);
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onMouseUp);

  return {
    ...state,
    cleanup: () => {
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    },
  };
}
