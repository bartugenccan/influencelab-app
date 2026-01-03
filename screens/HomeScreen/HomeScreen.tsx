import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useAppNavigation } from '@/hooks';
import { Video, ResizeMode } from 'expo-av';
import { AppRoutes } from '@/types/navigation';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen = () => {
  const navigation = useAppNavigation();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 🌟 GLOBAL CENTER GLOW */}
      <LinearGradient
        pointerEvents="none"
        colors={[
          'rgba(123, 0, 255, 0)', // merkez
          '#1b1022', // kenarlar
        ]}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Icon Section */}
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <Ionicons name="sparkles" size={24} color={Colors.iconColor} />
        </View>
      </View>

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>InfluenceLab</Text>
        <Text style={styles.subTitle}>See how your audience reacts before you post.</Text>
      </View>

      {/* AI Content Section - Takes flexible space */}
      <View style={styles.contentContainer}>
        <Video
          source={require('@/assets/videos/influencelab-ai.mp4')}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />
        {/* Video Overlay */}
        <View style={styles.videoOverlay}>
          {/* Left: Progress Lines */}
          <View style={styles.progressLines}>
            <View style={styles.progressLine} />
            <View style={[styles.progressLine, styles.progressLineShort]} />
          </View>
          {/* Right: AI Ready Badge */}
          <View style={styles.aiReadyBadge}>
            <Text style={styles.aiReadyText}>AI READY</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section - Fixed at bottom */}
      <View style={styles.bottomSection}>
        {/* Pills */}
        <View style={styles.pillsContainer}>
          <View style={styles.pillButton}>
            <MaterialCommunityIcons name="robot-confused" size={20} color={Colors.iconColor} />
            <Text style={styles.pillText}>AI Coach</Text>
          </View>
          <View style={styles.pillButton}>
            <MaterialCommunityIcons
              name="account-group"
              size={20}
              color={Colors.audienceiconColor}
            />
            <Text style={styles.pillText}>Audience Personas</Text>
          </View>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={() => {
            navigation.navigate(AppRoutes.UPLOAD_CONTENT);
          }}>
          <Entypo name="bar-graph" size={18} color="white" />
          <Text style={styles.buttonText}>Analyze My Content</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  iconWrapper: {
    borderWidth: 0.3,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    padding: 10,
    backgroundColor: Colors.inputBackground,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 15,
    color: '#9A9A9A',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(123, 123, 123, 0.4)',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progressLines: {
    gap: 4,
  },
  progressLine: {
    width: 50,
    height: 4,
    backgroundColor: Colors.buttonColor,
    borderRadius: 2,
  },
  progressLineShort: {
    width: 35,
  },
  aiReadyBadge: {
    backgroundColor: 'rgba(30, 20, 40, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(170, 23, 250, 0.5)',
  },
  aiReadyText: {
    color: Colors.buttonColor,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  pillsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 0.3,
    borderColor: Colors.borderColor,
    borderRadius: 100,
    backgroundColor: Colors.buttonSectionBackground,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  pillText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.buttonColor,
    paddingVertical: 18,
    borderRadius: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
