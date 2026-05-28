import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// ── Grid config ────────────────────────────────────────────────────────────
const CELL = 44;
const COLS = Math.ceil(width / CELL) + 1;
const ROWS = Math.ceil(height / CELL) + 1;

const FLOWERS = ['🌸', '🌺', '🌹', '🌷', '💮', '🌼', '🌻', '🏵️', '💐', '🌸', '🌺', '🌷'];

// Build flat list of flower positions
const GRID = Array.from({ length: ROWS * COLS }, (_, idx) => ({
  id: idx,
  emoji: FLOWERS[idx % FLOWERS.length],
  col: idx % COLS,
  row: Math.floor(idx / COLS),
}));

export default function FlowerGarden({ onBack }) {
  // One Animated.Value per flower — only used once (entry), then static forever
  const bloomAnims = useRef(GRID.map(() => new Animated.Value(0))).current;

  // UI elements
  const headerAnim = useRef(new Animated.Value(0)).current;
  const quoteAnim = useRef(new Animated.Value(0)).current;
  const backAnim = useRef(new Animated.Value(0)).current;

  // Tap burst
  const burstScale = useRef(new Animated.Value(0)).current;
  const burstOp = useRef(new Animated.Value(0)).current;
  const burstX = useRef(new Animated.Value(width / 2 - 25)).current;
  const burstY = useRef(new Animated.Value(height / 2 - 25)).current;

  useEffect(() => {
    // ── Staggered bloom-in: wave from top-left → bottom-right ──
    const animations = GRID.map((cell) => {
      const stagger = (cell.row * COLS + cell.col) * 18; // wave delay
      return Animated.sequence([
        Animated.delay(stagger),
        Animated.spring(bloomAnims[cell.id], {
          toValue: 1,
          tension: 80,
          friction: 7,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start();

    // UI fade-ins after a short lead
    Animated.sequence([
      Animated.delay(400),
      Animated.stagger(200, [
        Animated.timing(backAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(quoteAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleTap = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    burstX.setValue(locationX - 25);
    burstY.setValue(locationY - 25);
    burstScale.setValue(0);
    burstOp.setValue(1);
    Animated.parallel([
      Animated.timing(burstScale, { toValue: 9, duration: 550, useNativeDriver: true }),
      Animated.timing(burstOp, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.root}>

      {/* ── Full-screen flower grid ── */}
      {GRID.map((cell) => (
        <Animated.Text
          key={cell.id}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: cell.col * CELL - CELL / 4,
            top: cell.row * CELL - CELL / 4,
            fontSize: CELL - 6,
            lineHeight: CELL,
            width: CELL,
            textAlign: 'center',
            transform: [{ scale: bloomAnims[cell.id] }],
            opacity: bloomAnims[cell.id],
          }}
        >
          {cell.emoji}
        </Animated.Text>
      ))}

      {/* ── Soft rosy overlay ── */}
      <View style={styles.tint} pointerEvents="none" />

      {/* ── Tap burst ── */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.burst,
          {
            opacity: burstOp,
            transform: [
              { translateX: burstX },
              { translateY: burstY },
              { scale: burstScale },
            ],
          },
        ]}
      />

      {/* ── Tap zone ── */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={handleTap}
      />

      {/* ── Header ── */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.headerWrap,
          {
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1], outputRange: [-18, 0],
              }),
            }],
          },
        ]}
      >
        <View style={styles.card}>
          <Text style={styles.headerTitle}>🌸 Bestie Garden 🌸</Text>
          <Text style={styles.headerSub}>grown for my forever bestie, reshma 🫶</Text>
        </View>
      </Animated.View>

      {/* ── Quote ── */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.quoteWrap,
          {
            opacity: quoteAnim,
            transform: [{
              translateY: quoteAnim.interpolate({
                inputRange: [0, 1], outputRange: [18, 0],
              }),
            }],
          },
        ]}
      >
        <View style={styles.card}>
          <Text style={styles.quoteText}>
            {"\"A garden full of flowers,\njust like our friendship —\ncolourful & forever 🌻\""}
          </Text>
          <Text style={styles.tapHint}>✨ tap anywhere, bestie ✨</Text>
        </View>
      </Animated.View>

      {/* ── Back button ── */}
      <Animated.View style={[styles.backWrap, { opacity: backAnim }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onBack();
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={16} color="#ff4d6d" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff0f3',
    overflow: 'hidden',
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 200, 215, 0.18)',
  },
  burst: {
    position: 'absolute',
    top: 0, left: 0,
    width: 50, height: 50,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 77, 109, 0.55)',
    backgroundColor: 'rgba(255, 77, 109, 0.08)',
    zIndex: 40,
  },
  headerWrap: {
    position: 'absolute',
    top: height * 0.10,
    width: '100%',
    alignItems: 'center',
    zIndex: 20,
    paddingHorizontal: 24,
  },
  quoteWrap: {
    position: 'absolute',
    bottom: height * 0.09,
    width: '100%',
    alignItems: 'center',
    zIndex: 20,
    paddingHorizontal: 28,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.18)',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'serif',
    color: '#1A251E',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 11,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: '#ff4d6d',
    marginTop: 4,
    letterSpacing: 2,
  },
  quoteText: {
    fontSize: 14,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: '#1A251E',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.4,
  },
  tapHint: {
    fontSize: 10,
    fontFamily: 'serif',
    color: 'rgba(26,37,30,0.45)',
    marginTop: 8,
    letterSpacing: 1.2,
  },
  backWrap: {
    position: 'absolute',
    top: height * 0.055,
    left: 16,
    zIndex: 25,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  backText: {
    fontSize: 11,
    fontFamily: 'serif',
    fontWeight: '800',
    color: '#1A251E',
    letterSpacing: 0.8,
    marginLeft: 4,
  },
});
