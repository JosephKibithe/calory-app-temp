# Calory App

A calorie tracking mobile application for iOS that simplifies food logging using AI-powered image recognition. Users capture meal photos, and the app automatically identifies food items, calculates calories/macronutrients, and tracks daily progress.

## 🚀 Features

- **AI-Powered Food Recognition**: Take photos of your meals and let AI identify food items and calculate nutritional values
- **Daily Tracking Dashboard**: View real-time calorie and macronutrient totals with visual progress indicators
- **Meal History & Trends**: Track your eating patterns over time with detailed meal logs and visualizations
- **Personalized Goals**: Set custom calorie targets based on your health objectives
- **Offline Support**: Continue using the app even without an internet connection
- **Subscription Management**: Access premium features with in-app subscription options

## 🛠️ Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **UI Library**: React Native Paper
- **Backend/Auth**: Supabase (auth, data storage)
- **Deployment**: Expo Go (development), EAS (production)

## 📱 Screens

- **Onboarding**: Multi-step form to set health goals and dietary preferences
- **Dashboard**: Daily calorie tracking with meal summaries
- **Capture**: Camera interface for taking food photos
- **Analysis Results**: AI-processed food items with nutritional breakdown
- **Meal History**: Historical view of past meals and trends
- **Settings**: User preferences and subscription management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS device or simulator (for testing)

### Installation

```sh
# Clone the repository
git clone <repository-url>
cd calory-app

# Install dependencies
npm install

# Start the development server
npm start
```

### Environment Setup

Create an `.env` file in the root directory with the following variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

## 📝 Notes

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- [Supabase Documentation](https://supabase.io/docs)
