import { PrayerTimesForDate } from '../types';
import { API_BASE_URL } from '../config';

export interface ApiPrayerTimes {
  date: string;
  shacharit: string;
  mincha: string;
  arvit: string;
}

export async function fetchPrayerTimes(date: string): Promise<PrayerTimesForDate | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/prayer-times/${date}`);
    if (!res.ok) return null;
    const data: ApiPrayerTimes = await res.json();
    return {
      date: data.date,
      shacharit: data.shacharit,
      mincha: data.mincha,
      arvit: data.arvit,
    };
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    const { token } = await res.json();
    return token;
  } catch {
    return null;
  }
}

export async function savePrayerTimes(
  token: string,
  data: PrayerTimesForDate
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/prayer-times`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchWeeklySchedule(token: string): Promise<
  { dayOfWeek: number; shacharit: string; mincha: string; arvit: string }[] | null
> {
  try {
    const res = await fetch(`${API_BASE_URL}/prayer-times/weekly`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const { schedule } = await res.json();
    return schedule ?? [];
  } catch {
    return null;
  }
}

export async function saveWeeklySchedule(
  token: string,
  schedule: { dayOfWeek: number; shacharit: string; mincha: string; arvit: string }[]
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/prayer-times/weekly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ schedule }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
