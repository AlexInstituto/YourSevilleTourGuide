import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileStack from './ProfileStack';
import ToursStack from './ToursStack';
import ChatBot from '../screens/ChatBot';
import { BottomTabsParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#64748b',
      tabBarStyle: { backgroundColor: '#ffffff', paddingBottom: 5, height: 60 },
      tabBarIcon: ({ color, size }) => {
        let iconName: any;
        switch (route.name) {
          case 'Home': iconName = 'home-outline'; break;
          case 'Profile': iconName = 'person-outline'; break;
          case 'Tours': iconName = 'map-outline'; break;
          case 'ChatBot': iconName = 'chatbubble-ellipses-outline'; break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileStack} />
    <Tab.Screen name="Tours" component={ToursStack} />
    <Tab.Screen name="ChatBot" component={ChatBot} />
  </Tab.Navigator>
);

export default BottomTabs;
