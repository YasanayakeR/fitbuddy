import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WaterState {
    currentAmount: number;
    dailyGoal: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: WaterState = {
    currentAmount: 0,
    dailyGoal: 2000,
    status: 'idle',
};

export const loadWaterData = createAsyncThunk(
    'water/loadWaterData',
    async () => {
        const today = new Date().toISOString().split('T')[0];
        const jsonValue = await AsyncStorage.getItem(`@water_${today}`);
        return jsonValue != null ? JSON.parse(jsonValue) : 0;
    }
);

const waterSlice = createSlice({
    name: 'water',
    initialState,
    reducers: {
        addWater: (state, action: PayloadAction<number>) => {
            state.currentAmount = Math.min(state.currentAmount + action.payload, state.dailyGoal);
            const today = new Date().toISOString().split('T')[0];
            AsyncStorage.setItem(`@water_${today}`, JSON.stringify(state.currentAmount));
        },
        decreaseWater: (state, action: PayloadAction<number>) => {
            state.currentAmount = Math.max(state.currentAmount - action.payload, 0);
            const today = new Date().toISOString().split('T')[0];
            AsyncStorage.setItem(`@water_${today}`, JSON.stringify(state.currentAmount));
        },
        resetWater: (state) => {
            state.currentAmount = 0;
            const today = new Date().toISOString().split('T')[0];
            AsyncStorage.setItem(`@water_${today}`, JSON.stringify(0));
        },
        setGoal: (state, action: PayloadAction<number>) => {
            state.dailyGoal = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadWaterData.fulfilled, (state, action) => {
                state.currentAmount = action.payload;
                state.status = 'succeeded';
            });
    },
});

export const { addWater, decreaseWater, resetWater, setGoal } = waterSlice.actions;
export default waterSlice.reducer;
