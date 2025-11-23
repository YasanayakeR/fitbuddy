import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FoodItem {
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
}

export interface Meal {
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
    items: FoodItem[];
}

interface DietState {
    meals: Meal[];
    caloriesGoal: number;
    carbsGoal: number;
    proteinGoal: number;
    fatGoal: number;
}

const initialState: DietState = {
    meals: [
        { type: 'Breakfast', items: [] },
        { type: 'Lunch', items: [] },
        { type: 'Dinner', items: [] },
        { type: 'Snacks', items: [] },
    ],
    caloriesGoal: 2000,
    carbsGoal: 200,
    proteinGoal: 140,
    fatGoal: 65,
};

const DIET_STORAGE_KEY = '@diet_data';

export const loadDietData = createAsyncThunk('diet/loadData', async () => {
    try {
        const data = await AsyncStorage.getItem(DIET_STORAGE_KEY);
        return data ? JSON.parse(data) : initialState;
    } catch {
        return initialState;
    }
});

export const saveDietData = createAsyncThunk('diet/saveData', async (state: DietState) => {
    await AsyncStorage.setItem(DIET_STORAGE_KEY, JSON.stringify(state));
    return state;
});

const dietSlice = createSlice({
    name: 'diet',
    initialState,
    reducers: {
        addFoodItem: (state, action: PayloadAction<{ mealType: Meal['type']; food: FoodItem }>) => {
            const meal = state.meals.find(m => m.type === action.payload.mealType);
            if (meal) {
                meal.items.push(action.payload.food);
            }
        },
        removeFoodItem: (state, action: PayloadAction<{ mealType: Meal['type']; index: number }>) => {
            const meal = state.meals.find(m => m.type === action.payload.mealType);
            if (meal) {
                meal.items.splice(action.payload.index, 1);
            }
        },
        resetMeals: (state) => {
            state.meals.forEach(meal => {
                meal.items = [];
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadDietData.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { addFoodItem, removeFoodItem, resetMeals } = dietSlice.actions;
export default dietSlice.reducer;
