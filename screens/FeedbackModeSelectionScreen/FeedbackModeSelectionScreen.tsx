import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppNavigation } from '@/hooks';
import { AppRoutes } from '@/types';
import type { HomeStackParamList } from '@/types/navigation/stacks';
import { CustomText } from '@/components';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale } from 'react-native-size-matters';

type FeedbackModeSelectionRouteProp = RouteProp<
  HomeStackParamList,
  AppRoutes.FEEDBACK_MODE_SELECTION
>;

export const FeedbackModeSelectionScreen = () => {
  const route = useRoute<FeedbackModeSelectionRouteProp>();
  const navigation = useAppNavigation();
  const { media, caption } = route.params;

  const [selectedMode, setSelectedMode] = useState<'coach' | 'persona' | null>(null);

  const handleModeSelect = (mode: 'coach' | 'persona') => {
    setSelectedMode(mode);
  };

  const handleSubmit = () => {
    if (!selectedMode) {
      Alert.alert('Selection Required', 'Please select an analysis mode');
      return;
    }

    // Navigate to Analysis Loading screen
    if (selectedMode === 'coach') {
      navigation.navigate(AppRoutes.ANALYSIS_LOADING, {
        media,
        caption,
        analysisType: selectedMode,
      });
    } else if (selectedMode === 'persona') {
      navigation.navigate(AppRoutes.PERSONA_TEMPLATES);
    }
    // Do nothing for persona mode for now
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Background Gradient */}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(123, 0, 255, 0)', Colors.tabBar]}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <CustomText fontFamily="bold" style={styles.headerTitle}>
            Choose Feedback Type
          </CustomText>
          <CustomText fontFamily="regular" style={styles.stepIndicator}>
            Step 2 of 3
          </CustomText>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose your feedback intelligence</Text>
        <Text style={styles.subtitle}>Select an AI model to analyze your content</Text>

        <View style={styles.cardsContainer}>
          {/* AI Influencer Coach Card */}
          <TouchableOpacity
            style={[styles.card, selectedMode === 'coach' && styles.cardSelected, styles.coachCard]}
            onPress={() => handleModeSelect('coach')}
            activeOpacity={0.8}>
            <View style={styles.cardGradient}>
              {selectedMode === 'coach' && (
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
              <View style={styles.imageContainer}>
                <Image
                  source={require('@/assets/images/ai-coach.png')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardIconOverlay}>
                  <Ionicons name="bar-chart" size={24} color={Colors.borderColor} />
                </View>
                <LinearGradient
                  colors={['transparent', '#211328']}
                  style={styles.imageOverlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>AI Influencer Coach</Text>
                <Text style={styles.cardDescription}>
                  Expert feedback based on viral growth principles and algorithm trends. Best for
                  growth strategy.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Audience Persona Sim Card */}
          <TouchableOpacity
            style={[
              styles.card,
              selectedMode === 'persona' && styles.cardSelected,
              styles.personaCard,
            ]}
            onPress={() => handleModeSelect('persona')}
            activeOpacity={0.8}>
            <View style={styles.cardGradient}>
              {selectedMode === 'persona' && (
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
              <View style={styles.imageContainer}>
                <Image
                  source={require('@/assets/images/persona-sim.png')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={[styles.cardIconOverlay, styles.personaIconOverlay]}>
                  <Ionicons name="people" size={24} color="rgba(255, 255, 255, 0.5)" />
                </View>
                <LinearGradient
                  colors={['transparent', '#211328']}
                  style={styles.imageOverlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Audience Persona Sim</Text>
                <Text style={styles.cardDescription}>
                  See how your target audience reacts emotionally before you post. Best for
                  engagement optimization.
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!selectedMode}
          style={[styles.submitButton, !selectedMode && styles.submitButtonDisabled]}
          activeOpacity={0.8}>
          <LinearGradient
            colors={selectedMode ? ['#a413ec', '#7a0fbc'] : ['#555', '#444']}
            style={styles.submitButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={styles.submitButtonText}>Start Analysis</Text>
            <Ionicons name="arrow-forward" size={24} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(8),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: scale(40),
  },
  headerTitle: {
    fontSize: scale(18),
    color: Colors.white,
  },
  stepIndicator: {
    fontSize: scale(12),
    color: Colors.iconColor,
    marginTop: verticalScale(2),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: Colors.buttonColor,
  },
  coachCard: {},
  personaCard: {},
  cardGradient: {
    padding: 0,
    position: 'relative',
    backgroundColor: '#211328',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.buttonColor,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardIconOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  personaIconOverlay: {
    backgroundColor: 'rgba(80, 97, 118, 0.3)',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  cardContent: {
    padding: 12,
    backgroundColor: '#211328',
  },
  cardIcon: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'rgba(164, 19, 236, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  personaIcon: {
    backgroundColor: 'rgba(99, 165, 247, 0.2)',
  },
  cardIconText: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 16,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 2,
    marginHorizontal: scale(8),
  },
});
