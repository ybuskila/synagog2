import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getPrayerTimes, savePrayerTimes, saveWeeklySchedule, getWeeklySchedule } from '../store/prayerTimes';

const router = Router();

router.get('/weekly', authMiddleware, async (req, res) => {
  const schedule = await getWeeklySchedule();
  res.json({ schedule });
});

router.get('/:date', async (req, res) => {
  const { date } = req.params;
  if (date === 'weekly' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format (YYYY-MM-DD)' });
  }
  const times = await getPrayerTimes(date);
  if (!times) {
    return res.status(404).json({ error: 'Prayer times not found' });
  }
  res.json(times);
});

router.post('/', authMiddleware, async (req, res) => {
  const { date, shacharit, mincha, arvit } = req.body;
  if (!date || !shacharit || !mincha || !arvit) {
    return res.status(400).json({ error: 'date, shacharit, mincha, arvit required' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }
  await savePrayerTimes({ date, shacharit, mincha, arvit });
  res.json({ ok: true });
});

router.post('/weekly', authMiddleware, async (req, res) => {
  const { schedule } = req.body;
  if (!Array.isArray(schedule)) {
    return res.status(400).json({ error: 'schedule array required' });
  }
  await saveWeeklySchedule(schedule);
  res.json({ ok: true });
});

export { router as prayerTimesRouter };
