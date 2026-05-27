import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

/**
 * PermissionModal — HerVerse styled "Allow / Deny" dialog
 *
 * Props:
 *  visible       — boolean — show/hide
 *  icon          — Ionicons name string (e.g. 'camera-outline')
 *  title         — main heading
 *  description   — body text explaining why permission is needed
 *  allowLabel    — text for the allow button (default: "Allow")
 *  denyLabel     — text for the deny button  (default: "Not Now")
 *  onAllow       — callback when user taps Allow
 *  onDeny        — callback when user taps Deny / Not Now
 */
export default function PermissionModal({
  visible,
  icon = 'camera-outline',
  title = 'Permission Required',
  description = 'This app needs access to continue.',
  allowLabel = 'Allow',
  denyLabel = 'Not Now',
  onAllow,
  onDeny,
}) {
  const slideAnim  = useRef(new Animated.Value(300)).current;
  const backdropOp = useRef(new Animated.Value(0)).current;
  const orbPulse   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Slide sheet up + fade backdrop
      Animated.parallel([
        Animated.spring(slideAnim,  { toValue: 0, tension: 55, friction: 9, useNativeDriver: true }),
        Animated.timing(backdropOp, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();

      // Orb breathing pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbPulse, { toValue: 1.15, duration: 900, useNativeDriver: true }),
          Animated.timing(orbPulse, { toValue: 1.0,  duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else {
      // Slide back down
      Animated.parallel([
        Animated.timing(slideAnim,  { toValue: 300, duration: 280, useNativeDriver: true }),
        Animated.timing(backdropOp, { toValue: 0,   duration: 280, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleAllow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAllow?.();
  };

  const handleDeny = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDeny?.();
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      {/* ── Frosted backdrop ── */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOp }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleDeny} activeOpacity={1} />
      </Animated.View>

      {/* ── Bottom sheet card ── */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Handle bar */}
        <View style={styles.handleBar} />

        {/* Pulsing icon orb */}
        <Animated.View style={[styles.orbOuter, { transform: [{ scale: orbPulse }] }]}>
          <View style={styles.orbInner}>
            <Ionicons name={icon} size={30} color="#ff4d6d" />
          </View>
        </Animated.View>

        {/* App label */}
        <Text style={styles.appLabel}>HerVerse</Text>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Description */}
        <Text style={styles.description}>{description}</Text>

        {/* Privacy notice */}
        <View style={styles.privacyRow}>
          <Ionicons name="lock-closed-outline" size={11} color="rgba(26,37,30,0.35)" />
          <Text style={styles.privacyText}>Private only · Never stored · Never shared</Text>
        </View>

        {/* Buttons */}
        <View style={styles.btnGroup}>
          {/* Allow — primary rose */}
          <TouchableOpacity style={styles.allowBtn} onPress={handleAllow} activeOpacity={0.85}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
            <Text style={styles.allowText}>{allowLabel}</Text>
          </TouchableOpacity>

          {/* Deny — ghost */}
          <TouchableOpacity style={styles.denyBtn} onPress={handleDeny} activeOpacity={0.7}>
            <Text style={styles.denyText}>{denyLabel}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 15, 15, 0.45)',
  },

  // ── Bottom sheet ─────────────────────────────────
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff8f8',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingBottom: 40,
    paddingTop: 14,
    alignItems: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(255,77,109,0.12)',
  },

  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,77,109,0.25)',
    marginBottom: 24,
  },

  // ── Orb ──────────────────────────────────────────
  orbOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,77,109,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,77,109,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  orbInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: 'rgba(255,77,109,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Text ─────────────────────────────────────────
  appLabel: {
    fontSize: 10,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: '#ff4d6d',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '900',
    color: '#1A251E',
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 14,
  },
  divider: {
    width: 40,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: 'rgba(255,77,109,0.2)',
    marginBottom: 14,
  },
  description: {
    fontSize: 13.5,
    fontFamily: 'serif',
    color: 'rgba(26,37,30,0.65)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 28,
  },
  privacyText: {
    fontSize: 10,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: 'rgba(26,37,30,0.35)',
    letterSpacing: 0.3,
  },

  // ── Buttons ──────────────────────────────────────
  btnGroup: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  allowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ff4d6d',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 6,
  },
  allowText: {
    color: '#ffffff',
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  denyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  denyText: {
    color: 'rgba(26,37,30,0.4)',
    fontFamily: 'serif',
    fontSize: 13,
    fontStyle: 'italic',
    letterSpacing: 0.4,
  },
});
