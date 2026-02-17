import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { updateProfile } from '../services/db';
import { pickImage, uploadImage } from '../services/image';
import { ProfileStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  ProfileStackParamList,
  'ProfileEdit'
>;

type FormValues = {
  username: string;
};

const ProfileSchema = Yup.object().shape({
  username: Yup.string().required('El nombre es obligatorio'),
});

export default function ProfileEdit({ route, navigation }: Props) {
  const { profile } = route.params;
  const [imageUri, setImageUri] = useState<string | undefined>(
    profile.avatar_url || undefined
  );

  const selectImage = async () => {
    const uri = await pickImage();
    if (uri) setImageUri(uri);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Editar Perfil</Text>

        <TouchableOpacity onPress={selectImage} style={styles.avatarWrapper}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {profile.username?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.changeAvatarText}>
            Cambiar avatar
          </Text>
        </TouchableOpacity>

        <Formik<FormValues>
          initialValues={{ username: profile.username?? '' }}
          validationSchema={ProfileSchema}
          onSubmit={async (
            values: FormValues,
            { setSubmitting }
          ) => {
            try {
              let avatar_url = imageUri;

              if (imageUri && !imageUri.startsWith('http')) {
                avatar_url = await uploadImage(
                  imageUri,
                  `profiles/${Date.now()}.png`
                );
              }

              await updateProfile(values.username, avatar_url);
              Alert.alert('Perfil actualizado');
              navigation.goBack();
            } catch (err: any) {
              Alert.alert(
                'Error',
                err.message || 'Error desconocido'
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <Text style={styles.label}>Nombre</Text>

              <TextInput
                style={styles.input}
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                placeholder="Nombre de usuario"
                placeholderTextColor="#94a3b8"
              />

              {errors.username && touched.username && (
                <Text style={styles.error}>
                  {errors.username}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isSubmitting && styles.buttonDisabled,
                ]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting
                    ? 'Guardando...'
                    : 'Guardar cambios'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    padding: 24,
  },

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

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },

  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
  },

  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  avatarPlaceholderText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
  },

  changeAvatarText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },

  label: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 10,
    color: '#0f172a',
  },

  error: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 10,
  },

  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },

  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
});
