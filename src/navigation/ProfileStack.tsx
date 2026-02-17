import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEdit from '../screens/ProfileEdit';
import { ProfileStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#2563eb' },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      contentStyle: { backgroundColor: '#f1f5f9' },
    }}
  >
    <Stack.Screen
      name="ProfileView"
      component={ProfileScreen}
      options={{ title: 'Perfil' }}
    />
    <Stack.Screen
      name="ProfileEdit"
      component={ProfileEdit}
      options={{ title: 'Editar Perfil' }}
    />
  </Stack.Navigator>
);

export default ProfileStack;
