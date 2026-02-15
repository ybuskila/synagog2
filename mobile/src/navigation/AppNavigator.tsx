import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CongregationView } from '../screens/CongregationView';
import { AdminLogin } from '../screens/AdminLogin';
import { PrayerTimesForm } from '../screens/PrayerTimesForm';
import { AdminGate } from '../screens/AdminGate';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={route.name === 'PrayerTimes' ? 'time-outline' : 'person-outline'}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: '#1a5f2a',
        headerShown: false,
        tabBarLabel: route.name === 'PrayerTimes' ? 'זמנים' : 'גבאי',
      })}
    >
      <Tab.Screen name="PrayerTimes" component={CongregationView} />
      <Tab.Screen name="Admin" component={AdminGate} />
    </Tab.Navigator>
  );
}

function AppNavigatorInner() {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a5f2a' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      {token ? (
        <Stack.Screen
          name="PrayerTimesForm"
          component={PrayerTimesForm}
          options={{ title: 'עריכת זמנים' }}
        />
      ) : null}
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <AuthProvider>
      <AppNavigatorInner />
    </AuthProvider>
  );
}
