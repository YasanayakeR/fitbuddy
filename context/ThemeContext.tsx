import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    colors: typeof Colors.light;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    colors: Colors.light,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState<Theme>(systemScheme === 'dark' ? 'dark' : 'light');

    useEffect(() => {
        AsyncStorage.getItem('userTheme').then((savedTheme) => {
            if (savedTheme) {
                setTheme(savedTheme as Theme);
            }
        });
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        AsyncStorage.setItem('userTheme', newTheme);
    };

    const colors = Colors[theme];

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
