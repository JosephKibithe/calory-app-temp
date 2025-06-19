import { ExpoConfig, ConfigContext } from "expo/config";

// Load environment variables from .env file in development
// In production, these would be set through EAS build configuration
const SUPABASE_URL = process.env.SUPABASE_URL || "your-supabase-url";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || "your-supabase-anon-key";
const DEEPSEEK_API_KEY =
  process.env.DEEPSEEK_API_KEY || "your-deepseek-api-key";
const GOOGLE_CLOUD_VISION_API_KEY =
  process.env.GOOGLE_CLOUD_VISION_API_KEY || "your-vision-api-key";

console.log(
  "Config loading - Vision API Key available:",
  !!process.env.GOOGLE_CLOUD_VISION_API_KEY
);

export default ({ config }: ConfigContext): ExpoConfig => {
  const expoConfig: ExpoConfig = {
    ...config,
    name: "Calory App",
    slug: "calory-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.caloryapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.yourcompany.caloryapp",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      // Environment variables accessible in the app
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY,
      deepseekApiKey: DEEPSEEK_API_KEY,
      googleCloudVisionApiKey: GOOGLE_CLOUD_VISION_API_KEY,
      eas: {
        projectId: "your-eas-project-id",
      },
      router: {
        origin: false,
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
          cameraPermission:
            "The app accesses your camera to let you take photos of your meals.",
        },
      ],
    ],
  };

  console.log(
    "Expo config - Vision API Key available:",
    !!expoConfig.extra?.googleCloudVisionApiKey
  );

  return expoConfig;
};
