import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useAppNavigation } from '@/hooks';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Colors } from '@/constants/Colors';

export const HomeScreen = () => {
  const navigation = useAppNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* Icon Section */}
      <View>
        <Ionicons name="sparkles" size={24} color={Colors.iconColor} style={styles.icon} />
      </View>

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>InfluenceLab</Text>
        <Text style={styles.subTitle}>See how your audience reacts before you post.</Text>
      </View>

      {/* AI Content Section */}
      <View style={styles.contentContainer}></View>

      {/* Button Section */}

      <View style={styles.buttonSection}>
        <View style={styles.textContainer}>
          <View style={styles.aiCoachContainer}>
            <MaterialCommunityIcons name="robot-confused" size={24} color={Colors.iconColor} />
            <Text style={styles.aiCoachText}>AI Coach</Text>
          </View>
          <View style={styles.audienceContainer}>
            <MaterialCommunityIcons
              name="account-group"
              size={24}
              color={Colors.audienceiconColor}
            />
            <Text style={styles.audiencePersonasText}>Audience Personas</Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.buttonColor,
              padding: 16,
              borderRadius: 12,
              margin: 16,
            }}
            onPress={() => {}}>
            <Text style={styles.buttonText}>
              <Entypo name="bar-graph" size={18} color="white" /> Analyze My Content
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  icon: {
    margin: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    padding: 8,
    alignSelf: 'center',
    backgroundColor: Colors.inputBackground,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 20,
    color: Colors.borderColor,
    textAlign: 'center',
    marginTop: 8,
  },
  headerContainer: {},
  contentContainer: {
    flex: 0.7,
    backgroundColor: Colors.primary,
    margin: 16,
    borderRadius: 12,
    // top: 50,
  },
  buttonSection: {
    flex: 0.2,
    justifyContent: 'flex-end',
    top: 70,
  },
  aiCoachText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiCoachContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 100,
    backgroundColor: Colors.buttonSectionBackground,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  audienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 100,
    backgroundColor: Colors.buttonSectionBackground,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audiencePersonasText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
