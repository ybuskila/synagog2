# Deploying the Synagogue App to Production

## 1. Deploy the Backend API

### Option A: Railway

1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub (connect your repo) or use Railway CLI
3. Set root directory to `backend`
4. Add environment variables:
   - `JWT_SECRET` – random secret (e.g. `openssl rand -hex 32`)
   - `ADMIN_EMAIL` – gabbai login email
   - `ADMIN_PASSWORD` – gabbai password
5. Deploy; Railway assigns a URL like `https://your-app.up.railway.app`

### Option B: Render

1. Create account at [render.com](https://render.com)
2. New → Web Service → Connect repository
3. Root directory: `backend`
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. Add env vars: `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
7. Deploy; URL like `https://synagogue-api.onrender.com`

### Option C: DigitalOcean App Platform / VPS

- Use `Procfile` or run `npm run build && npm start`
- Set `PORT` (often 8080 or provided by host)
- Add `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

**Backend API base URL** (needed for mobile):  
`https://YOUR-BACKEND-URL/api`  
(e.g. `https://synagogue-api.onrender.com/api`)

---

## 2. Update Mobile App with API URL

In `mobile/eas.json`, set your backend URL:

```json
"build": {
  "preview": {
    "env": {
      "EXPO_PUBLIC_API_URL": "https://YOUR-BACKEND-URL/api"
    }
  },
  "production": {
    "env": {
      "EXPO_PUBLIC_API_URL": "https://YOUR-BACKEND-URL/api"
    }
  }
}
```

---

## 3. Build and Publish the Mobile App

### Prerequisites

- Expo account: [expo.dev](https://expo.dev)
- Install EAS CLI: `npm install -g eas-cli`
- Run: `eas login`

### One-time setup

```bash
cd mobile
eas build:configure
```

Update `eas.json` `projectId` with your Expo project ID if prompted.

### Build APK (Android, internal testing)

```bash
cd mobile
eas build --platform android --profile preview
```

Download the APK and share it for testing.

### Build for stores

```bash
# Android (AAB for Play Store)
eas build --platform android --profile production

# iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

### Submit to stores

```bash
eas submit --platform android
eas submit --platform ios
```

---

## 4. Web App (Optional)

```bash
cd mobile
npx expo export --platform web
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

---

## 5. Checklist

- [ ] Backend deployed and reachable
- [ ] `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` set
- [ ] CORS allows your app (backend uses `cors()`; restrict origins if needed)
- [ ] `EXPO_PUBLIC_API_URL` set in eas.json for production builds
- [ ] Assets (icon, splash) added to `mobile/assets/`
