import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dietReducer from './slices/dietSlice';
import exercisesReducer from './slices/exercisesSlice';
import waterReducer from './slices/waterSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        exercises: exercisesReducer,
        water: waterReducer,
        diet: dietReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
