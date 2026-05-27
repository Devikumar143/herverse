import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

// Generate 28 gold stardust particles for the climax convergence (Scene 21)
const generateLogoStardust = () => {
  const points = [];
  const NUM_POINTS = 28;
  for (let i = 0; i < NUM_POINTS; i++) {
    const angle = (i * 2 * Math.PI) / NUM_POINTS + (Math.random() - 0.5) * 0.4;
    const radius = Math.max(width, height) * (0.4 + Math.random() * 0.15);
    points.push({
      id: i,
      startX: Math.cos(angle) * radius,
      startY: Math.sin(angle) * radius,
      delay: Math.random() * 300,
    });
  }
  return points;
};

export default function CinematicIntro({ onEnter, playBackgroundMusic }) {
  const [sceneIndex, setSceneIndex] = useState(0); // 0 to 20 for Scenes 1 to 21
  const [stardust] = useState(() => generateLogoStardust());

  // Animations
  const textOpacity1 = useRef(new Animated.Value(0)).current;
  const textOpacity2 = useRef(new Animated.Value(0)).current; // used for Scene 10 second part
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Stardust animations
  const stardustAnims = useRef(stardust.map(() => new Animated.Value(1))).current;

  // Intro song ref
  const introSoundRef = useRef(null);

  // Active timers tracker to clean up on unmount or skip
  const activeTimers = useRef([]);

  useEffect(() => {
    // Start the cinematic sequence
    runCinematicSequence(0);

    return () => {
      // Cleanup timers + stop song on unmount
      activeTimers.current.forEach(clearTimeout);
      if (introSoundRef.current) {
        introSoundRef.current.stopAsync();
        introSoundRef.current.unloadAsync();
      }
    };
  }, []);

  const runCinematicSequence = (index) => {
    setSceneIndex(index);
    textOpacity1.setValue(0);
    textOpacity2.setValue(0);

    // Final Screen Climax (Scene 21)
    if (index === 20) {
      triggerClimaxAnimation();
      return;
    }

    // Scene 10 Special Timing ("And you..." -> pause -> "became unforgettable.")
    if (index === 9) {
      // 1. Fade in "And you..."
      Animated.timing(textOpacity1, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();

      // 2. Pause and then fade in "became unforgettable." in gold
      const t1 = setTimeout(() => {
        Animated.timing(textOpacity2, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      }, 1600);
      activeTimers.current.push(t1);

      // 3. Hold and then fade out both
      const t2 = setTimeout(() => {
        Animated.parallel([
          Animated.timing(textOpacity1, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(textOpacity2, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]).start(() => {
          runCinematicSequence(index + 1);
        });
      }, 5200);
      activeTimers.current.push(t2);

      return;
    }

    // Standard text screens (Scenes 1-9, 11-20)
    Animated.timing(textOpacity1, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Set hold and fade-out timer
    const t = setTimeout(() => {
      Animated.timing(textOpacity1, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        runCinematicSequence(index + 1);
      });
    }, 2400); // Display each for 2.4s
    activeTimers.current.push(t);
  };

  const triggerClimaxAnimation = () => {
    // Swirl stardust from outer space to center
    const particleAnimsList = stardustAnims.map((anim, index) =>
      Animated.sequence([
        Animated.delay(stardust[index].delay),
        Animated.timing(anim, {
          toValue: 0,
          duration: 2000 + Math.random() * 400,
          useNativeDriver: true,
        })
      ])
    );

    Animated.parallel([
      ...particleAnimsList,
      Animated.sequence([
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1.0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(2200),
        Animated.timing(taglineOpacity, {
          toValue: 0.95,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Infinite breathing heartbeat for the final CTA button
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.04,
            duration: 1300,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1.0,
            duration: 1300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  // Fade out and stop intro song
  const stopIntroSong = async () => {
    if (!introSoundRef.current) return;
    try {
      // Quick fade: step volume down in 300ms intervals
      for (let v = 0.6; v >= 0; v -= 0.12) {
        await introSoundRef.current.setVolumeAsync(Math.max(v, 0));
        await new Promise((r) => setTimeout(r, 80));
      }
      await introSoundRef.current.stopAsync();
      await introSoundRef.current.unloadAsync();
      introSoundRef.current = null;
    } catch (_) {}
  };

  const handleEnterPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    stopIntroSong();          // ← fade out intro song
    playBackgroundMusic();    // ← start main background music

    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.timing(logoScale, { toValue: 1.15, duration: 800, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(taglineOpacity, { toValue: 0, duration: 600, useNativeDriver: true })
    ]).start(() => {
      onEnter();
    });
  };

  const handleSkipIntro = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    activeTimers.current.forEach(clearTimeout);
    stopIntroSong();          // ← stop intro song immediately
    playBackgroundMusic();
    onEnter();
  };

  // Content map matching the exact 21-scene emotional structure
  const getSceneContent = () => {
    switch (sceneIndex) {
      case 0: return "Out of billions of people…";
      case 1: return "billions of conversations…";
      case 2: return "billions of moments…";
      case 3: return "somehow…";
      case 4: return "you became my favorite one.";
      case 5: return "And slowly…";
      case 6: return "ordinary days became memories.";
      case 7: return "Late-night talks became comfort.";
      case 8: return "Small moments became important.";
      case 10: return "MOUNI♥️";
      case 11: return "A world made of pure love.";
      case 12: return "Built from memories.";
      case 13: return "From comfort.";
      case 14: return "From laughter.";
      case 15: return "From everything that feels like us.";
      case 16: return "This isn’t just an app.";
      case 17: return "It’s a collection of moments…";
      case 18: return "that mattered.";
      case 19: return "And the person who made them matter.";
      default: return "";
    }
  };

  return (
    <View style={styles.container}>

      {/* Subtle Skip button in top right corner */}
      {sceneIndex < 20 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkipIntro} activeOpacity={0.7}>
          <Text style={styles.skipButtonText}>Skip Intro</Text>
          <Ionicons name="arrow-forward" size={12} color="rgba(26, 37, 30, 0.4)" />
        </TouchableOpacity>
      )}

      {/* standard text display (scenes 1-9, 11-20) */}
      {sceneIndex !== 9 && sceneIndex !== 20 && (
        <Animated.Text style={[styles.cinematicText, { opacity: textOpacity1 }]}>
          {getSceneContent()}
        </Animated.Text>
      )}

      {/* Scene 10 Special Display */}
      {sceneIndex === 9 && (
        <View style={styles.specialTextBox}>
          <Animated.Text style={[styles.cinematicText, { opacity: textOpacity1, marginBottom: 16 }]}>
            And you…
          </Animated.Text>
          <Animated.Text style={[styles.cinematicText, { opacity: textOpacity2, color: '#ff4d6d', fontWeight: '800' }]}>
            became my entire world.
          </Animated.Text>
        </View>
      )}

      {/* Climax Climax Climax (Scene 21) */}
      {sceneIndex === 20 && (
        <View style={styles.logoContainer}>
          {/* Dense gold stardust spiral particles converging */}
          {stardust.map((point, index) => {
            const scale = stardustAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 2.5],
            });

            const opacity = stardustAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.8],
            });

            return (
              <Animated.View
                key={point.id}
                style={[
                  styles.logoParticle,
                  {
                    transform: [
                      {
                        translateX: stardustAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, point.startX],
                        })
                      },
                      {
                        translateY: stardustAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, point.startY],
                        })
                      },
                      { scale: scale }
                    ],
                    opacity: opacity,
                  },
                ]}
              />
            );
          })}

          {/* Core HerVerse Logo */}
          <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], alignItems: 'center' }}>
            <View style={styles.logoGlowShell}>
              <Text style={styles.logoText}>HerVerse</Text>
            </View>
          </Animated.View>

          {/* Tagline */}
          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            “A world built of pure love.”
          </Animated.Text>

          {/* Glowing pulse Enter CTA button */}
          <Animated.View style={{ opacity: buttonOpacity, transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity style={styles.enterButton} onPress={handleEnterPress} activeOpacity={0.85}>
              <Text style={styles.enterButtonText}>Enter the world of you</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  skipButton: {
    position: 'absolute',
    top: 55,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 37, 30, 0.04)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  skipButtonText: {
    color: 'rgba(26, 37, 30, 0.45)',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'serif',
    marginRight: 4,
    textTransform: 'uppercase',
  },
  cinematicText: {
    fontSize: 22,
    color: '#1A251E',
    fontFamily: 'serif',
    textAlign: 'center',
    letterSpacing: 1.5,
    lineHeight: 36,
  },
  specialTextBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  logoParticle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff708a', // warm-rose love particles
    shadowColor: '#ff708a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  logoGlowShell: {
    padding: 10,
  },
  logoText: {
    fontSize: 54,
    color: '#1A251E',
    fontFamily: 'serif',
    fontWeight: '900',
    letterSpacing: 6,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#ff4d6d', // beautiful pink-red tagline
    fontFamily: 'serif',
    marginTop: 15,
    marginBottom: 50,
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  enterButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 77, 109, 0.4)', // soft love-pink outline border
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  enterButtonText: {
    color: '#1A251E',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
