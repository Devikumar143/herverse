import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

// Core Canvas Particle Background
import CosmicBackground from './src/components/CosmicBackground';

// Screen Modules
import CinematicIntro from './src/screens/CinematicIntro';
import GalaxyHome from './src/screens/GalaxyHome';
import Memories from './src/screens/Memories';
import LateNightTalks from './src/screens/LateNightTalks';
import Songs from './src/screens/Songs';
import Letters from './src/screens/Letters';
import Gallery from './src/screens/Gallery';

import SecretPlanet from './src/screens/SecretPlanet';
import FinalEnding from './src/screens/FinalEnding';
import MirrorUniverse from './src/screens/MirrorUniverse';
import FlowerGarden from './src/screens/FlowerGarden';
import TimeLock from './src/screens/TimeLock';

const { width, height } = Dimensions.get('window');

// Target Date: Locked until June 9th, 2026 at midnight
const TARGET_DATE = new Date('2026-06-09T00:00:00');

export default function App() {
  const [navState, setNavState] = useState('INTRO'); // INTRO, HOME, MEMORIES, TALKS, SONGS, LETTERS, GALLERY, SECRET, ENDING, flowers
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  const [isTimeUnlocked, setIsTimeUnlocked] = useState(false);

  // Global soundtrack settings
  const [currentSound, setCurrentSound] = useState(null);
  const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);

  useEffect(() => {
    // Enable background audio processing in iOS/Android
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldRouteThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });

    // Check if current date is past Target Date on boot
    const now = new Date();
    if (now >= TARGET_DATE) {
      setIsTimeUnlocked(true);
    }

    return () => {
      // Clean up global sound on exit
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, []);

  // Listen to hardware/gesture back events to prevent exiting app from sub-screens
  useEffect(() => {
    const handleBackPress = () => {
      if (navState !== 'HOME' && navState !== 'INTRO') {
        navigateTo('HOME');
        return true; // Stops the app from closing
      }
      return false; // Exits app on HOME/INTRO
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      subscription.remove();
    };
  }, [navState]);

  const playBackgroundMusic = async () => {
    try {
      if (currentSound) {
        await currentSound.playAsync();
        setIsGlobalPlaying(true);
        return;
      }
      
      // Load and stream the premium, licensed, ambient best-friend track
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/music/Inthandham.mp3'),
        { shouldPlay: true, isLooping: true, volume: 0.35 }
      );
      
      setCurrentSound(sound);
      setIsGlobalPlaying(true);
    } catch (e) {
      console.log('Error initializing global background soundtrack: ', e);
    }
  };

  const toggleSound = async () => {
    if (currentSound) {
      if (isGlobalPlaying) {
        await currentSound.pauseAsync();
        setIsGlobalPlaying(false);
      } else {
        await currentSound.playAsync();
        setIsGlobalPlaying(true);
      }
    } else {
      // Lazy load
      playBackgroundMusic();
    }
  };

  const navigateTo = async (screen) => {
    // Reset background sound automatically if jumping between rooms to ensure clear audio
    if (screen === 'HOME' && !isGlobalPlaying && currentSound && navState !== 'SONGS') {
      await currentSound.playAsync();
      setIsGlobalPlaying(true);
    }
    setNavState(screen);
  };

  const handleRestart = async () => {
    setIsSecretUnlocked(false);
    if (currentSound) {
      await currentSound.setPositionAsync(0);
      await currentSound.playAsync();
      setIsGlobalPlaying(true);
    }
    setNavState('INTRO');
  };

  if (!isTimeUnlocked) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <CosmicBackground>
          <TimeLock 
            onUnlock={() => setIsTimeUnlocked(true)} 
            onBypass={() => setIsTimeUnlocked(true)} 
          />
        </CosmicBackground>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* 60fps Starfield Canvas Particles */}
      <CosmicBackground>
        
        {/* Interactive sound controllers in the corner */}
        {navState !== 'INTRO' && navState !== 'ENDING' && (
          <View style={styles.soundShell}>
            <TouchableOpacity style={styles.soundIndicator} onPress={toggleSound} activeOpacity={0.8}>
              <Ionicons
                name={isGlobalPlaying ? 'musical-notes' : 'musical-note-outline'}
                size={13}
                color={isGlobalPlaying ? '#ff4d6d' : 'rgba(26, 37, 30, 0.4)'}
              />
              <Text style={[styles.soundText, isGlobalPlaying && styles.soundTextActive]}>
                {isGlobalPlaying ? 'Sound' : 'Mute'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cinematic intro scene */}
        {navState === 'INTRO' && (
          <CinematicIntro
            onEnter={() => navigateTo('HOME')}
            playBackgroundMusic={playBackgroundMusic}
          />
        )}

        {/* Galaxy Map screen */}
        {navState === 'HOME' && (
          <GalaxyHome
            onNavigate={navigateTo}
            isSecretUnlocked={isSecretUnlocked}
          />
        )}

        {/* Cosmic Mirror screen */}
        {navState === 'mirror' && (
          <MirrorUniverse onBack={() => navigateTo('HOME')} />
        )}

        {/* Memories scroll screen */}
        {navState === 'memories' && (
          <Memories onBack={() => navigateTo('HOME')} />
        )}

        {/* Flower Garden screen */}
        {navState === 'flowers' && (
          <FlowerGarden onBack={() => navigateTo('HOME')} />
        )}

        {/* Music screen */}
        {navState === 'songs' && (
          <Songs
            onBack={() => navigateTo('HOME')}
            currentSound={currentSound}
            setCurrentSound={setCurrentSound}
            isGlobalPlaying={isGlobalPlaying}
            setIsGlobalPlaying={setIsGlobalPlaying}
          />
        )}

        {/* Typewritten Letters screen */}
        {navState === 'letters' && (
          <Letters onBack={() => navigateTo('HOME')} />
        )}

        {/* Polaroid Gallery screen */}
        {navState === 'gallery' && (
          <Gallery onBack={() => navigateTo('HOME')} />
        )}


        {/* Passcode locked secret room */}
        {navState === 'secret' && (
          <SecretPlanet
            onBack={() => navigateTo('HOME')}
            isUnlocked={isSecretUnlocked}
            onUnlock={() => setIsSecretUnlocked(true)}
            onLaunchEnding={() => navigateTo('ENDING')}
          />
        )}

        {/* Finale Fireworks Ending screen */}
        {navState === 'ENDING' && (
          <FinalEnding onRestart={handleRestart} />
        )}

      </CosmicBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5EC', // Premium velvet cream base background
  },
  soundShell: {
    position: 'absolute',
    top: 55, // perfectly aligned vertically with screen headers!
    right: 16,
    zIndex: 999,
  },
  soundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // sleek glassmorphism
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 2,
  },
  soundText: {
    color: 'rgba(26, 37, 30, 0.4)',
    fontSize: 8.5,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  soundTextActive: {
    color: '#ff4d6d',
  },
});
