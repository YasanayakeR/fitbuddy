import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import ExerciseCard from '@/components/exercise/ExerciseCard';
import DietTracker from '@/components/nutrition/DietTracker';
import WaterTracker from '@/components/wellness/WaterTracker';
import WellnessTips from '@/components/wellness/WellnessTips';
import { Exercise, fetchExercises } from '@/redux/slices/exercisesSlice';
import { AppDispatch, RootState } from '@/redux/store';

import { logoutUser } from '@/redux/slices/authSlice';

import { useTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.exercises);
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExercises());
    }
  }, [status, dispatch]);

  const handlePress = (exercise: Exercise) => {
    router.push(`/exercise/${encodeURIComponent(exercise.name)}`);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (status === 'loading') {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Error: {error}</Text>
        <Feather name="alert-circle" size={40} color={colors.error} />
      </View>
    );
  }

  const ListHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.widgetsContainer}>
        <WaterTracker mode="widget" />
        <WellnessTips mode="widget" />
        <DietTracker mode="widget" />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello, {user?.name || 'User'}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Let's workout today!</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <Feather name="log-out" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <ExerciseCard exercise={item} onPress={() => handlePress(item)} />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  iconButton: {
    padding: 5,
  },
  list: {
    padding: 20,
  },
  headerContent: {
    marginBottom: 10,
  },
  widgetsContainer: {
    flexDirection: 'column',
    gap: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  errorText: {
    marginBottom: 10,
  },
});
