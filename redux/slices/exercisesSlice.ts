import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Exercise {
    name: string;
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
}

interface ExercisesState {
    items: Exercise[];
    favourites: Exercise[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ExercisesState = {
    items: [],
    favourites: [],
    status: 'idle',
    error: null,
};


export const fetchExercises = createAsyncThunk(
    'exercises/fetchExercises',
    async (muscle?: string) => {
        try {
            const response = await axios.get('https://api.api-ninjas.com/v1/exercises', {
                headers: {
                    'X-Api-Key': process.env.EXPO_PUBLIC_API_NINJAS_KEY,
                },
                params: {
                    muscle: muscle || 'biceps',
                }
            });
            return response.data as Exercise[];
        } catch (error) {
            throw error;
        }
    }
);

export const loadFavourites = createAsyncThunk(
    'exercises/loadFavourites',
    async () => {
        const jsonValue = await AsyncStorage.getItem('@favourites');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    }
);

const exercisesSlice = createSlice({
    name: 'exercises',
    initialState,
    reducers: {
        toggleFavourite: (state, action: PayloadAction<Exercise>) => {
            const exercise = action.payload;
            const existingIndex = state.favourites.findIndex(f => f.name === exercise.name);

            if (existingIndex >= 0) {
                state.favourites.splice(existingIndex, 1);
            } else {
                state.favourites.push(exercise);
            }

            AsyncStorage.setItem('@favourites', JSON.stringify(state.favourites));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExercises.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchExercises.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchExercises.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(loadFavourites.fulfilled, (state, action) => {
                state.favourites = action.payload;
            });
    },
});

export const { toggleFavourite } = exercisesSlice.actions;
export default exercisesSlice.reducer;
