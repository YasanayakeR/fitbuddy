import GoalCelebration from '@/components/common/GoalCelebration';
import DietTracker from '@/components/nutrition/DietTracker';
import FoodSelectionModal from '@/components/nutrition/FoodSelectionModal';
import { useTheme } from '@/context/ThemeContext';
import { addFoodItem, loadDietData, removeFoodItem, saveDietData, type FoodItem, type Meal } from '@/redux/slices/dietSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function DietScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { meals, carbsGoal, proteinGoal, fatGoal } = useSelector((state: RootState) => state.diet);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<Meal['type']>('Breakfast');
    const [showCelebration, setShowCelebration] = useState(false);
    const previousCalories = useRef(0);

    useEffect(() => {
        dispatch(loadDietData());
    }, [dispatch]);

    useEffect(() => {
        const state = { meals, caloriesGoal: 2000, carbsGoal, proteinGoal, fatGoal };
        dispatch(saveDietData(state));
    }, [meals, carbsGoal, proteinGoal, fatGoal, dispatch]);

    const carbsConsumed = meals.reduce((total, meal) =>
        total + meal.items.reduce((sum, item) => sum + item.carbs, 0), 0
    );
    const proteinConsumed = meals.reduce((total, meal) =>
        total + meal.items.reduce((sum, item) => sum + item.protein, 0), 0
    );
    const fatConsumed = meals.reduce((total, meal) =>
        total + meal.items.reduce((sum, item) => sum + item.fat, 0), 0
    );
    const caloriesConsumed = meals.reduce((total, meal) =>
        total + meal.items.reduce((sum, item) => sum + item.calories, 0), 0
    );

    useEffect(() => {
        const caloriesGoal = 2000;
        if (previousCalories.current < caloriesGoal && caloriesConsumed >= caloriesGoal) {
            setShowCelebration(true);
        }
        previousCalories.current = caloriesConsumed;
    }, [caloriesConsumed]);

    const mealIcons: { [key: string]: string } = {
        'Breakfast': 'sun',
        'Lunch': 'sun',
        'Dinner': 'moon',
        'Snacks': 'coffee',
    };

    const handleOpenModal = (mealType: Meal['type']) => {
        setSelectedMealType(mealType);
        setModalVisible(true);
    };

    const handleSelectFood = (food: FoodItem) => {
        dispatch(addFoodItem({ mealType: selectedMealType, food }));
    };

    const handleRemoveFood = (mealType: Meal['type'], index: number) => {
        dispatch(removeFoodItem({ mealType, index }));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Diet & Nutrition</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <DietTracker mode="full" />

                <View style={[styles.macrosContainer, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Macronutrients</Text>
                    <View style={styles.macroRow}>
                        <View style={styles.macroItem}>
                            <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Carbs</Text>
                            <View style={[styles.macroBarBg, { backgroundColor: colors.border }]}>
                                <View style={[styles.macroBarFill, { backgroundColor: '#FFB74D', width: `${Math.min((carbsConsumed / carbsGoal) * 100, 100)}%` }]} />
                            </View>
                            <Text style={[styles.macroValue, { color: colors.text }]}>{Math.round(carbsConsumed)}g / {carbsGoal}g</Text>
                        </View>
                        <View style={styles.macroItem}>
                            <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Protein</Text>
                            <View style={[styles.macroBarBg, { backgroundColor: colors.border }]}>
                                <View style={[styles.macroBarFill, { backgroundColor: '#4DB6AC', width: `${Math.min((proteinConsumed / proteinGoal) * 100, 100)}%` }]} />
                            </View>
                            <Text style={[styles.macroValue, { color: colors.text }]}>{Math.round(proteinConsumed)}g / {proteinGoal}g</Text>
                        </View>
                        <View style={styles.macroItem}>
                            <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Fat</Text>
                            <View style={[styles.macroBarBg, { backgroundColor: colors.border }]}>
                                <View style={[styles.macroBarFill, { backgroundColor: '#E57373', width: `${Math.min((fatConsumed / fatGoal) * 100, 100)}%` }]} />
                            </View>
                            <Text style={[styles.macroValue, { color: colors.text }]}>{Math.round(fatConsumed)}g / {fatGoal}g</Text>
                        </View>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Meals</Text>

                {meals.map((meal, index) => (
                    <View key={index} style={[styles.mealCard, { backgroundColor: colors.cardBackground }]}>
                        <View style={styles.mealHeader}>
                            <View style={styles.mealTitleRow}>
                                <View style={[styles.iconBg, { backgroundColor: colors.success + '20' }]}>
                                    <Feather name={mealIcons[meal.type] as any} size={18} color={colors.success} />
                                </View>
                                <Text style={[styles.mealName, { color: colors.text }]}>{meal.type}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleOpenModal(meal.type)}>
                                <Feather name="plus-circle" size={24} color={colors.success} />
                            </TouchableOpacity>
                        </View>

                        {meal.items.length > 0 ? (
                            <View style={styles.mealItems}>
                                {meal.items.map((item, idx) => (
                                    <View key={idx} style={styles.foodItemRow}>
                                        <Text style={[styles.mealItemText, { color: colors.textSecondary }]}>
                                            • {item.name} ({item.calories} kcal)
                                        </Text>
                                        <TouchableOpacity onPress={() => handleRemoveFood(meal.type, idx)}>
                                            <Feather name="trash-2" size={16} color={colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                <Text style={[styles.mealCalories, { color: colors.textSecondary }]}>
                                    Total: {meal.items.reduce((sum, item) => sum + item.calories, 0)} kcal
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.emptyMealText, { color: colors.textSecondary }]}>No food logged</Text>
                        )}
                    </View>
                ))}
            </ScrollView>

            <FoodSelectionModal
                visible={modalVisible}
                mealType={selectedMealType}
                onClose={() => setModalVisible(false)}
                onSelectFood={handleSelectFood}
            />

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
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
    },
    macrosContainer: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        marginTop: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    macroRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    macroItem: {
        flex: 1,
    },
    macroLabel: {
        fontSize: 12,
        marginBottom: 5,
    },
    macroBarBg: {
        height: 6,
        borderRadius: 3,
        marginBottom: 5,
        overflow: 'hidden',
    },
    macroBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    macroValue: {
        fontSize: 10,
        fontWeight: '600',
    },
    mealCard: {
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mealName: {
        fontSize: 16,
        fontWeight: '600',
    },
    mealItems: {
        paddingLeft: 42,
    },
    foodItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    mealItemText: {
        fontSize: 14,
        marginBottom: 4,
    },
    mealCalories: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: '600',
    },
    emptyMealText: {
        paddingLeft: 42,
        fontSize: 14,
        fontStyle: 'italic',
    },
});
