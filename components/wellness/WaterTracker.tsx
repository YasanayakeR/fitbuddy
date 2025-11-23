
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { addWater, loadWaterData } from '@/redux/slices/waterSlice';
import { AppDispatch, RootState } from '@/redux/store';

interface WaterTrackerProps {
    mode?: 'widget' | 'full';
}

export default function WaterTracker({ mode = 'widget' }: WaterTrackerProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { currentAmount, dailyGoal } = useSelector((state: RootState) => state.water);
    const { colors } = useTheme();
    const router = useRouter();

    // Animation for water level
    const animatedHeight = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        dispatch(loadWaterData());
    }, [dispatch]);

    useEffect(() => {
        const percentage = Math.min(currentAmount / dailyGoal, 1);
        Animated.timing(animatedHeight, {
            toValue: percentage,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [currentAmount, dailyGoal]);

    const handleAddWater = (amount: number) => {
        dispatch(addWater(amount));
    };

    const heightInterpolation = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    if (mode === 'widget') {
        return (
            <TouchableOpacity
                onPress={() => router.push('/water')}
                style={[styles.widgetContainer, { backgroundColor: colors.cardBackground }]}
            >
                <ImageBackground
                    source={require('@/assets/images/water_bg.png')}
                    style={styles.widgetBackground}
                    imageStyle={{ borderRadius: 16, opacity: 0.1 }}
                >
                    <View style={styles.widgetHeader}>
                        <View style={[styles.iconBg, { backgroundColor: colors.primary + '20' }]}>
                            <Feather name="droplet" size={20} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.widgetTitle, { color: colors.text }]}>Water</Text>
                            <Text style={[styles.widgetSubtitle, { color: colors.textSecondary }]}>
                                {currentAmount} / {dailyGoal} ml
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    backgroundColor: colors.primary,
                                    width: `${Math.min((currentAmount / dailyGoal) * 100, 100)}%`
                                }
                            ]}
                        />
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    const progress = Math.min((currentAmount / dailyGoal) * 100, 100);

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Hydration</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{currentAmount} / {dailyGoal} ml</Text>
            </View>

            <View style={styles.trackerContainer}>
                <View style={[styles.glass, { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}>
                    <Animated.View style={[styles.water, { height: heightInterpolation, backgroundColor: colors.primary }]} />
                    <View style={styles.glassHighlights} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    widgetContainer: {
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    widgetBackground: {
        padding: 15,
        borderRadius: 16,
    },
    widgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    widgetTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    widgetSubtitle: {
        fontSize: 12,
    },
    progressBarBg: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    progressContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
    },
    progressText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
    },
    trackerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    glass: {
        width: 60,
        height: 100,
        borderWidth: 2,
        borderTopWidth: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    water: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    glassHighlights: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 5,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 5,
    },
    controls: {
        gap: 10,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    smallButton: {
        opacity: 0.9,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});
