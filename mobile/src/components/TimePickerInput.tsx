import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

function parseTime(value: string): Date {
  const [h = 0, m = 0] = value.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

interface TimePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  style?: object;
}

export function TimePickerInput({ value, onChange, style }: TimePickerInputProps) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(() => parseTime(value || '06:30'));

  const open = () => {
    setDate(parseTime(value || '06:30'));
    setShow(true);
  };

  const onPickerChange = (_: unknown, d?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (d) {
      setDate(d);
      onChange(formatTime(d));
    }
  };

  const confirm = () => {
    onChange(formatTime(date));
    setShow(false);
  };

  const [hour, setHour] = useState('06');
  const [minute, setMinute] = useState('30');

  const openModal = () => {
    const [h, m] = (value || '06:30').split(':');
    setHour(h || '06');
    setMinute(m || '30');
    setShow(true);
  };

  const confirmModal = () => {
    const h = Math.min(23, Math.max(0, parseInt(hour, 10) || 0));
    const mm = Math.min(59, Math.max(0, parseInt(minute, 10) || 0));
    onChange(`${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
    setShow(false);
  };

  if (Platform.OS === 'web') {
    return (
      <>
        <TouchableOpacity style={[styles.trigger, style]} onPress={openModal} activeOpacity={0.7}>
          <Text style={styles.triggerText}>{value || '06:30'}</Text>
        </TouchableOpacity>
        <Modal visible={show} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShow(false)}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>בחירת שעה</Text>
              <View style={styles.webRow}>
                <Text style={styles.webLabel}>שעה</Text>
                <TextInput
                  style={styles.webInput}
                  value={hour}
                  onChangeText={setHour}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="00"
                />
                <Text style={styles.webLabel}>דקה</Text>
                <TextInput
                  style={styles.webInput}
                  value={minute}
                  onChangeText={setMinute}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="00"
                />
              </View>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.cancelText}>ביטול</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmModal}>
                  <Text style={styles.confirmText}>אישור</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  return (
    <>
      <TouchableOpacity style={[styles.trigger, style]} onPress={open} activeOpacity={0.7}>
        <Text style={styles.triggerText}>{value || '06:30'}</Text>
      </TouchableOpacity>
      {show && (
        Platform.OS === 'ios' ? (
          <Modal transparent animationType="slide">
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShow(false)}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShow(false)}>
                    <Text style={styles.cancelText}>ביטול</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={confirm}>
                    <Text style={styles.confirmText}>אישור</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="spinner"
                  onChange={onPickerChange}
                  style={styles.picker}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        ) : (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onPickerChange}
          />
        )
      )}
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  triggerText: { fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  webRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 },
  webLabel: { fontSize: 14, color: '#666', minWidth: 32 },
  webInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: 56,
    fontSize: 16,
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelText: { fontSize: 16, color: '#666' },
  confirmText: { fontSize: 16, fontWeight: '600', color: '#1a5f2a' },
  picker: { height: 180 },
});
