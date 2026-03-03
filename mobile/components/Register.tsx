import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Register = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '', name: '', surnames: '', phone: '' });
    const apiBase = process.env.EXPO_PUBLIC_API_URL;

    const handleRegister = async () => {
        if (!form.email || !form.password || !form.name || !form.surnames || !form.phone) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await fetch(`${apiBase}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registro exitoso');
                router.replace('/login');
            } else {
                alert(`Error en el registro: ${data.error || 'Inténtalo de nuevo'}`);
            }
        } catch (error) {
            console.error(error);
            alert('No se pudo conectar con el servidor.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Image source={require('../assets/images/padelodon.png')} style={styles.logo} />
                <Text style={styles.headerTitle}>Crear cuenta</Text>
                <Text style={styles.subTitle}>Únete a Padelodon y reserva tu pista</Text>

                <View style={styles.formCard}>
                    <TextInput placeholder="Correo electrónico" style={styles.input} placeholderTextColor="#888" keyboardType="email-address" autoCapitalize="none" onChangeText={(t) => setForm({...form, email: t})} />
                    <TextInput placeholder="Contraseña" style={styles.input} placeholderTextColor="#888" secureTextEntry onChangeText={(t) => setForm({...form, password: t})} />
                    <TextInput placeholder="Nombre" style={styles.input} placeholderTextColor="#888" onChangeText={(t) => setForm({...form, name: t})} />
                    <TextInput placeholder="Apellidos" style={styles.input} placeholderTextColor="#888" onChangeText={(t) => setForm({...form, surnames: t})} />
                    <TextInput placeholder="Teléfono" style={styles.input} placeholderTextColor="#888" keyboardType="phone-pad" onChangeText={(t) => setForm({...form, phone: t})} />

                    <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                        <Text style={styles.btnText}>Crear cuenta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.replace('/login')}>
                        <Text style={styles.loginLink}>¿Ya tienes cuenta? Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8' },
    scrollContent: { padding: 20 },
    logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 15, resizeMode: 'contain' },
    headerTitle: { fontSize: 26, fontWeight: '800', color: '#013247', textAlign: 'center', marginBottom: 5 },
    subTitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 25 },
    formCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        backgroundColor: '#f9f9f9',
        height: 50,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16
    },
    btn: {
        backgroundColor: '#013247',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    loginLink: { textAlign: 'center', marginTop: 20, color: '#00a8e8', fontWeight: '600' }
});

export default Register;