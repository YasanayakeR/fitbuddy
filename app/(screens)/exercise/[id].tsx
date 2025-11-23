import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { toggleFavourite } from '@/redux/slices/exercisesSlice';
import { AppDispatch, RootState } from '@/redux/store';

export default function ExerciseDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { items, favourites } = useSelector((state: RootState) => state.exercises);

    const exerciseName = decodeURIComponent(id as string);

    // Find exercise in items or favourites (in case it's only in favourites and not in current items list)
    const exercise = useMemo(() => {
        return items.find(e => e.name === exerciseName) || favourites.find(e => e.name === exerciseName);
    }, [items, favourites, exerciseName]);

    const isFavourite = useMemo(() => {
        return favourites.some(e => e.name === exerciseName);
    }, [favourites, exerciseName]);

    const handleToggleFavourite = () => {
        if (exercise) {
            dispatch(toggleFavourite(exercise));
        }
    };

    if (!exercise) {
        return (
            <View style={styles.center}>
                <Text>Exercise not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Feather name="activity" size={60} color="#4CAF50" />
                    </View>
                    <Text style={styles.title}>{exercise.name}</Text>
                    <View style={styles.badges}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{exercise.difficulty}</Text>
                        </View>
                        <View style={[styles.badge, styles.muscleBadge]}>
                            <Text style={styles.badgeText}>{exercise.muscle}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Type</Text>
                    <Text style={styles.sectionText}>{exercise.type}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Equipment</Text>
                    <Text style={styles.sectionText}>{exercise.equipment}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <Text style={styles.sectionText}>{exercise.instructions}</Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.favButton, isFavourite && styles.favButtonActive]}
                    onPress={handleToggleFavourite}
                >
                    <Feather
                        name="heart"
                        size={24}
                        color={isFavourite ? "#fff" : "#4CAF50"}
                    />
                    <Text style={[styles.favButtonText, isFavourite && styles.favButtonTextActive]}>
                        {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
        textTransform: 'capitalize',
    },
    badges: {
        flexDirection: 'row',
        gap: 10,
    },
    badge: {
        backgroundColor: '#FFC107',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    muscleBadge: {
        backgroundColor: '#2196F3',
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    sectionText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        textTransform: 'capitalize',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    favButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#4CAF50',
        padding: 15,
        borderRadius: 12,
    },
    favButtonActive: {
        backgroundColor: '#4CAF50',
    },
    favButtonText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    favButtonTextActive: {
        color: '#fff',
    },
    backButton: {
        marginTop: 20,
        padding: 10,
    },
    backButtonText: {
        color: '#2196F3',
        fontSize: 16,
    },
});
