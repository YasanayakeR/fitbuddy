import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TIPS = [
    "Drink water before every meal to stay hydrated.",
    "Take a 5-minute stretch break every hour.",
    "Get at least 7-8 hours of sleep for recovery.",
    "Eat more leafy greens for better digestion.",
    "Practice deep breathing to reduce stress.",
    "Walk for 30 minutes daily to improve heart health.",
    "Limit sugar intake for better energy levels.",
    "Listen to your body and rest when needed."
];

interface WellnessTipsProps {
    mode?: 'widget' | 'full';
}

export default function WellnessTips({ mode = 'widget' }: WellnessTipsProps) {
    const [tip, setTip] = useState('');
    const { colors } = useTheme();
    const router = useRouter();

    useEffect(() => {
        // Set random tip on mount
        setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    }, []);

    const refreshTip = () => {
        let newTip;
        do {
            newTip = TIPS[Math.floor(Math.random() * TIPS.length)];
        } while (newTip === tip);
        setTip(newTip);
    };

    if (mode === 'widget') {
        return (
            <TouchableOpacity
                onPress={() => router.push('/wellness')}
                style={[styles.widgetContainer, { backgroundColor: colors.cardBackground }]}
            >
                <ImageBackground
                    source={require('@/assets/images/wellness_bg.png')}
                    style={styles.widgetBackground}
                    imageStyle={{ borderRadius: 16, opacity: 0.1 }}
                >
                    <View style={styles.widgetHeader}>
                        <View style={[styles.iconBg, { backgroundColor: colors.warning + '20' }]}>
                            <Feather name="sun" size={20} color={colors.warning} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.widgetTitle, { color: colors.text }]}>Daily Tip</Text>
                            <Text numberOfLines={1} style={[styles.widgetSubtitle, { color: colors.textSecondary }]}>
                                {tip}
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
            <ImageBackground
                source={require('@/assets/images/wellness_bg.png')}
                style={styles.fullBackground}
                imageStyle={{ borderRadius: 16, opacity: 0.1 }}
            >
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Feather name="sun" size={20} color={colors.warning} />
                        <Text style={[styles.title, { color: colors.text }]}>Wellness Tip</Text>
                    </View>
                    <TouchableOpacity onPress={refreshTip}>
                        <Feather name="refresh-cw" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.tipText, { color: colors.textSecondary }]}>"{tip}"</Text>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    fullBackground: {
        padding: 20,
    },
    widgetContainer: {
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    widgetBackground: {
        padding: 15,
        borderRadius: 16,
    },
    widgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    widgetTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    widgetSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tipText: {
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 20,
    },
});
