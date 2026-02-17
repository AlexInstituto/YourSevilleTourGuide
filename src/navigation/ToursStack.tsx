import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToursScreen from '../screens/ToursScreen';
import TourFormScreen from '../screens/TourFormScreen';
import StopsScreen from '../screens/StopsScreen';
import StopFormScreen from '../screens/StopFormScreen';
import { ToursStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<ToursStackParamList>();

const ToursStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#2563eb' },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      contentStyle: { backgroundColor: '#f1f5f9' },
    }}
  >
    <Stack.Screen
      name="ToursList"
      component={ToursScreen}
      options={{ title: 'Tus Tours' }}
    />
    <Stack.Screen
      name="TourForm"
      component={TourFormScreen}
      options={{ title: 'Crear/Editar Tour' }}
    />
    <Stack.Screen
      name="StopsList"
      component={StopsScreen}
      options={{ title: 'Paradas' }}
    />
    <Stack.Screen
      name="StopForm"
      component={StopFormScreen}
      options={{ title: 'Crear/Editar Parada' }}
    />
  </Stack.Navigator>
);

export default ToursStack;
