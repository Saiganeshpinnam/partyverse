import { useState, useRef, useEffect, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  Float, 
  Stars,
  Trail,
  Sphere,
  Box,
  Cylinder,
  Cone,
  Text,
  Torus
} from '@react-three/drei';
import * as THREE from 'three';

interface RocketDriftArenaProps {
  gameState: any;
  onTargetHit: () => void;
  onPowerUpCollect: () => void;
}

// Enhanced Rocket Ship with User Controls
const RocketShip = forwardRef<THREE.Group, { 
  position: [number, number, number]; 
  color: string;
  onBoost: () => void;
}>(({ position, color, onBoost }, ref) => {
  const meshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [boosting, setBoosting] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 });
  
  // Use the forwarded ref or internal ref
  const groupRef = (ref as React.RefObject<THREE.Group>) || meshRef;
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setVelocity(v => ({ ...v, z: Math.max(v.z - 0.5, -3) }));
          break;
        case 's':
        case 'arrowdown':
          setVelocity(v => ({ ...v, z: Math.min(v.z + 0.5, 3) }));
          break;
        case 'a':
        case 'arrowleft':
          setVelocity(v => ({ ...v, x: Math.max(v.x - 0.5, -3) }));
          break;
        case 'd':
        case 'arrowright':
          setVelocity(v => ({ ...v, x: Math.min(v.x + 0.5, 3) }));
          break;
        case ' ':
          setBoosting(true);
          onBoost();
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setBoosting(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onBoost]);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Apply velocity with damping
      const damping = 0.95;
      setVelocity(v => ({
        x: v.x * damping,
        y: v.y * damping,
        z: v.z * damping
      }));
      
      // Update position
      groupRef.current.position.x += velocity.x * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      groupRef.current.position.z += velocity.z * 0.1;
      
      // Constrain position
      groupRef.current.position.x = Math.max(-8, Math.min(8, groupRef.current.position.x));
      groupRef.current.position.z = Math.max(-8, Math.min(8, groupRef.current.position.z));
      
      // Banking effect when turning
      groupRef.current.rotation.z = -velocity.x * 0.1;
      groupRef.current.rotation.y = velocity.x * 0.05;
      
      // Boost effect
      if (boosting) {
        groupRef.current.scale.set(1.1, 1.1, 1.1);
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
      
      // Update camera to follow rocket
      camera.position.x = groupRef.current.position.x;
      camera.position.z = groupRef.current.position.z + 10;
      camera.lookAt(groupRef.current.position);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        {/* Rocket Body */}
        <Cylinder args={[0.2, 0.3, 1, 8]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </Cylinder>
        
        {/* Rocket Nose */}
        <Cone args={[0.3, 0.4, 8]} position={[0, 0.7, 0]}>
          <meshStandardMaterial 
            color="#ff4444" 
            emissive="#ff4444" 
            emissiveIntensity={0.3}
          />
        </Cone>
        
        {/* Rocket Fins */}
        <Box args={[0.1, 0.3, 0.4]} position={[0.25, -0.2, 0]}>
          <meshStandardMaterial color="#ff6666" />
        </Box>
        <Box args={[0.1, 0.3, 0.4]} position={[-0.25, -0.2, 0]}>
          <meshStandardMaterial color="#ff6666" />
        </Box>
        <Box args={[0.4, 0.3, 0.1]} position={[0, -0.2, 0.25]}>
          <meshStandardMaterial color="#ff6666" />
        </Box>
        <Box args={[0.4, 0.3, 0.1]} position={[0, -0.2, -0.25]}>
          <meshStandardMaterial color="#ff6666" />
        </Box>
        
        {/* Enhanced Rocket Flames */}
        <Cone args={[0.15, boosting ? 1.2 : 0.6, 6]} position={[0, -0.8, 0]}>
          <meshStandardMaterial 
            color={boosting ? "#00ffff" : "#ffaa00"} 
            emissive={boosting ? "#00ffff" : "#ff6600"} 
            emissiveIntensity={1}
            transparent
            opacity={0.8}
          />
        </Cone>
        
        {/* Boost particles */}
        {boosting && (
          <>
            <Sphere args={[0.05, 4, 4]} position={[0.1, -1.2, 0.1]}>
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
            </Sphere>
            <Sphere args={[0.05, 4, 4]} position={[-0.1, -1.2, -0.1]}>
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
            </Sphere>
          </>
        )}
      </Float>
      
      <pointLight position={[0, 0, 0]} intensity={boosting ? 1 : 0.5} color={color} />
    </group>
  );
});

RocketShip.displayName = 'RocketShip';

// Enhanced Drift Ring with Collision Detection
function DriftRing({ position, color, onPass, playerPos }: { 
  position: [number, number, number]; 
  color: string;
  onPass: () => void;
  playerPos: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [passed, setPassed] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !passed) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
      
      // Enhanced collision detection
      const ringPos = new THREE.Vector3(...position);
      const distance = playerPos.distanceTo(ringPos);
      
      if (distance < 1.5) {
        setPassed(true);
        onPass();
        
        // Visual feedback
        const scale = meshRef.current.scale;
        scale.set(1.5, 1.5, 1.5);
        setTimeout(() => scale.set(1, 1, 1), 200);
      }
    }
  });

  if (passed) return null;

  return (
    <group position={position} ref={meshRef}>
      <Trail
        width={0.2}
        length={15}
        color={color}
        attenuation={(width) => width}
      >
        <Torus args={[1.5, 0.15, 16, 100]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.3}
          />
        </Torus>
      </Trail>
      
      {/* Ring particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.05, 8, 8]}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 1.5,
            Math.sin((i / 8) * Math.PI * 2) * 0.3,
            Math.sin((i / 8) * Math.PI * 2) * 1.5
          ]}
        >
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={1}
          />
        </Sphere>
      ))}
      
      <pointLight position={[0, 0, 0]} intensity={1} color={color} />
    </group>
  );
}

// Enhanced Asteroid with Movement
function Asteroid({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [rotationSpeed] = useState(() => ({
    x: Math.random() * 0.5,
    y: Math.random() * 0.5,
    z: Math.random() * 0.3
  }));
  const [movementSpeed] = useState(() => ({
    x: (Math.random() - 0.5) * 0.02,
    z: (Math.random() - 0.5) * 0.02
  }));
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed.x * 0.01;
      meshRef.current.rotation.y += rotationSpeed.y * 0.01;
      meshRef.current.rotation.z += rotationSpeed.z * 0.01;
      
      // Slow drift movement
      meshRef.current.position.x += movementSpeed.x;
      meshRef.current.position.z += movementSpeed.z;
      
      // Wrap around boundaries
      if (Math.abs(meshRef.current.position.x) > 10) {
        meshRef.current.position.x *= -1;
      }
      if (Math.abs(meshRef.current.position.z) > 10) {
        meshRef.current.position.z *= -1;
      }
    }
  });

  return (
    <group position={position}>
      <Box ref={meshRef} args={[0.8, 0.8, 0.8]}>
        <meshStandardMaterial 
          color="#8b7355" 
          emissive="#8b4513" 
          emissiveIntensity={0.2}
          roughness={0.8}
        />
      </Box>
      <pointLight position={[0, 0, 0]} intensity={0.2} color="#8b4513" />
    </group>
  );
}

// Enhanced Speed Boost with Animation
function SpeedBoost({ position, onCollect, playerPos }: { 
  position: [number, number, number];
  onCollect: () => void;
  playerPos: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [collected, setCollected] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 4;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.4;
      
      // Proximity detection
      const boostPos = new THREE.Vector3(...position);
      const distance = playerPos.distanceTo(boostPos);
      
      if (distance < 1.2) {
        setCollected(true);
        onCollect();
      }
    }
  });

  if (collected) return null;

  return (
    <group position={position} ref={meshRef}>
      <Float speed={6} rotationIntensity={2} floatIntensity={1}>
        <Torus args={[0.3, 0.08, 16, 100]}>
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00" 
            emissiveIntensity={1}
            metalness={0.9}
            roughness={0.1}
          />
        </Torus>
        <Sphere args={[0.2, 16, 16]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ff00" 
            emissiveIntensity={0.8}
          />
        </Sphere>
      </Float>
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#00ff00" />
    </group>
  );
}

// Game Controller Component
function GameController({ gameState, onTargetHit, onPowerUpCollect }: RocketDriftArenaProps) {
  const { camera } = useThree();
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 0));
  const rocketRef = useRef<THREE.Group>(null);
  
  // Update player position for collision detection
  useFrame(() => {
    if (rocketRef.current) {
      setPlayerPosition(rocketRef.current.position.clone());
    }
  });

  return (
    <>
      <Environment preset="night" />
      <Stars radius={200} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#00ffff" />
      
      {/* Space Arena */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#000033" 
          emissive="#000066" 
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Player Rocket */}
      <RocketShip 
        ref={rocketRef}
        position={[0, 0, 0]} 
        color="#00ffff" 
        onBoost={onPowerUpCollect}
      />
      
      {/* Game Elements */}
      {gameState.isPlaying && !gameState.isPaused && (
        <>
          <DriftRing position={[5, 2, -8]} color="#ffff00" onPass={onTargetHit} playerPos={playerPosition} />
          <DriftRing position={[-6, 3, 5]} color="#ffff00" onPass={onTargetHit} playerPos={playerPosition} />
          <DriftRing position={[8, 1, 3]} color="#ffff00" onPass={onTargetHit} playerPos={playerPosition} />
          <DriftRing position={[-4, 4, -6]} color="#ffff00" onPass={onTargetHit} playerPos={playerPosition} />
          
          <Asteroid position={[3, 1, 2]} />
          <Asteroid position={[-5, 2, -3]} />
          <Asteroid position={[7, 3, -1]} />
          <Asteroid position={[-2, 1, 4]} />
          
          <SpeedBoost position={[2, 2, -5]} onCollect={onPowerUpCollect} playerPos={playerPosition} />
          <SpeedBoost position={[-3, 3, 2]} onCollect={onPowerUpCollect} playerPos={playerPosition} />
          <SpeedBoost position={[6, 1, -2]} onCollect={onPowerUpCollect} playerPos={playerPosition} />
        </>
      )}
      
      {/* Instructions */}
      {!gameState.isPlaying && (
        <Text
          position={[0, 2, -5]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Use WASD or Arrow Keys to move • SPACE to boost
        </Text>
      )}
    </>
  );
}

export default function RocketDriftArena({ gameState, onTargetHit, onPowerUpCollect }: RocketDriftArenaProps) {
  return <GameController gameState={gameState} onTargetHit={onTargetHit} onPowerUpCollect={onPowerUpCollect} />;
}
