export const createAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export const speakText = (text: string, voice: 'male' | 'female', volume: number): Promise<void> => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.name.toLowerCase().includes(voice)) || null;
    utterance.volume = volume;
    utterance.onend = () => resolve();
    speechSynthesis.speak(utterance);
  });
};