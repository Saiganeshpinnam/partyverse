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
  Plane
} from '@react-three/drei';
import * as THREE from 'three';

interface GravityFlipRaceProps {
  gameState: any;
  onTargetHit: () => void;
  onPowerUpCollect: () => void;
}

// Gravity Runner
function GravityRunner({ position, color, isFlipped }: { 
  position: [number, number, number]; 
  color: string;
  isFlipped: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = isFlipped ? Math.PI : 0;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.1;
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <Float speed={3} rotationIntensity={0.4} floatIntensity={0.2}>
        {/* Runner Body */}
        <Box args={[0.3, 0.5, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
          />
        </Box>
        
        {/* Runner Head */}
        <Sphere args={[0.15, 16, 16]} position={[0, 0.35, 0]}>
          <meshStandardMaterial 
            color="#ffdddd" 
            emissive="#ffaaaa" 
            emissiveIntensity={0.2}
          />
        </Sphere>
        
        {/* Gravity Indicator */}
        <Torus args={[0.4, 0.05, 8, 16]} position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial 
            color={isFlipped ? "#ff00ff" : "#00ffff"} 
            emissive={isFlipped ? "#ff00ff" : "#00ffff"} 
            emissiveIntensity={0.8}
          />
        </Torus>
      </Float>
      
      <pointLight position={[0, 0, 0]} intensity={0.5} color={isFlipped ? "#ff00ff" : "#00ffff"} />
    </group>
  );
}

// Gravity Platform
function GravityPlatform({ position, size, gravityZone, onCross }: { 
  position: [number, number, number]; 
  size: [number, number, number];
  gravityZone: 'normal' | 'flipped' | 'neutral';
  onCross: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [crossed, setCrossed] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Check if player crossed platform
      const playerPos = new THREE.Vector3(0, 0, 0);
      const platformPos = new THREE.Vector3(...position);
      const distance = playerPos.distanceTo(platformPos);
      
      if (distance < 1 && !crossed) {
        setCrossed(true);
        onCross();
      }
    }
  });

  const platformColor = gravityZone === 'normal' ? '#00ffff' : gravityZone === 'flipped' ? '#ff00ff' : '#ffff00';

  return (
    <group position={position}>
      <Box ref={meshRef} args={size}>
        <meshStandardMaterial 
          color={platformColor} 
          emissive={platformColor} 
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={crossed ? 0.3 : 0.8}
        />
      </Box>
      
      {/* Gravity Field Effect */}
      <Cylinder args={[size[0]/2 + 0.5, size[0]/2 + 0.5, 0.1, 16]} position={[0, -0.1, 0]}>
        <meshStandardMaterial 
          color={platformColor} 
          emissive={platformColor} 
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </Cylinder>
      
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color={platformColor} />
    </group>
  );
}

// Checkpoint Flag
function CheckpointFlag({ position, onReach, passed }: { 
  position: [number, number, number];
  onReach: () => void;
  passed: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && !passed) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      
      // Check if player reached checkpoint
      const playerPos = new THREE.Vector3(0, 0, 0);
      const flagPos = new THREE.Vector3(...position);
      const distance = playerPos.distanceTo(flagPos);
      
      if (distance < 1) {
        onReach();
      }
    }
  });

  if (passed) return null;

  return (
    <group position={position} ref={meshRef}>
      {/* Flag Pole */}
      <Cylinder args={[0.05, 0.05, 2, 8]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Flag */}
      <Plane args={[0.8, 0.5]} position={[0.4, 1.8, 0]}>
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </Plane>
      
      <pointLight position={[0, 1.5, 0]} intensity={0.5} color="#00ff00" />
    </group>
  );
}

// Gravity Orb Power-up
function GravityOrb({ position, onCollect }: { 
  position: [number, number, number];
  onCollect: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [collected, setCollected] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.3;
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
      <Float speed={6} rotationIntensity={2} floatIntensity={1}>
        <Sphere args={[0.2, 16, 16]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#8b5cf6" 
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </Sphere>
        
        {/* Orbiting Rings */}
        <Torus args={[0.3, 0.03, 8, 16]} rotation={[0, 0, Math.PI/4]}>
          <meshStandardMaterial 
            color="#ff00ff" 
            emissive="#ff00ff" 
            emissiveIntensity={0.6}
          />
        </Torus>
        <Torus args={[0.3, 0.03, 8, 16]} rotation={[Math.PI/4, 0, 0]}>
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff" 
            emissiveIntensity={0.6}
          />
        </Torus>
      </Float>
      
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#8b5cf6" />
    </group>
  );
}

export default function GravityFlipRace({ gameState, onTargetHit, onPowerUpCollect }: GravityFlipRaceProps) {
  const [gravityFlipped, setGravityFlipped] = useState(false);
  const [checkpointsPassed, setCheckpointsPassed] = useState([false, false, false]);
  
  const handleCheckpoint = (index: number) => {
    const newCheckpoints = [...checkpointsPassed];
    newCheckpoints[index] = true;
    setCheckpointsPassed(newCheckpoints);
    onTargetHit();
  };

  const handleGravityFlip = () => {
    setGravityFlipped(!gravityFlipped);
  };

  return (
    <>
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
      
      <ambientLight intensity={gravityFlipped ? 0.1 : 0.3} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={gravityFlipped ? 0.3 : 0.7} 
        color={gravityFlipped ? "#ff00ff" : "#00ffff"} 
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color={gravityFlipped ? "#ff00ff" : "#00ffff"} />
      
      {/* Race Track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial 
          color={gravityFlipped ? "#1a0033" : "#001a33"} 
          emissive={gravityFlipped ? "#330066" : "#003366"} 
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Track Boundaries */}
      <Box position={[15, 0, 0]} args={[0.5, 4, 20]}>
        <meshStandardMaterial color="#666666" emissive="#333333" emissiveIntensity={0.2} />
      </Box>
      <Box position={[-15, 0, 0]} args={[0.5, 4, 20]}>
        <meshStandardMaterial color="#666666" emissive="#333333" emissiveIntensity={0.2} />
      </Box>
      <Box position={[0, 0, 10]} args={[30, 4, 0.5]}>
        <meshStandardMaterial color="#666666" emissive="#333333" emissiveIntensity={0.2} />
      </Box>
      <Box position={[0, 0, -10]} args={[30, 4, 0.5]}>
        <meshStandardMaterial color="#666666" emissive="#333333" emissiveIntensity={0.2} />
      </Box>
      
      {/* Player */}
      <GravityRunner position={[0, 0, 0]} color="#00ffff" isFlipped={gravityFlipped} />
      
      {gameState.isPlaying && !gameState.isPaused && (
        <>
          {/* Gravity Platforms */}
          <GravityPlatform 
            position={[3, 0, 0]} 
            size={[2, 0.2, 3]} 
            gravityZone="normal"
            onCross={() => {}}
          />
          <GravityPlatform 
            position={[-3, 0, 0]} 
            size={[2, 0.2, 3]} 
            gravityZone="flipped"
            onCross={handleGravityFlip}
          />
          <GravityPlatform 
            position={[8, 0, 3]} 
            size={[3, 0.2, 2]} 
            gravityZone="normal"
            onCross={() => {}}
          />
          <GravityPlatform 
            position={[-8, 0, -3]} 
            size={[3, 0.2, 2]} 
            gravityZone="flipped"
            onCross={handleGravityFlip}
          />
          <GravityPlatform 
            position={[0, 0, 6]} 
            size={[4, 0.2, 2]} 
            gravityZone="neutral"
            onCross={onTargetHit}
          />
          
          {/* Checkpoints */}
          <CheckpointFlag 
            position={[5, 0, 0]} 
            onReach={() => handleCheckpoint(0)}
            passed={checkpointsPassed[0]}
          />
          <CheckpointFlag 
            position={[-5, 0, 0]} 
            onReach={() => handleCheckpoint(1)}
            passed={checkpointsPassed[1]}
          />
          <CheckpointFlag 
            position={[0, 0, 5]} 
            onReach={() => handleCheckpoint(2)}
            passed={checkpointsPassed[2]}
          />
          
          {/* Gravity Orbs */}
          <GravityOrb position={[2, 1, 2]} onCollect={onPowerUpCollect} />
          <GravityOrb position={[-2, 1, -2]} onCollect={onPowerUpCollect} />
          <GravityOrb position={[6, 1, 0]} onCollect={onPowerUpCollect} />
          <GravityOrb position={[-6, 1, 0]} onCollect={onPowerUpCollect} />
        </>
      )}
    </>
  );
}
