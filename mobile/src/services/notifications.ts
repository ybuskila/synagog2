import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_ENABLED_KEY = '@synagogue/notifications_enabled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function initNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
}

export async function getNotificationsEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  return value === 'true';
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled ? 'true' : 'false');
}

export function schedulePrayerNotification(
  prayerName: string,
  prayerTime: string,
  dateStr: string
): void {
  if (Platform.OS === 'web') return;
  const [hours, minutes] = prayerTime.split(':').map(Number);
  const notifTime = new Date(dateStr);
  notifTime.setHours(hours, minutes, 0, 0);
  const triggerTime = new Date(notifTime.getTime() - 30 * 60 * 1000); // 30 min before
  if (triggerTime <= new Date()) return; // Don't schedule past notifications

  Notifications.scheduleNotificationAsync({
    content: {
      title: 'תפילה מתקרבת',
      body: `${prayerName} בעוד 30 דקות (${prayerTime})`,
      data: { prayer: prayerName, time: prayerTime },
    },
    trigger: triggerTime,
  });
}
