import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  Float, 
  Stars,
  Trail,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Cone
} from '@react-three/drei';
import * as THREE from 'three';

interface PortalShooterProps {
  gameState: any;
  onTargetHit: () => void;
  onPowerUpCollect: () => void;
}

// Portal Shooter Character
function PortalShooterCharacter({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
        {/* Shooter Body */}
        <Box args={[0.4, 0.6, 0.4]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.3}
            metalness={0.7}
            roughness={0.3}
          />
        </Box>
        
        {/* Shooter Head */}
        <Sphere args={[0.25, 16, 16]} position={[0, 0.5, 0]}>
          <meshStandardMaterial 
            color="#ffdddd" 
            emissive="#ffaaaa" 
            emissiveIntensity={0.2}
          />
        </Sphere>
        
        {/* Portal Gun */}
        <Cylinder args={[0.08, 0.08, 0.4, 8]} position={[0.3, 0.2, 0]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial 
            color="#333333" 
            emissive="#666666" 
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </Cylinder>
        
        {/* Portal Gun Tip */}
        <Sphere args={[0.1, 8, 8]} position={[0.5, 0.2, 0]}>
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff" 
            emissiveIntensity={0.8}
          />
        </Sphere>
      </Float>
      
      <pointLight position={[0, 0.5, 0]} intensity={0.4} color={color} />
    </group>
  );
}

// Target Portal
function TargetPortal({ position, color, onHit }: { 
  position: [number, number, number]; 
  color: string;
  onHit: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hit, setHit] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !hit) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  if (hit) return null;

  return (
    <group 
      position={position} 
      ref={meshRef}
      onClick={() => {
        setHit(true);
        onHit();
      }}
    >
      <Trail
        width={0.3}
        length={20}
        color={color}
        attenuation={(width) => width}
      >
        <Torus args={[0.8, 0.15, 16, 100]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </Torus>
      </Trail>
      
      {/* Portal Center */}
      <Sphere args={[0.4, 16, 16]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
        />
      </Sphere>
      
      {/* Portal Particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.05, 6, 6]}
          position={[
            Math.cos((i / 6) * Math.PI * 2 + Math.PI/3) * 0.6,
            Math.sin((i / 6) * Math.PI * 2) * 0.3,
            Math.sin((i / 6) * Math.PI * 2 + Math.PI/3) * 0.6
          ]}
        >
          <meshStandardMaterial 
            color="#ffffff" 
            emissive={color} 
            emissiveIntensity={1}
          />
        </Sphere>
      ))}
      
      <pointLight position={[0, 0, 0]} intensity={1.5} color={color} />
    </group>
  );
}

// Enemy Drone
function EnemyDrone({ position, onShoot }: { 
  position: [number, number, number];
  onShoot: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [destroyed, setDestroyed] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !destroyed) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 1.5;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      
      // Random movement
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime + Math.PI) * 2;
      meshRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime + Math.PI) * 2;
    }
  });

  if (destroyed) return null;

  return (
    <group 
      position={position} 
      ref={meshRef}
      onClick={() => {
        setDestroyed(true);
        onShoot();
      }}
    >
      {/* Drone Body */}
      <Box args={[0.5, 0.3, 0.5]}>
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.4}
        />
      </Box>
      
      {/* Drone Propellers */}
      <Cylinder args={[0.3, 0.3, 0.05, 8]} position={[0, 0.3, 0.3]}>
        <meshStandardMaterial 
          color="#666666" 
          emissive="#333333" 
          emissiveIntensity={0.1}
        />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.05, 8]} position={[0, 0.3, -0.3]}>
        <meshStandardMaterial 
          color="#666666" 
          emissive="#333333" 
          emissiveIntensity={0.1}
        />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.05, 8]} position={[0.3, 0.3, 0]}>
        <meshStandardMaterial 
          color="#666666" 
          emissive="#333333" 
          emissiveIntensity={0.1}
        />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.05, 8]} position={[-0.3, 0.3, 0]}>
        <meshStandardMaterial 
          color="#666666" 
          emissive="#333333" 
          emissiveIntensity={0.1}
        />
      </Cylinder>
      
      {/* Drone Eye */}
      <Sphere args={[0.08, 8, 8]} position={[0, 0, 0.26]}>
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={1}
        />
      </Sphere>
      
      <pointLight position={[0, 0, 0.3]} intensity={0.5} color="#ff0000" />
    </group>
  );
}

// Ammo Pickup
function AmmoPickup({ position, onCollect }: { 
  position: [number, number, number];
  onCollect: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [collected, setCollected] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }
  });

  if (collected) return null;

  return (
    <group 
      position={position} 
      ref={meshRef}
      onClick={() => {
        setCollected(true);
        onCollect();
      }}
    >
      <Float speed={5} rotationIntensity={1.5} floatIntensity={0.8}>
        <Box args={[0.3, 0.3, 0.3]}>
          <meshStandardMaterial 
            color="#ffff00" 
            emissive="#ffff00" 
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
        
        {/* Ammo Symbol */}
        <Cylinder args={[0.1, 0.1, 0.4, 6]} position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial 
            color="#ff6600" 
            emissive="#ff6600" 
            emissiveIntensity={0.6}
          />
        </Cylinder>
      </Float>
      
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffff00" />
    </group>
  );
}

// Portal Platform
function PortalPlatform({ position, size }: { 
  position: [number, number, number]; 
  size: [number, number, number];
}) {
  return (
    <group position={position}>
      <Box args={size}>
        <meshStandardMaterial 
          color="#4444ff" 
          emissive="#222266" 
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.4}
        />
      </Box>
      
      {/* Portal Edge Glow */}
      <Box args={[size[0] + 0.1, 0.1, size[2] + 0.1]} position={[0, size[1]/2 + 0.05, 0]}>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </Box>
    </group>
  );
}

export default function PortalShooterGame({ gameState, onTargetHit, onPowerUpCollect }: PortalShooterProps) {
  return (
    <>
      <Environment preset="warehouse" />
      <Stars radius={150} depth={50} count={4000} factor={4} saturation={0} fade />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#ff6b35" />
      
      {/* Arena Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          emissive="#0f3460" 
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Arena Walls */}
      <PortalPlatform position={[0, 0, 12]} size={[24, 4, 0.5]} />
      <PortalPlatform position={[0, 0, -12]} size={[24, 4, 0.5]} />
      <PortalPlatform position={[12, 0, 0]} size={[0.5, 4, 24]} />
      <PortalPlatform position={[-12, 0, 0]} size={[0.5, 4, 24]} />
      
      {/* Floating Platforms */}
      <PortalPlatform position={[5, -1, 5]} size={[3, 0.3, 3]} />
      <PortalPlatform position={[-5, -1, -5]} size={[3, 0.3, 3]} />
      <PortalPlatform position={[8, 0, -3]} size={[2, 0.3, 2]} />
      <PortalPlatform position={[-8, 0, 3]} size={[2, 0.3, 2]} />
      
      {/* Player */}
      <PortalShooterCharacter position={[0, 0, 0]} color="#00ffff" />
      
      {gameState.isPlaying && !gameState.isPaused && (
        <>
          {/* Target Portals */}
          <TargetPortal position={[6, 1, 6]} color="#ffff00" onHit={onTargetHit} />
          <TargetPortal position={[-6, 1, -6]} color="#ffff00" onHit={onTargetHit} />
          <TargetPortal position={[8, 2, -4]} color="#ffff00" onHit={onTargetHit} />
          <TargetPortal position={[-8, 2, 4]} color="#ffff00" onHit={onTargetHit} />
          <TargetPortal position={[0, 3, 0]} color="#ffff00" onHit={onTargetHit} />
          
          {/* Enemy Drones */}
          <EnemyDrone position={[4, 2, 3]} onShoot={onTargetHit} />
          <EnemyDrone position={[-4, 2, -3]} onShoot={onTargetHit} />
          <EnemyDrone position={[6, 1, -5]} onShoot={onTargetHit} />
          <EnemyDrone position={[-6, 1, 5]} onShoot={onTargetHit} />
          
          {/* Ammo Pickups */}
          <AmmoPickup position={[3, 0.5, 0]} onCollect={onPowerUpCollect} />
          <AmmoPickup position={[-3, 0.5, 0]} onCollect={onPowerUpCollect} />
          <AmmoPickup position={[0, 0.5, 3]} onCollect={onPowerUpCollect} />
          <AmmoPickup position={[0, 0.5, -3]} onCollect={onPowerUpCollect} />
          <AmmoPickup position={[5, 1, 2]} onCollect={onPowerUpCollect} />
        </>
      )}
    </>
  );
}
