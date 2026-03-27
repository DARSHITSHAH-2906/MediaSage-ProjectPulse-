import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUser, logoutUser } from './api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      fetchUser: async () => {
        try {
          set({ isLoading: true });
          const user = await getUser();
          set({ user, isLoading: false });
        } catch {
          // Token invalid/expired — clear user state
          set({ user: null, isLoading: false });
        }
      },
      logout: async () => {
        try {
          await logoutUser();
        } catch {
        } finally {
          set({ user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

