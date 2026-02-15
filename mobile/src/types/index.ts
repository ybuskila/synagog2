export type PrayerName = 'shacharit' | 'mincha' | 'arvit';

export interface PrayerTime {
  prayer: PrayerName;
  time: string; // HH:mm format
}

export interface PrayerTimesForDate {
  date: string; // YYYY-MM-DD
  shacharit: string;
  mincha: string;
  arvit: string;
}

export interface WeeklySchedule {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  shacharit: string;
  mincha: string;
  arvit: string;
}
