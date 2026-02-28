import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // <--- ¡Asegúrate de incluir TouchableOpacity aquí!
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BookingGrid from '../../components/BookingGrid';

export default function CourtDetails() {
    const { courtId, courtName } = useLocalSearchParams();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Botón de volver */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#013247" />
                <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{courtName}</Text>

            <View style={styles.gridWrapper}>
                <BookingGrid courtId={Number(courtId)} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8' },
    backButton: { flexDirection: 'row', alignItems: 'center', padding: 20, marginBottom: 10 },
    backText: { marginLeft: 5, color: '#013247', fontWeight: '600' },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#013247',
        paddingHorizontal: 20,
        marginBottom: 10
    },
    gridWrapper: { flex: 1 }
});