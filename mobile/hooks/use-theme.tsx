import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    colorScheme: Theme;
    setColorScheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const deviceScheme = useDeviceColorScheme();
    const [colorScheme, setColorSchemeState] = useState<Theme>(deviceScheme || 'light');

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('theme') as Theme | null;
            if (savedTheme) {
                setColorSchemeState(savedTheme);
            }
        };
        loadTheme();
    }, []);

    const setColorScheme = async (theme: Theme) => {
        setColorSchemeState(theme);
        await AsyncStorage.setItem('theme', theme);
    };

    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
