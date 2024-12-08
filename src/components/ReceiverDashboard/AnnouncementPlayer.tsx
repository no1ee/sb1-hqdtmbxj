import React, { useEffect, useRef, useState } from 'react';
import { useAnnouncementStore } from '../../store/announcementStore';
import { AudioItem } from '../../types';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Volume2, VolumeX, Volume1 } from 'lucide-react';

interface AnnouncementPlayerProps {
  pairId: string;
}

export default function AnnouncementPlayer({ pairId }: AnnouncementPlayerProps) {
  const { announcements } = useAnnouncementStore();
  const announcement = announcements.find(a => a.pairId === pairId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioItems = useRef<AudioItem[]>([]);
  const previousVolume = useRef(volume);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4F46E5',
      progressColor: '#818CF8',
      cursorColor: '#4F46E5',
      barWidth: 2,
      barGap: 1,
      height: 60,
      normalize: true
    });

    // Set initial volume
    wavesurferRef.current.setVolume(volume);

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!announcement) return;

    const sortedItems = [...announcement.audioItems].sort((a, b) => a.order - b.order);
    if (announcement.isRandomized) {
      for (let i = sortedItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sortedItems[i], sortedItems[j]] = [sortedItems[j], sortedItems[i]];
      }
    }
    currentAudioItems.current = sortedItems;
  }, [announcement]);

  const playNextItem = async () => {
    if (!announcement || !wavesurferRef.current) return;

    const items = currentAudioItems.current;
    if (currentItemIndex >= items.length) {
      setCurrentItemIndex(0);
      setIsPlaying(false);
      return;
    }

    const currentItem = items[currentItemIndex];

    if (currentItem.type === 'file') {
      wavesurferRef.current.load(currentItem.content);
      wavesurferRef.current.on('ready', () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.play();
        }
      });
    } else {
      // For TTS items, we'll use the Web Speech API
      const utterance = new SpeechSynthesisUtterance(currentItem.content);
      utterance.voice = speechSynthesis.getVoices().find(voice => 
        voice.name.toLowerCase().includes(announcement.voice)
      ) || null;
      utterance.volume = volume;
      utterance.onend = () => {
        setCurrentItemIndex(prev => prev + 1);
        setTimeout(playNextItem, announcement.delay * 1000);
      };
      speechSynthesis.speak(utterance);
    }
  };

  const togglePlayPause = () => {
    if (!wavesurferRef.current || !announcement) return;

    if (isPlaying) {
      wavesurferRef.current.pause();
      speechSynthesis.cancel();
    } else {
      setCurrentItemIndex(0);
      playNextItem();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!wavesurferRef.current) return;
    
    if (isMuted) {
      wavesurferRef.current.setVolume(previousVolume.current);
      setVolume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      wavesurferRef.current.setVolume(0);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume);
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0 || isMuted) return <VolumeX className="w-4 h-4" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  if (!announcement) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Waiting for announcements from the client...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Announcement Player</h2>
      
      <div className="space-y-6">
        <div ref={containerRef} className="w-full" />
        
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={togglePlayPause}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {isPlaying ? (
                <><Pause className="w-4 h-4 mr-2" /> Pause</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Play</>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-4 px-4">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {getVolumeIcon()}
            </button>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <span className="text-sm text-gray-500 w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Queue</h3>
          <div className="space-y-2">
            {currentAudioItems.current.map((item, index) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg ${
                  index === currentItemIndex
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50'
                }`}
              >
                <span className="text-sm text-gray-600">
                  {item.type === 'file' ? 'Audio File' : item.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}