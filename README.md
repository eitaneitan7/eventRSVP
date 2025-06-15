# 🎉 RSVP Events App

A fullstack event RSVP app with a **React Native mobile frontend** and a **Node.js backend**.

## 📦 Project Structure

```
EventRSVP/
├── backend/      # Node.js Express server
└── frontend/     # React Native mobile app (iOS & Android)
```

---

## 🔧 Prerequisites

- Node.js (v18+)
- npm
- Xcode
- CocoaPods
- Android Studio

---

## ⚙️ Backend Setup (Express)

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   By default, the backend runs on [http://localhost:4000](http://localhost:4000).

---

## 📱 Frontend Setup (React Native)

1. Navigate to the `frontend` folder:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install iOS pods:
   ```bash
   cd ios && pod install && cd ..
   ```

---

## 🚀 Running the App

### Start Metro Bundler:

```bash
npm start
```

Then, in a separate terminal:

### For Android:

```bash
npm run android
```

### For iOS:

```bash
npm run ios
```

---

## 🔗 Deep Linking

Deep linking is supported:

- Example: `frontend://event/12` → opens event detail with ID 12

**Test on Android:**

```bash
adb shell am start -W -a android.intent.action.VIEW -d "frontend://event/12" com.frontend
```

**Test on iOS Simulator:**

```bash
xcrun simctl openurl booted "frontend://event/12"
```

---

## Common Issues

- **iOS build fails?**
  Try cleaning:

  ```bash
    npm run clean:ios

  ```

- **Android stuck or build issues?**
  Try cleaning:

  ```bash
  npm run clean:android
  ```

- **Provisioning errors?**
  Open `ios/frontend.xcworkspace` in Xcode and ensure your personal team is selected under _Signing & Capabilities_.
