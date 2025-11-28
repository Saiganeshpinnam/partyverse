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

interface HackRushProps {
  gameState: any;
  onTargetHit: () => void;
  onPowerUpCollect: () => void;
}

// Hacker Character
function HackerCharacter({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      
      // Typing animation
      const typing = Math.sin(state.clock.elapsedTime * 10) > 0.5;
      if (typing) {
        meshRef.current.position.x = position[0] + 0.05;
      }
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.1}>
        {/* Hacker Body */}
        <Box args={[0.4, 0.5, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.5}
          />
        </Box>
        
        {/* Hacker Head */}
        <Sphere args={[0.2, 16, 16]} position={[0, 0.4, 0]}>
          <meshStandardMaterial 
            color="#333333" 
            emissive="#666666" 
            emissiveIntensity={0.1}
          />
        </Sphere>
        
        {/* Laptop */}
        <Box args={[0.6, 0.05, 0.4]} position={[0.3, 0, 0]} rotation={[0, 0.2, 0]}>
          <meshStandardMaterial 
            color="#222222" 
            emissive="#444444" 
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
        
        {/* Screen */}
        <Box args={[0.5, 0.3, 0.02]} position={[0.3, 0.15, 0]} rotation={[0, 0.2, 0]}>
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00" 
            emissiveIntensity={0.8}
          />
        </Box>
        
        {/* Hacker Hood */}
        <Sphere args={[0.22, 16, 16]} position={[0, 0.45, 0]}>
          <meshStandardMaterial 
            color="#000000" 
            emissive="#000000" 
            emissiveIntensity={0.1}
          />
        </Sphere>
      </Float>
      
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color="#00ff00" />
    </group>
  );
}

// Data Node
function DataNode({ position, color, onHack }: { 
  position: [number, number, number]; 
  color: string;
  onHack: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hacked, setHacked] = useState(false);
  const [hackingProgress, setHackingProgress] = useState(0);
  
  useFrame((state) => {
    if (meshRef.current && !hacked) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Simulate hacking progress
      if (Math.random() < 0.01) {
        setHackingProgress(prev => {
          if (prev >= 1) {
            setHacked(true);
            onHack();
            return 1;
          }
          return prev + 0.1;
        });
      }
    }
  });

  if (hacked) return null;

  return (
    <group position={position} ref={meshRef}>
      <Trail
        width={0.2}
        length={10}
        color={color}
        attenuation={(width) => width}
      >
        <Sphere args={[0.4, 16, 16]}>
          <meshStandardMaterial 
            color={hacked ? "#00ff00" : color} 
            emissive={hacked ? "#00ff00" : color} 
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.3}
          />
        </Sphere>
      </Trail>
      
      {/* Data Rings */}
      <Torus args={[0.6, 0.05, 8, 16]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.4}
        />
      </Torus>
      <Torus args={[0.6, 0.05, 8, 16]} rotation={[0, Math.PI/2, 0]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.4}
        />
      </Torus>
      
      {/* Hacking Progress Indicator */}
      {hackingProgress > 0 && (
        <Torus 
          args={[0.8, 0.05, 16, 100]} 
          rotation={[Math.PI/2, 0, 0]}
        >
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00" 
            emissiveIntensity={0.8}
            transparent
            opacity={hackingProgress}
          />
        </Torus>
      )}
      
      <pointLight position={[0, 0, 0]} intensity={1} color={color} />
    </group>
  );
}

// Firewall Barrier
function FirewallBarrier({ position, size, active }: { 
  position: [number, number, number]; 
  size: [number, number, number];
  active: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && active) {
      const intensity = Math.sin(state.clock.elapsedTime * 8) * 0.3 + 0.7;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  if (!active) return null;

  return (
    <group position={position}>
      <Box ref={meshRef} args={size}>
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </Box>
      
      {/* Firewall Grid */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Box 
          key={`h-${i}`}
          args={[size[0], 0.02, size[2]]} 
          position={[0, -size[1]/2 + (i + 1) * size[1]/6, 0]}
        >
          <meshStandardMaterial 
            color="#ff6600" 
            emissive="#ff6600" 
            emissiveIntensity={0.4}
            transparent
            opacity={0.8}
          />
        </Box>
      ))}
      
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#ff0000" />
    </group>
  );
}

// Code Fragment
function CodeFragment({ position, onCollect }: { 
  position: [number, number, number];
  onCollect: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [collected, setCollected] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 3;
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
      <Float speed={6} rotationIntensity={2} floatIntensity={1}>
        <Box args={[0.2, 0.2, 0.2]}>
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff" 
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </Box>
        
        {/* Code Lines */}
        <Plane args={[0.3, 0.3]} position={[0, 0, 0.11]}>
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ffff" 
            emissiveIntensity={0.4}
          />
        </Plane>
      </Float>
      
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#00ffff" />
    </group>
  );
}

// Security Camera
function SecurityCamera({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
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

export default function HackRush({ gameState, onTargetHit, onPowerUpCollect }: HackRushProps) {
  const [firewallsActive, setFirewallsActive] = useState([true, true, false]);
  
  useFrame((state) => {
    // Toggle firewalls periodically
    const cycle = Math.floor(state.clock.elapsedTime / 5) % 3;
    setFirewallsActive([
      cycle === 0,
      cycle === 1,
      cycle === 2
    ]);
  });

  return (
    <>
      <Environment preset="night" />
      <Stars radius={120} depth={50} count={5000} factor={4} saturation={0} fade />
      
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#00ff00" />
      <pointLight position={[0, 8, 0]} intensity={0.3} color="#00ff00" />
      
      {/* Cyber Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#001100" 
          emissive="#003300" 
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Grid Floor Pattern */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Box 
          key={`grid-x-${i}`}
          args={[0.1, 0.01, 20]} 
          position={[-9 + i * 2, -1.99, 0]}
        >
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00" 
            emissiveIntensity={0.2}
          />
        </Box>
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <Box 
          key={`grid-z-${i}`}
          args={[20, 0.01, 0.1]} 
          position={[0, -1.99, -9 + i * 2]}
        >
          <meshStandardMaterial 
            color="#00ff00" 
            emissive="#00ff00" 
            emissiveIntensity={0.2}
          />
        </Box>
      ))}
      
      {/* Player Hacker */}
      <HackerCharacter position={[0, 0, 0]} color="#00ff00" />
      
      {gameState.isPlaying && !gameState.isPaused && (
        <>
          {/* Data Nodes to Hack */}
          <DataNode position={[4, 1, 4]} color="#ffff00" onHack={onTargetHit} />
          <DataNode position={[-4, 1, -4]} color="#ffff00" onHack={onTargetHit} />
          <DataNode position={[6, 2, -3]} color="#ffff00" onHack={onTargetHit} />
          <DataNode position={[-6, 2, 3]} color="#ffff00" onHack={onTargetHit} />
          
          {/* Firewall Barriers */}
          <FirewallBarrier position={[0, 1, 6]} size={[8, 2, 0.3]} active={firewallsActive[0]} />
          <FirewallBarrier position={[0, 1, -6]} size={[8, 2, 0.3]} active={firewallsActive[1]} />
          <FirewallBarrier position={[8, 1, 0]} size={[0.3, 2, 12]} active={firewallsActive[2]} />
          <FirewallBarrier position={[-8, 1, 0]} size={[0.3, 2, 12]} active={firewallsActive[0]} />
          
          {/* Security Cameras */}
          <SecurityCamera position={[3, 3, 3]} />
          <SecurityCamera position={[-3, 3, -3]} />
          <SecurityCamera position={[5, 3, -5]} />
          <SecurityCamera position={[-5, 3, 5]} />
          
          {/* Code Fragments */}
          <CodeFragment position={[2, 0.5, 2]} onCollect={onPowerUpCollect} />
          <CodeFragment position={[-2, 0.5, -2]} onCollect={onPowerUpCollect} />
          <CodeFragment position={[4, 0.5, 0]} onCollect={onPowerUpCollect} />
          <CodeFragment position={[-4, 0.5, 0]} onCollect={onPowerUpCollect} />
          <CodeFragment position={[0, 0.5, 3]} onCollect={onPowerUpCollect} />
          <CodeFragment position={[0, 0.5, -3]} onCollect={onPowerUpCollect} />
        </>
      )}
    </>
  );
}
