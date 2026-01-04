import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { getPersonaTemplates, PersonaTemplateResponse, PersonaTemplate } from '@/api';
import { CustomText } from '@/components';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';

export const PersonaTemplatesScreen = () => {
  const [personaTemplates, setPersonaTemplates] = useState<PersonaTemplateResponse | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const data = await getPersonaTemplates();
        setPersonaTemplates(data);
      } catch (error) {
        console.error('Failed to fetch personas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  const getPersonaIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('student') || lowerTitle.includes('gen z')) {
      return 'school-outline';
    } else if (lowerTitle.includes('professional') || lowerTitle.includes('busy')) {
      return 'briefcase-outline';
    } else if (lowerTitle.includes('fitness') || lowerTitle.includes('health')) {
      return 'fitness-outline';
    }
    return 'person-outline';
  };

  const filteredTemplates = personaTemplates?.templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartSimulation = () => {
    if (selectedPersona) {
      // Handle navigation or simulation start
      console.log('Starting simulation with persona:', selectedPersona);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle} fontFamily="semiBold">
          Target Audience
        </CustomText>
        <View style={styles.progressIndicator}>
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <CustomText style={styles.title} fontFamily="bold">
          Who are you trying to reach?
        </CustomText>
        <CustomText style={styles.subtitle}>
          Select a persona for the AI to simulate interactions with. This helps tailor your content
          strategy.
        </CustomText>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aa17fa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search personas (e.g., Gen Z, Tech)..."
          placeholderTextColor="#8b7d94"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Persona List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.buttonColor} style={styles.loader} />
        ) : (
          <View style={styles.personaList}>
            {filteredTemplates?.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.personaCard,
                  selectedPersona === template.id && styles.personaCardSelected,
                ]}
                onPress={() => setSelectedPersona(template.id)}
                activeOpacity={0.7}>
                <View style={styles.personaIcon}>
                  <Ionicons
                    name={getPersonaIcon(template.title) as any}
                    size={24}
                    color={Colors.audienceiconColor}
                  />
                </View>
                <View style={styles.personaContent}>
                  <View style={styles.personaHeader}>
                    <CustomText style={styles.personaTitle} fontFamily="semiBold">
                      {template.title}
                    </CustomText>
                    <CustomText style={styles.personaAge}>{template.age_range}</CustomText>
                  </View>
                  <CustomText style={styles.personaDescription}>{template.description}</CustomText>
                </View>
                <View style={styles.selectionIndicator}>
                  {selectedPersona === template.id ? (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.buttonColor} />
                  ) : (
                    <View style={styles.unselectedCircle} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Start Simulation Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.startButton, !selectedPersona && styles.startButtonDisabled]}
          onPress={handleStartSimulation}
          disabled={!selectedPersona}
          activeOpacity={0.8}>
          <CustomText style={styles.startButtonText} fontFamily="semiBold">
            Start Simulation
          </CustomText>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.white,
  },
  progressIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4a2f5c',
  },
  progressDotActive: {
    backgroundColor: Colors.buttonColor,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: Colors.white,
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#b8a5c5',
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: Colors.white,
    fontSize: 14,
    fontFamily: Typography.fontFamily.regular,
  },
  scrollView: {
    flex: 1,
  },
  personaList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  personaCard: {
    flexDirection: 'row',
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  personaCardSelected: {
    borderColor: Colors.buttonColor,
    backgroundColor: '#4a2559',
  },
  personaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2d3d5e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  personaContent: {
    flex: 1,
  },
  personaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  personaTitle: {
    fontSize: 16,
    color: Colors.white,
    marginRight: 8,
  },
  personaAge: {
    fontSize: 12,
    color: '#8b7d94',
  },
  personaDescription: {
    fontSize: 13,
    color: '#b8a5c5',
    lineHeight: 18,
  },
  selectionIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5a4668',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: Colors.background,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: Colors.buttonColor,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    fontSize: 16,
    color: Colors.white,
  },
  loader: {
    marginTop: 40,
  },
});
