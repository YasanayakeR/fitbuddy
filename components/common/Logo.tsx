import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Logo() {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.outerCircle, { borderColor: colors.success + '40' }]}>
                <View style={[styles.innerCircle, { backgroundColor: colors.success + '20' }]}>
                    <View style={styles.dumbbell}>
                        <View style={[styles.dumbbellEnd, { backgroundColor: colors.success }]} />
                        <View style={[styles.dumbbellBar, { backgroundColor: colors.success }]} />
                        <View style={[styles.dumbbellEnd, { backgroundColor: colors.success }]} />
                    </View>
                    <View style={[styles.heartBadge, { backgroundColor: colors.cardBackground }]}>
                        <Feather name="heart" size={16} color={colors.secondary} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    outerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
    },
    innerCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dumbbell: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dumbbellEnd: {
        width: 16,
        height: 32,
        borderRadius: 4,
    },
    dumbbellBar: {
        width: 30,
        height: 8,
        marginHorizontal: 2,
    },
});
