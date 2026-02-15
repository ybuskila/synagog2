import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export function AdminHome() {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();

  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('PrayerTimesForm', { date: today })
        }
      >
        <Text style={styles.cardTitle}>עריכת זמני היום</Text>
        <Text style={styles.cardSubtitle}>שחרית, מנחה, ערבית</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('PrayerTimesForm', { date: today, weekly: true })
        }
      >
        <Text style={styles.cardTitle}>הגדרת זמנים שבועיים</Text>
        <Text style={styles.cardSubtitle}>זמנים קבועים לכל יום</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>יציאה</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8f9fa' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1a5f2a' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  logout: {
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: { fontSize: 16, color: '#c00' },
});
