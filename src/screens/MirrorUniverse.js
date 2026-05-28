import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import PermissionModal from '../components/PermissionModal';

const { width, height } = Dimensions.get('window');

const affirmationTexts = [
  "Look into the mirror of my heart...",
  "You are looking at the person I cherish most in this entire world.",
  "The one who fills my life with endless warmth, laughter, and pure happiness.",
  "Thank you for being my constant, my favorite person, and my bestie. Happy Birthday! ❤️🌹"
];

export default function MirrorUniverse({ onBack }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [bypassedCamera, setBypassedCamera] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);

  // Animations
  const textOpacity = useRef(new Animated.Value(0)).current;
  const ringRotation = useRef(new Animated.Value(0)).current;
  const mirrorScale = useRef(new Animated.Value(0.9)).current;
  const mirrorOpacity = useRef(new Animated.Value(0)).current;

  // Permission prompt animations
  const permSlide = useRef(new Animated.Value(40)).current;
  const permOpacity = useRef(new Animated.Value(0)).current;
  const orbPulse = useRef(new Animated.Value(1)).current;

  const timersRef = useRef([]);

  // Star/Heart ring rotation loop
  useEffect(() => {
    Animated.loop(
      Animated.timing(ringRotation, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Show custom permission modal as soon as we know it's not granted
  useEffect(() => {
    if (permission && !permission.granted && !bypassedCamera) {
      setShowPermModal(true);
      Animated.parallel([
        Animated.timing(permOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(permSlide, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true }),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbPulse, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
          Animated.timing(orbPulse, { toValue: 1.0,  duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [permission]);

  // Handle entry animation when camera is granted or bypassed
  useEffect(() => {
    if (bypassedCamera || (permission && permission.granted)) {
      Animated.parallel([
        Animated.timing(mirrorOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(mirrorScale, { toValue: 1.0, friction: 6, useNativeDriver: true }),
      ]).start(() => {
        triggerAffirmationsCycle();
      });
    }
  }, [permission, bypassedCamera]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Sequential narrative intervals
  const triggerAffirmationsCycle = () => {
    // Clear any existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Fade in first text
    Animated.timing(textOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }).start();

    // Setup timed triggers
    for (let i = 1; i < affirmationTexts.length; i++) {
      const timer = setTimeout(() => {
        // Fade out
        Animated.timing(textOpacity, { toValue: 0, duration: 800, useNativeDriver: true }).start(() => {
          setAffirmationIndex(i);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          // Fade in
          Animated.timing(textOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }).start();
        });
      }, i * 4500); // 4.5 seconds intervals
      timersRef.current.push(timer);
    }
  };

  const handleGrantPermission = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowPermModal(false);
    await requestPermission();
  };

  const spin = ringRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Custom stylized permission prompt modal */}
      <PermissionModal
        visible={showPermModal}
        icon="camera-outline"
        title="Allow Camera Access"
        description={"HerVerse wants to use your front camera to create a private live mirror — so you can see the most beautiful person in my world 🌸"}
        allowLabel="Allow"
        denyLabel="Not Now"
        onAllow={handleGrantPermission}
        onDeny={() => {
          setShowPermModal(false);
          setBypassedCamera(true);
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#ff4d6d" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mirror of my Heart</Text>
        <View style={{ width: 60 }} />
      </View>

      {!permission && !bypassedCamera ? (
        // Loading state
        <View style={styles.centerBox}>
          <Text style={styles.loadingText}>Connecting our hearts...</Text>
        </View>
      ) : !permission.granted && !bypassedCamera ? (
        // Stylized Permission Prompt when modal is closed but permission not resolved
        <Animated.View
          style={[
            styles.permissionBox,
            { opacity: permOpacity, transform: [{ translateY: permSlide }] },
          ]}
        >
          {/* Pulsing camera orb */}
          <Animated.View style={[styles.orbOuter, { transform: [{ scale: orbPulse }] }]}>
            <View style={styles.orbInner}>
              <Ionicons name="camera-outline" size={36} color="#ff4d6d" />
            </View>
          </Animated.View>

          {/* Title */}
          <Text style={styles.promptTitle}>Camera Access</Text>
          <Text style={styles.promptEyebrow}>Mirror of my Heart 🌸</Text>

          {/* Description card */}
          <View style={styles.promptCard}>
            <Text style={styles.promptDesc}>
              HerVerse uses your front camera as a private live mirror. This displays your live reflection inside Reshma's birthday universe!
            </Text>
            <View style={styles.privacyRow}>
              <Ionicons name="lock-closed-outline" size={12} color="rgba(26,37,30,0.4)" />
              <Text style={styles.privacyText}>
                100% Private Preview · No photos saved
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.grantButton}
            onPress={handleGrantPermission}
            activeOpacity={0.85}
          >
            <Ionicons name="camera" size={15} color="#ffffff" />
            <Text style={styles.grantButtonText}>Allow Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fallbackButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setBypassedCamera(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.fallbackButtonText}>Enter without camera</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        // Mirror Screen Feed (Camera only!)
        <View style={styles.mirrorContent}>
          <View style={styles.mirrorAligner}>
            {/* Rotating heart ring */}
            <Animated.View style={[styles.rotatingRing, { transform: [{ rotate: spin }, { scale: mirrorScale }] }]}>
              <View style={styles.starDecorator}><Ionicons name="heart" size={14} color="#ff4d6d" /></View>
              <View style={[styles.starDecorator, { transform: [{ rotate: '90deg' }] }]}><Ionicons name="heart" size={10} color="#ff4d6d" /></View>
              <View style={[styles.starDecorator, { transform: [{ rotate: '180deg' }] }]}><Ionicons name="heart" size={14} color="#ff4d6d" /></View>
              <View style={[styles.starDecorator, { transform: [{ rotate: '270deg' }] }]}><Ionicons name="heart" size={10} color="#ff4d6d" /></View>
            </Animated.View>

            {/* Circular Camera Mirror */}
            <Animated.View style={[styles.mirrorRingFrame, { opacity: mirrorOpacity, transform: [{ scale: mirrorScale }] }]}>
              <View style={styles.cameraCropContainer}>
                {permission?.granted && !bypassedCamera ? (
                  <CameraView style={styles.cameraFeed} facing="front" />
                ) : (
                  <LinearGradient
                    colors={['#FFF5F5', '#FFE3E3', '#FFC9C9']}
                    style={styles.mirrorPlaceholder}
                  >
                    <Ionicons name="heart" size={50} color="rgba(255, 77, 109, 0.4)" />
                  </LinearGradient>
                )}
              </View>
            </Animated.View>
          </View>

          {/* Timed Affirmation Text Card */}
          <View style={styles.narrativeFrame}>
            <Animated.Text style={[styles.affirmationText, { opacity: textOpacity }]}>
              {affirmationTexts[affirmationIndex]}
            </Animated.Text>
          </View>

          <Text style={styles.privacyNote}>
            🔒 Private Live Preview • No images are recorded
          </Text>
        </View>
      )}
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
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(26, 37, 30, 0.55)',
    fontFamily: 'serif',
    fontSize: 14,
    fontStyle: 'italic',
  },
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  orbOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 77, 109, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 77, 109, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 4,
  },
  orbInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 77, 109, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  promptTitle: {
    color: '#1A251E',
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  promptEyebrow: {
    color: '#ff4d6d',
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  promptCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.12)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  promptDesc: {
    color: 'rgba(26, 37, 30, 0.7)',
    fontSize: 13.5,
    fontFamily: 'serif',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  privacyText: {
    color: 'rgba(26,37,30,0.4)',
    fontSize: 10.5,
    fontFamily: 'serif',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  grantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ff4d6d',
    paddingHorizontal: 36,
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 12,
  },
  grantButtonText: {
    color: '#ffffff',
    fontFamily: 'serif',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  fallbackButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1.2,
    borderColor: '#ff4d6d',
  },
  fallbackButtonText: {
    color: '#ff4d6d',
    fontFamily: 'serif',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  mirrorContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  mirrorAligner: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 36,
  },
  rotatingRing: {
    position: 'absolute',
    width: 246,
    height: 246,
    borderRadius: 123,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 77, 109, 0.35)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starDecorator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: 8,
  },
  mirrorRingFrame: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#ffffff',
    padding: 6,
    borderWidth: 1.5,
    borderColor: '#ff4d6d',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
  },
  cameraCropContainer: {
    flex: 1,
    borderRadius: 104,
    overflow: 'hidden',
  },
  cameraFeed: {
    width: '100%',
    height: '100%',
  },
  mirrorPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  narrativeFrame: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.04)',
    padding: 24,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    width: '100%',
    maxWidth: 320,
    marginBottom: 24,
  },
  affirmationText: {
    color: '#1A251E',
    fontFamily: 'serif',
    fontSize: 15.5,
    lineHeight: 26,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  privacyNote: {
    color: 'rgba(26, 37, 30, 0.45)',
    fontSize: 10,
    fontFamily: 'serif',
    letterSpacing: 0.5,
  },
});
