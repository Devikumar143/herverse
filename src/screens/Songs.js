import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Svg, { Path, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// ── Sine wave config ───────────────────────────────────
const WAVE_W = width - 80;
const WAVE_H = 44;
const AMP    = 8;   // amplitude (px)
const FREQ   = 26;  // px per full cycle

const sineY = (x, phase) =>
  WAVE_H / 2 + AMP * Math.sin((x / FREQ) * Math.PI + phase);

// Rose path: from 0 → progress
const buildPlayedPath = (phase, progress) => {
  const endX = Math.max(0, WAVE_W * progress);
  if (endX < 1) return '';
  let d = `M 0 ${sineY(0, phase).toFixed(2)}`;
  for (let x = 2; x <= endX; x += 2)
    d += ` L ${x} ${sineY(x, phase).toFixed(2)}`;
  return d;
};

// Grey path: from progress → end
const buildUnplayedPath = (phase, progress) => {
  const startX = Math.max(0, WAVE_W * progress);
  let d = `M ${startX.toFixed(2)} ${sineY(startX, phase).toFixed(2)}`;
  for (let x = startX + 2; x <= WAVE_W; x += 2)
    d += ` L ${x} ${sineY(x, phase).toFixed(2)}`;
  return d;
};

const tracks = [
  {
    id: '1',
    title: 'Bapu Gari Bommo',
    artist: 'Telugu • Energetic Sweet',
    file: require('../../assets/music/Bapu Gari Bommo-SenSongsMp3.Co.mp3'),
    duration: '4:42',
  },
  {
    id: '2',
    title: 'Inkem Inkem Inkem Kaavaale',
    artist: 'Telugu • Ambient 3D',
    file: require('../../assets/Inkem Inkem Inkem Kaavaale (3D) - SenSongsMp3.Co.mp3'),
    duration: '4:28',
  },
  {
    id: '3',
    title: 'Chikiri Chikiri',
    artist: 'Telugu • Feel Good',
    file: require('../../assets/music/Chikiri Chikiri.mp3'),
    duration: '4:04',
  },
  {
    id: '4',
    title: 'Kaanunna Kalyanam',
    artist: 'Telugu • Romantic',
    file: require('../../assets/music/Kaanunna Kalyanam.mp3'),
    duration: '1:22',
  },
  {
    id: '5',
    title: 'Oh Prema',
    artist: 'Telugu • Love Ballad',
    file: require('../../assets/music/Oh Prema __ SenSongsMp3.mp3'),
    duration: '1:12',
  },
  {
    id: '6',
    title: 'Tara',
    artist: 'Telugu • Soft',
    file: require('../../assets/music/Tara.mp3'),
    duration: '1:05',
  },
  {
    id: '7',
    title: 'Naala Nenu',
    artist: 'Telugu • Emotional',
    file: require('../../assets/music/[iSongs.info] 01 - Naala Nenu.mp3'),
    duration: '1:31',
  },
];

export default function Songs({ onBack, currentSound, setCurrentSound, isGlobalPlaying, setIsGlobalPlaying }) {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rotationLoop = useRef(null);
  const soundRef = useRef(null);

  // Sine wave — track phase + progress together
  const phaseRef    = useRef(0);
  const intervalRef = useRef(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setIsPlaying(isGlobalPlaying && soundRef.current !== null);
    return () => {
      stopLocalSound();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startRotation();
      // Animate sine wave ~30fps
      intervalRef.current = setInterval(() => {
        phaseRef.current += 0.12;
        setPhase(phaseRef.current);
      }, 33);
    } else {
      stopRotation();
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const startRotation = () => {
    rotateAnim.setValue(0);
    rotationLoop.current = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotationLoop.current.start();
  };

  const stopRotation = () => {
    if (rotationLoop.current) {
      rotationLoop.current.stop();
    }
  };

  const playTrack = async (index) => {
    try {
      setIsGlobalPlaying(false);
      if (currentSound) {
        await currentSound.stopAsync();
      }
      await stopLocalSound();

      const track = tracks[index];
      const { sound } = await Audio.Sound.createAsync(
        track.file,
        { shouldPlay: true, isLooping: false },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setActiveTrackIndex(index);
      setIsPlaying(true);
    } catch (error) {
      console.log('Error playing track: ', error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      if (status.isPlaying) {
        const progress = status.positionMillis / status.durationMillis;
        setPlaybackProgress(isNaN(progress) ? 0 : progress);
      }
      if (status.didJustFinish) {
        handleNext();
      }
    }
  };

  const togglePlayPause = async () => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } else {
      playTrack(activeTrackIndex);
    }
  };

  const handleNext = () => {
    const nextIndex = (activeTrackIndex + 1) % tracks.length;
    playTrack(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (activeTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIndex);
  };

  const stopLocalSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {
        // silent fail
      }
      soundRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#ff4d6d" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Songs</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Vinyl Player cream deck */}
        <View style={styles.playerDeck}>
          {/* Animated Vinyl Record */}
          <Animated.View style={[styles.vinylRing, { transform: [{ rotate: spin }] }]}>
            <View style={styles.vinylGrooves}>
              <View style={styles.vinylCenterLabel}>
                <Ionicons name="heart" size={24} color="#ffffff" />
              </View>
            </View>
          </Animated.View>

          {/* Needle Arm Overlay */}
          <View style={styles.needleArm} />

          {/* Metadata Display */}
          <Text style={styles.songTitle}>{tracks[activeTrackIndex].title}</Text>
          <Text style={styles.songArtist}>{tracks[activeTrackIndex].artist}</Text>

          {/* Animated sine wave — rose = played, grey = remaining */}
          <View style={styles.waveSvgWrap}>
            <Svg width={WAVE_W} height={WAVE_H}>
              {/* Unplayed grey section */}
              <Path
                d={buildUnplayedPath(phase, playbackProgress)}
                stroke="rgba(26,37,30,0.15)"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
              />
              {/* Played rose section */}
              <Path
                d={buildPlayedPath(phase, playbackProgress)}
                stroke="#ff4d6d"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
              />
              {/* Playhead dot at current position */}
              {playbackProgress > 0 && playbackProgress < 1 && (
                <Circle
                  cx={WAVE_W * playbackProgress}
                  cy={sineY(WAVE_W * playbackProgress, phase)}
                  r={5}
                  fill="#ff4d6d"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              )}
            </Svg>
          </View>
          
          <View style={styles.timeLabelRow}>
            <Text style={styles.timeLabelText}>
              {soundRef.current ? 'playing' : '0:00'}
            </Text>
            <Text style={styles.timeLabelText}>
              {tracks[activeTrackIndex].duration}
            </Text>
          </View>

          {/* Player controls row */}
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlButton} onPress={handlePrev}>
              <Ionicons name="play-skip-back" size={22} color="#1A251E" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playPauseShell} onPress={togglePlayPause} activeOpacity={0.8}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={30}
                color="#ff4d6d"
                style={isPlaying ? {} : { marginLeft: 3 }}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
              <Ionicons name="play-skip-forward" size={22} color="#1A251E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Playlist selection card */}
        <View style={styles.playlistPanel}>
          <Text style={styles.playlistHeader}>Our Telugu Playlist 🎵</Text>
          
          {tracks.map((item, index) => {
            const isActive = index === activeTrackIndex;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.trackItem, isActive && styles.trackItemActive]}
                onPress={() => playTrack(index)}
              >
                <View style={styles.trackItemLeft}>
                  <Ionicons
                    name={isActive && isPlaying ? 'volume-high' : 'musical-note-outline'}
                    size={18}
                    color={isActive ? '#ff4d6d' : 'rgba(26, 37, 30, 0.4)'}
                  />
                  <View style={styles.trackMeta}>
                    <Text style={[styles.trackItemTitle, isActive && styles.trackTextActive]}>
                      {item.title}
                    </Text>
                    <Text style={styles.trackItemArtist}>{item.artist}</Text>
                  </View>
                </View>
                <Text style={styles.trackItemDuration}>{item.duration}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: 100,
    paddingTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(245, 245, 236, 0.65)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 37, 30, 0.06)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#ff4d6d',
    fontSize: 15,
    marginLeft: 4,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#1A251E',
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  playerDeck: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.04)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 20,
  },
  vinylRing: {
    width: width * 0.52,
    height: width * 0.52,
    borderRadius: (width * 0.52) / 2,
    backgroundColor: '#F7F5EE', // warm-cream retro platter
    borderWidth: 5,
    borderColor: '#FFEBEB', // soft rose outer disc rim
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    marginVertical: 10,
  },
  vinylGrooves: {
    width: '88%',
    height: '88%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.07)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vinylCenterLabel: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ff4d6d', // rose label center core
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  needleArm: {
    position: 'absolute',
    width: 3,
    height: 65,
    backgroundColor: '#ff4d6d', // premium rose needle pointer
    top: 25,
    right: width * 0.18,
    transform: [{ rotate: '25deg' }],
    borderRadius: 2,
  },
  songTitle: {
    color: '#1A251E',
    fontSize: 19,
    fontFamily: 'serif',
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 18,
  },
  songArtist: {
    color: '#ff4d6d', // rose artist signature
    fontSize: 13,
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  waveSvgWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 2,
    height: 40,
    justifyContent: 'center',
  },
  timeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  timeLabelText: {
    color: 'rgba(26, 37, 30, 0.45)',
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    width: '100%',
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 12,
  },
  playPauseShell: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#ff4d6d',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  playlistPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.04)',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  playlistHeader: {
    color: '#1A251E',
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 37, 30, 0.05)',
  },
  trackItemActive: {
    backgroundColor: '#FFEBEB', // soft rose active playlist capsule
    borderRadius: 12,
    paddingHorizontal: 8,
    borderBottomColor: 'transparent',
  },
  trackItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackMeta: {
    marginLeft: 10,
  },
  trackItemTitle: {
    color: '#1A251E',
    fontSize: 13.5,
    fontWeight: '700',
  },
  trackTextActive: {
    color: '#ff4d6d',
  },
  trackItemArtist: {
    color: 'rgba(26, 37, 30, 0.5)',
    fontSize: 11,
    marginTop: 1,
  },
  trackItemDuration: {
    color: 'rgba(26, 37, 30, 0.45)',
    fontSize: 11.5,
  },
});
