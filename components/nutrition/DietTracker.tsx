import { useTheme } from '@/context/ThemeContext';
import { loadDietData } from '@/redux/slices/dietSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface DietTrackerProps {
    mode?: 'widget' | 'full';
}

export default function DietTracker({ mode = 'widget' }: DietTrackerProps) {
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { meals, caloriesGoal } = useSelector((state: RootState) => state.diet);

    useEffect(() => {
        dispatch(loadDietData());
    }, [dispatch]);

    // Calculate total calories consumed
    const caloriesConsumed = meals.reduce((total, meal) => {
        return total + meal.items.reduce((sum, item) => sum + item.calories, 0);
    }, 0);

    if (mode === 'widget') {
        return (
            <TouchableOpacity
                onPress={() => router.push('/diet')}
                style={[styles.widgetContainer, { backgroundColor: colors.cardBackground }]}
            >
                <ImageBackground
                    source={require('@/assets/images/diet_bg.png')}
                    style={styles.widgetBackground}
                    imageStyle={{ borderRadius: 16, opacity: 0.1 }}
                >
                    <View style={styles.widgetHeader}>
                        <View style={[styles.iconBg, { backgroundColor: colors.success + '20' }]}>
                            <Feather name="pie-chart" size={20} color={colors.success} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.widgetTitle, { color: colors.text }]}>Diet</Text>
                            <Text style={[styles.widgetSubtitle, { color: colors.textSecondary }]}>
                                {caloriesConsumed} / {caloriesGoal} kcal
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    backgroundColor: colors.success,
                                    width: `${Math.min((caloriesConsumed / caloriesGoal) * 100, 100)}%`
                                }
                            ]}
                        />
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
            <ImageBackground
                source={require('@/assets/images/diet_bg.png')}
                style={styles.fullBackground}
                imageStyle={{ borderRadius: 16, opacity: 0.15 }}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Nutrition Tracker</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{caloriesConsumed} / {caloriesGoal} kcal</Text>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    fullBackground: {
        padding: 20,
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
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
    },
});
