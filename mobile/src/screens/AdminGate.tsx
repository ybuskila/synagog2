import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AdminLogin } from './AdminLogin';
import { PrayerTimesForm } from './PrayerTimesForm';
import { AdminHome } from './AdminHome';

const Stack = createNativeStackNavigator();

export function AdminGate() {
  const { token } = useAuth();

  if (!token) {
    return <AdminLogin />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a5f2a' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{ title: 'ניהול זמנים', headerShown: true }}
      />
      <Stack.Screen
        name="PrayerTimesForm"
        component={PrayerTimesForm}
        options={{ title: 'עריכת זמנים' }}
      />
    </Stack.Navigator>
  );
}
