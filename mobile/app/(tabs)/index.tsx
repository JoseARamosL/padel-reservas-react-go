import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

interface Pista {
    id: number;
    name: string;
    court_type: string;
    price_per_hour: number;
}

export default function HomeScreen() {
    const [pistas, setPistas] = useState<Pista[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            const loadData = async () => {
                try {
                    await checkLoginStatus();
                } catch (error) {
                    console.error("Error al verificar login:", error);
                }
            };
            loadData();
        }, [])
    );

    const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token);
    };

    const handleLogout = async () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Estás seguro de que quieres salir?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sí, salir",
                    onPress: async () => {
                        await AsyncStorage.removeItem('userToken');
                        setIsLoggedIn(false);
                        Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente");
                    }
                }
            ]
        );
    };

    React.useEffect(() => {
        fetch(`${API_URL}/courts`)
            .then(response => response.json())
            .then(data => {
                setPistas(data);
                setLoading(false);
            })
            .catch(error => console.error("Error al conectar:", error));
    }, []);

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🎾 Padel Pro</Text>

                <View style={styles.authButtonsWrapper}>
                    {isLoggedIn ? (
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.loginButtonText}>Salir</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => router.push('/login' as any)}
                            >
                                <Text style={styles.loginButtonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.loginButton, styles.registerButton]}
                                onPress={() => router.push('/register' as any)}
                            >
                                <Text style={styles.loginButtonText}>Registro</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            <FlatList
                data={pistas}
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.courtName}>{item.name}</Text>
                            <Text style={styles.courtType}>{item.court_type} • {item.price_per_hour}€/h</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.reserveButton}
                            onPress={() => router.push({
                                pathname: '/(tabs)/court_details',
                                params: { courtId: item.id.toString(), courtName: item.name }
                            })}
                        >
                            <Text style={styles.reserveButtonText}>Reservar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20' },
    authButtonsWrapper: { flexDirection: 'row', gap: 10 },
    loginButton: { backgroundColor: '#1b5e20', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
    registerButton: { backgroundColor: '#2e7d32' },
    logoutButton: { backgroundColor: '#c62828', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
    loginButtonText: { color: '#fff', fontWeight: 'bold' },
    list: { padding: 20 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
    },
    courtName: { fontSize: 18, fontWeight: 'bold' },
    courtType: { color: '#777', marginTop: 4 },
    reserveButton: { backgroundColor: '#4caf50', padding: 10, borderRadius: 8 },
    reserveButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});