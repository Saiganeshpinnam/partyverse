import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Settings, LogOut, Trophy, 
  Gamepad2, Zap, Star, Send, X, User, Music
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sphere, Torus, Box, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

// Mini games data
const miniGames = [
  { id: 'rocket-drift', name: 'Rocket Drift Arena', icon: '🚀', color: '#00ffff', players: 12 },
  { id: 'laser-maze', name: 'Laser Maze Escape', icon: '⚡', color: '#ff00ff', players: 8 },
  { id: 'gravity-flip', name: 'Gravity Flip Race', icon: '🌀', color: '#8b5cf6', players: 16 },
  { id: 'portal-shooter', name: 'Portal Shooter', icon: '🎯', color: '#ff6b35', players: 6 },
  { id: 'hack-rush', name: 'Hack Rush', icon: '💻', color: '#00ff00', players: 4 },
  { id: 'neon-racing', name: 'Neon Racing', icon: '🏎️', color: '#ffff00', players: 10 },
];

// Simulated online players
const onlinePlayers = [
  { id: '1', name: 'NeonBlade', level: 42, status: 'online' },
  { id: '2', name: 'CyberPunk99', level: 38, status: 'in-game' },
  { id: '3', name: 'HoloHacker', level: 55, status: 'online' },
  { id: '4', name: 'PixelStorm', level: 27, status: 'online' },
  { id: '5', name: 'VoidRunner', level: 61, status: 'in-game' },
];

// 3D Portal Component
function Portal3D({ position, color }: { position: [number, number, number]; color: string }) {
  const ringRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={ringRef} position={position}>
      <Torus args={[1, 0.08, 16, 100]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </Torus>
      <Torus args={[0.8, 0.04, 16, 100]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </Torus>
      <Sphere args={[0.6, 32, 32]}>
        <MeshDistortMaterial
          color="#000020"
          transparent
          opacity={0.5}
          distort={0.3}
          speed={2}
        />
      </Sphere>
    </group>
  );
}

function LobbyScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#00ffff" />
      <pointLight position={[-5, 3, 5]} intensity={0.8} color="#ff00ff" />
      <pointLight position={[5, 3, -5]} intensity={0.8} color="#8b5cf6" />
      
      {/* Portals */}
      <Float speed={2} rotationIntensity={0.2}>
        <Portal3D position={[-3, 0, -5]} color="#00ffff" />
      </Float>
      <Float speed={1.5} rotationIntensity={0.3}>
        <Portal3D position={[3, 0, -5]} color="#ff00ff" />
      </Float>
      <Float speed={2.5} rotationIntensity={0.15}>
        <Portal3D position={[0, 2, -6]} color="#8b5cf6" />
      </Float>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5}>
          <Box
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 5,
              -5 - Math.random() * 5,
            ]}
            args={[0.1, 0.1, 0.1]}
          >
            <meshStandardMaterial
              color={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
              emissive={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
              emissiveIntensity={1}
            />
          </Box>
        </Float>
      ))}
      
      {/* Grid floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[30, 30, 30, 30]} />
        <meshStandardMaterial
          color="#0a0a0f"
          wireframe
          emissive="#00ffff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <Environment preset="night" />
    </>
  );
}

export default function Lobby() {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', user: 'NeonBlade', message: 'Anyone up for Rocket Drift?', time: '2m ago' },
    { id: '2', user: 'CyberPunk99', message: 'Just beat my high score! 🎉', time: '5m ago' },
    { id: '3', user: 'System', message: 'Welcome to PartyVerse!', time: '10m ago' },
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages([
      { id: Date.now().toString(), user: user?.username || 'You', message: chatMessage, time: 'now' },
      ...messages,
    ]);
    setChatMessage('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePlayGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <LobbyScene />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div className="glass-panel mx-4 mt-4 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-orbitron text-2xl font-bold text-glow-cyan text-foreground">
                PartyVerse
              </h1>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="font-rajdhani">{onlinePlayers.length} Online</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-orbitron text-sm text-foreground">{user?.username || 'Player'}</p>
                  <p className="text-xs text-neon-cyan">Level {user?.level || 1}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                  <User className="w-5 h-5 text-background" />
                </div>
              </div>

              <div className="h-6 w-px bg-border" />

              {/* Action buttons */}
              <button
                onClick={() => navigate('/customize')}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="pt-24 px-4 pb-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Players */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <GlassPanel variant="cyan" className="p-4">
                <h2 className="font-orbitron text-lg text-neon-cyan mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Online Players
                </h2>
                <div className="space-y-3">
                  {onlinePlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta" />
                        <div
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                            player.status === 'online' ? "bg-neon-green" : "bg-neon-orange"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-rajdhani text-sm truncate">{player.name}</p>
                        <p className="text-xs text-muted-foreground">Lvl {player.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>

            {/* Center - Game Portals */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="text-center mb-6">
                <h2 className="font-orbitron text-2xl text-glow-magenta text-foreground mb-2">
                  Choose Your Game
                </h2>
                <p className="text-muted-foreground font-rajdhani">
                  Enter a portal to join the action
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {miniGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="cursor-pointer"
                  >
                    <GlassPanel
                      variant="neutral"
                      className="p-5 hover:border-opacity-100 transition-all group"
                      style={{
                        borderColor: `${game.color}50`,
                        boxShadow: `0 0 30px ${game.color}20`,
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${game.color}30, ${game.color}10)`,
                            border: `2px solid ${game.color}50`,
                          }}
                        >
                          {game.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-orbitron text-sm mb-1" style={{ color: game.color }}>
                            {game.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{game.players} playing</span>
                          </div>
                        </div>
                      </div>
                      <NeonButton
                        variant="ghost"
                        size="sm"
                        className="w-full mt-4 group-hover:border-current"
                        style={{ color: game.color }}
                        onClick={() => handlePlayGame(game.id)}
                      >
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Play Now
                      </NeonButton>
                    </GlassPanel>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Sidebar - Stats & Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-4"
            >
              {/* Stats */}
              <GlassPanel variant="magenta" className="p-4">
                <h2 className="font-orbitron text-lg text-neon-magenta mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Your Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">XP</span>
                    <span className="font-orbitron text-neon-cyan">{user?.xp || 0}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
                      style={{ width: '35%' }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Games Played</span>
                    <span className="font-orbitron">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Wins</span>
                    <span className="font-orbitron text-neon-green">0</span>
                  </div>
                </div>
              </GlassPanel>

              {/* Leaderboard */}
              <GlassPanel variant="purple" className="p-4">
                <h2 className="font-orbitron text-lg text-neon-purple mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Leaderboard
                </h2>
                <div className="space-y-2">
                  {[
                    { rank: 1, name: 'VoidRunner', score: 12500 },
                    { rank: 2, name: 'HoloHacker', score: 11200 },
                    { rank: 3, name: 'NeonBlade', score: 9800 },
                  ].map((entry) => (
                    <div
                      key={entry.rank}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/20"
                    >
                      <span
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          entry.rank === 1 && "bg-yellow-500 text-black",
                          entry.rank === 2 && "bg-gray-400 text-black",
                          entry.rank === 3 && "bg-orange-600 text-white"
                        )}
                      >
                        {entry.rank}
                      </span>
                      <span className="flex-1 font-rajdhani text-sm">{entry.name}</span>
                      <span className="text-xs text-neon-cyan font-orbitron">{entry.score}</span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </div>

        {/* Chat Toggle Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cn(
            "fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-neon-cyan to-neon-magenta",
            "shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)]",
            "hover:scale-110 transition-transform"
          )}
        >
          {isChatOpen ? (
            <X className="w-6 h-6 text-background" />
          ) : (
            <MessageSquare className="w-6 h-6 text-background" />
          )}
        </motion.button>

        {/* Chat Panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed bottom-24 right-6 w-80"
            >
              <GlassPanel variant="cyan" className="overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-orbitron text-neon-cyan flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Lobby Chat
                  </h3>
                </div>
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-semibold text-sm",
                          msg.user === 'System' ? "text-neon-orange" : "text-neon-cyan"
                        )}>
                          {msg.user}
                        </span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-foreground/90">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-input/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-lg bg-neon-cyan/20 hover:bg-neon-cyan/30 transition-colors"
                  >
                    <Send className="w-4 h-4 text-neon-cyan" />
                  </button>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
