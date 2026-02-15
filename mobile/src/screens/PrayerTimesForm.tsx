import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { savePrayerTimes, saveWeeklySchedule, fetchPrayerTimes, fetchWeeklySchedule } from '../services/api';
import { TimePickerInput } from '../components/TimePickerInput';

const PRAYER_LABELS: Record<string, string> = {
  shacharit: 'שחרית',
  mincha: 'מנחה',
  arvit: 'ערבית',
};

const DAYS = [
  { d: 0, label: 'ראשון' },
  { d: 1, label: 'שני' },
  { d: 2, label: 'שלישי' },
  { d: 3, label: 'רביעי' },
  { d: 4, label: 'חמישי' },
  { d: 5, label: 'שישי' },
  { d: 6, label: 'שבת' },
];

export function PrayerTimesForm() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { token } = useAuth();
  const date = route.params?.date ?? new Date().toISOString().split('T')[0];
  const isWeekly = route.params?.weekly ?? false;

  const [shacharit, setShacharit] = useState('06:30');
  const [mincha, setMincha] = useState('13:15');
  const [arvit, setArvit] = useState('19:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For weekly: array of 7 day schedules
  const [weekly, setWeekly] = useState<{ shacharit: string; mincha: string; arvit: string }[]>(
    Array(7).fill(null).map(() => ({ shacharit: '06:30', mincha: '13:15', arvit: '19:00' }))
  );

  useEffect(() => {
    if (!token) return;
    if (!isWeekly) {
      fetchPrayerTimes(date).then((data) => {
        if (data) {
          setShacharit(data.shacharit);
          setMincha(data.mincha);
          setArvit(data.arvit);
        }
        setLoading(false);
      });
    } else {
      fetchWeeklySchedule(token).then((schedule) => {
        if (schedule && schedule.length > 0) {
          const next = Array(7)
            .fill(null)
            .map(() => ({ shacharit: '06:30', mincha: '13:15', arvit: '19:00' }));
          schedule.forEach((s) => {
            if (s.dayOfWeek >= 0 && s.dayOfWeek < 7) {
              next[s.dayOfWeek] = { shacharit: s.shacharit, mincha: s.mincha, arvit: s.arvit };
            }
          });
          setWeekly(next);
        }
        setLoading(false);
      });
    }
  }, [date, isWeekly, token]);

  const validateTime = (t: string) => /^\d{1,2}:\d{2}$/.test(t);

  const handleSave = async () => {
    if (!token) return;
    if (!validateTime(shacharit) || !validateTime(mincha) || !validateTime(arvit)) {
      Alert.alert('שגיאה', 'נא להזין זמנים בפורמט HH:MM');
      return;
    }
    setSaving(true);
    const ok = isWeekly
      ? await saveWeeklySchedule(token, weekly.map((w, i) => ({ dayOfWeek: i, ...w })))
      : await savePrayerTimes(token, { date, shacharit, mincha, arvit });
    setSaving(false);
    if (ok) {
      Alert.alert('נשמר', 'הזמנים נשמרו בהצלחה', () => navigation.goBack());
    } else {
      Alert.alert('שגיאה', 'שמירה נכשלה. בדוק חיבור לאינטרנט.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a5f2a" />
      </View>
    );
  }

  if (isWeekly) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {DAYS.map(({ d, label }) => (
          <View key={d} style={styles.dayCard}>
            <Text style={styles.dayLabel}>{label}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{PRAYER_LABELS.shacharit}</Text>
              <TimePickerInput
                value={weekly[d]?.shacharit ?? '06:30'}
                onChange={(v) => {
                  const next = [...weekly];
                  next[d] = { ...next[d], shacharit: v };
                  setWeekly(next);
                }}
                style={styles.input}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{PRAYER_LABELS.mincha}</Text>
              <TimePickerInput
                value={weekly[d]?.mincha ?? '13:15'}
                onChange={(v) => {
                  const next = [...weekly];
                  next[d] = { ...next[d], mincha: v };
                  setWeekly(next);
                }}
                style={styles.input}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{PRAYER_LABELS.arvit}</Text>
              <TimePickerInput
                value={weekly[d]?.arvit ?? '19:00'}
                onChange={(v) => {
                  const next = [...weekly];
                  next[d] = { ...next[d], arvit: v };
                  setWeekly(next);
                }}
                style={styles.input}
              />
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>שמור זמנים שבועיים</Text>}
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.dateLabel}>{date}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{PRAYER_LABELS.shacharit}</Text>
        <TimePickerInput value={shacharit} onChange={setShacharit} style={styles.input} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{PRAYER_LABELS.mincha}</Text>
        <TimePickerInput value={mincha} onChange={setMincha} style={styles.input} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{PRAYER_LABELS.arvit}</Text>
        <TimePickerInput value={arvit} onChange={setArvit} style={styles.input} />
      </View>
      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>שמור</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8f9fa' },
  content: { paddingBottom: 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dateLabel: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'right', marginBottom: 24 },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dayLabel: { fontSize: 16, fontWeight: '600', color: '#1a5f2a', marginBottom: 12, textAlign: 'right' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 16, color: '#555' },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    width: 100,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1a5f2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
