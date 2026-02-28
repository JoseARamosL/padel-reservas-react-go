import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    courtId: number;
}

interface Slot {
    id: number;
    start_time: string;
    end_time: string;
    available: boolean;
}

const BookingGrid: React.FC<Props> = ({ courtId }) => {
    const [slots, setSlots] = useState<Slot[]>([]);
    const apiBase = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${apiBase}/api/reservations/availability?court_id=${courtId}&date=${new Date().toISOString().split('T')[0]}`)
            .then(res => res.json())
            .then(data => setSlots(data))
            .catch(console.error);
    }, [courtId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Horarios Disponibles</Text>

            <FlatList
                key="booking-list-linear"
                data={slots}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.item, !item.available && styles.itemDisabled]}
                        disabled={!item.available}
                        onPress={() => Alert.alert("Reservar", `Confirmar reserva: ${item.start_time} - ${item.end_time}`)}
                    >
                        <View style={styles.timeContainer}>
                            <Ionicons
                                name={item.available ? "time-outline" : "lock-closed-outline"}
                                size={22}
                                color={item.available ? "#013247" : "#aaa"}
                            />
                            <Text style={[styles.timeRange, !item.available && styles.disabledText]}>
                                {item.start_time} - {item.end_time}
                            </Text>
                        </View>

                        <View style={[styles.statusBadge, { backgroundColor: item.available ? '#e3f2fd' : '#f5f5f5' }]}>
                            <Text style={[styles.statusText, { color: item.available ? '#00a8e8' : '#aaa' }]}>
                                {item.available ? "Disponible" : "Ocupado"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20 // Esto evita que se pegue al título o header superior
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#013247',
        marginBottom: 20
    },
    listContent: {
        paddingBottom: 40 // Espacio extra para que el último elemento no toque el borde inferior
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        // Sombra sutil para un toque moderno
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    itemDisabled: {
        backgroundColor: '#f9f9f9',
        borderColor: '#eee'
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    timeRange: {
        fontSize: 16,
        fontWeight: '700',
        color: '#013247'
    },
    disabledText: { color: '#aaa' },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold'
    }
});

export default BookingGrid;