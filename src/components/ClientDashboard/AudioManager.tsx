import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAnnouncementStore } from '../../store/announcementStore';
import { AudioItem } from '../../types';
import { Music, Mic, Plus, X, ArrowUpDown } from 'lucide-react';

interface AudioManagerProps {
  pairId: string;
}

export default function AudioManager({ pairId }: AudioManagerProps) {
  const [ttsText, setTtsText] = useState('');
  const { announcements, createAnnouncement, addAudioItem, removeAudioItem, updateAnnouncement } = useAnnouncementStore();
  const announcement = announcements.find(a => a.pairId === pairId) || null;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!announcement) return;
    
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        addAudioItem(announcement.id, {
          type: 'file',
          content: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    });
  }, [announcement, addAudioItem]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav']
    }
  });

  const handleAddTTS = () => {
    if (!announcement || !ttsText.trim()) return;
    
    addAudioItem(announcement.id, {
      type: 'tts',
      content: ttsText.trim()
    });
    setTtsText('');
  };

  if (!announcement) {
    return (
      <div className="text-center py-12">
        <button
          onClick={() => createAnnouncement(pairId)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Announcement
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Audio Management</h2>
        
        <div className="space-y-4">
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}>
            <input {...getInputProps()} />
            <Music className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop MP3 files here, or click to select files
            </p>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              placeholder="Enter text for TTS..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              onClick={handleAddTTS}
              disabled={!ttsText.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Mic className="w-4 h-4 mr-2" />
              Add TTS
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Audio Items</h3>
          <div className="space-y-2">
            {announcement.audioItems
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    {item.type === 'file' ? (
                      <Music className="w-4 h-4 text-gray-500 mr-2" />
                    ) : (
                      <Mic className="w-4 h-4 text-gray-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-600 truncate max-w-md">
                      {item.type === 'file' ? 'Audio File' : item.content}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeAudioItem(announcement.id, item.id)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-500 cursor-move">
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Announcement Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Voice Type
            </label>
            <select
              value={announcement.voice}
              onChange={(e) => updateAnnouncement(announcement.id, { voice: e.target.value as 'male' | 'female' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Announcement Frequency (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={announcement.frequency}
              onChange={(e) => updateAnnouncement(announcement.id, { frequency: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delay Between Announcements (seconds)
            </label>
            <input
              type="number"
              min="0"
              value={announcement.delay}
              onChange={(e) => updateAnnouncement(announcement.id, { delay: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="randomize"
              checked={announcement.isRandomized}
              onChange={(e) => updateAnnouncement(announcement.id, { isRandomized: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="randomize" className="ml-2 block text-sm text-gray-700">
              Randomize announcement order
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}