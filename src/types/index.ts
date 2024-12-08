export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'client' | 'receiver';
  firstLogin: boolean;
}

export interface Pair {
  id: string;
  clientUsername: string;
  receiverUsername: string;
}

export interface AudioItem {
  id: string;
  type: 'file' | 'tts';
  content: string; // File URL for uploaded files, text for TTS
  order: number;
}

export interface Announcement {
  id: string;
  pairId: string;
  audioItems: AudioItem[];
  frequency: number;
  voice: 'male' | 'female';
  delay: number;
  isRandomized: boolean;
}