import { useState, useEffect, useRef, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Pause, Play, RotateCcw, Trophy, Zap, Target } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  Float, 
  Text3D, 
  Center,
  PerspectiveCamera,
  Stars,
  Trail,
  MeshDistortMaterial,
  Sphere,
  Box,
  Torus,
  Cone,
  Cylinder
} from '@react-three/drei';
import * as THREE from 'three';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';

// Import game components
import RocketDriftArena from '@/components/games/RocketDriftArena';
import LaserMazeEscape from '@/components/games/LaserMazeEscape';
import GravityFlipRace from '@/components/games/GravityFlipRace';
import PortalShooterGame from '@/components/games/PortalShooter';
import HackRush from '@/components/games/HackRush';
import NeonRacing from '@/components/games/NeonRacing';

// Game configuration
const gameConfig = {
  'rocket-drift': {
    name: 'Rocket Drift Arena',
    component: RocketDriftArena,
    description: 'Navigate through space rings and avoid asteroids!'
  },
  'laser-maze': {
    name: 'Laser Maze Escape',
    component: LaserMazeEscape,
    description: 'Escape the maze avoiding laser barriers!'
  },
  'gravity-flip': {
    name: 'Gravity Flip Race',
    component: GravityFlipRace,
    description: 'Race through gravity-defying platforms!'
  },
  'portal-shooter': {
    name: 'Portal Shooter',
    component: PortalShooterGame,
    description: 'Shoot portals and defeat enemy drones!'
  },
  'hack-rush': {
    name: 'Hack Rush',
    component: HackRush,
    description: 'Hack data nodes while avoiding security!'
  },
  'neon-racing': {
    name: 'Neon Racing',
    component: NeonRacing,
    description: 'Race through neon-lit tracks at high speed!'
  }
};
interface GameObject {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  color: string;
  type: 'player' | 'target' | 'obstacle' | 'powerup';
}

interface GameState {
  score: number;
  lives: number;
  level: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameTime: number;
}

// Main Game Component
export default function Game() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    isPlaying: false,
    isPaused: false,
    gameTime: 0
  });

  const [gameStarted, setGameStarted] = useState(false);
  
  // Get the current game configuration
  const currentGame = gameConfig[gameId as keyof typeof gameConfig];
  
  // If game not found, redirect to lobby
  useEffect(() => {
    if (!currentGame) {
      navigate('/lobby');
    }
  }, [currentGame, navigate]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const timer = setInterval(() => {
        setGameState(prev => ({ ...prev, gameTime: prev.gameTime + 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.isPlaying, gameState.isPaused]);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      score: 0,
      lives: 3,
      level: 1,
      gameTime: 0
    }));
    setGameStarted(true);
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      score: 0,
      lives: 3,
      level: 1,
      gameTime: 0
    }));
    setGameStarted(false);
  };

  const handleTargetHit = () => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 100
    }));
  };

  const handlePowerUpCollect = () => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 50,
      lives: Math.min(prev.lives + 1, 5)
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Game Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex justify-between items-center">
          <NeonButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/lobby')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lobby
          </NeonButton>
          
          <div className="flex items-center gap-6">
            <GlassPanel className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-bold">{gameState.score}</span>
              </div>
            </GlassPanel>
            
            <GlassPanel className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-400" />
                <span className="font-bold">Lives: {gameState.lives}</span>
              </div>
            </GlassPanel>
            
            <GlassPanel className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="font-bold">Level: {gameState.level}</span>
              </div>
            </GlassPanel>
            
            <GlassPanel className="px-4 py-2">
              <span className="font-mono font-bold">{formatTime(gameState.gameTime)}</span>
            </GlassPanel>
          </div>
          
          <div className="flex items-center gap-2">
            {gameStarted && (
              <>
                <NeonButton
                  variant="ghost"
                  size="sm"
                  onClick={pauseGame}
                  className="flex items-center gap-2"
                >
                  {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {gameState.isPaused ? 'Resume' : 'Pause'}
                </NeonButton>
                
                <NeonButton
                  variant="ghost"
                  size="sm"
                  onClick={resetGame}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </NeonButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative w-full h-screen">
        {!gameStarted ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GlassPanel className="p-8 text-center">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {currentGame?.name || 'ARCADE GAME'}
                </h1>
                <p className="text-gray-300 mb-6">
                  {currentGame?.description || 'Collect targets and power-ups while avoiding obstacles!'}
                </p>
                <div className="space-y-2 text-left mb-6">
                  <p className="text-sm">🎯 Complete objectives to score points</p>
                  <p className="text-sm">💎 Collect power-ups for bonus points and extra lives</p>
                  <p className="text-sm">🔺 Avoid obstacles and hazards</p>
                  <p className="text-sm">🎮 Use mouse to rotate camera view</p>
                </div>
                <NeonButton
                  onClick={startGame}
                  className="px-8 py-3 text-lg"
                >
                  Start Game
                </NeonButton>
              </GlassPanel>
            </motion.div>
          </div>
        ) : (
          <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
            <Suspense fallback={null}>
              {currentGame && (
                <currentGame.component 
                  gameState={gameState}
                  onTargetHit={handleTargetHit}
                  onPowerUpCollect={handlePowerUpCollect}
                />
              )}
            </Suspense>
          </Canvas>
        )}
        
        {/* Pause Overlay */}
        {gameState.isPaused && gameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <GlassPanel className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
                <NeonButton onClick={pauseGame}>
                  Resume Game
                </NeonButton>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
