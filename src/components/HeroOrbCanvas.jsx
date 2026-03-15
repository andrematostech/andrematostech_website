import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededNoise(index, seed) {
  const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function createSpriteTexture() {
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    0,
    size * 0.5,
    size * 0.5,
    size * 0.5
  );

  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(170,245,255,0.95)");
  gradient.addColorStop(0.7, "rgba(76,180,255,0.28)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function buildHaloPositions(count, minRadius, maxRadius, seedOffset) {
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const settles = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const theta = seededNoise(i, 1 + seedOffset) * Math.PI * 2;
    const phi = Math.acos(2 * seededNoise(i, 2 + seedOffset) - 1);
    const radius = minRadius + seededNoise(i, 3 + seedOffset) * (maxRadius - minRadius);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.cos(phi);
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    phases[i] = seededNoise(i, 4 + seedOffset) * Math.PI * 2;
    settles[i] = 0.035 + seededNoise(i, 5 + seedOffset) * 0.05;
  }

  return { positions, phases, settles };
}

function buildOrbitalParticlePositions(count, minRadius, maxRadius, seedOffset) {
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const settles = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const theta = seededNoise(i, 21 + seedOffset) * Math.PI * 2;
    const phi = Math.acos(2 * seededNoise(i, 22 + seedOffset) - 1);
    const radius = minRadius + seededNoise(i, 23 + seedOffset) * (maxRadius - minRadius);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.cos(phi);
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    phases[i] = seededNoise(i, 23 + seedOffset) * Math.PI * 2;
    settles[i] = 0.028 + seededNoise(i, 24 + seedOffset) * 0.03;
  }

  return { positions, phases, settles };
}

function sampleParticleData(data, step) {
  const count = Math.ceil(data.phases.length / step);
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const settles = new Float32Array(count);

  let cursor = 0;
  for (let i = 0; i < data.phases.length; i += step) {
    const sourceIndex = i * 3;
    const targetIndex = cursor * 3;
    positions[targetIndex] = data.positions[sourceIndex];
    positions[targetIndex + 1] = data.positions[sourceIndex + 1];
    positions[targetIndex + 2] = data.positions[sourceIndex + 2];
    phases[cursor] = data.phases[i];
    settles[cursor] = data.settles[i];
    cursor += 1;
  }

  return { positions, phases, settles };
}

function buildClosestConnectionPairs(data, ratio, seed) {
  const total = data.positions.length / 3;
  const targetCount = Math.max(2, Math.floor(total * ratio));
  const candidateIndices = Array.from({ length: total }, (_, index) => index);

  candidateIndices.sort(
    (a, b) => seededNoise(a, seed) - seededNoise(b, seed)
  );

  const selected = candidateIndices.slice(0, targetCount);
  const selectedSet = new Set(selected);
  const usedPairs = new Set();
  const pairs = [];

  selected.forEach((source) => {
    const sx = data.positions[source * 3];
    const sy = data.positions[source * 3 + 1];
    const sz = data.positions[source * 3 + 2];
    let closest = -1;
    let closestDistance = Number.POSITIVE_INFINITY;

    selectedSet.forEach((target) => {
      if (target === source) return;
      const key =
        source < target ? `${source}:${target}` : `${target}:${source}`;
      if (usedPairs.has(key)) return;

      const tx = data.positions[target * 3];
      const ty = data.positions[target * 3 + 1];
      const tz = data.positions[target * 3 + 2];
      const dx = sx - tx;
      const dy = sy - ty;
      const dz = sz - tz;
      const distance = dx * dx + dy * dy + dz * dz;

      if (distance < closestDistance) {
        closestDistance = distance;
        closest = target;
      }
    });

    if (closest !== -1) {
      const key =
        source < closest ? `${source}:${closest}` : `${closest}:${source}`;
      usedPairs.add(key);
      pairs.push([source, closest]);
    }
  });

  return pairs;
}

function buildConnectionItems(data, ratio, seed, startTime, maxItems) {
  const pairs = buildClosestConnectionPairs(data, ratio, seed)
    .map((pair, index) => ({
      pair,
      noise: seededNoise(pair[0] + pair[1] + index, seed + 29)
    }))
    .sort((a, b) => a.noise - b.noise)
    .map(({ pair }) => pair)
    .slice(0, maxItems);

  return pairs.map(([a, b], index) => ({
    a,
    b,
    startAt: startTime + seededNoise(index + a + b, seed) * 0.18,
    duration: 1.28 + seededNoise(index + a + b, seed + 17) * 0.4
  }));
}

const wrapperGlows = [
  {
    className:
      "pointer-events-none absolute left-[52%] top-[45%] h-[68%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[52px] sm:top-[44%] sm:h-[66%] sm:w-[84%] sm:blur-[48px] lg:top-[43%] lg:h-[63%] lg:w-[63%] lg:blur-[42px]",
    background:
      "radial-gradient(circle at center,rgba(132,188,255,0.3) 0%,rgba(132,188,255,0.22) 18%,rgba(102,164,255,0.14) 40%,rgba(52,100,212,0.06) 62%,rgba(10,15,32,0) 84%)"
  },
  {
    className:
      "pointer-events-none absolute left-[49%] top-[58%] h-[24%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[34px] sm:top-[58%] sm:h-[22%] sm:w-[38%] sm:blur-[32px] lg:top-[57%] lg:h-[24%] lg:w-[24%] lg:blur-[28px]",
    background:
      "radial-gradient(circle at center,rgba(52,100,212,0.34) 0%,rgba(102,164,255,0.22) 28%,rgba(102,164,255,0.1) 52%,rgba(10,15,32,0) 80%)"
  },
  {
    className:
      "pointer-events-none absolute left-1/2 top-[82%] h-[2.8%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[28px] sm:top-[84%] sm:h-[4%] sm:w-[68%] sm:blur-[30px] lg:top-[87%] lg:h-[3.8%] lg:w-[40%] lg:blur-[28px]",
    background:
      "radial-gradient(ellipse at center,rgba(132,188,255,0.92) 0%,rgba(132,188,255,0.7) 20%,rgba(102,164,255,0.44) 40%,rgba(52,100,212,0.16) 60%,rgba(10,15,32,0) 82%)"
  }
];

function OrbScene({ pointer, interaction, reducedMotion, compact }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const shellRef = useRef(null);
  const shellParticlesRef = useRef(null);
  const ambientParticlesRef = useRef(null);
  const orbitalParticlesARef = useRef(null);
  const orbitalParticlesBRef = useRef(null);
  const orbitalParticlesCRef = useRef(null);
  const orbitalParticlesLargeRef = useRef(null);
  const connectionLinesRef = useRef(null);
  const connectionMaterialRef = useRef(null);
  const impulseRef = useRef({ strength: 0, x: 0, y: 0, z: 0 });
  const connectionStateRef = useRef({
    items: [],
    seed: 0,
    nextRefreshAt: 0
  });
  const pointerVectorRef = useRef(new THREE.Vector2(0, 0));
  const particleTickRef = useRef(0);
  const lineTickRef = useRef(0);
  const clickSeedRef = useRef(0);
  const autonomousTiltRef = useRef({
    x: 0,
    y: 0,
    targetX: 0.045,
    targetY: -0.06,
    nextShiftAt: 0
  });

  const shellParticleCount = compact ? 6 : 11;
  const ambientParticleCount = compact ? 4 : 7;
  const orbitalParticleCount = compact ? 34 : 52;

  const shellParticleData = useMemo(
    () => buildHaloPositions(shellParticleCount, 1.24, 1.5, 0),
    [shellParticleCount]
  );
  const ambientParticleData = useMemo(
    () => buildHaloPositions(ambientParticleCount, 1.78, 2.52, 9),
    [ambientParticleCount]
  );
  const orbitalParticleDataA = useMemo(
    () => buildOrbitalParticlePositions(orbitalParticleCount, 1.36, 1.56, 31),
    [orbitalParticleCount]
  );
  const orbitalParticleDataB = useMemo(
    () => buildOrbitalParticlePositions(orbitalParticleCount, 1.44, 1.68, 37),
    [orbitalParticleCount]
  );
  const orbitalParticleDataC = useMemo(
    () => buildOrbitalParticlePositions(orbitalParticleCount, 1.54, 1.82, 41),
    [orbitalParticleCount]
  );
  const orbitalParticleLargeData = useMemo(
    () => sampleParticleData(orbitalParticleDataC, 6),
    [orbitalParticleDataC]
  );
  const particleSprite = useMemo(() => createSpriteTexture(), []);
  const connectionPositions = useMemo(
    () => new Float32Array(Math.max(1, Math.floor(orbitalParticleCount * 0.24)) * 6),
    [orbitalParticleCount]
  );

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const core = coreRef.current;
    const shell = shellRef.current;
    const shellParticles = shellParticlesRef.current;
    const ambientParticles = ambientParticlesRef.current;
    const orbitalParticlesA = orbitalParticlesARef.current;
    const orbitalParticlesB = orbitalParticlesBRef.current;
    const orbitalParticlesC = orbitalParticlesCRef.current;
    const orbitalParticlesLarge = orbitalParticlesLargeRef.current;
    const connectionLines = connectionLinesRef.current;
    const connectionMaterial = connectionMaterialRef.current;

    if (
      !group ||
      !core ||
      !shell ||
      !shellParticles ||
      !ambientParticles ||
      !orbitalParticlesA ||
      !orbitalParticlesB ||
      !orbitalParticlesC ||
      !orbitalParticlesLarge ||
      !connectionLines ||
      !connectionMaterial
    ) {
      return;
    }

    const t = clock.getElapsedTime();
    const motion = reducedMotion ? 0.3 : 1;
    const externalImpulse = interaction?.current ?? null;
    const impulse = impulseRef.current;
    const connectionState = connectionStateRef.current;
    const autonomousTilt = autonomousTiltRef.current;
    const particleStep = compact ? 1 / 22 : 1 / 28;
    const lineStep = compact ? 1 / 16 : 1 / 22;

    if (
      externalImpulse &&
      (
        externalImpulse.strength > impulse.strength ||
        externalImpulse.x !== impulse.x ||
        externalImpulse.y !== impulse.y ||
        externalImpulse.z !== impulse.z
      )
    ) {
      impulse.strength = externalImpulse.strength;
      impulse.x = externalImpulse.x;
      impulse.y = externalImpulse.y;
      impulse.z = externalImpulse.z;
    }

    if (t >= connectionState.nextRefreshAt || !connectionState.items.length) {
      clickSeedRef.current += 1;
      connectionState.seed = clickSeedRef.current * 577 + t * 113;
      const connectionBurstCount = compact ? 1 : 2;
      connectionState.items = [
        ...connectionState.items.filter((item) => t <= item.startAt + item.duration),
        ...buildConnectionItems(orbitalParticleDataC, 0.06, connectionState.seed, t, connectionBurstCount)
      ].slice(-(compact ? 2 : 3));
      connectionState.nextRefreshAt = t + 0.88 + seededNoise(clickSeedRef.current, 97) * 0.26;
    }

    const pulse = 1 + Math.sin(t * 1.08) * 0.032 * motion;
    const shellPulse = 1 + Math.sin(t * 0.92 + 0.8) * 0.022 * motion;
    const impulseStrength = impulse.strength;
    const baseSwayX = Math.sin(t * 0.32) * 0.06 + Math.cos(t * 0.18 + 0.6) * 0.03;
    const baseSwayY = Math.cos(t * 0.28 + 0.3) * 0.07 + Math.sin(t * 0.16 + 1.1) * 0.028;
    const coreDriftX =
      Math.sin(t * 0.42) * 0.05 +
      Math.sin(t * 0.88 + 1.3) * 0.024 +
      Math.cos(t * 0.24 + 0.7) * 0.018;
    const coreDriftY =
      Math.cos(t * 0.38 + 0.5) * 0.056 +
      Math.sin(t * 0.74 + 2.1) * 0.026 +
      Math.sin(t * 0.21) * 0.018;
    const coreDriftZ = Math.sin(t * 0.54 + 1.1) * 0.018;

    if (!reducedMotion && t >= autonomousTilt.nextShiftAt) {
      autonomousTilt.targetX = (seededNoise(Math.floor(t * 10), 61) - 0.5) * 0.2;
      autonomousTilt.targetY = (seededNoise(Math.floor(t * 10), 67) - 0.5) * 0.26;
      autonomousTilt.nextShiftAt = t + 1.8 + seededNoise(Math.floor(t * 10), 73) * 2.4;
    }

    autonomousTilt.x = THREE.MathUtils.lerp(autonomousTilt.x, autonomousTilt.targetX, 0.018);
    autonomousTilt.y = THREE.MathUtils.lerp(autonomousTilt.y, autonomousTilt.targetY, 0.018);

    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      pointer.current.x * 0.22 + autonomousTilt.y + baseSwayY,
      0.032
    );
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      pointer.current.y * -0.14 + autonomousTilt.x + baseSwayX,
      0.032
    );
    group.rotation.z += 0.00095 * motion;

    core.scale.setScalar(pulse);
    shell.scale.setScalar(shellPulse);
    core.rotation.x = coreDriftX + autonomousTilt.x * 0.18;
    core.rotation.y = coreDriftY + autonomousTilt.y * 0.18;
    core.rotation.z = coreDriftZ;

    orbitalParticlesA.rotation.x = 0.82 + Math.sin(t * 0.18) * 0.05;
    orbitalParticlesA.rotation.y += 0.0012 * motion;
    orbitalParticlesB.rotation.y = 0.52 + Math.sin(t * 0.16) * 0.07;
    orbitalParticlesB.rotation.z += 0.0009 * motion;
    orbitalParticlesC.rotation.z = 1.12 + Math.sin(t * 0.2) * 0.04;
    orbitalParticlesC.rotation.x += 0.0008 * motion;
    orbitalParticlesLarge.rotation.z = orbitalParticlesC.rotation.z;
    orbitalParticlesLarge.rotation.x = orbitalParticlesC.rotation.x;
    orbitalParticlesLarge.rotation.y += 0.0006 * motion;

    core.material.uniforms.uTime.value = t;
    pointerVectorRef.current.set(pointer.current.x, pointer.current.y);
    core.material.uniforms.uPointer.value.lerp(pointerVectorRef.current, 0.08);
    core.material.uniforms.uImpulse.value = 0;
    core.material.uniforms.uImpulseDir.value.set(0, 0, 0);

    shell.material.uniforms.uTime.value = t;
    shell.material.uniforms.uImpulse.value = 0;
    shell.material.uniforms.uImpulseDir.value.set(0, 0, 0);

    shellParticles.material.opacity = 0.58 + Math.sin(t * 1.4) * 0.05 * motion;
    ambientParticles.material.opacity = 0.24 + Math.sin(t * 1.0) * 0.04 * motion;

    particleTickRef.current += delta;
    lineTickRef.current += delta;
    const shouldUpdateParticles = reducedMotion || particleTickRef.current >= particleStep;
    const shouldUpdateLines = reducedMotion || lineTickRef.current >= lineStep;

    if (shouldUpdateParticles) {
      particleTickRef.current = 0;
    }

    if (shouldUpdateLines) {
      lineTickRef.current = 0;
    }

    const shellAttribute = shellParticles.geometry?.attributes?.position;
    if (shellAttribute && shouldUpdateParticles) {
      for (let i = 0; i < shellParticleCount; i += 1) {
        const i3 = i * 3;
        const bx = shellParticleData.positions[i3];
        const by = shellParticleData.positions[i3 + 1];
        const bz = shellParticleData.positions[i3 + 2];
        const phase = shellParticleData.phases[i];
        const settle = shellParticleData.settles[i];
        const baseLength = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
        const nx = bx / baseLength;
        const ny = by / baseLength;
        const nz = bz / baseLength;
        const cellWave = Math.sin(t * 1.55 + phase) * 0.045 * motion;
        const alignment = nx * impulse.x + ny * impulse.y + nz * impulse.z;
        const response = THREE.MathUtils.smoothstep(alignment, 0.3, 0.94) * impulseStrength * 0.055;

        shellAttribute.array[i3] = THREE.MathUtils.lerp(
          shellAttribute.array[i3],
          bx + nx * (cellWave + response),
          settle
        );
        shellAttribute.array[i3 + 1] = THREE.MathUtils.lerp(
          shellAttribute.array[i3 + 1],
          by + ny * (cellWave + response),
          settle
        );
        shellAttribute.array[i3 + 2] = THREE.MathUtils.lerp(
          shellAttribute.array[i3 + 2],
          bz + nz * (cellWave + response),
          settle
        );
      }

      shellAttribute.needsUpdate = true;
    }

    const ambientAttribute = ambientParticles.geometry?.attributes?.position;
    if (ambientAttribute && shouldUpdateParticles) {
      for (let i = 0; i < ambientParticleCount; i += 1) {
        const i3 = i * 3;
        const bx = ambientParticleData.positions[i3];
        const by = ambientParticleData.positions[i3 + 1];
        const bz = ambientParticleData.positions[i3 + 2];
        const phase = ambientParticleData.phases[i];
        const driftX = Math.sin(t * 0.25 + phase) * 0.08;
        const driftY = Math.cos(t * 0.22 + phase * 1.2) * 0.08;
        const driftZ = Math.sin(t * 0.19 + phase * 0.7) * 0.08;
        const settle = ambientParticleData.settles[i] * 0.5;

        ambientAttribute.array[i3] = THREE.MathUtils.lerp(ambientAttribute.array[i3], bx + driftX, settle);
        ambientAttribute.array[i3 + 1] = THREE.MathUtils.lerp(ambientAttribute.array[i3 + 1], by + driftY, settle);
        ambientAttribute.array[i3 + 2] = THREE.MathUtils.lerp(ambientAttribute.array[i3 + 2], bz + driftZ, settle);
      }

      ambientAttribute.needsUpdate = true;
    }

    const orbitalSets = [
      [orbitalParticlesA, orbitalParticleDataA, 0.03, 0.95, 0.08, 1.2],
      [orbitalParticlesB, orbitalParticleDataB, 0.035, 0.78, 0.11, 1.2],
      [orbitalParticlesC, orbitalParticleDataC, 0.028, 1.08, 0.14, 1.2],
      [orbitalParticlesLarge, orbitalParticleLargeData, 0.024, 1.02, 0.17, 1.2]
    ];

    if (shouldUpdateParticles) {
      orbitalSets.forEach(([points, data, driftScale, speedScale, impulseScale, settleBoost]) => {
        const positionAttribute = points.geometry?.attributes?.position;

        if (!positionAttribute) return;

        for (let i = 0; i < data.phases.length; i += 1) {
          const i3 = i * 3;
          const bx = data.positions[i3];
          const by = data.positions[i3 + 1];
          const bz = data.positions[i3 + 2];
          const phase = data.phases[i];
          const settle = data.settles[i] * settleBoost;
          const drift = Math.sin(t * speedScale + phase) * driftScale * motion;
          const depthDrift = Math.cos(t * (speedScale * 0.8) + phase) * driftScale * 0.75 * motion;
          const length = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
          const nx = bx / length;
          const ny = by / length;
          const nz = bz / length;
          const alignment = nx * impulse.x + ny * impulse.y + nz * impulse.z;
          const impulseWave = Math.sin(t * 3.8 + phase * 0.55) * 0.5 + 0.5;
          const disturbance =
            THREE.MathUtils.smoothstep(alignment, 0.18, 0.92) *
            impulseStrength *
            impulseScale *
            impulseWave;

          positionAttribute.array[i3] = THREE.MathUtils.lerp(
            positionAttribute.array[i3],
            bx + nx * (drift + disturbance),
            settle
          );
          positionAttribute.array[i3 + 1] = THREE.MathUtils.lerp(
            positionAttribute.array[i3 + 1],
            by + ny * (drift + disturbance),
            settle
          );
          positionAttribute.array[i3 + 2] = THREE.MathUtils.lerp(
            positionAttribute.array[i3 + 2],
            bz + nz * (drift + disturbance) + depthDrift + disturbance * 0.18,
            settle
          );
        }

        positionAttribute.needsUpdate = true;
      });
    }

    const connectionAttribute = connectionLines.geometry?.attributes?.position;
    if (connectionAttribute) {
      if (connectionState.items.length && shouldUpdateLines) {
        let cursor = 0;
        const sourcePositions = orbitalParticlesC.geometry?.attributes?.position?.array;

        if (sourcePositions) {
          let activeCount = 0;

          connectionState.items = connectionState.items.filter((item) => t <= item.startAt + item.duration);

          connectionState.items.forEach((item) => {
            const progress = THREE.MathUtils.clamp(
              (t - item.startAt) / Math.max(0.001, item.duration),
              0,
              1
            );

            if (progress <= 0 || progress >= 1) return;

            const aIndex = item.a * 3;
            const bIndex = item.b * 3;
            const ax = sourcePositions[aIndex];
            const ay = sourcePositions[aIndex + 1];
            const az = sourcePositions[aIndex + 2];
            const bx = sourcePositions[bIndex];
            const by = sourcePositions[bIndex + 1];
            const bz = sourcePositions[bIndex + 2];
            const travelProgress = THREE.MathUtils.smootherstep(progress, 0.04, 0.62);
            const headProgress = travelProgress * 0.92;
            const tailProgress = THREE.MathUtils.smootherstep(progress, 0.22, 0.5) * 0.8;

            if (headProgress - tailProgress <= 0.008) return;

            connectionAttribute.array[cursor] = THREE.MathUtils.lerp(ax, bx, tailProgress);
            connectionAttribute.array[cursor + 1] = THREE.MathUtils.lerp(ay, by, tailProgress);
            connectionAttribute.array[cursor + 2] = THREE.MathUtils.lerp(az, bz, tailProgress);
            connectionAttribute.array[cursor + 3] = THREE.MathUtils.lerp(ax, bx, headProgress);
            connectionAttribute.array[cursor + 4] = THREE.MathUtils.lerp(ay, by, headProgress);
            connectionAttribute.array[cursor + 5] = THREE.MathUtils.lerp(az, bz, headProgress);
            cursor += 6;
            activeCount += 1;
          });

          connectionLines.geometry.setDrawRange(0, cursor / 3);
          connectionAttribute.needsUpdate = true;
          connectionMaterial.opacity = activeCount ? 0.11 : 0;
        }
      } else {
        connectionLines.geometry.setDrawRange(0, 0);
        connectionMaterial.opacity = 0;
      }
    }

    impulse.strength = Math.max(0, impulse.strength * 0.95 - 0.005);
  });

  return (
    <>
      <ambientLight intensity={0.16} />
      <directionalLight position={[2.5, 2.2, 3.5]} intensity={0.92} color="#89d7ff" />
      <pointLight position={[-2.4, 1.8, 2.2]} intensity={1.08} color="#4ea9ff" />
      <pointLight position={[0, -1.8, 2.6]} intensity={0.9} color="#255ff2" />
      <pointLight position={[0.4, 0.2, 1.2]} intensity={0.52} color="#b7e5ff" />

      <group ref={groupRef} scale={compact ? 0.55 : 0.61}>
        <mesh ref={shellRef} renderOrder={1}>
          <icosahedronGeometry args={[1.255, compact ? 18 : 24]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            uniforms={{
              uTime: { value: 0 },
              uImpulse: { value: 0 },
              uImpulseDir: { value: new THREE.Vector3(0, 0, 0) }
            }}
            vertexShader={`
              uniform float uTime;
              uniform float uImpulse;
              uniform vec3 uImpulseDir;
              varying vec3 vNormalW;
              varying vec3 vWorldPosition;
              varying float vWave;
              varying float vRidge;
              varying float vBlob;

              float waveField(vec3 p) {
                float waveA = sin(p.y * 7.4 + uTime * 1.1);
                float waveB = sin((p.x + p.z) * 6.4 - uTime * 0.9);
                float waveC = sin((p.x - p.y + p.z) * 9.4 + uTime * 1.4);
                return waveA * 0.36 + waveB * 0.38 + waveC * 0.26;
              }

              void main() {
                vec3 n = normalize(position);
                vec3 displaced = position;
                float field = waveField(n);
                float ridge = 0.5 + 0.5 * sin((position.x - position.y + position.z) * 4.8 + uTime * 0.48);
                float membrane = 0.5 + 0.5 * sin((position.x * 3.4 + position.y * 2.9 - position.z * 3.1) - uTime * 0.42);
                float ripple = sin(length(position.xy) * 14.0 - uTime * 1.8) * 0.01;
                float alignment = max(dot(n, normalize(uImpulseDir + vec3(0.0001))), 0.0);
                float blobMask = smoothstep(0.02, 0.82, alignment);
                blobMask = pow(blobMask, 1.35);
                float blobWave = sin(alignment * 5.2 - uTime * 1.1) * 0.5 + 0.5;
                float blobShock = blobMask * mix(0.48, 1.0, blobWave);
                float displacement = field * 0.052 + ridge * 0.026 + membrane * 0.022 + ripple + blobShock * uImpulse * 0.036;
                displaced += normal * displacement;
                vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
                vWorldPosition = worldPosition.xyz;
                vNormalW = normalize(mat3(modelMatrix) * normal);
                vWave = field;
                vRidge = ridge;
                vBlob = blobShock;
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
              }
            `}
            fragmentShader={`
              uniform float uTime;
              varying vec3 vNormalW;
              varying vec3 vWorldPosition;
              varying float vWave;
              varying float vRidge;
              varying float vBlob;

              void main() {
                vec3 N = normalize(vNormalW);
                vec3 V = normalize(cameraPosition - vWorldPosition);
                float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.2);
                float pulse = 0.5 + 0.5 * sin(vWave * 10.0 + uTime * 1.35);
                float membraneFill = smoothstep(0.22, 0.9, vRidge);
                vec3 base = vec3(0.022, 0.12, 0.28);
                vec3 steel = vec3(0.28, 0.46, 0.72) * membraneFill * 0.31;
                vec3 glow = vec3(0.2, 0.68, 1.0) * (0.26 + fresnel * 0.58);
                vec3 tech = vec3(0.78, 0.9, 1.0) * pow(pulse, 2.2) * 0.045;
                vec3 fill = vec3(0.12, 0.22, 0.42) * membraneFill * 0.2;
                vec3 blobLight = vec3(0.56, 0.78, 1.0) * vBlob * 0.12;
                vec3 color = base + glow + tech + fill + blobLight;
                color += steel;
                float alpha = 0.094 + fresnel * 0.124 + membraneFill * 0.066 + pulse * 0.013 + vBlob * 0.016;
                gl_FragColor = vec4(color, alpha);
              }
            `}
          />
        </mesh>

        <mesh ref={coreRef} renderOrder={2}>
          <icosahedronGeometry args={[1.1, compact ? 20 : 28]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            uniforms={{
              uTime: { value: 0 },
              uPointer: { value: new THREE.Vector2(0, 0) },
              uImpulse: { value: 0 },
              uImpulseDir: { value: new THREE.Vector3(0, 0, 0) }
            }}
            vertexShader={`
              uniform float uTime;
              uniform vec2 uPointer;
              uniform float uImpulse;
              uniform vec3 uImpulseDir;
              varying vec3 vNormalW;
              varying vec3 vWorldPosition;
              varying float vCell;
              varying float vPulse;
              varying float vBand;

              float swellField(vec3 p) {
                float swellA = sin((p.x * 1.35 + p.y * 0.72) + uTime * 0.11);
                float swellB = sin((p.z * 1.7 - p.x * 0.55) - uTime * 0.09);
                float swellC = sin(length(p.xy) * 2.1 + uTime * 0.08);
                return swellA * 0.4 + swellB * 0.32 + swellC * 0.28;
              }

              void main() {
                vec3 n = normalize(position);
                float field = swellField(n);
                float cell = sin((n.x * 1.7 + n.y * 1.4 - n.z * 1.5) + field * 0.9 + uTime * 0.11);
                float band = 0.5 + 0.5 * sin((n.y * 1.8 - n.x * 0.9 + n.z * 0.7) + field * 0.95 - uTime * 0.08);
                float tide = sin(length(n.xy) * 1.9 + field * 0.8 + uTime * 0.09);
                float pointerLift = dot(n.xy, uPointer) * 0.022;
                float impulseMask = max(dot(n, normalize(uImpulseDir + vec3(0.0001))), 0.0);
                float blobMask = smoothstep(0.02, 0.8, impulseMask);
                blobMask = pow(blobMask, 1.45);
                float blobWave = sin(impulseMask * 5.0 - uTime * 0.95) * 0.5 + 0.5;
                float blobShock = blobMask * mix(0.44, 1.0, blobWave);
                float displacement = field * 0.009 + cell * 0.002 + tide * 0.003 + band * 0.003 + pointerLift + blobShock * uImpulse * 0.05;
                vec3 displaced = position + normal * displacement;
                vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
                vWorldPosition = worldPosition.xyz;
                vNormalW = normalize(mat3(modelMatrix) * normal);
                vCell = cell;
                vPulse = blobShock;
                vBand = band;
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
              }
            `}
            fragmentShader={`
              uniform float uTime;
              uniform float uImpulse;
              varying vec3 vNormalW;
              varying vec3 vWorldPosition;
              varying float vCell;
              varying float vPulse;
              varying float vBand;

              void main() {
                vec3 N = normalize(vNormalW);
                vec3 V = normalize(cameraPosition - vWorldPosition);
                float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.2);
                float lambert = max(dot(N, normalize(vec3(0.38, 0.44, 1.0))), 0.0);
                float pattern = smoothstep(0.28, 0.76, 0.5 + 0.5 * vCell);
                float bandMask = smoothstep(0.28, 0.86, vBand);
                float innerPulse = 0.5 + 0.5 * sin(uTime * 0.42 + vCell * 1.1);
                vec2 flowUv = vWorldPosition.xy * 0.9;
                float drift = 0.5 + 0.5 * sin(flowUv.x * 2.8 + flowUv.y * 2.2 + uTime * 0.34);
                float driftTwo = 0.5 + 0.5 * sin(flowUv.y * 3.1 - flowUv.x * 1.7 - uTime * 0.28);
                float radial = length(vWorldPosition.xy) / 1.12;
                float angle = atan(vWorldPosition.y, vWorldPosition.x + 0.0001);
                float centerMask = 1.0 - smoothstep(0.0, 0.92, length(vWorldPosition.xy) / 1.12);
                float centerVoid = 1.0 - smoothstep(0.0, 0.58, length(vWorldPosition.xy) / 1.12);
                float pulseSeedA = sin(uTime * 1.8 + sin(uTime * 0.62) * 2.1);
                float pulseSeedB = sin(uTime * 1.22 + cos(uTime * 0.48) * 1.7);
                float randomPulse = 0.58 + 0.42 * smoothstep(0.28, 1.0, 0.5 + 0.5 * (pulseSeedA * 0.62 + pulseSeedB * 0.38));
                float surgeMask = smoothstep(0.8, 0.96, randomPulse);
                float redCoreMask = centerVoid * (0.7 + centerMask * 0.3);
                float branchWave = sin(angle * 3.2 + uTime * 0.82 + radial * 4.8);
                float branchWaveTwo = sin(angle * 5.0 - uTime * 0.64 - radial * 6.2);
                float branchField = branchWave * 0.6 + branchWaveTwo * 0.4;
                float branchMask = smoothstep(0.54, 0.9, 0.5 + 0.5 * branchField);
                float branchFade =
                  smoothstep(0.0, 0.08, radial) *
                  (1.0 - smoothstep(0.44, 0.66, radial));
                float organicGrowth = branchMask * branchFade * surgeMask;

                vec3 base = mix(vec3(0.04, 0.08, 0.18), vec3(0.1, 0.18, 0.34), lambert * 0.6);
                vec3 body = vec3(0.2, 0.38, 0.84) * pattern * 0.16;
                vec3 flow = vec3(0.16, 0.3, 0.7) * drift * 0.14 + vec3(0.28, 0.46, 0.92) * driftTwo * 0.08;
                vec3 midGlow = vec3(0.14, 0.34, 0.76) * bandMask * 0.08;
                vec3 rim = vec3(0.64, 0.86, 1.0) * (fresnel * 0.58 + innerPulse * 0.06);
                vec3 voidTint = vec3(0.01, 0.03, 0.09) * centerVoid * 0.9;
                vec3 redCore = vec3(1.0, 0.12, 0.1) * randomPulse * redCoreMask * 0.48;
                vec3 organicRays = vec3(1.0, 0.26, 0.18) * organicGrowth * 0.045;
                vec3 color = base + body + rim;
                color += flow * centerMask;
                color += midGlow;
                color -= voidTint;
                color += redCore;
                color += organicRays;
                color += vec3(0.9, 0.96, 1.0) * bandMask * vPulse * (0.026 + uImpulse * 0.04);
                float centerAlphaFade = pow(centerVoid, 1.15) * 0.18;
                float alpha = 0.78 + fresnel * 0.11 - centerAlphaFade;

                gl_FragColor = vec4(color, alpha);
              }
            `}
          />
        </mesh>

        <points ref={orbitalParticlesARef} renderOrder={3}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={orbitalParticleDataA.positions.length / 3}
              array={orbitalParticleDataA.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#96d7ff"
            size={compact ? 0.06 : 0.072}
            sizeAttenuation
            transparent
            opacity={0.55}
            map={particleSprite}
            alphaMap={particleSprite ?? undefined}
            alphaTest={0.01}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <points ref={orbitalParticlesBRef} renderOrder={3}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={orbitalParticleDataB.positions.length / 3}
              array={orbitalParticleDataB.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#79beff"
            size={compact ? 0.048 : 0.058}
            sizeAttenuation
            transparent
            opacity={0.39}
            map={particleSprite}
            alphaMap={particleSprite ?? undefined}
            alphaTest={0.01}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <points ref={orbitalParticlesCRef} renderOrder={3}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={orbitalParticleDataC.positions.length / 3}
              array={orbitalParticleDataC.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#bfdcff"
            size={compact ? 0.04 : 0.048}
            sizeAttenuation
            transparent
            opacity={0.3}
            map={particleSprite}
            alphaMap={particleSprite ?? undefined}
            alphaTest={0.01}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <points ref={orbitalParticlesLargeRef} renderOrder={3}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={orbitalParticleLargeData.positions.length / 3}
              array={orbitalParticleLargeData.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#d7ebff"
            size={compact ? 0.08 : 0.096}
            sizeAttenuation
            transparent
            opacity={0.37}
            map={particleSprite}
            alphaMap={particleSprite ?? undefined}
            alphaTest={0.01}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <lineSegments ref={connectionLinesRef} renderOrder={3}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={connectionPositions.length / 3}
              array={connectionPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            ref={connectionMaterialRef}
            color="#9dd7ff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        <points ref={shellParticlesRef} renderOrder={4}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={shellParticleData.positions.length / 3}
              array={shellParticleData.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#dcfbff"
            size={compact ? 0.024 : 0.028}
            sizeAttenuation
            transparent
            opacity={0.58}
            map={particleSprite}
            alphaMap={particleSprite ?? undefined}
            alphaTest={0.01}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <points ref={ambientParticlesRef} renderOrder={5}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={ambientParticleData.positions.length / 3}
              array={ambientParticleData.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#8af3ff"
            size={compact ? 0.02 : 0.024}
            sizeAttenuation
            transparent
            opacity={0.24}
            map={particleSprite}
            alphaMap={particleSprite ?? undefined}
            alphaTest={0.01}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </>
  );
}

export default function HeroOrbCanvas({ active = true, externalPointerRef = null, interactionRef = null }) {
  const localPointerRef = useRef({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 1024px)");
    const mobileQuery = window.matchMedia("(max-width: 640px)");

    const sync = () => {
      setReducedMotion(motionQuery.matches);
      setCompact(compactQuery.matches);
      setMobile(mobileQuery.matches);
    };

    sync();
    motionQuery.addEventListener("change", sync);
    compactQuery.addEventListener("change", sync);
    mobileQuery.addEventListener("change", sync);

    return () => {
      motionQuery.removeEventListener("change", sync);
      compactQuery.removeEventListener("change", sync);
      mobileQuery.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className="relative mx-auto h-full min-h-[420px] w-full max-w-none overflow-visible bg-transparent sm:min-h-[560px] lg:min-h-[720px]">
      {wrapperGlows.map((glow, index) => (
        <div
          key={index}
          className={glow.className}
          style={{ background: glow.background }}
        />
      ))}
      <div
        className="absolute inset-[-6%] sm:inset-[-8%] lg:inset-[-10%]"
        style={{
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, black 62%, rgba(0,0,0,0.88) 70%, transparent 84%)",
          maskImage: "radial-gradient(circle at center, black 0%, black 62%, rgba(0,0,0,0.88) 70%, transparent 84%)"
        }}
      >
        <Canvas
          frameloop={active ? "always" : "never"}
          dpr={mobile ? [1, 1.1] : compact ? [1, 1.2] : [1, 1.35]}
          camera={{ position: [0, 0, mobile ? 5.5 : compact ? 5.35 : 5.25], fov: mobile ? 38 : compact ? 36 : 34 }}
          gl={{
            alpha: true,
            antialias: !compact,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
            stencil: false
          }}
          performance={{ min: 0.8 }}
          style={{
            backgroundColor: "transparent",
            backgroundImage: "none",
            display: "block",
            width: "100%",
            height: "100%"
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#0a0a0a"), 0);
          }}
        >
          <fog attach="fog" args={["#090b14", 5.8, 9.8]} />
          <OrbScene
            pointer={externalPointerRef ?? localPointerRef}
            interaction={interactionRef}
            reducedMotion={reducedMotion}
            compact={compact}
          />
        </Canvas>
      </div>
    </div>
  );
}
