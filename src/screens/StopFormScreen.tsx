import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createStop, updateStop } from '../services/db';
import { pickImage, uploadImage } from '../services/image';
import MapView, { Marker, LatLng } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ToursStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<ToursStackParamList, 'StopForm'>;

type StopFormValues = {
  title: string;
  description: string;
};

const StopSchema = Yup.object().shape({
  title: Yup.string().required('El título es obligatorio'),
  description: Yup.string(),
});

export default function StopFormScreen({ route, navigation }: Props) {
  const { tourId, stop, isUpdate } = route.params;
  const [imageUri, setImageUri] = useState<string | undefined>(stop?.image_url);

  // Estado del marcador para lat/lng
  const [marker, setMarker] = useState<LatLng>({
    latitude: stop?.latitude ?? 37.3886, // Sevilla
    longitude: stop?.longitude ?? -5.9963,
  });

  const selectImage = async () => {
    const uri = await pickImage();
    if (uri) setImageUri(uri);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>{isUpdate ? 'Editar Stop' : 'Crear Stop'}</Text>

          <Formik<StopFormValues>
            initialValues={{
              title: stop?.title || '',
              description: stop?.description || '',
            }}
            validationSchema={StopSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                let imageUrl: string | undefined = stop?.image_url;

                if (imageUri && imageUri !== stop?.image_url) {
                  imageUrl = await uploadImage(imageUri, `stops/${Date.now()}.png`);
                }

                if (isUpdate) {
                  await updateStop(stop!.id, {
                    title: values.title,
                    description: values.description,
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                    image_url: imageUrl,
                  });
                } else {
                  await createStop(
                    values.title,
                    values.description,
                    marker.latitude,
                    marker.longitude,
                    tourId,
                    imageUrl
                  );
                }

                Alert.alert('Éxito', isUpdate ? 'Stop actualizado' : 'Stop creado');
                navigation.goBack();
              } catch (err: any) {
                Alert.alert('Error', err.message || 'Error desconocido');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <>
                <Text style={styles.label}>Título</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Título del stop"
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  placeholderTextColor="#94a3b8"
                />
                {errors.title && touched.title && <Text style={styles.error}>{errors.title}</Text>}

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Descripción"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  placeholderTextColor="#94a3b8"
                />
                {errors.description && touched.description && <Text style={styles.error}>{errors.description}</Text>}

                <TouchableOpacity style={styles.secondaryButton} onPress={selectImage}>
                  <Text style={styles.secondaryButtonText}>Seleccionar Imagen</Text>
                </TouchableOpacity>

                {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

                {/* MAPA */}
                <Text style={[styles.label, { marginTop: 20 }]}>Ubicación en el mapa</Text>
                <MapView
                  style={{ width: '100%', height: 250, marginVertical: 10, borderRadius: 14 }}
                  initialRegion={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                  onPress={(e) => setMarker(e.nativeEvent.coordinate)}
                >
                  <Marker
                    coordinate={marker}
                    draggable
                    onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
                  />
                </MapView>

                <TouchableOpacity
                  style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit as any}
                  disabled={isSubmitting}
                >
                  <Text style={styles.primaryButtonText}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Stop'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  scroll: { padding: 20, justifyContent: 'center' },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, color: '#334155', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#f1f5f9', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, fontSize: 15, color: '#0f172a' },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 5 },
  primaryButton: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 20 },
  primaryButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },
  buttonDisabled: { backgroundColor: '#94a3b8' },
  secondaryButton: { marginTop: 10, alignItems: 'center' },
  secondaryButtonText: { color: '#2563eb', fontSize: 14, fontWeight: '500' },
  imagePreview: { width: 120, height: 120, borderRadius: 12, marginVertical: 10, alignSelf: 'center' },
});
