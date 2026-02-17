import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTours, deleteTour, Tour, getProfile } from '../services/db';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ToursStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<ToursStackParamList, 'ToursList'>;

export default function ToursScreen({ navigation }: Props) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadTours = async () => {
    try {
      setLoading(true);
      const data = await getTours();
      setTours(data);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error cargando tours');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTours();

      // Obtener el usuario logueado
      const fetchUser = async () => {
        const profile = await getProfile();
        setCurrentUserId(profile?.id || null);
      };
      fetchUser();
    }, [])
  );

  const onDelete = async (id: string) => {
    try {
      await deleteTour(id);
      loadTours();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error eliminando tour');
    }
  };

  const renderTour = ({ item }: { item: Tour }) => {
    const isOwner = currentUserId === item.user_id; // Solo el creador puede editar/eliminar

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>

        <View style={styles.buttonRow}>
          {isOwner && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => navigation.navigate('TourForm', { tour: item, isUpdate: true })}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => onDelete(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.button, styles.viewButton]}
            onPress={() => navigation.navigate('StopsList', { tourId: item.id })}
          >
            <Text style={styles.buttonText}>Stops</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando tours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tours</Text>

      <FlatList
        data={tours}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTour}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('TourForm')}
      >
        <Text style={styles.createButtonText}>Crear Tour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center', color: '#0f172a' },

  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: '#334155', marginBottom: 10 },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },

  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 2,
  },

  editButton: { backgroundColor: '#2563eb' },
  deleteButton: { backgroundColor: '#ef4444' },
  viewButton: { backgroundColor: '#10b981' },

  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  createButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});
