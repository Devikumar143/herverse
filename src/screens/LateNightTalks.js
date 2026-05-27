import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const chatConversations = [
  {
    id: 1,
    sender: 'bestie',
    message: 'Hey... do you think we will still love each other this deeply when we are 80? 👵👵',
    time: '2:14 AM',
  },
  {
    id: 2,
    sender: 'me',
    message: '100%. I will definitely be the one racing you in a motorized wheelchair and stealing your pudding in the nursing home. 😂',
    time: '2:15 AM',
  },
  {
    id: 3,
    sender: 'bestie',
    message: 'Haha seriously though! You have been my absolute constant in a world where everything keeps shifting. I don’t know what I would do without you.',
    time: '2:17 AM',
  },
  {
    id: 4,
    sender: 'me',
    message: 'You make the heavy days feel light. You are my safe space, and in a world full of noise, you are the only one who fully understands my silence. ❤️',
    time: '2:19 AM',
  },
  {
    id: 5,
    sender: 'bestie',
    message: 'Aww stop! Now you are making me emotional. Thank you for existing. I love our midnight brain spills. sleep tight! ✨',
    time: '2:22 AM',
  },
];

const secretThoughts = [
  "You make the ordinary moments feel like absolute magic.",
  "Even when I don't say it, you are the first person I want to share my happiest news and my heaviest sorrows with.",
  "Thank you for never judging my messy parts, and for loving me exactly as I am.",
  "Some people are just friends, but you... you are my selected family. A whole world of love I'm lucky to walk in.",
  "Your laughter is my absolute favorite sound in this entire world.",
];

export default function LateNightTalks({ onBack }) {
  const [showSecretDrawer, setShowSecretDrawer] = useState(false);
  const [activeSecretIndex, setActiveSecretIndex] = useState(0);

  const cycleSecretThought = () => {
    setActiveSecretIndex((prev) => (prev + 1) % secretThoughts.length);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#ff4d6d" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Late Night Talks</Text>
          <View style={styles.statusShell}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Always Connected</Text>
          </View>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* Message Area */}
      <ScrollView contentContainerStyle={styles.messageScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.timeDivider}>
          <Text style={styles.timeDividerText}>August 24, 2024</Text>
        </View>

        {chatConversations.map((chat) => {
          const isBestie = chat.sender === 'bestie';
          return (
            <View
              key={chat.id}
              style={[
                styles.messageRow,
                isBestie ? styles.rowLeft : styles.rowRight,
              ]}
            >
              {isBestie && (
                <View style={styles.avatar}>
                  <Ionicons name="heart" size={12} color="#ffffff" />
                </View>
              )}
              
              <View
                style={[
                  styles.bubble,
                  isBestie ? styles.bubbleLeft : styles.bubbleRight,
                ]}
              >
                <Text style={styles.messageText}>{chat.message}</Text>
                <Text style={[styles.messageTime, { color: 'rgba(26, 37, 30, 0.4)' }]}>{chat.time}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Things I Never Said Drawer */}
      <View style={[styles.drawer, showSecretDrawer && styles.drawerOpen]}>
        {!showSecretDrawer ? (
          <TouchableOpacity
            style={styles.drawerCollapsedTrigger}
            onPress={() => setShowSecretDrawer(true)}
          >
            <Ionicons name="chevron-up" size={18} color="#ff4d6d" />
            <Text style={styles.drawerTriggerText}>Things I Never Said...</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.drawerOpenContent}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Things I Never Said</Text>
              <TouchableOpacity onPress={() => setShowSecretDrawer(false)}>
                <Ionicons name="chevron-down" size={20} color="#1A251E" />
              </TouchableOpacity>
            </View>

            <View style={styles.secretThoughtBody}>
              <Ionicons name="quote" size={28} color="rgba(255, 77, 109, 0.2)" style={styles.quoteIcon} />
              <Text style={styles.secretThoughtText}>
                {secretThoughts[activeSecretIndex]}
              </Text>
            </View>

            <TouchableOpacity style={styles.cycleButton} onPress={cycleSecretThought} activeOpacity={0.85}>
              <Text style={styles.cycleButtonText}>Reveal Another Secret</Text>
              <Ionicons name="arrow-forward" size={14} color="#ffffff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#1A251E',
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  statusShell: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff4d6d',
    marginRight: 5,
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  statusText: {
    fontSize: 9,
    fontFamily: 'serif',
    color: 'rgba(26, 37, 30, 0.45)',
    letterSpacing: 1.0,
  },
  messageScroll: {
    paddingTop: 20,
    paddingBottom: 110,
    paddingHorizontal: 16,
  },
  timeDivider: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeDividerText: {
    color: 'rgba(26, 37, 30, 0.4)',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  rowLeft: {
    alignSelf: 'flex-start',
  },
  rowRight: {
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff4d6d',
    marginRight: 8,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  bubbleLeft: {
    backgroundColor: '#FFEBEB', // beautiful light rose pink
    borderTopLeftRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 109, 0.08)',
  },
  bubbleRight: {
    backgroundColor: '#ffffff', // bright cream-white
    borderTopRightRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(26, 37, 30, 0.04)',
  },
  messageText: {
    color: '#1A251E',
    fontSize: 13.5,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  messageTime: {
    fontSize: 8.5,
    textAlign: 'right',
    marginTop: 4,
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FAF9F4', // beautiful velvet cream drawer
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 77, 109, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  drawerOpen: {
    height: height * 0.42,
  },
  drawerCollapsedTrigger: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  drawerTriggerText: {
    color: '#1A251E',
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  drawerOpenContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: {
    color: '#ff4d6d',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  secretThoughtBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginVertical: 10,
    flex: 1,
  },
  quoteIcon: {
    marginBottom: 6,
  },
  secretThoughtText: {
    color: '#1A251E',
    fontFamily: 'serif',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: 'center',
  },
  cycleButton: {
    backgroundColor: '#ff4d6d', // elegant rose button
    borderRadius: 25,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  cycleButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontSize: 12,
  },
});
