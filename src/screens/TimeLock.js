import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Target Date: Locked until June 9th, 2026 at midnight
const TARGET_DATE = new Date('2026-06-09T00:00:00');

export default function TimeLock({ onUnlock, onBypass }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCounting, setIsCounting] = useState(true);

  // Animation values
  const heartScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // New multi-layer exit animation values
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentScale = useRef(new Animated.Value(1)).current;
  const heartOpacity = useRef(new Animated.Value(1)).current;
  const rippleScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  // Developer bypass taps tracking
  const bypassTaps = useRef(0);
  const bypassTimer = useRef(null);
  const timerIntervalRef = useRef(null);

  // Complex, premium unlock animation sequence (Supernova + shockwave + content exit)
  const triggerUnlockAnimation = () => {
    // Prevent double triggers
    setIsCounting(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Stop continuous heartbeat loops
    heartScale.stopAnimation();

    // Haptic success notification
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      // 1. Content elements scale down slightly and fade out
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.88,
        duration: 800,
        useNativeDriver: true,
      }),

      // 2. Central heart grows massively (like a shockwave zooming in)
      Animated.timing(heartScale, {
        toValue: 15,
        duration: 1300,
        useNativeDriver: true,
      }),
      Animated.timing(heartOpacity, {
        toValue: 0,
        duration: 1100,
        useNativeDriver: true,
      }),

      // 3. Stardust energy ring expands outward extremely fast
      Animated.timing(rippleScale, {
        toValue: 18,
        duration: 1300,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 1,
        duration: 180, // quick rise
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Fade out remaining ring light at the very end
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        // Complete the screen unlock
        onUnlock();
      });
    });
  };

  useEffect(() => {
    // 1. Initial soft entry fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // 2. Beating heart continuous cycle
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.18,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1.0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1.12,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1.0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Countdown timer loop
    const checkCountdown = () => {
      const now = new Date();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        triggerUnlockAnimation();
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    checkCountdown(); // Run immediately
    timerIntervalRef.current = setInterval(checkCountdown, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (bypassTimer.current) clearTimeout(bypassTimer.current);
    };
  }, []);

  // Developer Bypass: Tapping the heart 5 times quickly unlocks for testing
  const handleHeartPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Reset tap timeout
    if (bypassTimer.current) clearTimeout(bypassTimer.current);

    bypassTaps.current += 1;

    // Reset counts if they pause for more than 2 seconds
    bypassTimer.current = setTimeout(() => {
      bypassTaps.current = 0;
    }, 2000);

    if (bypassTaps.current >= 5) {
      triggerUnlockAnimation();
    }
  };

  const renderTimerUnit = (value, label) => (
    <View style={styles.timeCapsule}>
      <Text style={styles.timeVal}>{value.toString().padStart(2, '0')}</Text>
      <Text style={styles.timeLabel}>{label}</Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Upper Beating Heart Vault Core */}
      <View style={styles.vaultHeader}>
        {/* Soft, glowing stardust expansion ring behind the heart */}
        <Animated.View
          style={[
            styles.shockwaveRing,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />

        <Animated.View style={{ transform: [{ scale: heartScale }], opacity: heartOpacity }}>
          <TouchableOpacity
            style={styles.heartOrb}
            onPress={handleHeartPress}
            activeOpacity={0.9}
          >
            <View style={styles.heartOrbGlow} />
            <Ionicons name="heart" size={38} color="#ff4d6d" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.dashedRing, { opacity: contentOpacity }]} />
      </View>

      {/* Main card/countdown grid wrapper */}
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: contentOpacity,
            transform: [{ scale: contentScale }],
          },
        ]}
      >
        {/* Runic Titles */}
        <View style={styles.metaContainer}>
          <Text style={styles.lockTitle}>A Special Universe</Text>
          <Text style={styles.lockTitleAlt}>is Aligning...</Text>
          <Text style={styles.tagline}>every star is preparing for your day</Text>
        </View>

        {/* Neumorphic Translucent Countdown Grid */}
        <View style={styles.countdownGrid}>
          {renderTimerUnit(timeLeft.days, 'Days')}
          <Ionicons name="heart" size={10} color="#ff4d6d" style={styles.heartSep} />
          {renderTimerUnit(timeLeft.hours, 'Hours')}
          <Ionicons name="heart" size={10} color="#ff4d6d" style={styles.heartSep} />
          {renderTimerUnit(timeLeft.minutes, 'Mins')}
          <Ionicons name="heart" size={10} color="#ff4d6d" style={styles.heartSep} />
          {renderTimerUnit(timeLeft.seconds, 'Secs')}
        </View>


      </Animated.View>

      {/* Floating Quote */}
      <Animated.View style={[styles.footerContainer, { opacity: contentOpacity }]}>
        <Ionicons name="lock-closed" size={12} color="rgba(26, 37, 30, 0.4)" style={{ marginBottom: 6 }} />
        <Text style={styles.footerQuote}>“Preparing your special universe...”</Text>
        <Text style={styles.footerInstruction}>Unlocking in just a few heartbeats. ♥</Text>
        <Text style={styles.signatureText}>Built by your best friend KUMAR ♥️</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', // Ensures the starfield shows perfectly behind
  },
  vaultHeader: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  heartOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff', // solid cream neon container
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#ff4d6d',
    zIndex: 10,
  },
  heartOrbGlow: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 77, 109, 0.25)',
    backgroundColor: 'rgba(255, 77, 109, 0.04)',
    zIndex: 1,
  },
  dashedRing: {
    position: 'absolute',
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 77, 109, 0.35)',
    borderStyle: 'dashed',
    zIndex: 2,
  },
  metaContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  lockTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A251E',
    fontFamily: 'serif',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  lockTitleAlt: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ff4d6d', // Accent color
    fontFamily: 'serif',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  tagline: {
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'serif',
    color: 'rgba(26, 37, 30, 0.45)',
    marginTop: 10,
    letterSpacing: 1.2,
  },
  countdownGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%',
    maxWidth: 360,
    marginBottom: 40,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 77, 109, 0.45)',
  },
  timeCapsule: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    paddingVertical: 6,
  },
  timeVal: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ff4d6d',
    letterSpacing: 2,
    fontFamily: 'serif',
  },
  timeLabel: {
    fontSize: 9,
    color: 'rgba(26, 37, 30, 0.4)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  heartSep: {
    marginHorizontal: 4,
    marginBottom: 16,
    opacity: 0.7,
  },
  footerContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: height * 0.06,
  },
  footerQuote: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: 'rgba(26, 37, 30, 0.5)',
    textTransform: 'uppercase',
  },
  footerInstruction: {
    fontSize: 11,
    fontStyle: 'italic',
    fontFamily: 'serif',
    color: 'rgba(26, 37, 30, 0.4)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  bypassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 77, 109, 0.25)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  bypassBtnText: {
    color: '#ff4d6d',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  contentWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  shockwaveRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ff4d6d',
    backgroundColor: 'rgba(255, 77, 109, 0.15)',
    zIndex: 5,
  },
  signatureText: {
    color: '#ff4d6d',
    fontSize: 9,
    fontFamily: 'serif',
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 12,
    opacity: 0.8
  }
});
