import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';

// 1. Datos de prueba (Luego vendrán de nuestro Backend en Go)
const PISTAS_EJEMPLO = [
  { id: '1', nombre: 'Pista Central', tipo: 'Cristal', precio: '20€/h', disponible: true },
  { id: '2', nombre: 'Pista 2', tipo: 'Muro', precio: '15€/h', disponible: false },
  { id: '3', nombre: 'Pista 3', tipo: 'Cristal', precio: '20€/h', disponible: true },
];

export default function HomeScreen() {

  // 2. Componente para cada tarjeta de pista
  const renderItem = ({ item }: { item: typeof PISTAS_EJEMPLO[0] }) => (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.courtName}>{item.nombre}</Text>
          <Text style={styles.courtType}>{item.tipo} • {item.precio}</Text>
        </View>

        <TouchableOpacity
            style={[styles.button, { backgroundColor: item.disponible ? '#2e7d32' : '#9e9e9e' }]}
            disabled={!item.disponible}
        >
          <Text style={styles.buttonText}>
            {item.disponible ? 'Reservar' : 'Ocupada'}
          </Text>
        </TouchableOpacity>
      </View>
  );

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎾 Padel Pro</Text>
          <Text style={styles.subtitle}>Reserva tu próxima victoria</Text>
        </View>

        <FlatList
            data={PISTAS_EJEMPLO}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
        />
      </View>
  );
}

// 3. Estilos (Layout y Diseño)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Sombra para Android
    elevation: 3,
  },
  cardInfo: {
    flex: 1,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  courtType: {
    color: '#777',
    marginTop: 4,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});