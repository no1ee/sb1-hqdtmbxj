import { create } from 'zustand';
import { User, Pair } from '../types';
import CryptoJS from 'crypto-js';

interface UserState {
  users: User[];
  pairs: Pair[];
  addUser: (username: string, password: string, role: 'client' | 'receiver') => void;
  createPair: (clientUsername: string, receiverUsername: string) => void;
  getPairs: () => Pair[];
  getUnpairedUsers: (role: 'client' | 'receiver') => User[];
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  pairs: [],

  addUser: (username: string, password: string, role: 'client' | 'receiver') => {
    const passwordHash = CryptoJS.SHA256(password).toString();
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      passwordHash,
      role,
      firstLogin: true
    };

    set(state => ({
      users: [...state.users, newUser]
    }));
  },

  createPair: (clientUsername: string, receiverUsername: string) => {
    const newPair: Pair = {
      id: crypto.randomUUID(),
      clientUsername,
      receiverUsername
    };

    set(state => ({
      pairs: [...state.pairs, newPair]
    }));
  },

  getPairs: () => {
    return get().pairs;
  },

  getUnpairedUsers: (role: 'client' | 'receiver') => {
    const pairs = get().pairs;
    return get().users.filter(user => {
      if (user.role !== role) return false;
      const isPaired = pairs.some(pair => 
        role === 'client' ? pair.clientUsername === user.username : pair.receiverUsername === user.username
      );
      return !isPaired;
    });
  }
}));