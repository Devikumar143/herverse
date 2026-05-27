import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function SecretPlanet({ onBack, onUnlock, isUnlocked, onLaunchEnding }) {
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Vault error shake animation
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Starburst particle animation values
  const burstAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setErrorMessage('The heart shields rejected the code...');

    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => setErrorMessage(''), 3000);
    });
  };

  const handleKeyPress = (char) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (passcode.length < 7) {
      setPasscode((prev) => prev + char);
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPasscode((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    const uppercaseCode = passcode.trim().toUpperCase();
    if (uppercaseCode === 'FOREVER' || uppercaseCode === '0525' || uppercaseCode === 'ROMANCE' || uppercaseCode === 'HERVERSE') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Gold stardust burst animation
      Animated.timing(burstAnim, {
        toValue: 1.5,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        onUnlock();
      });
    } else {
      triggerShake();
      setPasscode('');
    }
  };

  // Starburst particle coordinates
  const particles = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 16;
    const distance = Math.max(width, height) * 0.7;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#ff3366" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secret Heart</Text>
        <View style={{ width: 60 }} />
      </View>

      {!isUnlocked ? (
        /* LOCKED STATE */
        <View style={styles.lockContent}>
          <Animated.View
            style={[
              styles.lockOrbShell,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            <View style={styles.lockCore}>
              <Ionicons name="lock-closed" size={36} color="#ff3366" />
            </View>
            <View style={styles.lockRunicRing} />
          </Animated.View>

          <Text style={styles.vaultTitle}>Heart Shield Active</Text>
          <Text style={styles.vaultInstructions}>
            Enter the secret code to unlock my deepest feelings
          </Text>

          {/* Passcode preview dots - set to exactly 7 */}
          <View style={styles.dotRow}>
            {Array.from({ length: 7 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.previewDot,
                  passcode.length > i && styles.previewDotFilled,
                ]}
              />
            ))}
          </View>

          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

          {/* Keypad Grid */}
          <View style={styles.keypadGrid}>
            <View style={styles.keypadRow}>
              {['F', 'O', 'R'].map((c, i) => (
                <TouchableOpacity key={`row1-${c}-${i}`} style={styles.keyButton} onPress={() => handleKeyPress(c)} activeOpacity={0.85}>
                  <Text style={styles.keyText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.keypadRow}>
              {['E', 'V', 'E'].map((c, i) => (
                <TouchableOpacity key={`row2-${c}-${i}`} style={styles.keyButton} onPress={() => handleKeyPress(c)} activeOpacity={0.85}>
                  <Text style={styles.keyText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.keypadRow}>
              {['R', '0', '5'].map((c, i) => (
                <TouchableOpacity key={`row3-${c}-${i}`} style={styles.keyButton} onPress={() => handleKeyPress(c)} activeOpacity={0.85}>
                  <Text style={styles.keyText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.keyButtonSpecial} onPress={handleDelete} activeOpacity={0.85}>
                <Ionicons name="backspace-outline" size={20} color="#1A251E" />
              </TouchableOpacity>

              {['2'].map((c, i) => (
                <TouchableOpacity key={`row4-${c}-${i}`} style={styles.keyButton} onPress={() => handleKeyPress(c)} activeOpacity={0.85}>
                  <Text style={styles.keyText}>{c}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.keyButtonSpecial} onPress={handleSubmit} activeOpacity={0.85}>
                <Ionicons name="checkmark-sharp" size={22} color="#ff3366" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.hintText}>Hint: Representing a timeless promise, or a birthday date (MMDD)</Text>

          {/* Starburst gold confetti explosion layer */}
          {burstAnim !== 0 &&
            particles.map((p) => {
              const translateX = burstAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, p.x],
              });
              const translateY = burstAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, p.y],
              });
              const opacity = burstAnim.interpolate({
                inputRange: [0, 1, 1.5],
                outputRange: [1, 0.9, 0],
              });
              return (
                <Animated.View
                  key={p.id}
                  style={[
                    styles.burstParticle,
                    {
                      left: width / 2 - 4,
                      top: height / 2 - 120,
                      transform: [{ translateX }, { translateY }],
                      opacity,
                    },
                  ]}
                />
              );
            })}
        </View>
      ) : (
        /* UNLOCKED STATE */
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.surpriseLayout}>
            <Text style={styles.unlockedHeader}>OUR HEARTS CONVERGED</Text>

            {/* Birthday letter scroll */}
            <View style={styles.scrollGlass}>
              <Ionicons name="ribbon-outline" size={32} color="#ff3366" style={styles.scrollIcon} />
              <Text style={styles.unlockedTitle}>Dear Partner in Time,</Text>
              <Text style={styles.unlockedLetterText}>
                You did it! You unlocked the secret heart of HerVerse.{"\n\n"}
                I wanted to create something completely unique for you because you are an absolutely unique soul. You aren’t just my friend; you are my constant, a sanctuary in a world that moves far too fast.{"\n\n"}
                Thank you for being the keeper of my secrets, the source of my joy, and the steady anchor in my life. You deserve a lifetime of pure happiness, and I hope this tiny pocket of love reminds you of how deeply appreciated and loved you are.{"\n\n"}
                Happy Birthday! Here’s to sharing another million beautiful moments of love together. 🎂🥂❤️
              </Text>
            </View>

            {/* Launch Cinematic Finale CTA */}
            <TouchableOpacity style={styles.launchEndingButton} onPress={onLaunchEnding} activeOpacity={0.8}>
              <Text style={styles.launchButtonText}>Reveal the secret ️</Text>
              <Ionicons name="heart" size={16} color="#ffffff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    color: '#ff3366',
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
  lockContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  lockOrbShell: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockCore: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#ffffff', // soft white lock orb
    borderWidth: 1.5,
    borderColor: '#ff3366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  lockRunicRing: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 51, 102, 0.2)',
    borderStyle: 'dashed',
  },
  vaultTitle: {
    color: '#1A251E',
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '950',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  vaultInstructions: {
    color: 'rgba(26, 37, 30, 0.55)',
    fontSize: 12.5,
    fontFamily: 'serif',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  dotRow: {
    flexDirection: 'row',
    marginVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(26, 37, 30, 0.08)',
    borderWidth: 1.2,
    borderColor: 'rgba(26, 37, 30, 0.15)',
    marginHorizontal: 5,
  },
  previewDotFilled: {
    backgroundColor: '#ff3366',
    borderColor: '#ff3366',
    shadowColor: '#ff3366',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  errorText: {
    color: '#ff3366',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  keypadGrid: {
    width: '100%',
    maxWidth: 290,
    marginTop: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  keyButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  keyButtonSpecial: {
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(141, 168, 144, 0.1)',
  },
  keyText: {
    color: '#1A251E',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hintText: {
    color: 'rgba(26, 37, 30, 0.45)',
    fontSize: 9.5,
    fontFamily: 'serif',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  burstParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4d6d', // pink-red love confetti
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 50,
  },
  surpriseLayout: {
    alignItems: 'center',
    width: '100%',
  },
  unlockedHeader: {
    color: '#ff3366',
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.5,
    marginBottom: 16,
  },
  scrollGlass: {
    backgroundColor: '#FAF9F4',
    borderWidth: 1,
    borderColor: 'rgba(141, 168, 144, 0.15)',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 28,
  },
  scrollIcon: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  unlockedTitle: {
    color: '#1A251E',
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
  },
  unlockedLetterText: {
    color: '#1A251E',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontFamily: 'serif',
    opacity: 0.85,
  },
  launchEndingButton: {
    backgroundColor: '#ff3366',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  launchButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
