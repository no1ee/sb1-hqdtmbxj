import { create } from 'zustand';
import { Announcement, AudioItem } from '../types';

interface AnnouncementState {
  announcements: Announcement[];
  createAnnouncement: (pairId: string) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  addAudioItem: (announcementId: string, item: Omit<AudioItem, 'id' | 'order'>) => void;
  removeAudioItem: (announcementId: string, itemId: string) => void;
  reorderAudioItems: (announcementId: string, itemIds: string[]) => void;
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: [],

  createAnnouncement: (pairId: string) => {
    const newAnnouncement: Announcement = {
      id: crypto.randomUUID(),
      pairId,
      audioItems: [],
      frequency: 1,
      voice: 'female',
      delay: 5,
      isRandomized: false
    };

    set(state => ({
      announcements: [...state.announcements, newAnnouncement]
    }));
  },

  updateAnnouncement: (id: string, updates: Partial<Announcement>) => {
    set(state => ({
      announcements: state.announcements.map(announcement =>
        announcement.id === id
          ? { ...announcement, ...updates }
          : announcement
      )
    }));
  },

  addAudioItem: (announcementId: string, item: Omit<AudioItem, 'id' | 'order'>) => {
    set(state => ({
      announcements: state.announcements.map(announcement => {
        if (announcement.id !== announcementId) return announcement;
        
        const newItem: AudioItem = {
          ...item,
          id: crypto.randomUUID(),
          order: announcement.audioItems.length
        };

        return {
          ...announcement,
          audioItems: [...announcement.audioItems, newItem]
        };
      })
    }));
  },

  removeAudioItem: (announcementId: string, itemId: string) => {
    set(state => ({
      announcements: state.announcements.map(announcement => {
        if (announcement.id !== announcementId) return announcement;
        
        return {
          ...announcement,
          audioItems: announcement.audioItems
            .filter(item => item.id !== itemId)
            .map((item, index) => ({ ...item, order: index }))
        };
      })
    }));
  },

  reorderAudioItems: (announcementId: string, itemIds: string[]) => {
    set(state => ({
      announcements: state.announcements.map(announcement => {
        if (announcement.id !== announcementId) return announcement;
        
        const reorderedItems = itemIds.map((id, index) => {
          const item = announcement.audioItems.find(item => item.id === id);
          return item ? { ...item, order: index } : null;
        }).filter((item): item is AudioItem => item !== null);

        return {
          ...announcement,
          audioItems: reorderedItems
        };
      })
    }));
  }
}));