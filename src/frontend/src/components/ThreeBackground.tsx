import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function FloatingShape({
  position,
  geometry,
  rotationSpeed,
}: {
  position: [number, number, number];
  geometry: React.ReactNode;
  rotationSpeed: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += rotationSpeed[0];
    meshRef.current.rotation.y += rotationSpeed[1];
    meshRef.current.rotation.z += rotationSpeed[2];
  });

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshBasicMaterial wireframe color="#00FFC6" opacity={0.08} transparent />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      {/* Icosahedron — top left area */}
      <FloatingShape
        position={[-4.5, 3, -3]}
        rotationSpeed={[0.002, 0.003, 0.001]}
        geometry={<icosahedronGeometry args={[1.5, 0]} />}
      />

      {/* Torus — top right area */}
      <FloatingShape
        position={[4.5, 2, -4]}
        rotationSpeed={[0.003, 0.001, 0.002]}
        geometry={<torusGeometry args={[1.2, 0.4, 8, 16]} />}
      />

      {/* Sphere — bottom center area */}
      <FloatingShape
        position={[0, -3, -5]}
        rotationSpeed={[0.001, 0.002, 0.003]}
        geometry={<sphereGeometry args={[1.3, 8, 8]} />}
      />

      {/* Small octahedron — mid-right */}
      <FloatingShape
        position={[5.5, -1.5, -3]}
        rotationSpeed={[0.004, 0.002, 0.001]}
        geometry={<octahedronGeometry args={[0.9, 0]} />}
      />

      {/* Small torus knot — mid-left */}
      <FloatingShape
        position={[-5, -0.5, -6]}
        rotationSpeed={[0.001, 0.003, 0.002]}
        geometry={<torusKnotGeometry args={[0.8, 0.25, 64, 8]} />}
      />
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -2,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: false }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
