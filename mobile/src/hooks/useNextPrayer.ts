import { useMemo } from 'react';
import { PrayerTimesForDate } from '../types';

type PrayerKey = 'shacharit' | 'mincha' | 'arvit';

const PRAYER_NAMES: Record<PrayerKey, string> = {
  shacharit: 'שחרית',
  mincha: 'מנחה',
  arvit: 'ערבית',
};

export function useNextPrayer(
  times: PrayerTimesForDate | null,
  dateStr: string
): { nextPrayer: PrayerKey | null; label: string } {
  return useMemo(() => {
    if (!times) return { nextPrayer: null, label: '' };
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (dateStr !== today) return { nextPrayer: null, label: '' };

    const entries: [PrayerKey, string][] = [
      ['shacharit', times.shacharit],
      ['mincha', times.mincha],
      ['arvit', times.arvit],
    ];

    for (const [prayer, time] of entries) {
      const [h, m] = time.split(':').map(Number);
      const prayerDate = new Date(now);
      prayerDate.setHours(h, m, 0, 0);
      if (prayerDate > now) {
        return { nextPrayer: prayer, label: PRAYER_NAMES[prayer] };
      }
    }
    return { nextPrayer: null, label: '' };
  }, [times, dateStr]);
}
