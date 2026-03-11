import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function OrbScene({ pointer, interaction, reducedMotion, compact }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const haloRef = useRef(null);
  const pointsRef = useRef(null);

  const particleCount = compact ? 240 : 480;

  const positions = useMemo(() => {
    const values = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const radius = 1.26 + Math.random() * 0.22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      values[i3] = radius * Math.sin(phi) * Math.cos(theta);
      values[i3 + 1] = radius * Math.cos(phi);
      values[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    return values;
  }, [particleCount]);

  const particlePhases = useMemo(() => {
    const values = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
      values[i] = Math.random() * Math.PI * 2;
    }

    return values;
  }, [particleCount]);

  const particleSettles = useMemo(() => {
    const values = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
      values[i] = 0.055 + Math.random() * 0.06;
    }

    return values;
  }, [particleCount]);

  const coreTexture = useMemo(() => {
    const size = 768;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.fillStyle = "#131313";
    ctx.fillRect(0, 0, size, size);

    const cols = 7;
    const rows = 7;
    const cell = size / cols;
    const radius = cell * 0.24;
    ctx.lineWidth = cell * 0.105;
    ctx.strokeStyle = "#f4f4f4";
    ctx.globalAlpha = 1;

    const roundedBlob = (x, y, w, h, r, warpA, warpB) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y + warpA * 0.12);
      ctx.bezierCurveTo(
        x + w * 0.35,
        y - warpB * 0.18,
        x + w * 0.72,
        y + warpA * 0.22,
        x + w - r * 0.35,
        y + warpB * 0.1
      );
      ctx.arcTo(x + w + warpA * 0.04, y + h * 0.3, x + w - warpB * 0.04, y + h - r, r);
      ctx.bezierCurveTo(
        x + w + warpA * 0.12,
        y + h * 0.65,
        x + w * 0.7,
        y + h + warpB * 0.14,
        x + w * 0.44,
        y + h - warpA * 0.06
      );
      ctx.arcTo(x + w * 0.18, y + h + warpB * 0.06, x + r, y + h - warpA * 0.08, r);
      ctx.bezierCurveTo(
        x - warpA * 0.1,
        y + h * 0.7,
        x - warpB * 0.08,
        y + h * 0.35,
        x + r,
        y + warpA * 0.12
      );
      ctx.closePath();
    };

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const noiseA = Math.sin(row * 0.9 + col * 0.7) * cell * 0.22;
        const noiseB = Math.cos(col * 0.82 + row * 0.58) * cell * 0.2;
        const driftX = Math.sin((row + 1) * (col + 1) * 0.18) * cell * 0.14;
        const driftY = Math.cos((row + 2) * (col + 1) * 0.16) * cell * 0.14;
        const width = cell * (0.76 + ((row + col) % 3) * 0.08);
        const height = cell * (0.7 + ((row + col + 1) % 3) * 0.09);
        const x = col * cell - cell * 0.12 + driftX + noiseA * 0.2;
        const y = row * cell - cell * 0.12 + driftY + noiseB * 0.2;

        roundedBlob(x, y, width, height, radius, noiseA, noiseB);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 0.38;
    for (let i = 0; i < 30; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = cell * (0.08 + Math.random() * 0.1);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, "rgba(255,255,255,0.92)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.18, 1.18);
    texture.anisotropy = 8;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const core = coreRef.current;
    const halo = haloRef.current;
    const points = pointsRef.current;

    if (!group || !core || !halo || !points) return;

    const t = clock.getElapsedTime();
    const motion = reducedMotion ? 0.35 : 1;
    const breath = 1 + Math.sin(t * 1.2) * 0.035 * motion;
    const impulse = interaction?.current ?? null;
    const impulseStrength = impulse ? impulse.strength : 0;
    const attribute = points.geometry?.attributes?.position;

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.current.x * 0.22, 0.05);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointer.current.y * 0.14, 0.05);
    group.rotation.z += 0.0008 * motion;

    core.scale.setScalar(breath);
    halo.scale.setScalar(1.08 + Math.sin(t * 1.1) * 0.04 * motion);
    halo.material.opacity = 0.16 + Math.sin(t * 1.4) * 0.035 * motion;

    points.rotation.y += 0.0008 * motion;
    points.rotation.x += 0.00035 * motion;
    points.scale.setScalar(1);
    points.material.opacity = 0.7 + Math.sin(t * 1.8) * 0.06 * motion;

    if (attribute) {
      for (let i = 0; i < particleCount; i += 1) {
        const i3 = i * 3;
        const bx = positions[i3];
        const by = positions[i3 + 1];
        const bz = positions[i3 + 2];

        let x = bx;
        let y = by;
        let z = bz;

        if (impulseStrength > 0) {
          const baseLength = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
          const nx = bx / baseLength;
          const ny = by / baseLength;
          const nz = bz / baseLength;
          const alignment = nx * impulse.x + ny * impulse.y + nz * impulse.z;
          const influence = THREE.MathUtils.smoothstep(alignment, 0.64, 0.96) * impulseStrength;

          if (influence > 0) {
            const phase = particlePhases[i];
            const radialWave = Math.sin(t * 8.8 + phase) * 0.16 * influence;
            const tangentialWave = Math.cos(t * 6.9 + phase) * 0.075 * influence;

            x += nx * radialWave + -nz * tangentialWave;
            y += ny * radialWave + nx * tangentialWave * 0.5;
            z += nz * radialWave + ny * tangentialWave;
          }
        }

        attribute.array[i3] = THREE.MathUtils.lerp(attribute.array[i3], x, particleSettles[i]);
        attribute.array[i3 + 1] = THREE.MathUtils.lerp(attribute.array[i3 + 1], y, particleSettles[i]);
        attribute.array[i3 + 2] = THREE.MathUtils.lerp(attribute.array[i3 + 2], z, particleSettles[i]);
      }

      attribute.needsUpdate = true;
    }

    if (impulse) {
      impulse.strength = Math.max(0, impulse.strength * 0.92 - 0.01);
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 3, 4]} intensity={0.75} color="#5b5b5b" />
      <pointLight position={[0, 0, 2.8]} intensity={1.15} color="#3f3f3f" />
      <pointLight position={[-2.4, 1.8, 1.6]} intensity={0.45} color="#8a8a8a" />

      <group ref={groupRef}>
        <mesh ref={haloRef}>
          <sphereGeometry args={[1.92, 48, 48]} />
          <meshBasicMaterial
            color="#1a1a1a"
            transparent
            opacity={0.09}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={coreRef}>
          <sphereGeometry args={[1.1, 64, 64]} />
          <meshStandardMaterial
            color="#121212"
            map={coreTexture}
            emissive="#404040"
            emissiveMap={coreTexture}
            emissiveIntensity={0.14}
            roughness={0.66}
            metalness={0.04}
            bumpMap={coreTexture}
            bumpScale={0.1}
            transparent
            opacity={0.98}
          />
        </mesh>

        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#1b1b1b"
            size={compact ? 0.028 : 0.036}
            sizeAttenuation
            transparent
            opacity={0.5}
            depthWrite={false}
          />
        </points>
      </group>
    </>
  );
}

export default function HeroOrbCanvas({ externalPointerRef = null, interactionRef = null }) {
  const localPointerRef = useRef({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 1024px)");

    const sync = () => {
      setReducedMotion(motionQuery.matches);
      setCompact(compactQuery.matches);
    };

    sync();
    motionQuery.addEventListener("change", sync);
    compactQuery.addEventListener("change", sync);

    return () => {
      motionQuery.removeEventListener("change", sync);
      compactQuery.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[420px] sm:max-w-[560px] lg:max-w-[760px]"
      style={{ backgroundColor: "#F4F2EE" }}
    >
      <div className="pointer-events-none absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(13,13,13,0.18)_0%,rgba(13,13,13,0.08)_42%,rgba(244,242,238,0)_72%)] blur-3xl" />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.2], fov: 34 }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        style={{ background: "#F4F2EE", display: "block" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0xffffff, 0);
        }}
      >
        <OrbScene
          pointer={externalPointerRef ?? localPointerRef}
          interaction={interactionRef}
          reducedMotion={reducedMotion}
          compact={compact}
        />
      </Canvas>
    </div>
  );
}
