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

interface NeonRacingProps {
  gameState: any;
  onTargetHit: () => void;
  onPowerUpCollect: () => void;
}

// Neon Race Car
function NeonRaceCar({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.15;
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      
      // Wheel rotation
      meshRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && index >= 1 && index <= 4) {
          child.rotation.x += 0.2;
        }
      });
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <Float speed={3} rotationIntensity={0.4} floatIntensity={0.2}>
        {/* Car Body */}
        <Box args={[0.8, 0.4, 1.2]} position={[0, 0.2, 0]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
        
        {/* Car Roof */}
        <Box args={[0.6, 0.3, 0.8]} position={[0, 0.5, 0]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
        
        {/* Wheels */}
        <Cylinder args={[0.15, 0.15, 0.1, 8]} position={[0.3, 0, 0.4]}>
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
        </Cylinder>
        <Cylinder args={[0.15, 0.15, 0.1, 8]} position={[-0.3, 0, 0.4]}>
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
        </Cylinder>
        <Cylinder args={[0.15, 0.15, 0.1, 8]} position={[0.3, 0, -0.4]}>
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
        </Cylinder>
        <Cylinder args={[0.15, 0.15, 0.1, 8]} position={[-0.3, 0, -0.4]}>
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
        </Cylinder>
        
        {/* Headlights */}
        <Sphere args={[0.08, 8, 8]} position={[0.3, 0.2, 0.6]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={1}
          />
        </Sphere>
        <Sphere args={[0.08, 8, 8]} position={[-0.3, 0.2, 0.6]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={1}
          />
        </Sphere>
        
        {/* Taillights */}
        <Sphere args={[0.06, 8, 8]} position={[0.3, 0.2, -0.6]}>
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000" 
            emissiveIntensity={0.8}
          />
        </Sphere>
        <Sphere args={[0.06, 8, 8]} position={[-0.3, 0.2, -0.6]}>
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000" 
            emissiveIntensity={0.8}
          />
        </Sphere>
      </Float>
      
      <pointLight position={[0, 0.5, 0]} intensity={0.5} color={color} />
      <pointLight position={[0, 0.2, 0.6]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 0.2, -0.6]} intensity={0.6} color="#ff0000" />
    </group>
  );
}

// Checkpoint Gate
function CheckpointGate({ position, onPass, passed }: { 
  position: [number, number, number];
  onPass: () => void;
  passed: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && !passed) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      
      // Check if car passed through
      const carPos = new THREE.Vector3(0, 0, 0);
      const gatePos = new THREE.Vector3(...position);
      const distance = carPos.distanceTo(gatePos);
      
      if (distance < 2) {
        onPass();
      }
    }
  });

  if (passed) return null;

  return (
    <group position={position} ref={meshRef}>
      {/* Gate Posts */}
      <Cylinder args={[0.2, 0.2, 3, 8]} position={[2, 1.5, 0]}>
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00" 
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 3, 8]} position={[-2, 1.5, 0]}>
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00" 
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>
      
      {/* Gate Beam */}
      <Box args={[4.5, 0.3, 0.3]} position={[0, 2.5, 0]}>
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00" 
          emissiveIntensity={0.8}
        />
      </Box>
      
      {/* Checkpoint Light */}
      <Sphere args={[0.2, 8, 8]} position={[0, 2.5, 0]}>
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={1}
        />
      </Sphere>
      
      <pointLight position={[0, 2.5, 0]} intensity={1.5} color="#00ff00" />
    </group>
  );
}

// Speed Boost Pad
function SpeedBoostPad({ position, onCollect }: { 
  position: [number, number, number];
  onCollect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      const intensity = Math.sin(state.clock.elapsedTime * 5) * 0.3 + 0.7;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  if (collected) return null;

  return (
    <group 
      position={position} 
      onClick={() => {
        setCollected(true);
        onCollect();
      }}
    >
      <Box ref={meshRef} args={[1, 0.1, 2]}>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Arrow Indicators */}
      <Cone args={[0.3, 0.5, 4]} position={[0, 0.3, 0.5]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.8}
        />
      </Cone>
      <Cone args={[0.3, 0.5, 4]} position={[0, 0.3, -0.5]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.8}
        />
      </Cone>
      
      <pointLight position={[0, 0.5, 0]} intensity={1.2} color="#00ffff" />
    </group>
  );
}

// Obstacle Barrier
function ObstacleBarrier({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <Cone args={[0.5, 1, 6]}>
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.4}
        />
      </Cone>
      
      {/* Warning Stripes */}
      <Cylinder args={[0.52, 0.52, 0.2, 8]} position={[0, -0.4, 0]}>
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00" 
          emissiveIntensity={0.3}
        />
      </Cylinder>
      
      <pointLight position={[0, 0.5, 0]} intensity={0.4} color="#ff0000" />
    </group>
  );
}

// Neon Ring Track
function NeonRingTrack({ radius, position }: { 
  radius: number; 
  position: [number, number, number];
}) {
  const points = [];
  const segments = 64;
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius + position[0],
      position[1],
      Math.sin(angle) * radius + position[2]
    ));
  }
  
  const curve = new THREE.CatmullRomCurve3(points);
  
  return (
    <group>
      {/* Track Surface */}
      <TubeGeometry args={[curve, 64, 0.8, 8, false]} />
      
      {/* Track Edges */}
      <TubeGeometry args={[curve, 64, 0.1, 8, false]} />
    </group>
  );
}

// Tube Geometry helper
function TubeGeometry({ args }: { args: any }) {
  const curve = args[0];
  const tubularSegments = args[1];
  const radius = args[2];
  const radialSegments = args[3];
  const closed = args[4];
  
  return (
    <mesh>
      <tubeGeometry args={[curve, tubularSegments, radius, radialSegments, closed]} />
      <meshStandardMaterial 
        color="#1a1a2e" 
        emissive="#0f3460" 
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function NeonRacing({ gameState, onTargetHit, onPowerUpCollect }: NeonRacingProps) {
  const [checkpointsPassed, setCheckpointsPassed] = useState([false, false, false, false]);
  
  const handleCheckpoint = (index: number) => {
    const newCheckpoints = [...checkpointsPassed];
    newCheckpoints[index] = true;
    setCheckpointsPassed(newCheckpoints);
    onTargetHit();
  };

  return (
    <>
      <Environment preset="city" />
      <Stars radius={150} depth={50} count={6000} factor={4} saturation={0} fade />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#ffff00" />
      
      {/* Racing Track Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          emissive="#1a1a1a" 
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Track Lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box 
          key={`line-${i}`}
          args={[0.1, 0.01, 30]} 
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 15, 
            -1.99, 
            Math.sin((i / 8) * Math.PI * 2) * 15
          ]}
          rotation={[0, (i / 8) * Math.PI * 2, 0]}
        >
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.3}
          />
        </Box>
      ))}
      
      {/* Outer Track Barrier */}
      <Cylinder args={[18, 18, 0.5, 32]} position={[0, -1.75, 0]}>
        <meshStandardMaterial 
          color="#ff00ff" 
          emissive="#ff00ff" 
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>
      
      {/* Inner Track Barrier */}
      <Cylinder args={[12, 12, 0.5, 32]} position={[0, -1.75, 0]}>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>
      
      {/* Player Neon Car */}
      <NeonRaceCar position={[15, 0, 0]} color="#00ffff" />
      
      {gameState.isPlaying && !gameState.isPaused && (
        <>
          {/* Checkpoint Gates */}
          <CheckpointGate 
            position={[15, 0, 0]} 
            onPass={() => handleCheckpoint(0)}
            passed={checkpointsPassed[0]}
          />
          <CheckpointGate 
            position={[0, 0, 15]} 
            onPass={() => handleCheckpoint(1)}
            passed={checkpointsPassed[1]}
          />
          <CheckpointGate 
            position={[-15, 0, 0]} 
            onPass={() => handleCheckpoint(2)}
            passed={checkpointsPassed[2]}
          />
          <CheckpointGate 
            position={[0, 0, -15]} 
            onPass={() => handleCheckpoint(3)}
            passed={checkpointsPassed[3]}
          />
          
          {/* Speed Boost Pads */}
          <SpeedBoostPad position={[10, -1.9, 10]} onCollect={onPowerUpCollect} />
          <SpeedBoostPad position={[-10, -1.9, 10]} onCollect={onPowerUpCollect} />
          <SpeedBoostPad position={[-10, -1.9, -10]} onCollect={onPowerUpCollect} />
          <SpeedBoostPad position={[10, -1.9, -10]} onCollect={onPowerUpCollect} />
          <SpeedBoostPad position={[15, -1.9, 0]} onCollect={onPowerUpCollect} />
          <SpeedBoostPad position={[-15, -1.9, 0]} onCollect={onPowerUpCollect} />
          
          {/* Obstacle Barriers */}
          <ObstacleBarrier position={[12, 0, 5]} />
          <ObstacleBarrier position={[-12, 0, 5]} />
          <ObstacleBarrier position={[-12, 0, -5]} />
          <ObstacleBarrier position={[12, 0, -5]} />
          <ObstacleBarrier position={[5, 0, 12]} />
          <ObstacleBarrier position={[-5, 0, 12]} />
          <ObstacleBarrier position={[-5, 0, -12]} />
          <ObstacleBarrier position={[5, 0, -12]} />
        </>
      )}
    </>
  );
}
