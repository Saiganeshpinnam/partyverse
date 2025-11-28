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
  Plane,
  Text,
  Torus
} from '@react-three/drei';
import * as THREE from 'three';

interface LaserMazeEscapeProps {
  gameState: any;
  onTargetHit: () => void;
  onPowerUpCollect: () => void;
}

// Enhanced Player Character with Controls
const PlayerCharacter = forwardRef<THREE.Group, { 
  position: [number, number, number]; 
  color: string;
  onShield: () => void;
}>(({ position, color, onShield }, ref) => {
  const meshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [velocity, setVelocity] = useState({ x: 0, z: 0 });
  const [shielded, setShielded] = useState(false);
  
  // Use the forwarded ref or internal ref
  const groupRef = (ref as React.RefObject<THREE.Group>) || meshRef;
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setVelocity(v => ({ ...v, z: Math.max(v.z - 0.3, -2) }));
          break;
        case 's':
        case 'arrowdown':
          setVelocity(v => ({ ...v, z: Math.min(v.z + 0.3, 2) }));
          break;
        case 'a':
        case 'arrowleft':
          setVelocity(v => ({ ...v, x: Math.max(v.x - 0.3, -2) }));
          break;
        case 'd':
        case 'arrowright':
          setVelocity(v => ({ ...v, x: Math.min(v.x + 0.3, 2) }));
          break;
        case ' ':
          setShielded(true);
          onShield();
          setTimeout(() => setShielded(false), 1000);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onShield]);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Apply velocity with damping
      const damping = 0.92;
      setVelocity(v => ({
        x: v.x * damping,
        z: v.z * damping
      }));
      
      // Update position
      groupRef.current.position.x += velocity.x * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.position.z += velocity.z * 0.1;
      
      // Constrain position
      groupRef.current.position.x = Math.max(-6, Math.min(6, groupRef.current.position.x));
      groupRef.current.position.z = Math.max(-6, Math.min(6, groupRef.current.position.z));
      
      // Walking animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.1;
      
      // Update camera to follow player
      camera.position.x = groupRef.current.position.x;
      camera.position.z = groupRef.current.position.z + 8;
      camera.lookAt(groupRef.current.position);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.1}>
        {/* Shield Effect */}
        {shielded && (
          <Sphere args={[1.2, 16, 16]}>
            <meshStandardMaterial 
              color="#00ffff" 
              emissive="#00ffff" 
              emissiveIntensity={0.8}
              transparent
              opacity={0.3}
            />
          </Sphere>
        )}
        
        {/* Player Body */}
        <Box args={[0.4, 0.6, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.5}
          />
        </Box>
        
        {/* Player Head */}
        <Sphere args={[0.2, 16, 16]} position={[0, 0.4, 0]}>
          <meshStandardMaterial 
            color="#ffdddd" 
            emissive="#ffaaaa" 
            emissiveIntensity={0.2}
          />
        </Sphere>
        
        {/* Cyber Helmet */}
        <Box args={[0.25, 0.15, 0.25]} position={[0, 0.55, 0]}>
          <meshStandardMaterial 
            color="#333333" 
            emissive="#666666" 
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      </Float>
      
      <pointLight position={[0, 0.5, 0]} intensity={shielded ? 1 : 0.3} color={shielded ? "#00ffff" : color} />
    </group>
  );
});

PlayerCharacter.displayName = 'PlayerCharacter';

// Enhanced Laser Beam with Movement
function LaserBeam({ position, rotation, color, playerPos }: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  color: string;
  playerPos: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(true);
  const [intensity, setIntensity] = useState(1);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing effect
      setIntensity(0.7 + Math.sin(state.clock.elapsedTime * 8) * 0.3);
      
      // Check collision with player
      const laserPos = new THREE.Vector3(...position);
      const distance = playerPos.distanceTo(laserPos);
      
      if (distance < 0.5) {
        // Flash red when hit
        (meshRef.current.material as THREE.MeshStandardMaterial).color = new THREE.Color("#ff0000");
        setTimeout(() => {
          if (meshRef.current) {
            (meshRef.current.material as THREE.MeshStandardMaterial).color = new THREE.Color(color);
          }
        }, 100);
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <Box ref={meshRef} args={[0.1, 0.1, 8]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={intensity}
          transparent
          opacity={0.8}
        />
      </Box>
      <pointLight position={[0, 0, 0]} intensity={intensity} color={color} />
    </group>
  );
}

// Moving Laser Beam
function MovingLaserBeam({ position, axis, range, color, playerPos }: {
  position: [number, number, number];
  axis: 'x' | 'z';
  range: number;
  color: string;
  playerPos: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const offset = Math.sin(state.clock.elapsedTime * 0.5) * range;
      if (axis === 'x') {
        meshRef.current.position.x = position[0] + offset;
      } else {
        meshRef.current.position.z = position[2] + offset;
      }
    }
  });

  return (
    <LaserBeam position={position} rotation={[0, 0, 0]} color={color} playerPos={playerPos} />
  );
}

// Enhanced Maze Wall
function MazeWall({ position, size }: { 
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
      
      {/* Wall Edge Glow */}
      <Box args={[size[0] + 0.1, size[1] + 0.1, size[2] + 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </Box>
    </group>
  );
}

// Enhanced Exit Portal
function ExitPortal({ position, onReach, playerPos }: { 
  position: [number, number, number];
  onReach: () => void;
  playerPos: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [reached, setReached] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !reached) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      
      // Check if player reached exit
      const portalPos = new THREE.Vector3(...position);
      const distance = playerPos.distanceTo(portalPos);
      
      if (distance < 1) {
        setReached(true);
        onReach();
      }
    }
  });

  if (reached) return null;

  return (
    <group position={position} ref={meshRef}>
      <Torus args={[0.8, 0.2, 16, 100]}>
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </Torus>
      
      {/* Portal center */}
      <Sphere args={[0.5, 16, 16]}>
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#00ff00" 
          emissiveIntensity={1}
          transparent
          opacity={0.7}
        />
      </Sphere>
      
      {/* Portal particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.05, 6, 6]}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.6,
            Math.sin((i / 6) * Math.PI * 2) * 0.3,
            Math.sin((i / 6) * Math.PI * 2) * 0.6
          ]}
        >
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ff00" 
            emissiveIntensity={2}
          />
        </Sphere>
      ))}
      
      <pointLight position={[0, 0, 0]} intensity={2} color="#00ff00" />
    </group>
  );
}

// Enhanced Shield Power-up
function ShieldPowerUp({ position, onCollect, playerPos }: { 
  position: [number, number, number];
  onCollect: () => void;
  playerPos: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [collected, setCollected] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      
      // Proximity detection
      const powerUpPos = new THREE.Vector3(...position);
      const distance = playerPos.distanceTo(powerUpPos);
      
      if (distance < 1) {
        setCollected(true);
        onCollect();
      }
    }
  });

  if (collected) return null;

  return (
    <group position={position} ref={meshRef}>
      <Float speed={5} rotationIntensity={1.5} floatIntensity={0.8}>
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff" 
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </Sphere>
        
        {/* Shield symbol */}
        <Box args={[0.4, 0.4, 0.1]} position={[0, 0, 0.15]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ffff" 
            emissiveIntensity={0.6}
          />
        </Box>
      </Float>
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#00ffff" />
    </group>
  );
}

// Security Camera with Movement
function SecurityCamera({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.2;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      {/* Camera Body */}
      <Box args={[0.3, 0.2, 0.3]}>
        <meshStandardMaterial 
          color="#333333" 
          emissive="#666666" 
          emissiveIntensity={0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      
      {/* Camera Lens */}
      <Sphere args={[0.08, 8, 8]} position={[0, 0, 0.16]}>
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.8}
        />
      </Sphere>
      
      {/* Camera Light */}
      <pointLight position={[0, 0, 0.2]} intensity={0.5} color="#ff0000" />
    </group>
  );
}

// Game Controller Component
function GameController({ gameState, onTargetHit, onPowerUpCollect }: LaserMazeEscapeProps) {
  const { camera } = useThree();
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 0));
  const playerRef = useRef<THREE.Group>(null);
  
  // Update player position for collision detection
  useFrame(() => {
    if (playerRef.current) {
      setPlayerPosition(playerRef.current.position.clone());
    }
  });

  return (
    <>
      <Environment preset="night" />
      <Stars radius={150} depth={50} count={6000} factor={4} saturation={0} fade />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} color="#ff6b35" />
      <pointLight position={[0, 8, 0]} intensity={0.3} color="#ff6b35" />
      
      {/* Maze Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          emissive="#0f3460" 
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Player Character */}
      <PlayerCharacter 
        ref={playerRef}
        position={[0, 0, 0]} 
        color="#00ffff" 
        onShield={onPowerUpCollect}
      />
      
      {/* Game Elements */}
      {gameState.isPlaying && !gameState.isPaused && (
        <>
          {/* Maze Walls */}
          <MazeWall position={[4, 1, 0]} size={[0.5, 3, 8]} />
          <MazeWall position={[-4, 1, 0]} size={[0.5, 3, 8]} />
          <MazeWall position={[0, 1, 4]} size={[8, 3, 0.5]} />
          <MazeWall position={[0, 1, -4]} size={[8, 3, 0.5]} />
          <MazeWall position={[2, 1, 2]} size={[4, 3, 0.5]} />
          <MazeWall position={[-2, 1, -2]} size={[4, 3, 0.5]} />
          
          {/* Laser Beams */}
          <LaserBeam position={[0, 0.5, 0]} rotation={[0, Math.PI/2, 0]} color="#ff0000" playerPos={playerPosition} />
          <LaserBeam position={[2, 0.5, 2]} rotation={[Math.PI/2, 0, 0]} color="#ff0000" playerPos={playerPosition} />
          <LaserBeam position={[-2, 0.5, -2]} rotation={[Math.PI/2, 0, 0]} color="#ff0000" playerPos={playerPosition} />
          
          {/* Moving Lasers */}
          <MovingLaserBeam position={[0, 1, 3]} axis="x" range={2} color="#ff00ff" playerPos={playerPosition} />
          <MovingLaserBeam position={[3, 1, 0]} axis="z" range={2} color="#ff00ff" playerPos={playerPosition} />
          
          {/* Security Cameras */}
          <SecurityCamera position={[1, 2.5, 1]} />
          <SecurityCamera position={[-1, 2.5, -1]} />
          <SecurityCamera position={[3, 2.5, 3]} />
          <SecurityCamera position={[-3, 2.5, -3]} />
          
          {/* Exit Portal */}
          <ExitPortal position={[0, 0.5, -3]} onReach={onTargetHit} playerPos={playerPosition} />
          
          {/* Shield Power-ups */}
          <ShieldPowerUp position={[1, 0.5, 1]} onCollect={onPowerUpCollect} playerPos={playerPosition} />
          <ShieldPowerUp position={[-1, 0.5, -1]} onCollect={onPowerUpCollect} playerPos={playerPosition} />
          <ShieldPowerUp position={[2, 0.5, 2]} onCollect={onPowerUpCollect} playerPos={playerPosition} />
        </>
      )}
    </>
  );
}

export default function LaserMazeEscape({ gameState, onTargetHit, onPowerUpCollect }: LaserMazeEscapeProps) {
  return <GameController gameState={gameState} onTargetHit={onTargetHit} onPowerUpCollect={onPowerUpCollect} />;
}
