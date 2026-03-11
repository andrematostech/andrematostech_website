import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function OrbScene({ pointer, interaction, reducedMotion, compact }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const innerGlowRef = useRef(null);
  const haloRef = useRef(null);
  const pointsRef = useRef(null);

  const particleCount = compact ? 240 : 480;

  const positions = useMemo(() => {
    const values = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const radius = 1.29 + Math.random() * 0.24;
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

  const particleSprite = useMemo(() => {
    const size = 128;
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
    gradient.addColorStop(0.45, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.72, "rgba(255,255,255,0.4)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const core = coreRef.current;
    const innerGlow = innerGlowRef.current;
    const halo = haloRef.current;
    const points = pointsRef.current;

    if (!group || !core || !innerGlow || !halo || !points) return;

    const t = clock.getElapsedTime();
    const motion = reducedMotion ? 0.35 : 1;
    const breath = 1 + Math.sin(t * 0.72) * 0.035 * motion;
    const impulse = interaction?.current ?? null;
    const impulseStrength = impulse ? impulse.strength : 0;
    const attribute = points.geometry?.attributes?.position;

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.current.x * 0.22, 0.05);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointer.current.y * 0.14, 0.05);
    group.rotation.z += 0.0012 * motion;

    core.scale.setScalar(breath);
    innerGlow.scale.setScalar(breath * 0.955);
    halo.scale.setScalar(1.12 + Math.sin(t * 0.68) * 0.046 * motion);
    halo.material.opacity = 0.138 + Math.sin(t * 0.86) * 0.03 * motion;
    innerGlow.material.opacity = 0.138 + Math.sin(t * 0.78) * 0.02 * motion;

    points.rotation.y += 0.0008 * motion;
    points.rotation.x += 0.00035 * motion;
    points.scale.setScalar(1);
    points.material.opacity = 0.5 + Math.sin(t * 1.8) * 0.05 * motion;

    if (core.material.uniforms?.uTime) {
      core.material.uniforms.uTime.value = t;
    }

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
      <ambientLight intensity={0.34} />
      <directionalLight position={[2, 3, 4]} intensity={0.95} color="#737373" />
      <pointLight position={[0, 0, 2.8]} intensity={1.2} color="#4e4e4e" />
      <pointLight position={[-2.4, 1.8, 1.6]} intensity={0.42} color="#9a9a9a" />

      <group ref={groupRef} scale={0.92}>
        <mesh ref={haloRef}>
          <sphereGeometry args={[1.9, 48, 48]} />
          <meshBasicMaterial
            color="#1a1a1a"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={coreRef}>
          <sphereGeometry args={[1.1, 128, 128]} />
          <shaderMaterial
            transparent
            uniforms={{
              uBase: { value: new THREE.Color("#171717") },
              uCenter: { value: new THREE.Color("#676767") },
              uLightDir: { value: new THREE.Vector3(0.35, 0.5, 1).normalize() },
              uTime: { value: 0 }
            }}
            vertexShader={`
              varying vec3 vNormalW;
              varying vec3 vWorldPosition;

              void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                vNormalW = normalize(mat3(modelMatrix) * normal);
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
              }
            `}
            fragmentShader={`
              uniform vec3 uBase;
              uniform vec3 uCenter;
              uniform vec3 uLightDir;
              uniform float uTime;
              varying vec3 vNormalW;
              varying vec3 vWorldPosition;

              void main() {
                vec3 N = normalize(vNormalW);
                vec3 V = normalize(cameraPosition - vWorldPosition);
                vec3 L = normalize(uLightDir);
                float phi = atan(N.z, N.x);
                float theta = acos(clamp(N.y, -1.0, 1.0));

                float lambert = max(dot(N, L), 0.0);
                float center = pow(max(dot(N, V), 0.0), 1.55);
                float rim = pow(1.0 - max(dot(N, V), 0.0), 2.7);
                float fresnel = pow(1.0 - max(dot(N, V), 0.0), 1.45);
                float swirl = sin(phi * 1.6 + theta * 1.25 - uTime * 0.22);
                float cloudA = 0.5 + 0.5 * sin(phi * 4.2 + theta * 1.4 + uTime * 0.26 + swirl * 0.45);
                float cloudB = 0.5 + 0.5 * sin(phi * -3.1 + theta * 2.25 - uTime * 0.21);
                float nodes = pow(max(0.0, sin(phi * 6.2 - uTime * 0.34) * sin(theta * 5.4 + uTime * 0.28)), 2.2);
                float field = cloudA * 0.38 + cloudB * 0.34 + nodes * 0.18;

                vec3 color = mix(uBase, uCenter, center * 0.84);
                color += vec3(0.095) * lambert;
                color += vec3(0.06, 0.065, 0.072) * fresnel;
                color -= vec3(0.09) * rim;
                color += vec3(0.042, 0.047, 0.053) * field * (0.34 + center * 0.82);
                color += vec3(0.022, 0.024, 0.028) * nodes * (0.5 + fresnel * 0.5);

                gl_FragColor = vec4(color, 0.58);
              }
            `}
          />
        </mesh>

        <mesh ref={innerGlowRef}>
          <sphereGeometry args={[1.03, 96, 96]} />
          <meshBasicMaterial
            color="#9a9a9a"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
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
            size={compact ? 0.041 : 0.052}
            sizeAttenuation
            transparent
            opacity={0.42}
            map={particleSprite}
            alphaMap={particleSprite ?? undefined}
            alphaTest={0.01}
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
