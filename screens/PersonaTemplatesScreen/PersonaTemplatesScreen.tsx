import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPersonaTemplates, PersonaTemplateResponse, PersonaTemplate } from '@/api';
import { CustomText } from '@/components';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale } from 'react-native-size-matters';
import { useAppNavigation } from '@/hooks';

// Define a palette of vibrant/matching colors for the cards
const CARD_COLORS = [
  { primary: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.2)' }, // Red/Coral
  { primary: '#4ECDC4', bg: 'rgba(78, 205, 196, 0.2)' }, // Teal
  { primary: '#45B7D1', bg: 'rgba(69, 183, 209, 0.2)' }, // Blue
  { primary: '#96CEB4', bg: 'rgba(150, 206, 180, 0.2)' }, // Sage
  { primary: '#FFEEAD', bg: 'rgba(255, 238, 173, 0.2)' }, // Yellow
  { primary: '#D4A5A5', bg: 'rgba(212, 165, 165, 0.2)' }, // Pinkish
];

export const PersonaTemplatesScreen = () => {
  const [personaTemplates, setPersonaTemplates] = useState<PersonaTemplateResponse | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useAppNavigation();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const data = await getPersonaTemplates();
        setPersonaTemplates(data);
      } catch (error) {
        console.error('Failed to fetch persona templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  const getPersonaIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('student') || lowerTitle.includes('gen z')) {
      return 'school';
    } else if (lowerTitle.includes('professional') || lowerTitle.includes('busy')) {
      return 'briefcase';
    } else if (lowerTitle.includes('fitness') || lowerTitle.includes('health')) {
      return 'barbell';
    }
    return 'person';
  };

  const filteredTemplates = personaTemplates?.templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartSimulation = () => {
    if (selectedPersona) {
      // Handle navigation or simulation start
      console.log('Starting simulation with persona template:', selectedPersona);
    }
  };

  const PersonaTemplateCard = ({
    template,
    isSelected,
    onSelect,
    index,
  }: {
    template: PersonaTemplate;
    isSelected: boolean;
    onSelect: () => void;
    index: number;
  }) => {
    // Pick consistent color based on index
    const colorTheme = CARD_COLORS[index % CARD_COLORS.length];

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onSelect}
        style={[styles.cardContainer, isSelected && styles.cardContainerSelected]}>
        <View style={styles.cardContent}>
          {/* Header Row: Icon + Title + Radio */}
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={[styles.iconContainer, { backgroundColor: colorTheme.bg }]}>
                <Ionicons
                  name={getPersonaIcon(template.title) as any}
                  size={20}
                  color={colorTheme.primary}
                />
              </View>
              <CustomText style={styles.cardTitle} fontFamily="bold">
                {template.title}
              </CustomText>
            </View>

            <View style={styles.radioContainer}>
              {isSelected ? (
                <Ionicons name="checkmark-circle" size={24} color="#A020F0" />
              ) : (
                <View style={styles.radioUnselected} />
              )}
            </View>
          </View>

          {/* Age Badge */}
          <View style={[styles.ageBadge, { backgroundColor: colorTheme.bg }]}>
            <CustomText style={[styles.ageText, { color: colorTheme.primary }]} fontFamily="medium">
              {template.age_range} years
            </CustomText>
          </View>

          {/* Description */}
          <CustomText style={styles.cardDescription} numberOfLines={3}>
            {template.description}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle} fontFamily="bold">
          Target Audience
        </CustomText>
        {/* Placeholder for center alignment if needed, or just empty view */}
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <CustomText style={styles.pageTitle} fontFamily="bold">
            Who are you trying to reach?
          </CustomText>
          <CustomText style={styles.pageSubtitle}>
            Select a persona for the AI to simulate interactions with. This helps tailor your content
            strategy.
          </CustomText>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#aa17fa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search personas (e.g., Gen Z, Tech)."
            placeholderTextColor="#8b7d94"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Templates List */}
        {loading ? (
          <ActivityIndicator size="large" color="#A020F0" style={styles.loader} />
        ) : (
          <View style={styles.listContainer}>
            {filteredTemplates?.map((template, index) => (
              <PersonaTemplateCard
                key={template.id}
                template={template}
                isSelected={selectedPersona === template.id}
                onSelect={() => setSelectedPersona(template.id)}
                index={index}
              />
            ))}
          </View>
        )}

        {/* Bottom Spacer for Button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleStartSimulation}
          disabled={!selectedPersona}>
          <LinearGradient
            colors={selectedPersona ? ['#B040FF', '#8000FF'] : ['#4a4a4a', '#3a3a3a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.startButton, !selectedPersona && styles.startButtonDisabled]}>
            <CustomText style={styles.startButtonText} fontFamily="bold">
              Start Simulation
            </CustomText>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </LinearGradient>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18, // Increased size to match standard headers
    color: Colors.white,
  },
  headerRightSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    color: Colors.white,
    marginBottom: 12,
    lineHeight: 34,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#8b7d94',
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1428', // Darker purple-ish background
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
    color: '#D49EFF', // Lighter purple for icon
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: Colors.white,
    fontSize: 15,
    fontFamily: Typography.fontFamily.regular,
  },
  loader: {
    marginTop: 40,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  // Card Styles
  cardContainer: {
    backgroundColor: '#1E1428',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardContainerSelected: {
    borderColor: '#A020F0', // Purple border
    // Enhanced Glow effect matching AnalysisResultScreen
    shadowColor: '#A413EC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
  },
  cardContent: {
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    color: Colors.white,
  },
  radioContainer: {
    paddingLeft: 10,
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a4a4a',
  },
  ageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 52, // Align with text start (icon width + gap)
    marginTop: -4,
    marginBottom: 4,
  },
  ageText: {
    fontSize: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#8b7d94',
    lineHeight: 20,
    marginLeft: 52, // Align with text start
  },
  // Button Styles
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20, // Safe area handles padding on iOS
    backgroundColor: 'transparent',
  },
  startButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  startButtonDisabled: {
    opacity: 0.7,
  },
  startButtonText: {
    fontSize: 16,
    color: Colors.white,
  },
});
