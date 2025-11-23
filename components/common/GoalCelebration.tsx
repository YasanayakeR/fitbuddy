import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';

interface GoalCelebrationProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    message?: string;
}

export default function GoalCelebration({ visible, onClose, title }: GoalCelebrationProps) {
    const { colors } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: -1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            const timer = setTimeout(() => {
                scaleAnim.setValue(0);
                rotateAnim.setValue(0);
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible, scaleAnim, rotateAnim, onClose]);

    const rotate = rotateAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-10deg', '10deg'],
    });

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            backgroundColor: colors.cardBackground,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
                            <Feather name="award" size={60} color={colors.success} />
                        </View>
                    </Animated.View>

                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
