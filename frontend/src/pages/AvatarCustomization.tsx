import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Check, Palette, Shirt, 
  Glasses, Music, User, ArrowRight 
} from 'lucide-react';
import { AvatarPreview } from '@/components/3d/AvatarPreview';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { useUserStore, AvatarConfig } from '@/stores/userStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type TabType = 'avatar' | 'hair' | 'outfit' | 'glasses' | 'emotes';

const tabs: { id: TabType; label: string; icon: typeof User }[] = [
  { id: 'avatar', label: 'Avatar', icon: User },
  { id: 'hair', label: 'Hair', icon: Sparkles },
  { id: 'outfit', label: 'Outfit', icon: Shirt },
  { id: 'glasses', label: 'Glasses', icon: Glasses },
  { id: 'emotes', label: 'Emotes', icon: Music },
];

const avatarOptions = [
  { id: 'cyber-punk-1', name: 'Cyber Punk', preview: '🤖' },
  { id: 'neon-warrior', name: 'Neon Warrior', preview: '⚔️' },
  { id: 'holo-hacker', name: 'Holo Hacker', preview: '💻' },
  { id: 'space-racer', name: 'Space Racer', preview: '🚀' },
];

const hairOptions = [
  { id: 'spiky', name: 'Spiky', preview: '🦔' },
  { id: 'long', name: 'Long', preview: '💇' },
  { id: 'short', name: 'Short', preview: '✂️' },
  { id: 'mohawk', name: 'Mohawk', preview: '🎸' },
  { id: 'bald', name: 'Bald', preview: '🥚' },
];

const hairColors = [
  '#00ffff', '#ff00ff', '#ffff00', '#ff6b35', '#8b5cf6', 
  '#00ff00', '#ff0066', '#ffffff', '#000000',
];

const skinOptions = [
  { id: 'default', name: 'Default', color: '#ffdbac' },
  { id: 'tan', name: 'Tan', color: '#c68642' },
  { id: 'dark', name: 'Dark', color: '#8d5524' },
  { id: 'pale', name: 'Pale', color: '#ffe0bd' },
  { id: 'robot', name: 'Robot', color: '#808080' },
];

const outfitOptions = [
  { id: 'cyber-jacket', name: 'Cyber Jacket', color: '#00ffff' },
  { id: 'neon-suit', name: 'Neon Suit', color: '#ff00ff' },
  { id: 'holo-armor', name: 'Holo Armor', color: '#8b5cf6' },
  { id: 'street-wear', name: 'Street Wear', color: '#ff6b35' },
  { id: 'classic', name: 'Classic', color: '#ffffff' },
];

const glassesOptions = [
  { id: 'none', name: 'None', preview: '👁️' },
  { id: 'cyber-visor', name: 'Cyber Visor', preview: '🥽' },
  { id: 'gaming-goggles', name: 'Gaming Goggles', preview: '😎' },
  { id: 'holo-lens', name: 'Holo Lens', preview: '👓' },
];

const emoteOptions = [
  { id: 'wave', name: 'Wave', preview: '👋' },
  { id: 'dance', name: 'Dance', preview: '💃' },
  { id: 'laugh', name: 'Laugh', preview: '😂' },
  { id: 'celebrate', name: 'Celebrate', preview: '🎉' },
  { id: 'flex', name: 'Flex', preview: '💪' },
  { id: 'peace', name: 'Peace', preview: '✌️' },
];

export default function AvatarCustomization() {
  const navigate = useNavigate();
  const { user, updateAvatar } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabType>('avatar');
  const [isSaving, setIsSaving] = useState(false);

  const [localConfig, setLocalConfig] = useState<AvatarConfig>(
    user?.avatar || {
      gender: 'male',
      avatarModel: 'cyber-punk-1',
      hair: 'spiky',
      hairColor: '#00ffff',
      skin: 'default',
      glasses: 'none',
      emotes: ['wave', 'dance'],
      colorScheme: 'neon-cyan',
      outfit: 'cyber-jacket',
    }
  );

  const handleUpdateConfig = (update: Partial<AvatarConfig>) => {
    setLocalConfig((prev) => ({ ...prev, ...update }));
  };

  const toggleEmote = (emoteId: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      emotes: prev.emotes.includes(emoteId)
        ? prev.emotes.filter((e) => e !== emoteId)
        : [...prev.emotes, emoteId],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateAvatar(localConfig);
    setIsSaving(false);
    toast.success('Avatar saved! Entering the lobby...');

    setTimeout(() => navigate('/lobby'), 1000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'avatar':
        return (
          <div className="space-y-6">
            {/* Avatar Model */}
            <div>
              <h3 className="text-lg font-orbitron text-neon-cyan mb-4">Choose Avatar</h3>
              <div className="grid grid-cols-2 gap-3">
                {avatarOptions.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateConfig({ avatarModel: avatar.id })}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all",
                      localConfig.avatarModel === avatar.id
                        ? "border-neon-cyan bg-neon-cyan/20 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]"
                        : "border-border bg-input/30 hover:border-neon-cyan/50"
                    )}
                  >
                    <span className="text-3xl">{avatar.preview}</span>
                    <span className="block mt-2 text-sm font-rajdhani">{avatar.name}</span>
                    {localConfig.avatarModel === avatar.id && (
                      <Check className="absolute top-2 right-2 w-4 h-4 text-neon-cyan" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Skin Tone */}
            <div>
              <h3 className="text-lg font-orbitron text-neon-cyan mb-4">Skin Tone</h3>
              <div className="flex gap-3 flex-wrap">
                {skinOptions.map((skin) => (
                  <motion.button
                    key={skin.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleUpdateConfig({ skin: skin.id })}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 transition-all",
                      localConfig.skin === skin.id
                        ? "border-neon-cyan shadow-[0_0_15px_hsl(var(--neon-cyan)/0.5)]"
                        : "border-border hover:border-neon-cyan/50"
                    )}
                    style={{ backgroundColor: skin.color }}
                    title={skin.name}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'hair':
        return (
          <div className="space-y-6">
            {/* Hair Style */}
            <div>
              <h3 className="text-lg font-orbitron text-neon-cyan mb-4">Hair Style</h3>
              <div className="grid grid-cols-3 gap-3">
                {hairOptions.map((hair) => (
                  <motion.button
                    key={hair.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateConfig({ hair: hair.id })}
                    className={cn(
                      "relative p-3 rounded-xl border-2 transition-all",
                      localConfig.hair === hair.id
                        ? "border-neon-cyan bg-neon-cyan/20"
                        : "border-border bg-input/30 hover:border-neon-cyan/50"
                    )}
                  >
                    <span className="text-2xl">{hair.preview}</span>
                    <span className="block mt-1 text-xs font-rajdhani">{hair.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Hair Colors */}
            <div>
              <h3 className="text-lg font-orbitron text-neon-magenta mb-4">Hair Color</h3>
              <div className="flex gap-3 flex-wrap">
                {hairColors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleUpdateConfig({ hairColor: color })}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all",
                      localConfig.hairColor === color
                        ? "border-foreground shadow-[0_0_15px_currentColor]"
                        : "border-border hover:border-foreground/50"
                    )}
                    style={{ backgroundColor: color, boxShadow: localConfig.hairColor === color ? `0 0 15px ${color}` : undefined }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'outfit':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-orbitron text-neon-cyan mb-4">Choose Outfit</h3>
            <div className="grid grid-cols-2 gap-3">
              {outfitOptions.map((outfit) => (
                <motion.button
                  key={outfit.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateConfig({ outfit: outfit.id })}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all",
                    localConfig.outfit === outfit.id
                      ? "border-neon-cyan bg-neon-cyan/20 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]"
                      : "border-border bg-input/30 hover:border-neon-cyan/50"
                  )}
                >
                  <div 
                    className="w-8 h-8 rounded-lg mx-auto"
                    style={{ backgroundColor: outfit.color, boxShadow: `0 0 15px ${outfit.color}50` }}
                  />
                  <span className="block mt-2 text-sm font-rajdhani">{outfit.name}</span>
                  {localConfig.outfit === outfit.id && (
                    <Check className="absolute top-2 right-2 w-4 h-4 text-neon-cyan" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'glasses':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-orbitron text-neon-cyan mb-4">Eyewear</h3>
            <div className="grid grid-cols-2 gap-3">
              {glassesOptions.map((glasses) => (
                <motion.button
                  key={glasses.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateConfig({ glasses: glasses.id })}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all",
                    localConfig.glasses === glasses.id
                      ? "border-neon-cyan bg-neon-cyan/20 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]"
                      : "border-border bg-input/30 hover:border-neon-cyan/50"
                    )}
                >
                  <span className="text-3xl">{glasses.preview}</span>
                  <span className="block mt-2 text-sm font-rajdhani">{glasses.name}</span>
                  {localConfig.glasses === glasses.id && (
                    <Check className="absolute top-2 right-2 w-4 h-4 text-neon-cyan" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'emotes':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-orbitron text-neon-cyan mb-4">
              Emotes <span className="text-muted-foreground text-sm">({localConfig.emotes.length} selected)</span>
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {emoteOptions.map((emote) => (
                <motion.button
                  key={emote.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleEmote(emote.id)}
                  className={cn(
                    "relative p-3 rounded-xl border-2 transition-all",
                    localConfig.emotes.includes(emote.id)
                      ? "border-neon-magenta bg-neon-magenta/20 shadow-[0_0_15px_hsl(var(--neon-magenta)/0.3)]"
                      : "border-border bg-input/30 hover:border-neon-magenta/50"
                  )}
                >
                  <span className="text-2xl">{emote.preview}</span>
                  <span className="block mt-1 text-xs font-rajdhani">{emote.name}</span>
                  {localConfig.emotes.includes(emote.id) && (
                    <Check className="absolute top-1 right-1 w-3 h-3 text-neon-magenta" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="fixed inset-0 cyber-grid opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-orbitron font-bold text-glow-cyan">
            Customize Your Avatar
          </h1>
          <p className="text-muted-foreground mt-2 font-rajdhani text-lg">
            Create your unique identity in PartyVerse
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Avatar Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassPanel variant="cyan" className="p-6 h-[600px] flex justify-center">
              <div className="h-full w-full rounded-xl bg-gradient-to-b from-card to-background flex items-center justify-center">
                <AvatarPreview config={localConfig} />
              </div>
            </GlassPanel>

            <div className="mt-4 text-center">
              <p className="font-orbitron text-xl text-foreground">{user?.username || 'Player'}</p>
              <p className="text-muted-foreground font-rajdhani">Level {user?.level || 1}</p>
            </div>
          </motion.div>

          {/* Customization Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassPanel variant="magenta" className="p-6">

              {/* Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-sm whitespace-nowrap transition-all",
                        activeTab === tab.id
                          ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan"
                          : "bg-input/30 text-muted-foreground hover:text-foreground border border-transparent"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="min-h-[350px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Save Button */}
              <div className="mt-6 pt-6 border-t border-border">
                <NeonButton
                  variant="solid"
                  size="lg"
                  onClick={handleSave}
                  loading={isSaving}
                  className="w-full"
                >
                  <span>Enter Lobby</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </NeonButton>
              </div>

            </GlassPanel>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
