import fs from 'fs';
import path from 'path';

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'prayer-times.json');

export interface PrayerTimeRecord {
  date: string;
  shacharit: string;
  mincha: string;
  arvit: string;
}

export interface WeeklyEntry {
  dayOfWeek: number;
  shacharit: string;
  mincha: string;
  arvit: string;
}

const DEFAULT_TIMES: PrayerTimeRecord = {
  date: '',
  shacharit: '06:30',
  mincha: '13:15',
  arvit: '19:00',
};

function loadData(): Record<string, PrayerTimeRecord> & { _weekly?: WeeklyEntry[] } {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { _weekly: [] };
  }
}

function saveData(data: Record<string, PrayerTimeRecord> & { _weekly?: WeeklyEntry[] }) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function getPrayerTimes(date: string): Promise<PrayerTimeRecord | null> {
  const data = loadData();
  if (data[date]) return data[date];
  const weekly = data._weekly as WeeklyEntry[] | undefined;
  if (weekly && weekly.length > 0) {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const entry = weekly.find((w) => w.dayOfWeek === dayOfWeek);
    if (entry) {
      return { date, shacharit: entry.shacharit, mincha: entry.mincha, arvit: entry.arvit };
    }
  }
  return null;
}

export async function savePrayerTimes(record: PrayerTimeRecord): Promise<void> {
  const data = loadData();
  data[record.date] = record;
  saveData(data);
}

export async function saveWeeklySchedule(schedule: WeeklyEntry[]): Promise<void> {
  const data = loadData();
  data._weekly = schedule;
  saveData(data);
}

export async function getWeeklySchedule(): Promise<WeeklyEntry[]> {
  const data = loadData();
  return (data._weekly as WeeklyEntry[]) ?? [];
}
