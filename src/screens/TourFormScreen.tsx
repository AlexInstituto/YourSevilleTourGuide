import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createTour, updateTour } from '../services/db';
import { pickImage, uploadImage } from '../services/image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ToursStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<ToursStackParamList, 'TourForm'>;

type TourFormValues = {
  name: string;
  description: string;
};

const TourSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  description: Yup.string(),
});

export default function TourFormScreen({ navigation, route }: Props) {
  const { tour, isUpdate } = route.params || {};
  const [imageUri, setImageUri] = useState<string | undefined>(tour?.image_url);

  const selectImage = async () => {
    const uri = await pickImage();
    if (uri) setImageUri(uri);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Crear Tour</Text>

          <Formik<TourFormValues>
            initialValues={{ name: tour?.name || '', description: tour?.description || '' }}
            validationSchema={TourSchema}
            onSubmit={async (values: TourFormValues, { setSubmitting }) => {
              try {
                let imageUrl: string | undefined = undefined;
                if (imageUri) {
                  imageUrl = await uploadImage(imageUri, `tours/${Date.now()}.png`);
                }
                if(!isUpdate)
                  await createTour(values.name, values.description, imageUrl);
                else
                  await updateTour(tour!.id, {name: values.name, description: values.description, image_url: imageUrl});
                Alert.alert('Tour creado', 'El tour se ha guardado correctamente');
                navigation.goBack();
              } catch (err: any) {
                Alert.alert('Error', err.message || 'Error desconocido');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del tour"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  placeholderTextColor="#94a3b8"
                />
                {errors.name && touched.name && <Text style={styles.error}>{errors.name}</Text>}

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Descripción"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  placeholderTextColor="#94a3b8"
                  multiline
                />

                <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  ) : (
                    <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text style={styles.primaryButtonText}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Tour'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 20 },

  label: { fontSize: 14, color: '#334155', marginBottom: 6 },

  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 10,
    color: '#0f172a',
  },

  error: { color: '#ef4444', fontSize: 13, marginBottom: 10 },

  imagePicker: {
    height: 120,
    width: 120,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    alignSelf: 'center',
    overflow: 'hidden',
  },

  imagePickerText: { color: '#64748b', fontSize: 14 },

  imagePreview: { width: '100%', height: '100%' },

  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  primaryButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },

  buttonDisabled: { backgroundColor: '#94a3b8' },
});
