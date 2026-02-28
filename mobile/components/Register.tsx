import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const Register = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '', name: '', surnames: '', phone: '' });
    const apiBase = process.env.EXPO_PUBLIC_API_URL;

    const handleRegister = async () => { /* ... lógica igual ... */ };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.headerTitle}>¡Únete a Padel Pro!</Text>
                <Text style={styles.subTitle}>Crea tu cuenta para reservar pistas</Text>

                <View style={styles.formCard}>
                    <TextInput
                        placeholder="Correo electrónico"
                        style={styles.input}
                        placeholderTextColor="#888" // Color gris oscuro para que sea visible
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(t) => setForm({...form, email: t})}
                    />
                    <TextInput
                        placeholder="Contraseña"
                        style={styles.input}
                        placeholderTextColor="#888"
                        secureTextEntry
                        onChangeText={(t) => setForm({...form, password: t})}
                    />
                    <TextInput
                        placeholder="Nombre"
                        style={styles.input}
                        placeholderTextColor="#888"
                        onChangeText={(t) => setForm({...form, name: t})}
                    />
                    <TextInput
                        placeholder="Apellidos"
                        style={styles.input}
                        placeholderTextColor="#888"
                        onChangeText={(t) => setForm({...form, surnames: t})}
                    />
                    <TextInput
                        placeholder="Teléfono"
                        style={styles.input}
                        placeholderTextColor="#888"
                        keyboardType="phone-pad"
                        onChangeText={(t) => setForm({...form, phone: t})}
                    />

                    <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                        <Text style={styles.btnText}>Crear cuenta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/login')}>
                        <Text style={styles.loginLink}>¿Ya tienes cuenta? Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#1b5e20', marginTop: 40, marginBottom: 10 },
    subTitle: { fontSize: 16, color: '#666', marginBottom: 30 },
    formCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        backgroundColor: '#ffffff', // Fondo blanco para más contraste
        height: 50,                 // Altura definida
        paddingHorizontal: 15,      // Espacio lateral
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1.5,           // Un poco más grueso para que se vea el borde
        borderColor: '#d1d1d1',     // Gris más oscuro para mejor contraste
        fontSize: 16                // Aseguramos un tamaño legible
    },
    btn: {
        backgroundColor: '#1b5e20',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    loginLink: { textAlign: 'center', marginTop: 20, color: '#1b5e20', fontWeight: '600' }
});

export default Register;