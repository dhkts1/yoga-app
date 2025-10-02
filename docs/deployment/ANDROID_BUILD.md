# Building Android APK - Complete Guide

## Overview
The Mindful Yoga App can be packaged as an Android APK using Capacitor, which wraps the PWA in a native Android container. This allows distribution via APK file sharing or Google Play Store.

---

## Prerequisites

- **Java JDK 17**: Required for Android build (verify with `java -version`)
- **Android SDK**: Optional for command-line builds (Android Studio includes it)
- **Node.js**: Already installed for web development

---

## Initial Setup (One-time)

### 1. Install Capacitor dependencies
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 2. Initialize Capacitor
```bash
npx cap init "Mindful Yoga" "com.mindfulyoga.app" --web-dir=dist
```

### 3. Build the web app
```bash
npm run build
```

### 4. Add Android platform
```bash
npx cap add android
```

This creates an `android/` directory with the full Android Studio project (gitignored).

### 5. Sync web assets
```bash
npx cap sync android
```

---

## Build Process

### Option 1: Command Line (Quick Debug Build)
```bash
cd android
./gradlew assembleDebug
```
- Output: `android/app/build/outputs/apk/debug/app-debug.apk`
- Ready to install on devices via USB or file sharing

### Option 2: Android Studio (Full IDE)
```bash
npx cap open android
```
Then in Android Studio:
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- More control over build variants and signing

### Option 3: Release Build (Signed for Distribution)
```bash
cd android
./gradlew assembleRelease
```
- Requires keystore setup for signing (see below)
- Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## Installing APK on Device

### Via USB (ADB)
```bash
cd android
./gradlew installDebug
```
- Requires USB debugging enabled on Android device
- Automatic install when connected

### Via File Transfer
1. Copy APK from `android/app/build/outputs/apk/debug/app-debug.apk`
2. Transfer to Android device (email, cloud storage, USB)
3. Open APK in file manager to install
4. May need to enable "Install from unknown sources"

---

## Updating the App

### When you make changes to web code
```bash
# 1. Rebuild web assets
npm run build

# 2. Sync to Android project
npx cap sync android

# 3. Rebuild APK
cd android
./gradlew assembleDebug
```

### When you modify Android native code
```bash
# Just rebuild
cd android
./gradlew assembleDebug
```

---

## Configuration Files

### capacitor.config.json (Project root)
```json
{
  "appId": "com.mindfulyoga.app",
  "appName": "Mindful Yoga",
  "webDir": "dist"
}
```

### android/app/src/main/res/values/strings.xml
- App name and package configuration
- Auto-generated, generally no changes needed

### android/variables.gradle
- SDK versions and dependency versions
- Default settings work for most cases

---

## Java Version Compatibility Fix

**Issue:** Capacitor requires Java 21 by default, but Java 17 is more widely installed.

**Solution Applied:**
Added to `android/build.gradle`:
```gradle
subprojects {
    afterEvaluate { project ->
        if (project.hasProperty("android")) {
            android {
                compileOptions {
                    sourceCompatibility JavaVersion.VERSION_17
                    targetCompatibility JavaVersion.VERSION_17
                }
            }
        }
    }
}
```

This overrides all subprojects to use Java 17 compatibility.

---

## Release Build Setup (For Production)

### 1. Generate signing keystore
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias yoga-app -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Create `android/keystore.properties`
```properties
storeFile=my-release-key.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=yoga-app
keyPassword=YOUR_KEY_PASSWORD
```

### 3. Update `android/app/build.gradle`
Add before `android` block:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Add to `android.buildTypes.release`:
```gradle
release {
    if (keystorePropertiesFile.exists()) {
        signingConfig signingConfigs.release
    }
    minifyEnabled false
    proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
}
```

### 4. Build signed release APK
```bash
cd android
./gradlew assembleRelease
```

---

## Troubleshooting

### Build fails with "invalid source release: 21"
- Your system has Java 17 but Capacitor expects Java 21
- Solution applied: Java 17 compatibility override in build.gradle

### "flatDir should be avoided" warnings
- Safe to ignore, this is a Capacitor default configuration

### APK won't install on device
- Enable "Install from unknown sources" in Android settings
- For release builds, ensure APK is properly signed

### Changes not appearing in APK
- Run `npm run build` first
- Then `npx cap sync android`
- Then rebuild APK

---

## Directory Structure

```
android/                              # Android Studio project (gitignored)
├── app/
│   ├── src/main/
│   │   ├── assets/public/           # Web app assets (synced from dist/)
│   │   ├── res/                     # Android resources (icons, strings)
│   │   ├── AndroidManifest.xml      # Android app manifest
│   │   └── java/                    # Java/Kotlin code (minimal)
│   ├── build.gradle                 # App-level build config
│   └── capacitor.build.gradle       # Capacitor auto-generated config
├── build.gradle                     # Project-level build config
├── variables.gradle                 # SDK versions and dependencies
└── gradle/                          # Gradle wrapper

capacitor.config.json                # Capacitor configuration (not gitignored)
```

---

## Important Notes

- **PWA features preserved**: Offline support, service worker, localStorage all work
- **No code changes needed**: Same React app runs in native wrapper
- **Automatic updates**: For debug builds, just rebuild and reinstall
- **Native plugins available**: Can add Capacitor plugins for camera, GPS, etc.
- **App store ready**: Release builds can be submitted to Google Play Store

---

**Last Updated**: October 2025
