import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, name }: { email: string; password: string; name?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!email || !password) {
      throw new Error('Invalid credentials');
    }

    const storedUser = await SecureStore.getItemAsync('user');
    let userName = name || email.split('@')[0];

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.email === email) {
        userName = parsed.name || userName;
      }
    }

    const token = 'dummy-jwt-token';
    const user = { email, name: userName };

    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));

    return { token, user };
  }
);

export const restoreUser = createAsyncThunk(
  'auth/restore',
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userData = await SecureStore.getItemAsync('userData');

      if (token && userData) {
        return { token, user: JSON.parse(userData) };
      } else {
        return rejectWithValue('No user found');
      }
    } catch (error) {
      return rejectWithValue('Failed to restore user');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(restoreUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(restoreUser.rejected, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
