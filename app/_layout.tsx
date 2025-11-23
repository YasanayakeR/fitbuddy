import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { restoreUser } from '@/redux/slices/authSlice';
import { AppDispatch, RootState, store } from '@/redux/store';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider, useDispatch, useSelector } from 'react-redux';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { theme } = useTheme();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;

    const isLoginPage = segments[0] === '(auth)' && segments[1] === 'login';
    const isRegisterPage = segments[0] === '(auth)' && segments[1] === 'register';
    const isAuthRoute = isLoginPage || isRegisterPage;

    if (!user && !isAuthRoute) {
      // Redirect to login if not authenticated and not on an auth page
      router.replace('/(auth)/login');
    } else if (user && isAuthRoute) {
      // Redirect to home if authenticated and on an auth page
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="(screens)/exercise/[id]" options={{ title: 'Exercise Details' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </Provider>
  );
}
