import { useState, useEffect, useCallback } from 'react';
import { PrayerTimesForDate } from '../types';
import { fetchPrayerTimes } from '../services/api';

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function usePrayerTimes(date?: Date) {
  const target = date ?? new Date();
  const dateStr = formatDate(target);
  const [data, setData] = useState<PrayerTimesForDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const result = await fetchPrayerTimes(dateStr);
    setData(result);
    if (!result) setError(true);
    setLoading(false);
  }, [dateStr]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
