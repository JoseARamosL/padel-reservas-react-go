// app/tabs/court_details.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BookingGrid from '../../components/BookingGrid'; // Ajusta la ruta a donde guardaste el grid

export default function CourtDetails() {
    const { courtId, courtName } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{courtName}</Text>
            {/* Aquí cargamos el componente que hicimos antes */}
            <BookingGrid courtId={Number(courtId)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 }
});