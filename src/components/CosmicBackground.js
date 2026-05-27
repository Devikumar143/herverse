import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Generate starry coordinate sets for variety
const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      // Group stars into 3 delay categories for natural unsynced twinkling
      group: i % 3, 
    });
  }
  return stars;
};

// Particle shapes collection for romantic stardust variety
const PARTICLE_SHAPES = ['✦', '♥', '★', '✧', '♥'];

export default function CosmicBackground({ children }) {
  const [stars] = useState(() => generateStars(50));
  const [particles, setParticles] = useState([]);
  const lastTouchRef = useRef({ x: 0, y: 0, time: 0 });
  
  // Animated values for 3 star groups (opacity)
  const twinkleAnim1 = useRef(new Animated.Value(0.3)).current;
  const twinkleAnim2 = useRef(new Animated.Value(0.6)).current;
  const twinkleAnim3 = useRef(new Animated.Value(0.8)).current;

  // Animated values for Shooting Star
  const shootingStarX = useRef(new Animated.Value(-100)).current;
  const shootingStarY = useRef(new Animated.Value(-100)).current;
  const shootingStarOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Setup infinite twinkling cycles
    const createTwinkleLoop = (anim, toVal, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: toVal,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.15,
            duration: duration * 1.3,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createTwinkleLoop(twinkleAnim1, 0.95, 2000),
      createTwinkleLoop(twinkleAnim2, 0.85, 2800),
      createTwinkleLoop(twinkleAnim3, 0.95, 3600),
    ]).start();

    // 2. Setup randomized Shooting Star triggers
    const triggerShootingStar = () => {
      const startX = Math.random() * (width - 100);
      const startY = Math.random() * (height / 2);
      
      shootingStarX.setValue(startX);
      shootingStarY.setValue(startY);
      shootingStarOpacity.setValue(0);

      Animated.sequence([
        Animated.timing(shootingStarOpacity, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(shootingStarX, {
            toValue: startX + 180,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(shootingStarY, {
            toValue: startY + 120,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(shootingStarOpacity, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Wait random time between 8 to 16 seconds to fire next one
        const delay = Math.random() * 8000 + 8000;
        setTimeout(triggerShootingStar, delay);
      });
    };

    // Fire first shooting star after 5 seconds
    const timer = setTimeout(triggerShootingStar, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Performance-optimized global non-blocking touch handler
  const handleTouch = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    const now = Date.now();
    const last = lastTouchRef.current;
    
    // Throttle checks: space out spawns by at least 10px or 40ms to keep 60 FPS
    const distance = Math.hypot(pageX - last.x, pageY - last.y);
    if (distance > 10 || now - last.time > 45) {
      lastTouchRef.current = { x: pageX, y: pageY, time: now };
      
      const randomShape = PARTICLE_SHAPES[Math.floor(Math.random() * PARTICLE_SHAPES.length)];
      const randomColor = Math.random() > 0.4 ? '#ff4d6d' : '#ff708a'; // Alternate beautiful romantic pinks
      
      const newParticle = {
        id: Math.random().toString(36).substring(2, 9),
        x: pageX,
        y: pageY,
        shape: randomShape,
        color: randomColor,
        scale: Math.random() * 0.8 + 0.4,
        rotate: `${Math.random() * 360}deg`,
        // Drifts in random horizontal offset
        driftX: (Math.random() - 0.5) * 45,
        anim: new Animated.Value(0),
      };

      setParticles((prev) => {
        // Enforce maximum buffer limit of 18 active elements to prevent overloading React
        const buffer = prev.slice(-17);
        return [...buffer, newParticle];
      });

      Animated.timing(newParticle.anim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }).start(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      });
    }
  };

  return (
    <LinearGradient
      colors={['#FBF5F5', '#FFF0F0', '#FFE6E6', '#FBF5F5']}
      locations={[0, 0.35, 0.75, 1]}
      style={styles.container}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
    >
      {/* Decorative Warm Rose gas nebulas */}
      <View style={[styles.nebula, styles.nebulaRose]} />
      <View style={[styles.nebula, styles.nebulaGold]} />

      {/* Twinkling Golden Starfield layer */}
      {stars.map((star) => {
        let opacityVal = twinkleAnim1;
        if (star.group === 1) opacityVal = twinkleAnim2;
        if (star.group === 2) opacityVal = twinkleAnim3;

        return (
          <Animated.View
            key={star.id}
            style={[
              styles.star,
              {
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                borderRadius: star.size / 2,
                opacity: opacityVal,
              },
            ]}
          />
        );
      })}

      {/* Golden Shooting Star light trail */}
      <Animated.View
        style={[
          styles.shootingStar,
          {
            transform: [
              { translateX: shootingStarX },
              { translateY: shootingStarY },
              { rotate: '35deg' },
            ],
            opacity: shootingStarOpacity,
          },
        ]}
      />

      {children}

      {/* Global Interactive Stardust Particle Trail Layer */}
      {particles.map((p) => {
        const translateY = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70], // floating upwards
        });
        const translateX = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.driftX], // drifting horizontally
        });
        const opacity = p.anim.interpolate({
          inputRange: [0, 0.15, 0.75, 1],
          outputRange: [0, 1, 0.8, 0], // fade-in then fade-out gracefully
        });
        const scale = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [p.scale, p.scale * 0.4], // shrinking into distance
        });

        return (
          <Animated.View
            key={p.id}
            pointerEvents="none" // absolutely essential to guarantee underlying touch components work flawlessly
            style={[
              styles.trailParticle,
              {
                left: p.x - 14,
                top: p.y - 14,
                opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { scale },
                  { rotate: p.rotate },
                ],
              },
            ]}
          >
            <Text style={[styles.trailParticleText, { color: p.color }]}>
              {p.shape}
            </Text>
          </Animated.View>
        );
      })}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  nebula: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
  },
  nebulaRose: {
    width: width * 1.3,
    height: width * 1.3,
    backgroundColor: '#FFE3E3', // soft warm rose aura
    top: -height * 0.15,
    left: -width * 0.3,
  },
  nebulaGold: {
    width: width * 1.1,
    height: width * 1.1,
    backgroundColor: '#FFF0F0', // soft warm cream rose aura
    bottom: -height * 0.2,
    right: -width * 0.2,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ff708a', // elegant rose stardust
    shadowColor: '#ff708a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  shootingStar: {
    position: 'absolute',
    width: 70,
    height: 1.5,
    backgroundColor: '#ff708a',
    shadowColor: '#ff708a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  trailParticle: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999, // Render on top of everything so it's always visible
  },
  trailParticleText: {
    fontSize: 16,
    fontWeight: '900',
    textShadowColor: 'rgba(255, 77, 109, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
