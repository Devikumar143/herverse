import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Coordinate points for 24 firework explosion particles
const generateFireworkParticles = () => {
  const list = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i * 2 * Math.PI) / 24 + Math.random() * 0.2;
    const distance = Math.max(width, height) * (0.32 + Math.random() * 0.12);
    // Sage, gold, cream, rose, mint stardust palette
    const colors = ['#8da890', '#cca554', '#ffffff', '#ff3366', '#3BF06A'];
    list.push({
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color: colors[i % colors.length],
      size: Math.random() * 5 + 4,
    });
  }
  return list;
};

export default function FinalEnding({ onRestart }) {
  const [sceneStage, setSceneStage] = useState(0); // 0: Thank you text, 1: Happy Birthday blast
  const [particles] = useState(() => generateFireworkParticles());

  const thankYouOpacity = useRef(new Animated.Value(0)).current;
  const birthdayOpacity = useRef(new Animated.Value(0)).current;
  const birthdayScale = useRef(new Animated.Value(0.65)).current;
  const restartOpacity = useRef(new Animated.Value(0)).current;

  // Firework explosion progress
  const explosionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Phase 1: Fade in emotional parting quote
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(thankYouOpacity, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.delay(3500),
      Animated.timing(thankYouOpacity, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Phase 2: Happy Birthday explosion!
      setSceneStage(1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Animated.parallel([
        Animated.timing(explosionAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.parallel([
            Animated.timing(birthdayOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(birthdayScale, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
          ]),
          Animated.timing(birthdayScale, { toValue: 1.0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(2200),
          Animated.timing(restartOpacity, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Delayed firework haptics
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 350);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 700);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 1050);
    });
  }, []);

  return (
    <View style={styles.container}>
      {sceneStage === 0 ? (
        /* Phase 1 */
        <Animated.View style={[styles.textCenterFrame, { opacity: thankYouOpacity }]}>
          <Text style={styles.thankYouText}>
            “Every moment with you is a treasure I hold close to my heart.”
          </Text>
        </Animated.View>
      ) : (
        /* Phase 2 */
        <View style={styles.birthdayStage}>
          {/* Celebrating stardust particles */}
          {particles.map((p) => {
            const translateX = explosionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, p.x],
            });
            const translateY = explosionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, p.y],
            });
            const opacity = explosionAnim.interpolate({
              inputRange: [0, 0.15, 0.8, 1],
              outputRange: [0, 1, 0.8, 0],
            });
            const scale = explosionAnim.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [1, 1.2, 0.2],
            });

            return (
              <Animated.View
                key={p.id}
                style={[
                  styles.fireworkDot,
                  {
                    left: width / 2 - p.size / 2,
                    top: height / 2 - 100,
                    width: p.size,
                    height: p.size,
                    borderRadius: p.size / 2,
                    backgroundColor: p.color,
                    opacity,
                    transform: [{ translateX }, { translateY }, { scale }],
                  },
                ]}
              />
            );
          })}

          {/* Glimmering Happy Birthday Text */}
          <Animated.View
            style={[
              styles.birthdayGlowPanel,
              {
                opacity: birthdayOpacity,
                transform: [{ scale: birthdayScale }],
              },
            ]}
          >
            <Text style={styles.hbdSub}>Happy Birthday</Text>
            <Text style={styles.hbdTitle}>MOUNI♥️</Text>
            <Text style={styles.hbdFooter}>You are the best gift I could ever ask for.</Text>
          </Animated.View>

          {/* Restart universe CTA */}
          <Animated.View style={[styles.restartContainer, { opacity: restartOpacity }]}>
            <TouchableOpacity style={styles.restartButton} onPress={onRestart} activeOpacity={0.8}>
              <Ionicons name="refresh-sharp" size={18} color="#ff3366" />
              <Text style={styles.restartButtonText}>Return to Universe </Text>
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
  },
  textCenterFrame: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thankYouText: {
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '300',
    color: '#1A251E',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 36,
    fontStyle: 'italic',
  },
  birthdayStage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireworkDot: {
    position: 'absolute',
  },
  birthdayGlowPanel: {
    alignItems: 'center',
    padding: 10,
  },
  hbdSub: {
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '800',
    color: '#ff3366', // rose gold sub
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  hbdTitle: {
    fontSize: 54,
    fontFamily: 'serif',
    fontWeight: '900',
    color: '#1A251E', // deep forest bold
    letterSpacing: 8,
    marginTop: 6,
  },
  hbdFooter: {
    fontSize: 12,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: '#ff3366', // warm rose-pink text
    marginTop: 18,
    letterSpacing: 0.5,
  },
  restartContainer: {
    position: 'absolute',
    bottom: height * 0.08,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff', // soft white capsule
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  restartButtonText: {
    color: '#1A251E',
    fontSize: 12.5,
    fontFamily: 'serif',
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
});
