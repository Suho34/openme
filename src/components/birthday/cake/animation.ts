import * as THREE from "three";
import type { CandleData, ParticleData } from "./builders";
import type { Materials } from "./materials";
import type { InteractionState } from "./interaction";

export function runAnimationLoop(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  rootGroup: THREE.Group,
  candleData: CandleData[],
  particleData: ParticleData[],
  flamesRef: { current: THREE.Group[] },
  materials: Materials,
  interactionState: InteractionState
): () => void {
  const clock = new THREE.Clock();
  let animationId: number;

  function animate() {
    animationId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    const dt = Math.min(clock.getDelta(), 0.1);

    if (!interactionState.isDragging) {
      rootGroup.rotation.y += 0.002;
    }

    // Animate candle flames
    candleData.forEach((data) => {
      if (!flamesRef.current[data.index]?.visible) return;

      const flicker = 1
        + Math.sin(time * data.flickerSpeed + data.phase) * data.flickerAmp
        + Math.sin(time * data.flickerSpeed * 1.7 + data.phase + 1.3) * data.flickerAmp * 0.7
        + Math.sin(time * data.flickerSpeed * 2.3 + data.phase + 2.7) * data.flickerAmp * 0.4;

      const fc = Math.max(0.55, Math.min(1.5, flicker));

      data.flameCone.scale.set(1 + (1 - fc) * 0.4, fc, 1 + (1 - fc) * 0.4);
      data.flameCone.position.y = 0.1 * fc;

      data.flameTip.scale.setScalar(0.8 + fc * 0.4);
      data.flameTip.position.y = 0.18 + fc * 0.04;

      data.flameCore.scale.setScalar(0.7 + fc * 0.5);
      data.flameCore.position.y = 0.07 + fc * 0.03;

      data.pointLight.intensity = data.baseIntensity * fc;
      data.pointLight.position.y = 0.1 + fc * 0.04;

      const wx = Math.sin(time * data.flickerSpeed * 0.7 + data.phase) * 0.006;
      const wz = Math.cos(time * data.flickerSpeed * 0.8 + data.phase) * 0.006;
      data.flameGroup.position.x = wx;
      data.flameGroup.position.z = wz;
    });

    // Animate particles
    particleData.forEach((pData) => {
      const floatY = Math.sin(time * pData.speed + pData.phase) * pData.amplitude;
      pData.mesh.position.y = pData.baseY + floatY;
      pData.mesh.rotation.y += pData.rotSpeed * dt;
      const alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * pData.speed * 1.3 + pData.phase));
      const mat = pData.mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + alpha * 0.9;
      mat.opacity = alpha;
      mat.transparent = true;
    });

    const gf = 1 + Math.sin(time * 2.5) * 0.08 + Math.sin(time * 4.7) * 0.05;
    (materials.flame as THREE.MeshStandardMaterial).emissiveIntensity = 2.5 * gf;
    (materials.flameTip as THREE.MeshStandardMaterial).emissiveIntensity = 1.8 * gf;

    renderer.render(scene, camera);
  }

  animate();

  return () => cancelAnimationFrame(animationId);
}
