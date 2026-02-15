import { toJewishDate, formatJewishDateInHebrew } from 'jewish-date';

export function getTodayHebrewDate(): string {
  const jewishDate = toJewishDate(new Date());
  return formatJewishDateInHebrew(jewishDate);
}
