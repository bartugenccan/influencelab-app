import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAnalyzeContentMutation } from '@/api/services/content.service';
import { useAppNavigation } from '@/hooks';
import { AppRoutes } from '@/types';
import type { HomeStackParamList } from '@/types/navigation/stacks';
import { LoadingOverlay } from '@/components';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

type FeedbackModeSelectionRouteProp = RouteProp<
  HomeStackParamList,
  AppRoutes.FEEDBACK_MODE_SELECTION
>;

export const FeedbackModeSelectionScreen = () => {
  const route = useRoute<FeedbackModeSelectionRouteProp>();
  const navigation = useAppNavigation();
  const { media, caption } = route.params;

  const [selectedMode, setSelectedMode] = useState<'coach' | 'persona' | null>(null);

  const { mutate: analyzeContent, isPending } = useAnalyzeContentMutation({
    onSuccess: (response) => {
      // Navigate to results screen or handle success
      console.log('Analysis complete:', response);
    },
    onError: (error) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to analyze content');
      console.error('Analysis error:', error);
    },
  });

  const handleModeSelect = (mode: 'coach' | 'persona') => {
    setSelectedMode(mode);
  };

  const handleSubmit = () => {
    if (!selectedMode) {
      Alert.alert('Selection Required', 'Please select an analysis mode');
      return;
    }

    // Only submit if coach mode is selected
    if (selectedMode === 'coach') {
      analyzeContent({
        media,
        analysis_type: selectedMode,
        caption,
      });
    }
    // Do nothing for persona mode
  };

  return (
    <SafeAreaView style={styles.container}>
      {isPending && <LoadingOverlay />}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Session</Text>
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
            <LinearGradient
              colors={['#4a1a5a', '#2a0a3a']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              {selectedMode === 'coach' && (
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
              <Image
                source={require('@/assets/images/ai-coach.png')}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <View style={styles.cardIcon}>
                  <Text style={styles.cardIconText}>✨</Text>
                </View>
                <Text style={styles.cardTitle}>AI Influencer Coach</Text>
                <Text style={styles.cardDescription}>
                  Expert feedback based on viral growth principles and algorithm trends. Best for
                  growth strategy.
                </Text>
              </View>
            </LinearGradient>
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
            <LinearGradient
              colors={['#1a3a4a', '#0a2a3a']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              {selectedMode === 'persona' && (
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
              <Image
                source={require('@/assets/images/persona-sim.png')}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <View style={[styles.cardIcon, styles.personaIcon]}>
                  <Text style={styles.cardIconText}>👥</Text>
                </View>
                <Text style={styles.cardTitle}>Audience Persona Sim</Text>
                <Text style={styles.cardDescription}>
                  See how your target audience reacts emotionally before you post. Best for
                  engagement optimization.
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!selectedMode || isPending}
          style={[styles.submitButton, (!selectedMode || isPending) && styles.submitButtonDisabled]}
          activeOpacity={0.8}>
          <LinearGradient
            colors={selectedMode && !isPending ? ['#a413ec', '#7a0fbc'] : ['#555', '#444']}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
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
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 12,
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
    marginLeft: 8,
    marginBottom: 2,
  },
});
