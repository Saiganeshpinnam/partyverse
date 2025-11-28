import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Sphere, Box, Cylinder, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useUserStore, AvatarConfig } from '@/stores/userStore';

// Stylized character mesh (placeholder for GLB models)
function StylizedAvatar({ config }: { config: AvatarConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Idle animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const skinColors: Record<string, string> = {
    default: '#ffdbac',
    tan: '#c68642',
    dark: '#8d5524',
    pale: '#ffe0bd',
    robot: '#808080',
  };

  const outfitColors: Record<string, string> = {
    'cyber-jacket': '#00ffff',
    'neon-suit': '#ff00ff',
    'holo-armor': '#8b5cf6',
    'street-wear': '#ff6b35',
    'classic': '#ffffff',
  };

  const hairStyles: Record<string, [number, number, number]> = {
    spiky: [0.35, 0.4, 0.35],
    long: [0.4, 0.5, 0.35],
    short: [0.32, 0.25, 0.32],
    mohawk: [0.15, 0.5, 0.3],
    bald: [0, 0, 0],
  };

  const hairDimensions = hairStyles[config.hair] || hairStyles.spiky;
  const skinColor = skinColors[config.skin] || skinColors.default;
  const outfitColor = outfitColors[config.outfit] || outfitColors['cyber-jacket'];

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>

        {/* Head */}
        <Sphere args={[0.3, 32, 32]} position={[0, 1.1, 0]}>
          <meshStandardMaterial color={skinColor} roughness={0.5} metalness={0.1} />
        </Sphere>

        {/* Hair */}
        {config.hair !== 'bald' && (
          <Box args={hairDimensions} position={[0, 1.35, 0]}>
            <meshStandardMaterial 
              color={config.hairColor} 
              emissive={config.hairColor}
              emissiveIntensity={0.3}
              roughness={0.3} 
              metalness={0.5} 
            />
          </Box>
        )}

        {/* Eyes */}
        <Sphere args={[0.05, 16, 16]} position={[-0.1, 1.15, 0.25]}>
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
          />
        </Sphere>
        <Sphere args={[0.05, 16, 16]} position={[0.1, 1.15, 0.25]}>
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
          />
        </Sphere>

        {/* Glasses */}
        {config.glasses !== 'none' && (
          <group position={[0, 1.15, 0.28]}>
            <Box args={[0.15, 0.08, 0.02]} position={[-0.1, 0, 0]}>
              <meshStandardMaterial 
                color={config.glasses === 'gaming-goggles' ? '#ff00ff' : '#00ffff'}
                emissive={config.glasses === 'gaming-goggles' ? '#ff00ff' : '#00ffff'}
                emissiveIntensity={0.5}
                transparent
                opacity={0.7}
              />
            </Box>

            <Box args={[0.15, 0.08, 0.02]} position={[0.1, 0, 0]}>
              <meshStandardMaterial 
                color={config.glasses === 'gaming-goggles' ? '#ff00ff' : '#00ffff'}
                emissive={config.glasses === 'gaming-goggles' ? '#ff00ff' : '#00ffff'}
                emissiveIntensity={0.5}
                transparent
                opacity={0.7}
              />
            </Box>

            <Box args={[0.05, 0.02, 0.02]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#333" metalness={0.8} />
            </Box>
          </group>
        )}

        {/* Torso */}
        <Cylinder args={[0.2, 0.25, 0.6, 8]} position={[0, 0.5, 0]}>
          <meshStandardMaterial 
            color={outfitColor}
            emissive={outfitColor}
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.6}
          />
        </Cylinder>

        {/* Shoulder Pads */}
        <Box args={[0.15, 0.1, 0.15]} position={[-0.28, 0.65, 0]}>
          <meshStandardMaterial 
            color={outfitColor}
            emissive={outfitColor}
            emissiveIntensity={0.5}
            metalness={0.8}
          />
        </Box>
        <Box args={[0.15, 0.1, 0.15]} position={[0.28, 0.65, 0]}>
          <meshStandardMaterial 
            color={outfitColor}
            emissive={outfitColor}
            emissiveIntensity={0.5}
            metalness={0.8}
          />
        </Box>

        {/* Arms */}
        <Cylinder args={[0.08, 0.06, 0.5, 8]} position={[-0.35, 0.35, 0]} rotation={[0, 0, 0.3]}>
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </Cylinder>
        <Cylinder args={[0.08, 0.06, 0.5, 8]} position={[0.35, 0.35, 0]} rotation={[0, 0, -0.3]}>
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </Cylinder>

        {/* Legs */}
        <Cylinder args={[0.1, 0.08, 0.5, 8]} position={[-0.12, -0.1, 0]}>
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.5} />
        </Cylinder>
        <Cylinder args={[0.1, 0.08, 0.5, 8]} position={[0.12, -0.1, 0]}>
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.5} />
        </Cylinder>

        {/* Outfit Trim */}
        <Box args={[0.42, 0.02, 0.26]} position={[0, 0.75, 0]}>
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
          />
        </Box>

        {/* Platform */}
        <Cylinder args={[0.5, 0.5, 0.05, 32]} position={[0, -0.4, 0]}>
          <meshStandardMaterial 
            color="#0a0a1a"
            emissive="#00ffff"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </Cylinder>
      </group>
    </Float>
  );
}

function LoadingFallback() {
  return (
    <Sphere args={[0.5, 32, 32]}>
      <MeshDistortMaterial
        color="#00ffff"
        distort={0.3}
        speed={2}
        roughness={0}
        metalness={0.8}
        emissive="#00ffff"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
}

interface AvatarPreviewProps {
  config?: AvatarConfig;
  enableControls?: boolean;
}

export function AvatarPreview({ config, enableControls = true }: AvatarPreviewProps) {
  const userAvatar = useUserStore((state) => state.user?.avatar);

  const avatarConfig = config || userAvatar || {
    gender: 'male',
    avatarModel: 'cyber-punk-1',
    hair: 'spiky',
    hairColor: '#00ffff',
    skin: 'default',
    glasses: 'none',
    emotes: ['wave'],
    colorScheme: 'neon-cyan',
    outfit: 'cyber-jacket',
  };

  return (
    <Canvas
      camera={{ position: [0, 1.4, 3], fov: 35 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
      shadows
    >
      <color attach="background" args={['#0b0e19']} />

      {/* Lighting */}
      <ambientLight intensity={0.7} />

      <directionalLight
        castShadow
        intensity={1.4}
        position={[3, 5, 4]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <directionalLight
        intensity={0.8}
        position={[-3, 3, -3]}
      />

      <Suspense fallback={<LoadingFallback />}>
        <group position={[0, -0.4, 0]} scale={[1.6, 1.6, 1.6]}>
          <StylizedAvatar config={avatarConfig} />
        </group>
      </Suspense>

      {enableControls && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1.2, 0]}
          rotateSpeed={0.6}
        />
      )}

      <Environment preset="night" />
    </Canvas>
  );
}
