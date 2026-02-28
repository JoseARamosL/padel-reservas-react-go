import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const apiBase = process.env.EXPO_PUBLIC_API_URL;

    const handleLogin = async () => {
        try {
            const response = await fetch(`${apiBase}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('userToken', data.token);
                Alert.alert("¡Bienvenido!", "Has iniciado sesión correctamente");
                router.replace('/');
            } else {
                Alert.alert("Error", data.error || "Credenciales incorrectas");
            }
        } catch (err) {
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formCard}>
                <Image source={require('../assets/images/padelodon.png')} style={styles.logo} />
                <Text style={styles.title}>Iniciar Sesión</Text>

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Contraseña"
                    style={styles.input}
                    secureTextEntry
                    placeholderTextColor="#888"
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                    <Text style={styles.btnText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>Volver</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8', justifyContent: 'center', padding: 20 },
    formCard: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1
    },
    logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 20, resizeMode: 'contain' },
    title: { fontSize: 24, fontWeight: '800', color: '#013247', marginBottom: 30, textAlign: 'center' },
    input: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 15,
        fontSize: 16
    },
    btn: { backgroundColor: '#013247', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    backText: { textAlign: 'center', marginTop: 20, color: '#00a8e8', fontWeight: '600' }
});

export default Login;