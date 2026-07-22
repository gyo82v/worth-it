Worth It - Development Commands

1. Start the development server
Normal development
- npm start

This starts Metro Bundler:
- npx expo start


2. Start Expo and clear cache

- npx expo start --clear
- npm start -- --clear


3. Create / reinstall the Android development build

- npx expo run:android


4. Generate native projects

- npx expo prebuild


5. Check Expo project health

- npx expo-doctor


6. Check installed Expo dependencies

- npx expo install --check


7. Check connected Android devices

- adb devices


8. Restart Android Debug Bridge

- adb kill-server
- adb start-server
- adb devices


9. Check Android SDK location(powershell)

- $env:ANDROID_HOME


10. Check Java installation

- java -version

Check JAVA_HOME:

- $env:JAVA_HOME


11. After changing NativeWind configuration

Restart Metro:

- npx expo start --clear

If native configuration changed:

- npx expo run:android



12. Install an Expo-compatible package

- npx expo install package-name

Example:

npx expo install firebase

instead of:

npm install firebase


13. Install normal npm packages

For JavaScript-only libraries:

- npm install package-name


14. Remove node_modules and reinstall(powershell)

- Remove-Item -Recurse -Force node_modules
- Remove-Item package-lock.json
- npm install

Then:

npx expo start --clear
Git Commands
15. Check changes
git status
16. Save a checkpoint
git add .
git commit -m "Describe changes"

*************************************************

Publishing Preparation (later)
17. Check Expo account
- npx expo whoami

18. Login to Expo
- npx expo login

19. Build Android production app
Later, when publishing:

- eas build --platform android

(Requires EAS CLI.)

Install:

- npm install -g eas-cli
Daily Workflow

For normal app development:

1. Open VS Code

2. Start Metro

npm start

3. Open Worth It Development app on Android

4. Edit code

5. Save

6. Fast Refresh updates automatically
When you need a new Android build

Only after native changes:

Add native library
        ↓
npx expo run:android
        ↓
Continue development
Current Worth It Setup
Expo SDK              57
React                 19.2
React Native          0.86
Expo Router           57
NativeWind            5 preview
Tailwind              4
Android SDK           Installed
Java                  Android Studio JBR
Development Build     Working ✅
Physical Device       Connected ✅