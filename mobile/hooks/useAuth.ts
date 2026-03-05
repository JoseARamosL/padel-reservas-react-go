import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: number;
    name: string | null;
    surnames: string | null;
    email: string;
    phone: string | null;
}

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            const checkUser = async () => {
                const userString = await AsyncStorage.getItem('user');
                if (userString) {
                    const userData = JSON.parse(userString);
                    setUser(userData);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            };
            checkUser();
        }, [])
    );

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        router.push('/login');
    };

    return { isLoggedIn, user, logout };
};
