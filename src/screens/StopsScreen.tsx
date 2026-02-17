import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { deleteStop, getProfile, getStops, getTour, Stop, Tour } from '../services/db';
import { ToursStackParamList } from '../types/navigation';
import { generateTourPDF } from '../services/pdf';

type Props = NativeStackScreenProps<ToursStackParamList, 'StopsList'>;

export default function StopsScreen({ route, navigation }: Props) {
  const { tourId } = route.params;
  const [stops, setStops] = useState<Stop[]>([]);
  const [speakingStopId, setSpeakingStopId] = useState<string | null>(null);
  const [tourOwnerId, setTourOwnerId] = useState<string | undefined>(undefined);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfile();
      setCurrentUserId(profile?.id);
    };
    fetchProfile();
  }, []);

  const loadStops = async (id: string) => {
    try {
      const data: Stop[] = await getStops(id);
      setStops(data);

      const tour: Tour = await getTour(id);
      setTourOwnerId(tour.user_id); // Guardamos el id del creador
    } catch (err: any) {
      console.error(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStops(tourId);
    }, [tourId])
  );

  const speakStop = (stop: Stop) => {
    if (speakingStopId === stop.id) {
      Speech.stop();
      setSpeakingStopId(null);
      return;
    }

    Speech.stop();
    setSpeakingStopId(stop.id);

    Speech.speak(stop.description || 'No hay descripción disponible', {
      language: 'es',
      onDone: () => setSpeakingStopId(null),
      onStopped: () => setSpeakingStopId(null),
      onError: () => setSpeakingStopId(null),
    });
  };

  const onDelete = async (id: string) => {
    try {
      await deleteStop(id);
      loadStops(tourId);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error eliminando stop');
    }
  };

  const canEdit = currentUserId === tourOwnerId;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={{ latitude: 37.3886, longitude: -5.9963, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
        {stops.map(stop => (
          <Marker
            key={stop.id}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={stop.title}
            description={stop.description}
          />
        ))}
      </MapView>

      <View style={styles.listContainer}>
        {canEdit && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('StopForm', { tourId, stop: undefined, isUpdate: false })}
          >
            <Text style={styles.primaryButtonText}>Crear Stop</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={stops}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.stopCard}>
              <Text style={styles.stopTitle}>{item.title}</Text>
              <Text style={styles.stopDescription}>{item.description}</Text>
              <Text style={styles.stopCoords}>
                {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    speakingStopId === item.id && { backgroundColor: '#facc15' },
                  ]}
                  onPress={() => speakStop(item)}
                >
                  <Text style={styles.secondaryButtonText}>
                    {speakingStopId === item.id ? 'Detener' : 'Escuchar'}
                  </Text>
                </TouchableOpacity>

                {canEdit && (
                  <>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => navigation.navigate('StopForm', { tourId, stop: item, isUpdate: true })}
                    >
                      <Text style={styles.secondaryButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.secondaryButton, { backgroundColor: '#ef4444' }]}
                      onPress={() => onDelete(item.id)}
                    >
                      <Text style={styles.secondaryButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={() => generateTourPDF({ id: tourId, owner_id: tourOwnerId }, stops)}>
          <Text style={styles.primaryButtonText}>Generar PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  listContainer: { flex: 1, padding: 16 },
  stopCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12 },
  stopTitle: { fontWeight: '700', fontSize: 16, color: '#0f172a' },
  stopDescription: { fontSize: 14, color: '#334155', marginVertical: 4 },
  stopCoords: { fontSize: 12, color: '#64748b', marginBottom: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  primaryButton: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginVertical: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  secondaryButton: { flex: 1, backgroundColor: '#2563eb', paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  secondaryButtonText: { color: '#fff', fontWeight: '500' },
});
