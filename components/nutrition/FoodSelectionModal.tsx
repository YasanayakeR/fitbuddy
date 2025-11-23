import { FOOD_DATABASE } from '@/constants/FoodDatabase';
import { useTheme } from '@/context/ThemeContext';
import { FoodItem } from '@/redux/slices/dietSlice';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FoodSelectionModalProps {
    visible: boolean;
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
    onClose: () => void;
    onSelectFood: (food: FoodItem) => void;
}

export default function FoodSelectionModal({ visible, mealType, onClose, onSelectFood }: FoodSelectionModalProps) {
    const { colors } = useTheme();
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

    const foods = FOOD_DATABASE[mealType] || [];

    const handleSelect = (food: FoodItem) => {
        setSelectedFood(food);
    };

    const handleAdd = () => {
        if (selectedFood) {
            onSelectFood(selectedFood);
            setSelectedFood(null);
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Add {mealType}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.foodList}>
                        {foods.map((food, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.foodItem,
                                    {
                                        backgroundColor: selectedFood?.name === food.name ? colors.success + '20' : colors.background,
                                        borderColor: selectedFood?.name === food.name ? colors.success : colors.border,
                                    }
                                ]}
                                onPress={() => handleSelect(food)}
                            >
                                <View style={styles.foodInfo}>
                                    <Text style={[styles.foodName, { color: colors.text }]}>{food.name}</Text>
                                    <Text style={[styles.foodMacros, { color: colors.textSecondary }]}>
                                        {food.calories} kcal · C: {food.carbs}g · P: {food.protein}g · F: {food.fat}g
                                    </Text>
                                </View>
                                {selectedFood?.name === food.name && (
                                    <Feather name="check-circle" size={20} color={colors.success} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { backgroundColor: colors.border }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.addButton,
                                {
                                    backgroundColor: selectedFood ? colors.success : colors.border,
                                    opacity: selectedFood ? 1 : 0.5
                                }
                            ]}
                            onPress={handleAdd}
                            disabled={!selectedFood}
                        >
                            <Text style={styles.addButtonText}>Add Food</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    foodList: {
        padding: 15,
    },
    foodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 2,
    },
    foodInfo: {
        flex: 1,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    foodMacros: {
        fontSize: 12,
    },
    footer: {
        flexDirection: 'row',
        padding: 15,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {},
    addButton: {},
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
