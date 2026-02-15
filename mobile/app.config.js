const path = require('path');
const fs = require('fs');

const base = require('./app.json');
const expo = { ...base.expo };

if (!fs.existsSync(path.resolve(__dirname, 'assets/icon.png'))) {
  delete expo.icon;
}
if (!fs.existsSync(path.resolve(__dirname, 'assets/splash.png'))) {
  expo.splash = { resizeMode: 'contain', backgroundColor: '#1a5f2a' };
}
if (expo.android?.adaptiveIcon && !fs.existsSync(path.resolve(__dirname, expo.android.adaptiveIcon.foregroundImage))) {
  const { adaptiveIcon, ...rest } = expo.android;
  expo.android = rest;
}
if (Array.isArray(expo.plugins)) {
  expo.plugins = expo.plugins.map((p) => {
    if (Array.isArray(p) && p[0] === 'expo-notifications' && p[1]?.icon) {
      if (!fs.existsSync(path.resolve(__dirname, p[1].icon))) {
        const [{ icon, ...rest }] = [p[1]];
        return [p[0], rest];
      }
    }
    return p;
  });
}

module.exports = { expo };
