import { create } from 'zustand';
import type { UserProfile } from '../types/auth';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  updateUserSettings: (settings: Partial<UserProfile['settings']>) => void;
}

export const useStore = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  updateUserSettings: (settings) => 
    set((state) => ({
      user: state.user 
        ? { ...state.user, settings: { ...state.user.settings, ...settings } }
        : null
    }))
}));