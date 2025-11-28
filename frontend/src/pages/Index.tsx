import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Zap, Users, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { NeonRoom } from '@/components/3d/NeonRoom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { useUserStore } from '@/stores/userStore';

const features = [
  {
    icon: Gamepad2,
    title: '10 Mini-Games',
    description: 'Compete in unique multiplayer challenges',
    color: 'cyan',
  },
  {
    icon: Users,
    title: 'Real-Time Multiplayer',
    description: 'Play with friends worldwide instantly',
    color: 'magenta',
  },
  {
    icon: Trophy,
    title: 'Leaderboards',
    description: 'Climb the ranks and become a legend',
    color: 'purple',
  },
  {
    icon: Sparkles,
    title: 'Custom Avatars',
    description: 'Express yourself with unique styles',
    color: 'orange',
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/lobby');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <NeonRoom />
      </div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none scanlines opacity-20" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-6 flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
              <Zap className="w-7 h-7 text-background" />
            </div>
            <span className="font-orbitron text-2xl font-bold text-glow-cyan text-foreground">
              PartyVerse
            </span>
          </div>
          <div className="flex gap-3">
            <NeonButton variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </NeonButton>
            <NeonButton variant="cyan" onClick={() => navigate('/register')}>
              Join Now
            </NeonButton>
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-glow-cyan text-foreground">One World.</span>
                <br />
                <span className="text-glow-magenta text-foreground">Endless Chaos.</span>
              </h1>
              <p className="font-rajdhani text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Enter the ultimate multiplayer mini-game universe. Customize your avatar, 
                compete in 10 unique games, and dominate the leaderboards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <NeonButton 
                variant="solid" 
                size="xl" 
                onClick={() => navigate('/register')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Playing
                <ArrowRight className="w-5 h-5 ml-2" />
              </NeonButton>
              <NeonButton 
                variant="magenta" 
                size="xl"
                onClick={() => navigate('/login')}
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Continue Journey
              </NeonButton>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <GlassPanel
                      variant={feature.color as 'cyan' | 'magenta' | 'purple' | 'neutral'}
                      hover3D
                      className="p-5 h-full"
                    >
                      <Icon className={`w-8 h-8 mb-3 text-neon-${feature.color}`} />
                      <h3 className="font-orbitron text-sm font-semibold mb-2 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-rajdhani">
                        {feature.description}
                      </p>
                    </GlassPanel>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="p-6 text-center"
        >
          <p className="text-muted-foreground font-rajdhani text-sm">
            © 2024 PartyVerse. Built with React, Three.js & WebSockets.
          </p>
        </motion.footer>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-neon-cyan/40' : 'bg-neon-magenta/40'}`}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
            }}
            animate={{
              y: -20,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
