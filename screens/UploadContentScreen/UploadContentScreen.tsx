import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { scale, verticalScale } from 'react-native-size-matters';

import { CustomText, LoadingOverlay } from '@/components';
import { Colors } from '@/constants/Colors';
import { useAppNavigation } from '@/hooks';
import { AppRoutes } from '@/types';

type PlatformType = 'instagram_feed' | 'instagram_reels';

interface SelectedMedia {
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

export const UploadContentScreen = () => {
  const navigation = useAppNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  // State
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);
  const [platform, setPlatform] = useState<PlatformType>('instagram_feed');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  // Scroll to bottom when caption input is focused
  const handleCaptionFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  // Request permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is required to select files.');
      return false;
    }
    return true;
  };

  // Select file from library
  const handleSelectFile = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Images + Videos
        allowsEditing: false,
        quality: 0.9,
        videoMaxDuration: 60, // 60 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedMedia({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          fileName: asset.fileName || `media_${Date.now()}`,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select file');
      console.error(error);
    }
  };

  // Remove selected media
  const handleRemoveMedia = () => {
    setSelectedMedia(null);
  };

  // Handle analyze button press
  const handleAnalyze = async () => {
    if (!selectedMedia) {
      Alert.alert('No Media', 'Please select a file to analyze');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement upload and analysis logic
      // This will be connected to API service in next steps

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated API call

      Alert.alert('Success', 'Content analysis started!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze content');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Render media preview
  const renderMediaPreview = () => {
    if (!selectedMedia) return null;

    return (
      <View style={styles.previewContainer}>
        {selectedMedia.type === 'image' ? (
          <Image source={{ uri: selectedMedia.uri }} style={styles.previewMedia} />
        ) : (
          <Video
            source={{ uri: selectedMedia.uri }}
            style={styles.previewMedia}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />
        )}

        {/* Remove button */}
        <TouchableOpacity style={styles.removeButton} onPress={handleRemoveMedia}>
          <Ionicons name="close-circle" size={28} color={Colors.white} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {loading && <LoadingOverlay />}

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
            New Analysis
          </CustomText>
          <CustomText fontFamily="regular" style={styles.stepIndicator}>
            Step 1 of 3
          </CustomText>
        </View>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Upload Section */}
          <View style={styles.section}>
            <CustomText fontFamily="semiBold" style={styles.sectionTitle}>
              Upload Media
            </CustomText>

            {selectedMedia ? (
              renderMediaPreview()
            ) : (
              <TouchableOpacity style={styles.uploadBox} onPress={handleSelectFile}>
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="cloud-upload" size={48} color={Colors.iconColor} />
                </View>
                <CustomText fontFamily="medium" style={styles.uploadTitle}>
                  Drag & drop or tap to browse
                </CustomText>
                <CustomText fontFamily="regular" style={styles.uploadSubtitle}>
                  Supports JPG, PNG, MP4
                </CustomText>
                <View style={styles.selectFileButton}>
                  <CustomText fontFamily="semiBold" style={styles.selectFileText}>
                    Select File
                  </CustomText>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Target Platform Section */}
          <View style={styles.section}>
            <CustomText fontFamily="semiBold" style={styles.sectionTitle}>
              Target Platform
            </CustomText>

            <View style={styles.platformBox}>
              <View style={styles.platformContent}>
                <View style={styles.platformIcon}>
                  <Ionicons name="logo-instagram" size={24} color={Colors.white} />
                </View>
                <View style={styles.platformInfo}>
                  <CustomText fontFamily="medium" style={styles.platformName}>
                    Instagram
                  </CustomText>
                  <CustomText fontFamily="regular" style={styles.platformSubtext}>
                    FEED / REELS
                  </CustomText>
                </View>
              </View>
              <View style={styles.lockBadge}>
                <MaterialIcons name="lock" size={16} color={Colors.white} />
              </View>
            </View>

            <CustomText fontFamily="regular" style={styles.platformNote}>
              Currently optimized for Instagram algorithm. More platforms coming soon.
            </CustomText>
          </View>

          {/* Caption Section */}
          <View style={styles.section}>
            <View style={styles.captionHeader}>
              <CustomText fontFamily="semiBold" style={styles.sectionTitle}>
                Caption
                <CustomText fontFamily="regular" style={styles.optionalLabel}>
                  {' '}
                  (Optional)
                </CustomText>
              </CustomText>
              <CustomText fontFamily="regular" style={styles.charCounter}>
                {caption.length}/2200
              </CustomText>
            </View>

            <TextInput
              style={styles.captionInput}
              placeholder="What's on your mind? The AI will analyze this tone to generate improvements..."
              placeholderTextColor="#666"
              multiline
              maxLength={2200}
              value={caption}
              onChangeText={setCaption}
              onFocus={handleCaptionFocus}
              textAlignVertical="top"
            />
          </View>

          {/* Analyze Button */}
          <TouchableOpacity
            style={[styles.analyzeButton, !selectedMedia && styles.analyzeButtonDisabled]}
            onPress={() =>
              navigation.navigate(AppRoutes.FEEDBACK_MODE_SELECTION, {
                media: selectedMedia!,
                caption,
              })
            }
            disabled={!selectedMedia || loading}>
            <Ionicons name="analytics" size={20} color={Colors.white} />
            <CustomText fontFamily="bold" style={styles.analyzeButtonText}>
              Analyze Content
            </CustomText>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(8)
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
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scale(16),
    color: Colors.white,
    marginBottom: verticalScale(12),
  },
  uploadBox: {
    backgroundColor: Colors.inputBackground,
    borderRadius: scale(16),
    borderWidth: 2,
    borderColor: Colors.borderColor,
    borderStyle: 'dashed',
    paddingVertical: verticalScale(40),
    paddingHorizontal: scale(20),
    alignItems: 'center',
  },
  uploadIconContainer: {
    marginBottom: verticalScale(16),
  },
  uploadTitle: {
    fontSize: scale(16),
    color: Colors.white,
    marginBottom: verticalScale(4),
  },
  uploadSubtitle: {
    fontSize: scale(13),
    color: '#999',
    marginBottom: verticalScale(20),
  },
  selectFileButton: {
    backgroundColor: Colors.buttonColor,
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(12),
    borderRadius: scale(12),
  },
  selectFileText: {
    fontSize: scale(15),
    color: Colors.white,
  },
  previewContainer: {
    position: 'relative',
    backgroundColor: Colors.inputBackground,
    borderRadius: scale(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  previewMedia: {
    width: '100%',
    height: verticalScale(300),
    backgroundColor: '#000',
  },
  removeButton: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: scale(14),
  },
  platformBox: {
    backgroundColor: Colors.inputBackground,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  platformContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  platformIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: Colors.buttonSectionBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformInfo: {
    gap: verticalScale(2),
  },
  platformName: {
    fontSize: scale(15),
    color: Colors.white,
  },
  platformSubtext: {
    fontSize: scale(11),
    color: '#999',
  },
  lockBadge: {
    backgroundColor: Colors.buttonSectionBackground,
    padding: scale(8),
    borderRadius: scale(8),
  },
  platformNote: {
    fontSize: scale(12),
    color: '#888',
    lineHeight: scale(16),
  },
  captionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  optionalLabel: {
    color: '#888',
    fontSize: scale(14),
  },
  charCounter: {
    fontSize: scale(12),
    color: '#888',
  },
  captionInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: scale(16),
    fontSize: scale(14),
    color: Colors.white,
    minHeight: verticalScale(120),
    fontFamily: 'Inter_400Regular',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: Colors.buttonColor,
    paddingVertical: verticalScale(18),
    borderRadius: scale(20),
    marginBottom: verticalScale(32),
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    fontSize: scale(16),
    color: Colors.white,
  },
});
