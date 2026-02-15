import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@synagogue.org';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(
  process.env.ADMIN_PASSWORD || 'changeme',
  10
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const isAdmin = email === ADMIN_EMAIL && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  if (!isAdmin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ sub: email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

export { router as authRouter };
