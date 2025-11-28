import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

function FloatingOrb({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} position={position} args={[0.3, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}

function NeonRing({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Torus ref={meshRef} position={position} args={[1 * scale, 0.05, 16, 100]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        roughness={0}
        metalness={1}
      />
    </Torus>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshStandardMaterial
        color="#0a0a0f"
        wireframe
        emissive="#00ffff"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function Portal({ position }: { position: [number, number, number] }) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={ringRef} position={position}>
      <Torus args={[2, 0.1, 16, 100]}>
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </Torus>
      <Torus args={[1.7, 0.05, 16, 100]}>
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </Torus>
      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color="#000020"
          transparent
          opacity={0.3}
          roughness={0}
          metalness={1}
        />
      </Sphere>
    </group>
  );
}

function FloatingCubes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 6;
        return (
          <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Box
              position={[Math.cos(angle) * radius, Math.sin(i) * 2, Math.sin(angle) * radius]}
              args={[0.5, 0.5, 0.5]}
            >
              <meshStandardMaterial
                color={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
                emissive={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
          </Float>
        );
      })}
    </group>
  );
}

export function NeonRoom() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 10, 30]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#ff00ff" />
      <pointLight position={[0, -3, 0]} intensity={0.5} color="#8b5cf6" />
      
      <FloatingOrb position={[-3, 2, -2]} color="#00ffff" speed={1.2} />
      <FloatingOrb position={[3, 1, -3]} color="#ff00ff" speed={0.8} />
      <FloatingOrb position={[0, 3, -4]} color="#8b5cf6" speed={1.5} />
      
      <NeonRing position={[-4, 0, -5]} color="#00ffff" scale={0.8} />
      <NeonRing position={[4, 1, -6]} color="#ff00ff" scale={1.2} />
      
      <Portal position={[0, 0, -8]} />
      <FloatingCubes />
      <GridFloor />
      
      <Environment preset="night" />
    </Canvas>
  );
}
