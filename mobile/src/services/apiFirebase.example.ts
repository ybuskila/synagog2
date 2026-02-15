/**
 * Firebase alternative to api.ts
 * To use: install @react-native-firebase/app, auth, firestore
 * Rename this to api.ts (backup original first)
 */

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { PrayerTimesForDate } from '../types';

export async function fetchPrayerTimes(date: string): Promise<PrayerTimesForDate | null> {
  try {
    const doc = await firestore().collection('prayerTimes').doc(date).get();
    const data = doc.data();
    if (!data) return null;
    return { date, shacharit: data.shacharit, mincha: data.mincha, arvit: data.arvit };
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<string | null> {
  try {
    const cred = await auth().signInWithEmailAndPassword(email, password);
    const token = await cred.user.getIdToken();
    return token;
  } catch {
    return null;
  }
}

export async function savePrayerTimes(
  _token: string,
  data: PrayerTimesForDate
): Promise<boolean> {
  try {
    await firestore().collection('prayerTimes').doc(data.date).set(data);
    return true;
  } catch {
    return false;
  }
}

export async function saveWeeklySchedule(
  _token: string,
  schedule: { dayOfWeek: number; shacharit: string; mincha: string; arvit: string }[]
): Promise<boolean> {
  try {
    await firestore().collection('config').doc('weekly').set({ schedule });
    return true;
  } catch {
    return false;
  }
}

export async function fetchWeeklySchedule(_token: string) {
  try {
    const doc = await firestore().collection('config').doc('weekly').get();
    return doc.data()?.schedule ?? null;
  } catch {
    return null;
  }
}
