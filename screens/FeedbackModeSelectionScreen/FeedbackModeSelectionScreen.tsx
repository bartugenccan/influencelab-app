import { StyleSheet, Text, TouchableOpacity, View, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { useAnalyzeContentMutation } from '@/api/services/content.service';
import { useAppNavigation } from '@/hooks';
import { AppRoutes } from '@/types';
import type { HomeStackParamList } from '@/types/navigation/stacks';
import { LoadingOverlay } from '@/components';

type FeedbackModeSelectionRouteProp = RouteProp<
  HomeStackParamList,
  AppRoutes.FEEDBACK_MODE_SELECTION
>;

export const FeedbackModeSelectionScreen = () => {
  const route = useRoute<FeedbackModeSelectionRouteProp>();
  const navigation = useAppNavigation();
  const { media, caption } = route.params;

  const [selectedMode, setSelectedMode] = useState<'coach' | 'persona' | null>(null);
  const [persona, setPersona] = useState('');
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [revisedCaption, setRevisedCaption] = useState<string>('');

  const { mutate: analyzeContent, isPending } = useAnalyzeContentMutation({
    onSuccess: (response) => {
      setOverallScore(response.coach_analysis.overall_score);
      setImprovements(response.coach_analysis.improvments);
      setStrengths(response.coach_analysis.strengths);
      setRevisedCaption(response.coach_analysis.revised_caption);
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

    if (selectedMode === 'persona' && !persona.trim()) {
      Alert.alert('Persona Required', 'Please enter persona information');
      return;
    }

    analyzeContent({
      media,
      analysis_type: selectedMode,
      caption,
      persona: selectedMode === 'persona' ? persona : undefined,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isPending && <LoadingOverlay />}

      <TouchableOpacity onPress={() => handleModeSelect('coach')}>
        <Text style={{ color: selectedMode === 'coach' ? 'blue' : 'black' }}>Coach</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleModeSelect('persona')}>
        <Text style={{ color: selectedMode === 'persona' ? 'blue' : 'black' }}>Persona</Text>
      </TouchableOpacity>

      {selectedMode === 'persona' && (
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginTop: 20,
            width: 200,
          }}
          placeholder="Enter persona info"
          value={persona}
          onChangeText={setPersona}
        />
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isPending}
        style={{ marginTop: 20, opacity: isPending ? 0.5 : 1 }}>
        <Text>Submit</Text>
      </TouchableOpacity>

      {overallScore !== null && (
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text>Overall Score: {overallScore}</Text>
          <Text>Revised Caption:</Text>
          <Text>{revisedCaption}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
