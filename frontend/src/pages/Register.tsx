import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Gamepad2, Sparkles } from 'lucide-react';
import { NeonRoom } from '@/components/3d/NeonRoom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { NeonInput } from '@/components/ui/NeonInput';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';

type Gender = 'male' | 'female';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useUserStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male' as Gender,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const success = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.gender
      );
      
      if (success) {
        toast.success('Account created! Customize your avatar.');
        navigate('/customize');
      }
    } catch (error) {
      // Handle specific error messages
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      
      if (errorMessage === 'Email already exists') {
        toast.error('Email already exists! Please try a different email or sign in.');
      } else if (errorMessage === 'Username already exists') {
        toast.error('Username already exists! Please choose a different username.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <NeonRoom />
      </div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none scanlines opacity-30" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-background/80 via-transparent to-background/40" />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <GlassPanel variant="cyan" glow className="p-8">
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-cyan/20 border-2 border-neon-cyan mb-4">
                <Gamepad2 className="w-8 h-8 text-neon-cyan" />
              </div>
              <h1 className="text-3xl font-orbitron font-bold text-glow-cyan text-foreground">
                Join PartyVerse
              </h1>
              <p className="text-muted-foreground mt-2 font-rajdhani text-lg">
                Create your account and enter the universe
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <NeonInput
                  label="Username"
                  icon={<User className="w-5 h-5" />}
                  placeholder="Choose your gamer tag"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  error={errors.username}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <NeonInput
                  label="Email"
                  type="email"
                  icon={<Mail className="w-5 h-5" />}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <NeonInput
                  label="Password"
                  type="password"
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <NeonInput
                  label="Confirm Password"
                  type="password"
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                />
              </motion.div>

              {/* Gender Selection */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">
                  Select Avatar Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.gender === 'male'
                        ? 'border-neon-cyan bg-neon-cyan/20 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]'
                        : 'border-border bg-input/30 hover:border-neon-cyan/50'
                    }`}
                  >
                    <span className="text-2xl">👨‍🚀</span>
                    <span className={`block mt-2 font-orbitron text-sm ${
                      formData.gender === 'male' ? 'text-neon-cyan' : 'text-muted-foreground'
                    }`}>
                      Male
                    </span>
                    {formData.gender === 'male' && (
                      <motion.div
                        layoutId="genderIndicator"
                        className="absolute inset-0 rounded-xl border-2 border-neon-cyan"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.gender === 'female'
                        ? 'border-neon-magenta bg-neon-magenta/20 shadow-[0_0_20px_hsl(var(--neon-magenta)/0.3)]'
                        : 'border-border bg-input/30 hover:border-neon-magenta/50'
                    }`}
                  >
                    <span className="text-2xl">👩‍🚀</span>
                    <span className={`block mt-2 font-orbitron text-sm ${
                      formData.gender === 'female' ? 'text-neon-magenta' : 'text-muted-foreground'
                    }`}>
                      Female
                    </span>
                    {formData.gender === 'female' && (
                      <motion.div
                        layoutId="genderIndicator"
                        className="absolute inset-0 rounded-xl border-2 border-neon-magenta"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-2"
              >
                <NeonButton
                  type="submit"
                  variant="solid"
                  size="lg"
                  loading={isLoading}
                  className="w-full"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Account
                </NeonButton>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-muted-foreground font-rajdhani">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-neon-cyan hover:text-neon-magenta transition-colors font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-neon-cyan/50"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
            }}
            animate={{
              y: -20,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
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
