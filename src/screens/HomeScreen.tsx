import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabsParamList } from '../types/navigation';
import { Logo } from '../../assets/images';


type Props = NativeStackScreenProps<BottomTabsParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={Logo} // reemplaza con tu logo
          style={styles.logo}
        />
        <Text style={styles.title}>Bienvenido a</Text>
        <Text style={styles.subtitle}>Your Seville Tour Guide!</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Tours')}
        >
          <Text style={styles.primaryButtonText}>Ver Tours</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.secondaryButtonText}>Mi Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0f172a',
  },

  subtitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 30,
    textAlign: 'center',
  },

  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },

  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },

  secondaryButton: {
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#2563eb',
    fontWeight: '500',
    fontSize: 14,
  },
});
