import WellnessTips from '@/components/wellness/WellnessTips';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WellnessScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

    const WELLNESS_DATA = {
        Nutrition: {
            icon: 'coffee',
            tips: [
                "Eat a variety of foods to ensure you get all necessary nutrients.",
                "Limit processed foods and sugary drinks.",
                "Include protein in every meal to support muscle repair.",
                "Eat plenty of fruits and vegetables for vitamins and fiber.",
                "Stay hydrated! Water is essential for digestion and energy."
            ]
        },
        Sleep: {
            icon: 'moon',
            tips: [
                "Stick to a consistent sleep schedule, even on weekends.",
                "Create a relaxing bedtime routine to wind down.",
                "Avoid screens (phones, tablets) at least an hour before bed.",
                "Keep your bedroom cool, dark, and quiet.",
                "Limit caffeine and heavy meals in the evening."
            ]
        },
        Mindfulness: {
            icon: 'sun',
            tips: [
                "Practice deep breathing exercises for 5 minutes daily.",
                "Take short breaks during work to clear your mind.",
                "Spend time in nature to reduce stress levels.",
                "Practice gratitude by listing 3 things you're thankful for.",
                "Focus on the present moment rather than worrying about the future."
            ]
        },
        Recovery: {
            icon: 'activity',
            tips: [
                "Stretch after every workout to improve flexibility.",
                "Take rest days to allow your muscles to repair.",
                "Use foam rolling to release muscle tension.",
                "Get a massage or take a warm bath to relax muscles.",
                "Listen to your body; if it hurts, rest."
            ]
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Wellness</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <WellnessTips mode="full" />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>

                <View style={styles.grid}>
                    {Object.entries(WELLNESS_DATA).map(([category, data]) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryCard,
                                {
                                    backgroundColor: selectedCategory === category ? colors.success : colors.cardBackground,
                                    borderColor: selectedCategory === category ? colors.success : 'transparent',
                                    borderWidth: 1
                                }
                            ]}
                            onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
                        >
                            <View style={[
                                styles.iconCircle,
                                { backgroundColor: selectedCategory === category ? 'rgba(255,255,255,0.2)' : colors.success + '20' }
                            ]}>
                                <Feather
                                    name={data.icon as any}
                                    size={24}
                                    color={selectedCategory === category ? '#fff' : colors.success}
                                />
                            </View>
                            <Text style={[
                                styles.categoryText,
                                { color: selectedCategory === category ? '#fff' : colors.text }
                            ]}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {selectedCategory && (
                    <View style={[styles.tipsContainer, { backgroundColor: colors.cardBackground }]}>
                        <ImageBackground
                            source={require('@/assets/images/wellness_bg.png')}
                            style={styles.tipsBackground}
                            imageStyle={{ borderRadius: 16, opacity: 0.1 }}
                        >
                            <Text style={[styles.tipsHeader, { color: colors.text }]}>
                                {selectedCategory} Tips
                            </Text>
                            {WELLNESS_DATA[selectedCategory as keyof typeof WELLNESS_DATA].tips.map((tip, index) => (
                                <View key={index} style={styles.tipItem}>
                                    <Feather name="check-circle" size={16} color={colors.success} style={{ marginTop: 2 }} />
                                    <Text style={[styles.tipText, { color: colors.textSecondary }]}>{tip}</Text>
                                </View>
                            ))}
                        </ImageBackground>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    categoryCard: {
        width: '47%',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    categoryText: {
        fontWeight: '600',
    },
    tipsContainer: {
        marginTop: 25,
        borderRadius: 16,
        overflow: 'hidden',
    },
    tipsBackground: {
        padding: 20,
    },
    tipsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    tipItem: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});
