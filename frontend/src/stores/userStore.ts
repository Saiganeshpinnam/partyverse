import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Determine API base URL
const getApiBase = () => {
  // For local development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5002';
  }
  // For production, use your backend domain (update this to your deployed backend)
  return 'https://partyverse.onrender.com'; // Replace with your actual backend URL
};

export interface AvatarConfig {
  gender: 'male' | 'female';
  avatarModel: string;
  hair: string;
  hairColor: string;
  skin: string;
  glasses: string;
  emotes: string[];
  colorScheme: string;
  outfit: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: AvatarConfig;
  xp: number;
  level: number;
  friends: string[];
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateAvatar: (avatar: Partial<AvatarConfig>) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, gender: 'male' | 'female') => Promise<boolean>;
  logout: () => void;
}

const defaultAvatar: AvatarConfig = {
  gender: 'male',
  avatarModel: 'cyber-punk-1',
  hair: 'spiky',
  hairColor: '#00ffff',
  skin: 'default',
  glasses: 'none',
  emotes: ['wave', 'dance'],
  colorScheme: 'neon-cyan',
  outfit: 'cyber-jacket',
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      updateAvatar: (avatarUpdate) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, avatar: { ...state.user.avatar, ...avatarUpdate } }
            : null,
        })),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const apiBase = getApiBase();
          console.log('Frontend login attempt:', { email, apiBase });
          const response = await fetch(`${apiBase}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          console.log('Login response status:', response.status);
          console.log('Login response headers:', response.headers);

          // Check if response is ok before parsing JSON
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Login error response:', errorText);
            
            // Try to parse as JSON, fallback to text if it fails
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch (e) {
              errorData = { error: errorText || 'Login failed' };
            }
            
            set({ isLoading: false });
            return false;
          }

          // Parse successful response
          const data = await response.json();
          console.log('Login success:', data);

          const user: User = {
            id: data.user._id,
            username: data.user.username || data.user.name, // Use username if available, fallback to name
            email: data.user.email,
            avatar: { ...defaultAvatar, gender: 'male' }, // Default for existing users
            xp: 0,
            level: 1,
            friends: [],
          };
          
          // Store token
          localStorage.setItem('token', data.token);
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (username, email, password, gender) => {
        set({ isLoading: true });
        try {
          const apiBase = getApiBase();
          const response = await fetch(`${apiBase}/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: username, username: username, email, password }),
          });

          // Check if response is ok before parsing JSON
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Registration error response:', errorText);
            
            // Try to parse as JSON, fallback to text if it fails
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch (e) {
              errorData = { error: errorText || 'Registration failed' };
            }
            
            set({ isLoading: false });
            throw new Error(errorData.error || 'Registration failed');
          }

          // Parse successful response
          const data = await response.json();
          console.log('Registration success:', data);

          const newUser: User = {
            id: 'user-' + Math.random().toString(36).substr(2, 9),
            username,
            email,
            avatar: { ...defaultAvatar, gender },
            xp: 0,
            level: 1,
            friends: [],
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'partyverse-user',
    }
  )
);
