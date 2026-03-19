// services/soundService.js
import { Audio } from "expo-av";

// Sound objects cache
const sounds = {};

// Preload sounds (call this when your app starts)
export const preloadSounds = async () => {
  try {
    sounds.notification = await loadSound(
      require("../assets/FAAAAHHHHHHH.wav"),
    );
  } catch (error) {
    console.error("Error preloading sounds:", error);
  }
};

// Helper to load a single sound
const loadSound = async (source) => {
  const { sound } = await Audio.Sound.createAsync(source, {
    shouldPlay: false,
  });
  return sound;
};

// Play a sound by name
export const playSound = async (soundName) => {
  try {
    const sound = sounds[soundName];
    if (sound) {
      // Check if sound is already playing
      const status = await sound.getStatusAsync();
      if (status.isPlaying) {
        await sound.stopAsync();
      }
      await sound.replayAsync(); // Replay from beginning
    } else {
      console.warn(`Sound "${soundName}" not found`);
    }
  } catch (error) {
    console.error(`Error playing sound ${soundName}:`, error);
  }
};

// Clean up sounds (call when app closes)
export const unloadSounds = async () => {
  for (const key in sounds) {
    if (sounds[key]) {
      await sounds[key].unloadAsync();
    }
  }
};

// Configure audio mode (optional)
export const configureAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: false, // Play even on silent mode
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    console.error("Error configuring audio:", error);
  }
};
