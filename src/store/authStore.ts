import { create } from 'zustand';
import CryptoJS from 'crypto-js';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  
  login: async (username: string, password: string) => {
    // In a real app, this would be an API call
    const passwordHash = CryptoJS.SHA256(password).toString();
    
    // Simulated validation
    if (username === 'admin' && passwordHash === CryptoJS.SHA256('password').toString()) {
      set({
        currentUser: {
          id: '1',
          username: 'admin',
          passwordHash,
          role: 'admin',
          firstLogin: true
        }
      });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    // Implementation for password change
    return true;
  }
}));