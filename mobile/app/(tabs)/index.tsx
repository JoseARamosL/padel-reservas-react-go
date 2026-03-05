import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener expo/vector-icons instalado

export default function HomeScreen() {
    const [pistas, setPistas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuVisible, setMenuVisible] = useState(false);
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const router = useRouter();

    useFocusEffect(React.useCallback(() => {
        const load = async () => {
            const token = await AsyncStorage.getItem('userToken');
            setIsLoggedIn(!!token);
            fetch(`${API_URL}/courts`)
                .then(res => res.json())
                .then(data => { setPistas(data); setLoading(false); })
                .catch(console.error);
        };
        load();
    }, [API_URL]));

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        setIsLoggedIn(false);
        setMenuVisible(false);
    };

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Limpio */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/images/padelodon.png')} style={styles.logo} />
                    <View>
                        <Text style={styles.welcomeText}>¡Bienvenido a</Text>
                        <Text style={styles.brandText}>Padelodon!</Text>
                    </View>
                </View>

                {/* Botón de Menú Hamburguesa */}
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Ionicons name="menu" size={30} color="#013247" />
                </TouchableOpacity>
            </View>

            {/* Modal de Menú */}
            <Modal visible={isMenuVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.menuContent}>
                    {isLoggedIn ? (
                        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                            <Text style={styles.menuTextLogout}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/login' as any); }}>
                                <Text style={styles.menuText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/register' as any); }}>
                                <Text style={styles.menuText}>Registro</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </Modal>

            <FlatList
                data={pistas}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View><Text style={styles.courtName}>{item.name}</Text><Text style={styles.courtType}>{item.court_type}</Text></View>
                        <TouchableOpacity style={styles.reserveButton} onPress={() => router.push({ pathname: '/(tabs)/court_details', params: { courtId: item.id.toString(), courtName: item.name } })}>
                            <Text style={styles.reserveButtonText}>Reservar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8' },
    header: { padding: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    logo: { width: 50, height: 50, resizeMode: 'contain', marginRight: 10 },
    welcomeText: { fontSize: 12, color: '#666' },
    brandText: { fontSize: 18, fontWeight: 'bold', color: '#013247' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
    menuContent: { position: 'absolute', top: 80, right: 20, backgroundColor: '#fff', borderRadius: 15, padding: 10, width: 150, elevation: 5 },
    menuItem: { padding: 15 },
    menuText: { fontSize: 16, color: '#013247', fontWeight: '600' },
    menuTextLogout: { fontSize: 16, color: '#ff5252', fontWeight: '600' },
    list: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    courtName: { fontSize: 16, fontWeight: '800', color: '#013247' },
    courtType: { color: '#666', marginTop: 4 },
    reserveButton: { backgroundColor: '#00a8e8', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15 },
    reserveButtonText: { color: '#fff', fontWeight: 'bold' }
});