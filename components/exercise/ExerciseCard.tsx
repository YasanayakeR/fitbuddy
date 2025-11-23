import { useTheme } from '@/context/ThemeContext';
import { Exercise } from '@/redux/slices/exercisesSlice';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExerciseCardProps {
    exercise: Exercise;
    onPress: () => void;
}

export default function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
    const { theme } = useTheme();
    const scaleValue = React.useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '#4CAF50';
            case 'intermediate': return '#FFC107';
            case 'expert': return '#F44336';
            default: return '#999';
        }
    };

    const iconColor = theme === 'dark' ? '#81C784' : '#4CAF50';
    const iconBgColor = theme === 'dark' ? '#2E3B2F' : '#E8F5E9';

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Animated.View style={[
                styles.card,
                theme === 'dark' && styles.darkCard,
                { transform: [{ scale: scaleValue }] }
            ]}>
                <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                    <View style={styles.dumbbell}>
                        <View style={[styles.dumbbellEnd, { backgroundColor: iconColor }]} />
                        <View style={[styles.dumbbellBar, { backgroundColor: iconColor }]} />
                        <View style={[styles.dumbbellEnd, { backgroundColor: iconColor }]} />
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, theme === 'dark' && styles.darkText]}>{exercise.name}</Text>
                    <View style={styles.details}>
                        <Text style={[styles.detailText, theme === 'dark' && styles.darkDetailText]}>
                            <Feather name="zap" size={12} /> {exercise.muscle}
                        </Text>
                        <View style={[styles.badge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                            <Text style={styles.badgeText}>{exercise.difficulty}</Text>
                        </View>
                    </View>
                </View>
                <Feather name="chevron-right" size={24} color={theme === 'dark' ? '#666' : '#ccc'} />
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    darkCard: {
        backgroundColor: '#1E1E1E',
        borderColor: '#333',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    dumbbell: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dumbbellEnd: {
        width: 8,
        height: 16,
        borderRadius: 2,
    },
    dumbbellBar: {
        width: 16,
        height: 4,
        marginHorizontal: 1,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#2E3B2F',
    },
    type: {
        fontSize: 12,
        textTransform: 'capitalize',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
        textTransform: 'capitalize',
        letterSpacing: 0.3,
    },
    darkText: {
        color: '#E0E0E0',
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 13,
        color: '#666',
        marginRight: 12,
        textTransform: 'capitalize',
    },
    darkDetailText: {
        color: '#aaa',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
});
