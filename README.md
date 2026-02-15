# Synagogue App – Cross-Platform Mobile & Backend

A React Native (Expo) mobile app for displaying and managing synagogue prayer times, with a REST API backend.

## Features

### Congregation View
- Daily prayer times: שחרית (Shacharit), מנחה (Mincha), ערבית (Arvit)
- Clean Hebrew RTL layout
- Highlights the next upcoming prayer
- Today’s Hebrew date
- Optional push notification 30 minutes before each prayer

### Gabbai Admin Interface
- Secure login
- Edit prayer times per date
- Set recurring weekly times
- Data stored via REST API

### Backend
- Prayer times per date (JSON file storage)
- JWT auth for admin
- Optional weekly schedule fallback

---

## Project Structure

```
synagog2/
├── mobile/          # React Native Expo app
│   ├── src/
│   │   ├── screens/     # CongregationView, AdminLogin, PrayerTimesForm, etc.
│   │   ├── services/    # API, notifications
│   │   ├── hooks/       # usePrayerTimes, useNextPrayer
│   │   ├── context/     # AuthContext
│   │   └── utils/       # Hebrew date
│   └── ...
├── backend/         # Node.js Express API
│   ├── src/
│   │   ├── routes/      # auth, prayerTimes
│   │   ├── middleware/  # authMiddleware
│   │   └── store/       # prayer times storage
│   └── ...
└── README.md
```

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run dev
```

API runs at `http://localhost:3000`.

### 2. Mobile App

```bash
cd mobile
npm install
npx expo start
```

Press `i` for iOS, `a` for Android.

**Assets**: Add `icon.png`, `splash.png`, `adaptive-icon.png` (and optionally `notification-icon.png`) to `mobile/assets/`. Or run `npx create-expo-app temp --template blank` and copy its `assets/` folder.

### 3. API Base URL (Dev)

In `mobile/src/config.ts`:
- **iOS Simulator**: `http://localhost:3000/api`
- **Android Emulator**: `http://10.0.2.2:3000/api`
- **Physical device**: `http://YOUR_PC_IP:3000/api`

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | `{ email, password }` → `{ token }` |
| GET | `/api/prayer-times/:date` | No | Returns prayer times for YYYY-MM-DD |
| POST | `/api/prayer-times` | Yes | `{ date, shacharit, mincha, arvit }` |
| POST | `/api/prayer-times/weekly` | Yes | `{ schedule: [{ dayOfWeek, shacharit, mincha, arvit }] }` |

---

## Firebase Option

To use Firebase instead of the REST backend:

1. Create a Firebase project and add the app.
2. `cd mobile && npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore`
3. Add `google-services.json` (Android) and `GoogleService-Info.plist` (iOS).
4. Replace `mobile/src/services/api.ts` with a Firebase-based implementation (Firestore for prayer times, Auth for admin).

---

## RTL / Hebrew

RTL is enabled via `I18nManager.forceRTL(true)` in `App.tsx`. Text inputs and layouts support Hebrew by default.

---

## License

MIT
