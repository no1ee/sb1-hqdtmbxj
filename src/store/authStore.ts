import { create } from 'zustand';
import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface AuthState {
  currentUser: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  token: localStorage.getItem('token'),
  
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      set({ currentUser: data.user, token: data.token });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ currentUser: null, token: null });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return false;

    try {
      const response = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
          username: currentUser.username,
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        return false;
      }

      // Update the user's firstLogin status locally
      set({
        currentUser: {
          ...currentUser,
          firstLogin: false,
        },
      });

      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  },
}));