import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, type RouteProp } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { scale, verticalScale } from 'react-native-size-matters';

import { CustomText } from '@/components';
import { Colors } from '@/constants/Colors';
import { useAppNavigation } from '@/hooks';
import { AppRoutes } from '@/types';
import type { HomeStackParamList } from '@/types/navigation/stacks';

type AnalysisResultRouteProp = RouteProp<HomeStackParamList, AppRoutes.ANALYSIS_RESULT>;

export const AnalysisResultScreen = () => {
    const route = useRoute<AnalysisResultRouteProp>();
    const navigation = useAppNavigation();
    const { result, media } = route.params;

    const analysis = result.coach_analysis;

    const handleDone = () => {
        navigation.navigate(AppRoutes.HOME);
    };

    const handleReCheckWithCaption = () => {
        // Navigate to loading screen with the revised caption
        navigation.replace(AppRoutes.ANALYSIS_LOADING, {
            media,
            caption: analysis.revised_caption,
            analysisType: 'coach',
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return '#4CAF50';
        if (score >= 6) return '#FFC107';
        return '#F44336';
    };

    const renderScoreCard = (title: string, score: number, icon: string) => (
        <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
                <Ionicons name={icon as any} size={20} color={Colors.white} />
                <CustomText fontFamily="medium" style={styles.scoreTitle}>{title}</CustomText>
            </View>
            <View style={styles.scoreBarContainer}>
                <LinearGradient
                    colors={['#A413EC', '#63A5F7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.scoreBarFill, { width: `${score * 10}%` }]}
                />
            </View>
            <CustomText fontFamily="bold" style={[styles.scoreValue, { color: getScoreColor(score) }]}>
                {score}
            </CustomText>
        </View>
    );

    const renderListSection = (title: string, items: string[], icon: string, color: string) => (
        <View style={styles.listSection}>
            <View style={styles.listHeader}>
                <Ionicons name={icon as any} size={20} color={color} />
                <CustomText fontFamily="semiBold" style={styles.listTitle}>{title}</CustomText>
            </View>
            {items.map((item, index) => (
                <View key={index} style={styles.listItem}>
                    <View style={[styles.listDot, { backgroundColor: color }]} />
                    <CustomText fontFamily="regular" style={styles.listText}>{item}</CustomText>
                </View>
            ))}
        </View>
    );

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
                <TouchableOpacity onPress={handleDone} style={styles.backButton}>
                    <Ionicons name="close" size={24} color={Colors.white} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <CustomText fontFamily="bold" style={styles.headerTitle}>
                        Analysis Results
                    </CustomText>
                    <CustomText fontFamily="regular" style={styles.stepIndicator}>
                        AI Coach Feedback
                    </CustomText>
                </View>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Overall Score */}
                <View style={styles.overallScoreContainer}>
                    <LinearGradient
                        colors={['#2a0a3a', '#1a0a2a']}
                        style={styles.overallScoreGradient}
                    >
                        <CustomText fontFamily="medium" style={styles.overallLabel}>Overall Score</CustomText>
                        <CustomText fontFamily="bold" style={styles.overallScore}>
                            {analysis.overall_score}
                        </CustomText>
                        <CustomText fontFamily="regular" style={styles.overallSubtext}>
                            out of 100
                        </CustomText>
                    </LinearGradient>
                </View>

                {/* Media Preview */}
                {media && (
                    <View style={styles.mediaPreview}>
                        <Image source={{ uri: media.uri }} style={styles.mediaImage} />
                    </View>
                )}

                {/* Score Cards */}
                <View style={styles.scoresContainer}>
                    {renderScoreCard('Visual Score', analysis.visual_score, 'eye-outline')}
                    {renderScoreCard('Caption Score', analysis.caption_score, 'text-outline')}
                    {renderScoreCard('Alignment', analysis.alignment_score, 'compass-outline')}
                </View>

                {/* Strengths */}
                {analysis.strengths && analysis.strengths.length > 0 && (
                    renderListSection('Strengths', analysis.strengths, 'checkmark-circle', '#4CAF50')
                )}

                {/* Improvements */}
                {analysis.improvments && analysis.improvments.length > 0 && (
                    renderListSection('Areas to Improve', analysis.improvments, 'arrow-up-circle', '#FFC107')
                )}

                {/* Quick Wins */}
                {analysis.quick_wins && analysis.quick_wins.length > 0 && (
                    renderListSection('Quick Wins', analysis.quick_wins, 'flash', '#A413EC')
                )}

                {/* Revised Caption */}
                {analysis.revised_caption && (
                    <View style={styles.captionSection}>
                        <View style={styles.captionHeader}>
                            <Ionicons name="create-outline" size={20} color="#63A5F7" />
                            <CustomText fontFamily="semiBold" style={styles.captionTitle}>
                                Suggested Caption
                            </CustomText>
                        </View>
                        {/* Glowing Shadow Wrapper */}
                        <View style={styles.captionBoxWrapper}>
                            <View style={styles.captionBox}>
                                <CustomText
                                    fontFamily="regular"
                                    style={styles.captionText}
                                    selectable={false}
                                >
                                    {analysis.revised_caption}
                                </CustomText>
                                <TouchableOpacity
                                    style={styles.reCheckButton}
                                    onPress={handleReCheckWithCaption}
                                >
                                    <LinearGradient
                                        colors={['#A413EC', '#450374ff']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.reCheckButtonGradient}
                                    >
                                        <Ionicons name="refresh" size={18} color={Colors.white} />
                                        <CustomText fontFamily="medium" style={styles.reCheckText}>
                                            Re-Check With Updated Caption
                                        </CustomText>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Done Button */}
                <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                    <LinearGradient
                        colors={['#A413EC', '#7a0fbc']}
                        style={styles.doneButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <CustomText fontFamily="bold" style={styles.doneButtonText}>
                            Done
                        </CustomText>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
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
        paddingHorizontal: scale(20),
    },
    overallScoreContainer: {
        marginBottom: verticalScale(20),
        borderRadius: scale(16),
        overflow: 'hidden',
    },
    overallScoreGradient: {
        alignItems: 'center',
        paddingVertical: verticalScale(24),
    },
    overallLabel: {
        fontSize: scale(14),
        color: '#999',
        marginBottom: verticalScale(8),
    },
    overallScore: {
        fontSize: scale(64),
        color: Colors.white,
        lineHeight: scale(70),
    },
    overallSubtext: {
        fontSize: scale(14),
        color: '#666',
    },
    mediaPreview: {
        marginBottom: verticalScale(20),
        borderRadius: scale(12),
        overflow: 'hidden',
    },
    mediaImage: {
        width: '100%',
        height: verticalScale(150),
    },
    scoresContainer: {
        gap: verticalScale(12),
        marginBottom: verticalScale(24),
    },
    scoreCard: {
        backgroundColor: Colors.inputBackground,
        borderRadius: scale(12),
        padding: scale(16),
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },
    scoreHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        marginBottom: verticalScale(12),
    },
    scoreTitle: {
        fontSize: scale(14),
        color: Colors.white,
    },
    scoreBarContainer: {
        width: '100%',
        height: verticalScale(8),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: scale(4),
        overflow: 'hidden',
        marginBottom: verticalScale(8),
    },
    scoreBarFill: {
        height: '100%',
        borderRadius: scale(4),
    },
    scoreValue: {
        fontSize: scale(24),
        textAlign: 'right',
    },
    listSection: {
        marginBottom: verticalScale(20),
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        marginBottom: verticalScale(12),
    },
    listTitle: {
        fontSize: scale(16),
        color: Colors.white,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: scale(12),
        marginBottom: verticalScale(8),
        paddingLeft: scale(4),
    },
    listDot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        marginTop: verticalScale(6),
    },
    listText: {
        flex: 1,
        fontSize: scale(14),
        color: '#ccc',
        lineHeight: scale(20),
    },
    captionSection: {
        marginBottom: verticalScale(24),
    },
    captionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        marginBottom: verticalScale(12),
    },
    captionTitle: {
        fontSize: scale(16),
        color: Colors.white,
    },
    captionBoxWrapper: {
        borderRadius: scale(14),
        // iOS shadow for glow effect
        shadowColor: '#A413EC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        // Android elevation
        elevation: 12,
    },
    captionBox: {
        backgroundColor: Colors.inputBackground,
        borderRadius: scale(12),
        padding: scale(16),
        borderWidth: 1.5,
        borderColor: 'rgba(164, 19, 236, 0.5)',
        overflow: 'hidden',
    },
    captionText: {
        fontSize: scale(14),
        color: '#ccc',
        lineHeight: scale(22),
        marginBottom: verticalScale(16),
    },
    reCheckButton: {
        borderRadius: scale(10),
        overflow: 'hidden',
    },
    reCheckButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
    },
    reCheckText: {
        fontSize: scale(14),
        color: Colors.white,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(6),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: verticalScale(10),
        borderRadius: scale(8),
    },
    copyText: {
        fontSize: scale(14),
        color: Colors.white,
    },
    doneButton: {
        borderRadius: scale(16),
        overflow: 'hidden',
        marginBottom: verticalScale(16),
    },
    doneButtonGradient: {
        paddingVertical: verticalScale(18),
        alignItems: 'center',
    },
    doneButtonText: {
        fontSize: scale(16),
        color: Colors.white,
    },
    bottomSpacer: {
        height: verticalScale(20),
    },
});
