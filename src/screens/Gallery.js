import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Modal, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const galleryImages = [
  {
    id: 1,
    title: "Bestie Glow ✨",
    location: "Sweet Moments",
    image: require('../../assets/gallery/1000193554.jpeg'),
    caption: "That smile of yours has a way of lighting up the entire room. Never stop shining, bestie!",
  },
  {
    id: 2,
    title: "Sunsets & Smiles 🌅",
    location: "Golden Hours",
    image: require('../../assets/gallery/1000193556.jpeg'),
    caption: "Under the golden sky, every second spent laughing with you is a second I cherish forever.",
  },
  {
    id: 3,
    title: "The Cutest Duo 👭",
    location: "Heart Station",
    image: require('../../assets/gallery/Snapchat-1176787083.jpg'),
    caption: "They say best friends are like stars—you don't always see them, but you know they're always there. Thank you for being my constant star.",
  },
  {
    id: 4,
    title: "Silly Faces, Warm Hearts 😜",
    location: "Laughter Hub",
    image: require('../../assets/gallery/Snapchat-138064234.jpg'),
    caption: "With you, I can be 100% myself without any filters. Here’s to a million more inside jokes and silly snaps!",
  },
  {
    id: 5,
    title: "Pure Happiness 🌸",
    location: "Sanctuary",
    image: require('../../assets/gallery/Snapchat-1495394634.jpg'),
    caption: "Your joy is completely infectious. A single message or photo from you can instantly turn my worst days around.",
  },
  {
    id: 6,
    title: "Partner in Time ⏳",
    location: "Our Little World",
    image: require('../../assets/gallery/Snapchat-1620421904.jpg'),
    caption: "Time flies by so fast, but every single frame of our journey is permanently printed on my heart.",
  },
  {
    id: 7,
    title: "Cosmic Connection 💫",
    location: "Beyond the Stars",
    image: require('../../assets/gallery/Snapchat-1796219530.jpg'),
    caption: "Some friendships are written in the stars. Ours is a galaxy of its own, filled with infinite love and comfort.",
  },
  {
    id: 8,
    title: "Chic & Charming 💕",
    location: "Forever Rose",
    image: require('../../assets/gallery/Snapchat-2041797737.jpg'),
    caption: "Stepping out with style, but carrying an even more beautiful heart inside. You are absolutely one in a billion.",
  },
  {
    id: 9,
    title: "Captured Grace 📸",
    location: "Memory Lane",
    image: require('../../assets/gallery/Snapchat-2141221130.jpg'),
    caption: "Looking absolutely beautiful in this candid frame. Every photograph of you tells a story of elegance.",
  },
  {
    id: 10,
    title: "Heart & Soul 🎀",
    location: "Secret Haven",
    image: require('../../assets/gallery/Snapchat-256599440.jpg'),
    caption: "Distance and time mean nothing when our souls are permanently connected by the strongest bond of friendship.",
  },
  {
    id: 11,
    title: "Warm Snuggle Vibes 🧸",
    location: "Comfort Zone",
    image: require('../../assets/gallery/Snapchat-435183092.jpg'),
    caption: "For the friend who feels like warm blankets on a cold winter night—peaceful, cozy, and irreplaceable.",
  },
  {
    id: 12,
    title: "Infinite Radiance ☀️",
    location: "Sunlit Memories",
    image: require('../../assets/gallery/Snapchat-660766747.jpg'),
    caption: "No matter where life takes us, my promise to support you and stand by you remains completely unshakable.",
  },
  {
    id: 13,
    title: "Sweet Candids 🍬",
    location: "Giggle Corner",
    image: require('../../assets/gallery/Snapchat-81184239.jpg'),
    caption: "The best memories are the ones we didn’t plan to make. Just laughing, living, and sharing this beautiful life together.",
  },
  {
    id: 14,
    title: "Stardust & Sparkles ✨",
    location: "Galaxy of Love",
    image: require('../../assets/gallery/Snapchat-838652340.jpg'),
    caption: "Happy birthday to my ultimate favorite person! I hope this tiny universe of memories reminds you of how loved you are.",
  },
  {
    id: 15,
    title: "Wednesday Magic 🖤",
    location: "Her World",
    image: require('../../assets/gallery/IMG_20260526_000242_946.jpg'),
    caption: "Even on ordinary Wednesdays, she carries an extraordinary grace that makes every day feel like a celebration.",
  },
  {
    id: 16,
    title: "Flowers & You 🌼",
    location: "Golden Bloom",
    image: require('../../assets/gallery/IMG_20260526_000252_118.jpg'),
    caption: "Standing in a garden of flowers, and still the most beautiful thing my eyes could find was you.",
  },
  {
    id: 17,
    title: "Golden Starlight ⭐",
    location: "Cosmic Realm",
    image: require('../../assets/gallery/716a603d-f73b-47ab-9b62-29fc60e4d27a.jpg'),
    caption: "Your presence is like a brilliant star that guides me, warms me, and fills my life with endless beauty.",
  },
];

export default function Gallery({ onBack }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalHearts, setModalHearts] = useState([]);

  const handleOpenPhoto = (photo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPhoto(photo);

    // Spawn 15 floating hearts with staggered delays and varied trajectories
    const newHearts = Array.from({ length: 15 }).map((_, i) => {
      const anim = new Animated.Value(0);
      
      // Continuous floating loop for the life of the modal open state
      Animated.loop(
        Animated.sequence([
          Animated.delay(Math.random() * 2000), // staggered entry
          Animated.timing(anim, {
            toValue: 1,
            duration: 3500 + Math.random() * 3500,
            useNativeDriver: true,
          })
        ])
      ).start();

      return {
        id: i,
        anim,
        left: Math.random() * 95, // screen left coordinate percentage
        top: 15 + Math.random() * 70, // screen top coordinate percentage
        size: 14 + Math.random() * 16, // unique sizes for layering
        color: ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#ffccd5'][i % 5], // premium rose gradients
      };
    });

    setModalHearts(newHearts);
  };

  const handleCloseModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPhoto(null);
    setModalHearts([]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#ff4d6d" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.instruction}>Tap on any Polaroid to zoom into our beautiful memories</Text>
        
        {/* Alternating rotated grid */}
        <View style={styles.grid}>
          {galleryImages.map((photo, index) => {
            const isEven = index % 2 === 0;
            const rotationAngle = isEven ? '1.5deg' : '-1.5deg';

            return (
              <TouchableOpacity
                key={photo.id}
                style={[styles.gridItem, { transform: [{ rotate: rotationAngle }] }]}
                onPress={() => handleOpenPhoto(photo)}
                activeOpacity={0.8}
              >
                <View style={styles.polaroidFrame}>
                  <Image source={photo.image} style={styles.polaroidImage} resizeMode="contain" />
                  <View style={styles.polaroidBottom}>
                    <Text style={styles.polaroidTitle} numberOfLines={1}>{photo.title}</Text>
                    <Text style={styles.polaroidLoc} numberOfLines={1}>{photo.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Full Screen off-white zoom Modal */}
      <Modal
        visible={selectedPhoto !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          {/* Stardust background floating hearts behind the card */}
          {modalHearts.map((h) => {
            const translateY = h.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [60, -180],
            });
            const translateX = h.anim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, (h.id % 2 === 0 ? 25 : -25), 0],
            });
            const opacity = h.anim.interpolate({
              inputRange: [0, 0.15, 0.8, 1],
              outputRange: [0, 0.65, 0.65, 0],
            });
            const scale = h.anim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.6, 1.1, 0.6],
            });

            return (
              <Animated.View
                key={h.id}
                style={[
                  styles.floatingHeart,
                  {
                    left: `${h.left}%`,
                    top: `${h.top}%`,
                    opacity,
                    transform: [
                      { translateY },
                      { translateX },
                      { scale },
                    ],
                  },
                ]}
              >
                <Ionicons name="heart" size={h.size} color={h.color} />
              </Animated.View>
            );
          })}

          {selectedPhoto && (
            <View style={styles.modalCard}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseModal}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={22} color="#ff4d6d" />
              </TouchableOpacity>

              {/* Enhanced Polaroid zoom Frame */}
              <View style={styles.zoomPolaroidFrame}>
                <Image source={selectedPhoto.image} style={styles.zoomPolaroidImage} resizeMode="contain" />
                <View style={styles.zoomPolaroidBottom}>
                  <Text style={styles.zoomTitle}>{selectedPhoto.title}</Text>
                  <Text style={styles.zoomLoc}>{selectedPhoto.location}</Text>
                </View>
              </View>

              {/* Story Sage Capsule */}
              <View style={styles.quoteBox}>
                <Ionicons name="heart" size={16} color="#ff4d6d" style={styles.sparkleIcon} />
                <Text style={styles.quoteText}>{selectedPhoto.caption}</Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  gridItem: {
    width: (width - 48) / 2,
    marginBottom: 24,
  },
  polaroidFrame: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.03)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  polaroidImage: {
    width: '100%',
    height: 135,
    borderRadius: 2,
    backgroundColor: '#FAF9F4', // elegant velvet cream background
  },
  polaroidBottom: {
    marginTop: 8,
    alignItems: 'center',
  },
  polaroidTitle: {
    fontSize: 12,
    fontFamily: 'serif',
    fontWeight: '800',
    color: '#1A251E',
    letterSpacing: 0.2,
  },
  polaroidLoc: {
    fontSize: 9,
    color: '#ff4d6d',
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(245, 245, 236, 0.96)', // Translucent off-white velvet overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: -45,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 77, 109, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 109, 0.2)',
  },
  zoomPolaroidFrame: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    paddingBottom: 28,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.04)',
    transform: [{ rotate: '1deg' }],
  },
  zoomPolaroidImage: {
    width: '100%',
    height: height * 0.40, // taller frame to show full portrait images beautifully
    borderRadius: 4,
    backgroundColor: '#FAF9F4', // elegant velvet cream background
  },
  zoomPolaroidBottom: {
    marginTop: 14,
    alignItems: 'center',
  },
  zoomTitle: {
    fontSize: 16.5,
    fontFamily: 'serif',
    fontWeight: '900',
    color: '#1A251E',
    letterSpacing: 0.5,
  },
  zoomLoc: {
    fontSize: 11,
    color: '#ff4d6d',
    marginTop: 3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  quoteBox: {
    backgroundColor: '#FFEBEB', // soft rose pink capsule
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 109, 0.15)',
    borderRadius: 16,
    padding: 14,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  sparkleIcon: {
    marginBottom: 6,
  },
  quoteText: {
    color: '#1A251E',
    fontSize: 13.5,
    fontFamily: 'serif',
    lineHeight: 22,
    letterSpacing: 0.5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  floatingHeart: {
    position: 'absolute',
    zIndex: 0,
  },
});
