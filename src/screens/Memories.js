import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const memoriesData = [
  {
    id: 1,
    title: 'The First Spark',
    date: '（⊙ｏ⊙）',
    description: 'A simple hello that transformed my entire life. We started chatting about nonsense and realized we spoke the exact same silent language of the heart. Who knew this would become forever?',
    quote: '"You make ordinary moments unforgettable."',
  },
  {
    id: 2,
    title: 'Late Night Coffee Chats',
    date: '(❁´◡`❁)',
    description: 'Cozy corners, warm mugs, and endless laughter that drowned out the rest of the world. Sharing our deepest dreams, crying over heartbreaks, and making promises we intend to keep.',
    quote: '"Some people become our entire world."',
  },
  {
    id: 3,
    title: 'Gazing at the Cosmos',
    date: '(づ｡◕‿‿◕｡)づ',
    description: 'Lying on the cold grass, tracing constellations, and sharing silences that felt more meaningful than a thousand words. In a world of billions, having you as my bestie is the ultimate jackpot.',
    quote: '"Thank you for existing."',
  },
];

export default function Memories({ onBack }) {
  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#ff4d6d" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memories</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Soft Sage Timeline Spine */}
        <View style={styles.timelineSpine} />

        {memoriesData.map((memory, index) => {
          const isEven = index % 2 === 0;
          const rotationAngle = isEven ? '1.5deg' : '-1.5deg';

          return (
            <View key={memory.id} style={styles.timelineRow}>
              {/* Timeline dot with glowing core */}
              <View style={styles.timelineDotContainer}>
                <View style={styles.timelineDotOutline} />
                <View style={styles.timelineDotCore} />
              </View>

              {/* Stacked floating card container */}
              <View style={[styles.cardContainer, { transform: [{ rotate: rotationAngle }] }]}>
                {/* Floating Mint-Green Heart Badge */}
                <View style={styles.floatingHeartBadge}>
                  <Ionicons name="heart" size={14} color="#ffffff" />
                </View>

                <Text style={styles.cardDate}>{memory.date}</Text>

                {/* Heart icon placeholder */}
                <View style={styles.heartPlaceholder}>
                  <Ionicons name="heart" size={32} color="rgba(255, 77, 109, 0.3)" />
                </View>

                {/* Description and Quote */}
                <View style={styles.textDetails}>
                  <Text style={styles.descriptionText}>{memory.description}</Text>
                  <Text style={styles.cardQuote}>{memory.quote}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Small Ending Quote */}
        <View style={styles.timelineEnd}>
          <Ionicons name="heart-outline" size={20} color="#ff4d6d" />
          <Text style={styles.endQuote}>To be continued in our hearts...</Text>
        </View>
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
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 18,
  },
  timelineSpine: {
    position: 'absolute',
    left: 28,
    top: 30,
    bottom: 120,
    width: 2,
    backgroundColor: 'rgba(141, 168, 144, 0.25)',
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 40,
    width: '100%',
  },
  timelineDotContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 17,
    marginRight: 18,
  },
  timelineDotOutline: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ff4d6d',
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
  },
  timelineDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4d6d',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.04)',
  },
  floatingHeartBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff4d6d',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
  },
  cardDate: {
    color: '#ff4d6d',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'serif',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  polaroidFrame: {
    backgroundColor: '#FDFDFB',
    borderRadius: 4,
    padding: 8,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.03)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  polaroidImage: {
    width: '100%',
    height: height * 0.2,
    borderRadius: 2,
  },
  polaroidBottom: {
    alignItems: 'center',
    marginTop: 10,
  },
  polaroidCaption: {
    fontSize: 15,
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#1A251E',
  },
  textDetails: {
    marginTop: 16,
  },
  descriptionText: {
    color: 'rgba(26, 37, 30, 0.75)',
    fontSize: 13.5,
    lineHeight: 22,
    letterSpacing: 0.4,
  },
  cardQuote: {
    fontSize: 13,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: '#ff4d6d',
    marginTop: 10,
    letterSpacing: 1,
  },
  timelineEnd: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 40,
  },
  endQuote: {
    color: 'rgba(26, 37, 30, 0.45)',
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'serif',
    marginTop: 8,
    letterSpacing: 1.5,
  },
});
