import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { scale, verticalScale } from 'react-native-size-matters';

import { CustomText } from '@/components';
import { Colors } from '@/constants/Colors';
import { useAppNavigation } from '@/hooks';
import { AppRoutes } from '@/types';
import type { HomeStackParamList } from '@/types/navigation/stacks';
import { useAnalyzeContentMutation, type AnalyzeContentResponse } from '@/api/services/content.service';

type AnalysisLoadingRouteProp = RouteProp<HomeStackParamList, AppRoutes.ANALYSIS_LOADING>;

const LOADING_STEPS = [
    { title: 'Analyzing content...', description: 'Processing your media file...' },
    { title: 'Evaluating visuals...', description: 'Checking composition and quality...' },
    { title: 'Analyzing perception...', description: 'Understanding audience psychology...' },
    { title: 'Generating insights...', description: 'Preparing your personalized feedback...' },
];

export const AnalysisLoadingScreen = () => {
    const route = useRoute<AnalysisLoadingRouteProp>();
    const navigation = useAppNavigation();
    const { media, caption, analysisType } = route.params;

    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Track both conditions for navigation
    const [isProgressComplete, setIsProgressComplete] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeContentResponse | null>(null);
    const [hasError, setHasError] = useState(false);

    const PROGRESS_DURATION = 5000; // 5 seconds for progress bar

    const { mutate: analyzeContent } = useAnalyzeContentMutation({
        onSuccess: (response) => {
            console.log('Analysis complete:', response);
            setAnalysisResult(response);
        },
        onError: (error) => {
            console.error('Analysis error:', error);
            setHasError(true);
        },
    });

    // Handle navigation when both conditions are met
    useEffect(() => {
        if (hasError && isProgressComplete) {
            navigation.goBack();
            return;
        }

        if (analysisResult && isProgressComplete) {
            // Both API response received and progress bar complete
            navigation.replace(AppRoutes.ANALYSIS_RESULT, {
                result: analysisResult,
                media,
            });
        }
    }, [analysisResult, isProgressComplete, hasError]);

    useEffect(() => {
        // Start the analysis when the screen loads
        analyzeContent({
            media,
            analysis_type: analysisType,
            caption,
        });

        // Animate progress bar smoothly to 100% over 5 seconds
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / PROGRESS_DURATION) * 100, 100);

            setProgress(newProgress);
            Animated.timing(progressAnim, {
                toValue: newProgress,
                duration: 100,
                useNativeDriver: false,
            }).start();

            if (newProgress >= 100) {
                clearInterval(progressInterval);
                setIsProgressComplete(true);
            }
        }, 50);

        // Cycle through loading steps
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
        }, 1500);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, []);

    const handleCancel = () => {
        navigation.goBack();
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

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
                <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <CustomText fontFamily="bold" style={styles.headerTitle}>
                        ANALYSIS
                    </CustomText>
                </View>
                <View style={styles.headerRight} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Lottie Animation */}
                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('@/assets/animations/ai-glow-animation.json')}
                        autoPlay
                        loop
                        style={styles.lottieAnimation}
                    />
                </View>

                {/* Loading Text */}
                <CustomText fontFamily="bold" style={styles.loadingTitle}>
                    {LOADING_STEPS[currentStep].title}
                </CustomText>
                <CustomText fontFamily="regular" style={styles.loadingDescription}>
                    {LOADING_STEPS[currentStep].description}
                </CustomText>

                {/* Progress Section */}
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <CustomText fontFamily="semiBold" style={styles.progressLabel}>
                            TONE: <CustomText fontFamily="bold" style={styles.progressValue}>ANALYZING</CustomText>
                        </CustomText>
                        <CustomText fontFamily="medium" style={styles.progressPercent}>
                            {Math.round(progress)}%
                        </CustomText>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
                            <LinearGradient
                                colors={['#A413EC', '#63A5F7']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.progressGradient}
                            />
                        </Animated.View>
                    </View>

                    <CustomText fontFamily="regular" style={styles.analysisNote}>
                        AI Coach is analyzing your content...
                    </CustomText>
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
        fontSize: scale(14),
        color: Colors.white,
        letterSpacing: 2,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(20),
    },
    animationContainer: {
        width: scale(250),
        height: scale(250),
        marginBottom: verticalScale(40),
    },
    lottieAnimation: {
        width: '100%',
        height: '100%',
    },
    loadingTitle: {
        fontSize: scale(24),
        color: Colors.white,
        textAlign: 'center',
        marginBottom: verticalScale(8),
    },
    loadingDescription: {
        fontSize: scale(14),
        color: '#999',
        textAlign: 'center',
        marginBottom: verticalScale(40),
    },
    progressSection: {
        width: '100%',
        paddingHorizontal: scale(20),
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    progressLabel: {
        fontSize: scale(12),
        color: '#A413EC',
    },
    progressValue: {
        color: '#A413EC',
    },
    progressPercent: {
        fontSize: scale(14),
        color: Colors.white,
    },
    progressBarContainer: {
        width: '100%',
        height: verticalScale(6),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: scale(3),
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: scale(3),
        overflow: 'hidden',
    },
    progressGradient: {
        flex: 1,
    },
    analysisNote: {
        fontSize: scale(12),
        color: '#666',
        marginTop: verticalScale(16),
    },
    footer: {
        paddingHorizontal: scale(20),
        paddingBottom: verticalScale(32),
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: verticalScale(16),
        borderRadius: scale(12),
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: scale(16),
        color: Colors.white,
    },
});
