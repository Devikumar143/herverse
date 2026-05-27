import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const lettersData = [
  {
    id: 1,
    subject: 'To My Favorite Human',
    tagline: 'A small reflection of your light...',
    content: "Happy Birthday to my absolute favorite human, Mouni! \n\nIf I had to describe you to the world, I would tell them about the way your laughter can instantly sweep away the heaviest clouds in a room. You carry a rare kind of warmth—a gentle, golden grace that makes everyone around you feel completely safe, understood, and valued. \n\nWhether you are smiling in your snaps, sharing silly stories, or standing strong through life's challenges, you shine with a beautiful, authentic light. Thank you for simply being you, for your infinite kindness, and for filling my life with endless happiness. \n\nWith all my heart,\nYour Bestie Kumar ❤️",
  },
  {
    id: 2,
    subject: 'The Spirit of Mouni',
    tagline: 'What makes you so special...',
    content: "My dear bestie,\n\nI want to take a moment on your birthday to celebrate the truly incredible person you are. \n\nYou are someone who listens with your whole heart, speaks with pure kindness, and stands fiercely by the people you cherish. Your soul is a beautiful blend of sweet, joyful wonder and profound inner strength. You find beauty in the smallest things and bring infinite comfort to the deepest silences. \n\nYou deserve every ounce of happiness, sunshine, and laughter this universe has to offer because you give so much of it away to others. Never forget how truly wonderful, unique, and irreplaceable you are to me. \n\nForever your proud best friend,\nKumar ❤️",
  },
];

function TypewriterText({ text, active }) {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setDisplayedText('');
      indexRef.current = 0;
      return;
    }

    indexRef.current = 0;
    setDisplayedText('');

    const tick = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        timerRef.current = setTimeout(tick, 15);
      }
    };

    timerRef.current = setTimeout(tick, 15);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, active]);

  return <Text style={styles.letterContentText}>{displayedText}</Text>;
}

export default function Letters({ onBack }) {
  const [openLetterId, setOpenLetterId] = useState(null);

  // Animations
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;

  const handleOpenLetter = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Fade out list
    Animated.timing(listOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setOpenLetterId(id);
      
      // Spring unroll scroll card
      Animated.spring(scrollAnim, {
        toValue: 1,
        friction: 7,
        tension: 30,
        useNativeDriver: false, // height/layout animation
      }).start();
    });
  };

  const handleCloseLetter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate folding down
    Animated.timing(scrollAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: false,
    }).start(() => {
      setOpenLetterId(null);
      
      // Fade back in list
      Animated.timing(listOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Interpolations for scroll unrolling effect
  const cardHeight = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, height * 0.65],
  });

  const cardOpacity = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const cardScale = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const cardRotate = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-2deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#ff4d6d" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Letters</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {openLetterId === null ? (
          /* List Envelopes Grid */
          <Animated.View style={[styles.envelopeStack, { opacity: listOpacity }]}>
            <Text style={styles.instruction}>Select a magical letter scroll to unwrap</Text>
            
            {lettersData.map((letter) => (
              <TouchableOpacity
                key={letter.id}
                style={styles.envelopeCard}
                onPress={() => handleOpenLetter(letter.id)}
                activeOpacity={0.8}
              >
                <View style={styles.envelopeTop}>
                  <Ionicons name="mail-unread-outline" size={28} color="#ff4d6d" />
                  <View style={styles.envelopeMeta}>
                    <Text style={styles.envelopeSubject}>{letter.subject}</Text>
                    <Text style={styles.envelopeTag}>{letter.tagline}</Text>
                  </View>
                </View>
                <View style={styles.envelopeFooter}>
                  <Text style={styles.envelopeUnwrap}>Tap to unwrap scroll</Text>
                  <Ionicons name="arrow-forward" size={14} color="#ff4d6d" />
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        ) : (
          /* Active opened unrolling scroll sheet */
          <View style={styles.scrollUnrollWrapper}>
            
            {/* Scroll Roll Top Handle Decoration */}
            <Animated.View style={[styles.scrollRollerTop, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
              <View style={styles.rollerStickLeft} />
              <View style={styles.rollerStickCenter} />
              <View style={styles.rollerStickRight} />
            </Animated.View>

            <Animated.View 
              style={[
                styles.openedLetterCard, 
                { 
                  height: cardHeight, 
                  opacity: cardOpacity, 
                  transform: [
                    { scale: cardScale },
                    { rotate: cardRotate }
                  ]
                }
              ]}
            >
              <TouchableOpacity
                style={styles.closeLetterButton}
                onPress={handleCloseLetter}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={18} color="#ff4d6d" />
                <Text style={styles.closeLetterText}>Wrap Scroll</Text>
              </TouchableOpacity>

              <ScrollView style={styles.letterTextFrame} showsVerticalScrollIndicator={true}>
                <Text style={styles.openedLetterTitle}>
                  {lettersData.find((l) => l.id === openLetterId).subject}
                </Text>
                <View style={styles.letterDivider} />
                
                <TypewriterText
                  text={lettersData.find((l) => l.id === openLetterId).content}
                  active={openLetterId !== null}
                />
              </ScrollView>
            </Animated.View>

            {/* Scroll Roll Bottom Handle Decoration */}
            <Animated.View style={[styles.scrollRollerBottom, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
              <View style={styles.rollerStickLeft} />
              <View style={styles.rollerStickCenter} />
              <View style={styles.rollerStickRight} />
            </Animated.View>

          </View>
        )}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  instruction: {
    color: 'rgba(26, 37, 30, 0.55)',
    fontSize: 12,
    fontFamily: 'serif',
    fontStyle: 'italic',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 24,
  },
  envelopeStack: {
    width: '100%',
  },
  envelopeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(141, 168, 144, 0.15)',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  envelopeTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  envelopeMeta: {
    marginLeft: 14,
    flex: 1,
  },
  envelopeSubject: {
    color: '#1A251E',
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  envelopeTag: {
    color: 'rgba(26, 37, 30, 0.5)',
    fontSize: 12.5,
    marginTop: 3,
  },
  envelopeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(141, 168, 144, 0.08)',
    paddingTop: 12,
  },
  envelopeUnwrap: {
    color: '#ff4d6d',
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: 'serif',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scrollUnrollWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  scrollRollerTop: {
    width: '95%',
    height: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -2,
    zIndex: 10,
  },
  scrollRollerBottom: {
    width: '95%',
    height: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -2,
    zIndex: 10,
  },
  rollerStickCenter: {
    flex: 1,
    height: 12,
    backgroundColor: '#ff4d6d', // beautiful pink-red roller handle
    borderRadius: 6,
  },
  rollerStickLeft: {
    width: 14,
    height: 14,
    backgroundColor: '#ff4d6d',
    borderRadius: 3,
    marginRight: -4,
  },
  rollerStickRight: {
    width: 14,
    height: 14,
    backgroundColor: '#ff4d6d',
    borderRadius: 3,
    marginLeft: -4,
  },
  openedLetterCard: {
    backgroundColor: '#FAF9F4', // beautiful velvet cream opened scroll
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ff4d6d' + '40', // soft rose border outline
    padding: 20,
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  closeLetterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 16,
  },
  closeLetterText: {
    color: '#ff4d6d',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  letterTextFrame: {
    flex: 1,
  },
  openedLetterTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '900',
    color: '#1A251E',
    letterSpacing: 1,
  },
  letterDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 77, 109, 0.15)',
    marginVertical: 12,
  },
  letterContentText: {
    color: '#1A251E',
    fontSize: 14.5,
    lineHeight: 26,
    letterSpacing: 0.5,
    fontFamily: 'serif',
    opacity: 0.85,
  },
});
