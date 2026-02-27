import React, { useState, useEffect } from 'react';
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
  console.log("API_URL", API_URL);
  const router = useRouter();

  // Comprobamos el estado del login cada vez que la pantalla gana el foco
  useFocusEffect(
      React.useCallback(() => {
        // Definimos una función interna para manejar la promesa
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
              // Opcional: mostrar un mensaje breve
              Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente");
            }
          }
        ]
    );
  };

  useEffect(() => {
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

          {isLoggedIn && (
              <Text style={styles.welcomeText}>¡Hola de nuevo!</Text>
          )}

          {/* Botón dinámico según estado de sesión */}
          {isLoggedIn ? (
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.loginButtonText}>Salir</Text>
              </TouchableOpacity>
          ) : (
              <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => router.push('/login' as any)}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
          )}
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
  loginButton: { backgroundColor: '#1b5e20', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  logoutButton: { backgroundColor: '#c62828', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  loginButtonText: { color: '#fff', fontWeight: 'bold' },
  list: { padding: 20 },
  welcomeText: { fontSize: 14, color: '#4caf50', marginBottom: 5 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courtName: { fontSize: 18, fontWeight: 'bold' },
  courtType: { color: '#777', marginTop: 4 },
  reserveButton: { backgroundColor: '#4caf50', padding: 10, borderRadius: 8 },
  reserveButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});