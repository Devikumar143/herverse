import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Premium high-fashion planetary configs (no cartoon mascots)
const planetConfigs = [

  {
    id: 'memories',
    label: 'Memories',
    icon: 'journal-outline',
    color: '#ff4d6d', // romantic pink-red
    x: -width * 0.28,
    y: -height * 0.22,
    scale: 1.1,
  },
  {
    id: 'flowers',
    label: 'Flower Garden',
    icon: 'flower-outline',
    color: '#ff4d6d',
    x: width * 0.28,
    y: -height * 0.2,
    scale: 1.1,
  },
  {
    id: 'songs',
    label: 'Songs',
    icon: 'musical-notes-outline',
    color: '#ff4d6d',
    x: -width * 0.32,
    y: 0,
    scale: 1.1,
  },
  {
    id: 'letters',
    label: 'Letters',
    icon: 'mail-outline',
    color: '#ff4d6d',
    x: width * 0.32,
    y: height * 0.02,
    scale: 0.9,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: 'images-outline',
    color: '#ff4d6d',
    x: -width * 0.28,
    y: height * 0.22,
    scale: 0.9,
  },
  {
    id: 'mirror',
    label: 'Mirror of my Heart',
    icon: 'heart-outline',
    color: '#ff4d6d',
    x: width * 0.28,
    y: height * 0.24,
    scale: 1.1,
  },
  {
    id: 'secret',
    label: 'Secret Heart',
    icon: 'lock-closed-outline',
    color: '#ff3366', // rose accent
    x: 0,
    y: height * 0.33,
    scale: 1.2,
    isLocked: true
  },
];

export default function GalaxyHome({ onNavigate, isSecretUnlocked }) {
  const scatterAnim = useRef(new Animated.Value(1)).current;
  const centralStarScale = useRef(new Animated.Value(1)).current;
  const centralStarGlow = useRef(new Animated.Value(0.75)).current;

  // Float loops
  const floatAnims = useRef(planetConfigs.map(() => new Animated.Value(0))).current;
  const planetScaleAnims = useRef(planetConfigs.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    // 1. Central Core Pulsing
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(centralStarScale, { toValue: 1.1, duration: 2200, useNativeDriver: true }),
          Animated.timing(centralStarGlow, { toValue: 1.0, duration: 2200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(centralStarScale, { toValue: 1.0, duration: 2200, useNativeDriver: true }),
          Animated.timing(centralStarGlow, { toValue: 0.75, duration: 2200, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // 2. Zero-gravity Float
    planetConfigs.forEach((_, index) => {
      const delay = index * 180;
      const duration = 2400 + (index % 3) * 600;

      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(floatAnims[index], {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnims[index], {
            toValue: -1,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const handlePlanetPress = (planet, index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Deep scatter zoom transition
    Animated.parallel([
      Animated.timing(planetScaleAnims[index], {
        toValue: 7,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(scatterAnim, {
        toValue: 2.4,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(centralStarScale, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onNavigate(planet.id);

      // Reset animations
      planetScaleAnims[index].setValue(1);
      scatterAnim.setValue(1);
      centralStarScale.setValue(1);
    });
  };

  const centerCoordinates = {
    x: width / 2,
    y: height / 2 - 25,
  };

  return (
    <View style={styles.container}>
      {/* Subtle dashed sage-green SVG connecting constellation lines */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          {planetConfigs.map((planet) => {
            const planetX = centerCoordinates.x + planet.x;
            const planetY = centerCoordinates.y + planet.y;

            return (
              <Line
                key={planet.id}
                x1={centerCoordinates.x}
                y1={centerCoordinates.y}
                x2={planetX}
                y2={planetY}
                stroke="rgba(255, 77, 109, 0.35)" // elegant soft-love pink line
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
            );
          })}
        </Svg>
      </View>

      {/* Header Info */}
      <View style={styles.topInfo}>
        <Text style={styles.appTitle}>RESHMA♥️</Text>
        <Text style={styles.tagline}>explore the universe built for you</Text>
      </View>

      {/* Central Core "LOVE" core */}
      <Animated.View
        style={[
          styles.centralStarContainer,
          {
            left: centerCoordinates.x - 30,
            top: centerCoordinates.y - 30,
            transform: [{ scale: centralStarScale }],
            opacity: centralStarGlow,
          },
        ]}
      >
        <View style={styles.centralStarCore} />
        <View style={styles.centralStarGlowRing} />
        <Text style={styles.centralStarLabel}>YOU</Text>
      </Animated.View>

      {/* Renders all Interactive Editorial Orbs */}
      {planetConfigs.map((planet, index) => {
        const floatOffset = floatAnims[index].interpolate({
          inputRange: [-1, 1],
          outputRange: [-8, 8],
        });

        const planetX = centerCoordinates.x + planet.x;
        const planetY = centerCoordinates.y + planet.y;

        // Dynamic Icon calculation
        const isLocked = planet.isLocked && !isSecretUnlocked;
        const currentIconName = isLocked
          ? 'lock-closed-outline'
          : (planet.id === 'secret' ? 'heart' : planet.icon);

        return (
          <Animated.View
            key={planet.id}
            style={[
              styles.planetContainer,
              {
                left: planetX - 35,
                top: planetY - 35,
                transform: [
                  { translateY: floatOffset },
                  {
                    translateX: Animated.multiply(
                      planet.x,
                      Animated.subtract(scatterAnim, 1)
                    ),
                  },
                  {
                    translateY: Animated.multiply(
                      planet.y,
                      Animated.subtract(scatterAnim, 1)
                    ),
                  },
                  { scale: planetScaleAnims[index] },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.planetNode,
                { borderColor: planet.color + '25' }
              ]}
              onPress={() => handlePlanetPress(planet, index)}
              activeOpacity={0.8}
            >
              {/* Glowing inner aura rim */}
              <View style={[styles.innerGlowRing, { borderColor: planet.color + '12', backgroundColor: planet.color + '05' }]} />

              <Ionicons name={currentIconName} size={22} color={planet.color} />
            </TouchableOpacity>

            {/* Floating Editorial pill label */}
            <View style={styles.labelPill}>
              <Text style={[styles.planetLabel, { color: '#1A251E' }]}>
                {planet.isLocked && !isLocked ? 'Surprise' : planet.label}
              </Text>
            </View>
          </Animated.View>
        );
      })}

      {/* Floating Quote */}
      <View style={styles.bottomBar}>
        <Text style={styles.floatingQuote}>“Built for you reshma ❤️”</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topInfo: {
    position: 'absolute',
    top: height * 0.08,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A251E',
    fontFamily: 'serif',
    letterSpacing: 6,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(26, 37, 30, 0.08)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'serif',
    color: 'rgba(26, 37, 30, 0.5)',
    marginTop: 6,
    letterSpacing: 1.5,
  },
  centralStarContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralStarCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ff4d6d', // elegant soft pink-red core heart
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  centralStarGlowRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 77, 109, 0.45)',
    backgroundColor: 'rgba(255, 77, 109, 0.08)',
  },
  centralStarLabel: {
    position: 'absolute',
    bottom: -22,
    fontSize: 10,
    fontWeight: '800',
    color: '#ff4d6d',
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  planetContainer: {
    position: 'absolute',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planetNode: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ffffff', // solid off-white sphere
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  innerGlowRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.2,
  },
  labelPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.05)',
  },
  planetLabel: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'serif',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: height * 0.05,
    width: '100%',
    alignItems: 'center',
  },
  floatingQuote: {
    fontSize: 13,
    fontStyle: 'italic',
    fontFamily: 'serif',
    color: 'rgba(26, 37, 30, 0.65)',
    letterSpacing: 1.5,
  },
});
