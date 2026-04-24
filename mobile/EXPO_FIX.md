# Fixing "Failed to Download Remote Update" Error

## Quick Fixes:

### 1. Clear Expo Go Cache
- **Android**: Settings → Apps → Expo Go → Storage → Clear Cache
- **iOS**: Delete and reinstall Expo Go app

### 2. Use Tunnel Mode (if LAN doesn't work)
```bash
cd mobile
npx expo start --tunnel
```

### 3. Use Development Build (Recommended for Production)
Since we're using native modules (@react-native-voice/voice), Expo Go has limitations.

**Option A: Use Development Build**
```bash
cd mobile
npx expo prebuild
npx expo run:android  # or run:ios
```

**Option B: Build with EAS**
```bash
npm install -g eas-cli
eas build:configure
eas build --platform android
```

### 4. Disable Updates (Already Done)
Updates are disabled in `app.json`:
```json
"updates": {
  "enabled": false,
  "checkAutomatically": "NEVER"
}
```

### 5. Restart with Clear Cache
```bash
cd mobile
npx expo start --clear
```

## Why This Error Happens:
- Expo Go tries to download OTA updates
- Network connectivity issues
- SDK version mismatch
- Cache corruption

## Best Solution:
For production, use a **development build** or **standalone build** instead of Expo Go, since we use native voice modules.

