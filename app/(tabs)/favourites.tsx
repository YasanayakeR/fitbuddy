import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import ExerciseCard from '@/components/exercise/ExerciseCard';
import { Exercise, loadFavourites } from '@/redux/slices/exercisesSlice';
import { AppDispatch, RootState } from '@/redux/store';

export default function FavouritesScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { favourites } = useSelector((state: RootState) => state.exercises);
    const router = useRouter();

    useEffect(() => {
        dispatch(loadFavourites());
    }, [dispatch]);

    const handlePress = (exercise: Exercise) => {
        router.push(`/exercise/${encodeURIComponent(exercise.name)}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Favourites</Text>
            </View>

            {favourites.length === 0 ? (
                <View style={styles.emptyState}>
                    <Feather name="heart" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>No favourites yet</Text>
                    <Text style={styles.emptySubtext}>Mark exercises as favourite to see them here.</Text>
                </View>
            ) : (
                <FlatList
                    data={favourites}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <ExerciseCard exercise={item} onPress={() => handlePress(item)} />
                    )}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    list: {
        padding: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 10,
        textAlign: 'center',
    },
});
