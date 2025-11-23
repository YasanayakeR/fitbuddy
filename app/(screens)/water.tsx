import GoalCelebration from '@/components/common/GoalCelebration';
import WaterTracker from '@/components/wellness/WaterTracker';
import { useTheme } from '@/context/ThemeContext';
import { addWater, decreaseWater } from '@/redux/slices/waterSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function WaterScreen() {
    const { colors, theme } = useTheme();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { currentAmount, dailyGoal } = useSelector((state: RootState) => state.water);
    const [showCelebration, setShowCelebration] = useState(false);
    const previousAmount = useRef(currentAmount);

    useEffect(() => {
        if (previousAmount.current < dailyGoal && currentAmount >= dailyGoal) {
            setShowCelebration(true);
        }
        previousAmount.current = currentAmount;
    }, [currentAmount, dailyGoal]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Hydration</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <WaterTracker mode="full" />

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: colors.error + '20' }]}
                        onPress={() => dispatch(decreaseWater(250))}
                    >
                        <Feather name="minus" size={24} color={colors.error} />
                        <Text style={[styles.controlText, { color: colors.error }]}>-250ml</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: colors.primary + '20' }]}
                        onPress={() => dispatch(addWater(250))}
                    >
                        <Feather name="plus" size={24} color={colors.primary} />
                        <Text style={[styles.controlText, { color: colors.primary }]}>+250ml</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
                    <Feather name="info" size={20} color={colors.primary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        Drinking water helps maintain the balance of body fluids. Your body is composed of about 60% water.
                    </Text>
                </View>
            </View>

            <GoalCelebration
                visible={showCelebration}
                onClose={() => setShowCelebration(false)}
                title="Goal Reached!"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
    },
    controls: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    controlButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
    },
    controlText: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    infoCard: {
        marginTop: 20,
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        gap: 15,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});
