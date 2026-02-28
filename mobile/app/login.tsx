import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                // GUARDAMOS EL TOKEN
                await AsyncStorage.setItem('userToken', data.token);
                Alert.alert("¡Bienvenido!", "Has iniciado sesión correctamente");
                router.replace('/'); // Volvemos al home
            } else {
                Alert.alert("Error", data.error || "Credenciales incorrectas");
            }
        } catch (err) {
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#757575"
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Contraseña"
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#757575"
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                <Text style={styles.btnText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f9f9f9' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1b5e20', marginBottom: 30, textAlign: 'center' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 15 },
    btn: { backgroundColor: '#1b5e20', padding: 18, borderRadius: 12, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold' }
});

export default Login;