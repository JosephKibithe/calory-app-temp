### Project Overview

A calorie tracking app for iOS that simplifies food logging using AI-powered image recognition. Users capture meal photos, and the app automatically identifies food items, calculates calories/macronutrients, and tracks daily progress. Includes onboarding, subscription paywall, and intuitive meal history visualization.

### Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **UI Library**: React Native Paper
- **Backend/Auth**: Supabase (auth, data storage)
- **Deployment**: Expo Go (development), EAS (production)

---

### Expo Setup

- **Initialization**: Expo CLI with TypeScript template.
- **Core Dependencies**: Expo Camera, Image Picker, Supabase SDK.
- **Config**: Deepseek API keys via `app.config.ts` environment variables.

### Authentication Flow

- **Signup/Login**: Supabase email/password auth with OTP fallback.
- **Paywall**: Stripe integration (via Supabase Edge Functions) for subscription gating.
- **Session Persistence**: Secure local storage for auth tokens.

---

### Feature List

#### 1. **Onboarding & Goal Setup**

- Multi-step form (React Native Paper) to set health goals (calorie targets, dietary preferences).
- Progress saved to Supabase post-authentication.

#### 2. **Meal Capture (Camera/Upload)**

- Expo Camera/Image Picker for photo capture or gallery upload.
- Multi-item support: Single foods or composite meals.

#### 3. **AI Food Analysis**

- **Vision**: Deepseek VL2 OCR processes images → extracts food items/quantities.
- **LLM**: Deepseek chat model calculates calories/macronutrients per item.
- Error handling for ambiguous items (user override option).

#### 4. **Daily Tracking Dashboard**

- Real-time calorie/macro totals (Supabase subscriptions).
- Circular progress bar (remaining calories).
- Swipeable meal cards (Expo Router navigation to details).

#### 5. **Meal History & Trends**

- Supabase-stored meal logs displayed in scrollable list.
- Weekly/monthly summaries (charts via `react-native-svg`).

#### 6. **Offline Support**

- Pending meal sync queue (Expo SQLite for offline-first).
- Sync indicator when back online.

#### 7. **Subscription Management**

- Stripe portal link (handled via Supabase Edge Functions).
- Grace period for expired subscriptions.

---

### Mobile Considerations

- **Navigation**: Stack tabs (Expo Router) for meals/history/settings.
- **Gestures**: Swipe-to-delete meals, pull-to-refresh dashboard.
- **Performance**: Image caching with `expo-image`.
