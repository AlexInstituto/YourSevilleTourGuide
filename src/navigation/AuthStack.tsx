import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { AuthStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#2563eb' },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      contentStyle: { backgroundColor: '#f1f5f9' },
    }}
  >
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: 'Iniciar sesión' }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: 'Registro' }}
    />
  </Stack.Navigator>
);

export default AuthStack;
