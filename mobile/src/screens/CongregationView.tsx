import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useNextPrayer } from '../hooks/useNextPrayer';
import { getTodayHebrewDate } from '../utils/hebrewDate';
import { getNotificationsEnabled, setNotificationsEnabled } from '../services/notifications';
import { schedulePrayerNotification } from '../services/notifications';

const PRAYER_LABELS: Record<string, string> = {
  shacharit: 'שחרית',
  mincha: 'מנחה',
  arvit: 'ערבית',
};

export function CongregationView() {
  const { data, loading, error, refresh } = usePrayerTimes();
  const dateStr = new Date().toISOString().split('T')[0];
  const { nextPrayer } = useNextPrayer(data, dateStr);
  const [notificationsOn, setNotificationsOn] = useState(false);

  useEffect(() => {
    getNotificationsEnabled().then(setNotificationsOn);
  }, []);

  const onNotifyChange = async (value: boolean) => {
    setNotificationsOn(value);
    await setNotificationsEnabled(value);
    if (value && data) {
      schedulePrayerNotification('שחרית', data.shacharit, dateStr);
      schedulePrayerNotification('מנחה', data.mincha, dateStr);
      schedulePrayerNotification('ערבית', data.arvit, dateStr);
    }
  };

  const hebrewDate = getTodayHebrewDate();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a5f2a" />
        <Text style={styles.loadingText}>טוען זמני תפילות...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <Text style={styles.hebrewDate}>{hebrewDate}</Text>

      {error ? (
        <Text style={styles.error}>לא ניתן לטעון זמנים. נסה שוב מאוחר יותר.</Text>
      ) : data ? (
        <View style={styles.timesCard}>
          {(['shacharit', 'mincha', 'arvit'] as const).map((prayer) => {
            const time = data[prayer];
            const isNext = nextPrayer === prayer;
            return (
              <View
                key={prayer}
                style={[styles.row, isNext && styles.rowHighlight]}
              >
                <Text style={[styles.time, isNext && styles.timeHighlight]}>
                  {time}
                </Text>
                <Text style={[styles.label, isNext && styles.labelHighlight]}>
                  {PRAYER_LABELS[prayer]}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={styles.notifyRow}>
        <Text style={styles.notifyLabel}>התראה 30 דק׳ לפני תפילה</Text>
        <Switch
          value={notificationsOn}
          onValueChange={onNotifyChange}
          trackColor={{ false: '#ccc', true: '#2d8f3d' }}
          thumbColor="#fff"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 24, paddingTop: 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  hebrewDate: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a5f2a',
    textAlign: 'right',
    marginBottom: 24,
  },
  timesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowHighlight: {
    backgroundColor: '#e8f5e9',
    marginHorizontal: -24,
    paddingHorizontal: 24,
    borderBottomColor: 'transparent',
  },
  time: { fontSize: 24, fontWeight: '600', color: '#333' },
  timeHighlight: { color: '#1a5f2a' },
  label: { fontSize: 20, color: '#555' },
  labelHighlight: { color: '#1a5f2a', fontWeight: '600' },
  error: { fontSize: 16, color: '#c00', textAlign: 'center', marginTop: 24 },
  notifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  notifyLabel: { fontSize: 16, color: '#333' },
});
