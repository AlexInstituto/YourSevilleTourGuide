import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProfile, Profile } from '../services/db';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';
import { signOut } from '../services/auth';

type Props = NativeStackScreenProps<
  ProfileStackParamList,
  'ProfileView'
>;

export default function ProfileScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo cerrar sesión');
    }
  };

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error: any) {
      console.error('Error loading profile:', error.message || error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadProfile().finally(() => setLoading(false));
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.card}>
        {profile?.avatar_url ? (
          <Image
            source={{ uri: profile.avatar_url }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {profile?.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={styles.username}>
          {profile?.username}
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('ProfileEdit', { profile: profile! })
          }
        >
          <Text style={styles.primaryButtonText}>
            Editar Perfil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f1f5f9',
  },

  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },

  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatarPlaceholderText: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '700',
  },

  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 25,
  },

  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
  },

  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  logoutButton: { backgroundColor: '#ef4444', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14 },
  logoutText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
