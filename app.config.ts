import { ExpoConfig, ConfigContext } from 'expo/config';

// Load environment variables from .env file in development
// In production, these would be set through EAS build configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Calory App',
  slug: 'calory-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#4CAF50'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.caloryapp'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#4CAF50'
    },
    package: 'com.yourcompany.caloryapp'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    // Environment variables accessible in the app
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    deepseekApiKey: DEEPSEEK_API_KEY,
    eas: {
      projectId: 'your-eas-project-id'
    }
  },
  plugins: [
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera to take photos of your food.'
      }
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos to select images of your food.'
      }
    ]
  ]
});
