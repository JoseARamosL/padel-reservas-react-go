import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import './BookingGrid.css'

interface Props {
    courtId: number;
}

interface Slot {
    id: number;
    time: string;
    available: boolean;
}

const BookingGrid: React.FC<Props> = ({ courtId }) => {
    const [slots, setSlots] = useState<Slot[]>([]);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        // Asegúrate de que API_URL esté definido aquí también
        fetch(`TU_URL_API/api/reservations/availability?court_id=${courtId}&date=${today}`)
            .then(res => res.json())
            .then(data => setSlots(data))
            .catch(err => console.error(err));
    }, [courtId]);

    return (
        <View style={styles.gridContainer}>
            <Text style={styles.title}>Horarios de hoy</Text>
            <View style={styles.slotsWrapper}>
                {slots.map((slot) => (
                    <TouchableOpacity
                        key={slot.id}
                        style={[styles.slotBtn, { backgroundColor: slot.available ? '#28a745' : '#dc3545' }]}
                        disabled={!slot.available}
                        onPress={() => Alert.alert("Reservando", `Hora: ${slot.time}`)}
                    >
                        <Text style={styles.btnText}>{slot.time}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: { padding: 10 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    slotsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    slotBtn: { width: '30%', padding: 15, borderRadius: 8, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold' }
});

export default BookingGrid;