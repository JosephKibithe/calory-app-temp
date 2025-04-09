import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { UserProvider } from '../contexts/UserContext';

// Keep the splash screen visible while we initialize the app
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check if the user is authenticated
    if (!user && segments[0] !== 'login' && segments[0] !== 'register' && segments[0] !== 'forgot-password' && segments[0] !== '') {
      // If the user is not signed in and not on an auth screen, redirect to login
      router.replace('/login');
    } else if (user && (segments[0] === 'login' || segments[0] === 'register' || segments[0] === 'forgot-password' || segments[0] === '')) {
      // If the user is signed in and on an auth screen, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [user, segments, loading]);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
          animationDuration: 200,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          presentation: 'card',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            headerShown: false,
            animation: 'fade',
            gestureEnabled: false, // Prevent going back to onboarding
            animationDuration: 150,
          }}
        />
        <Stack.Screen
          name="capture"
          options={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 200,
            presentation: 'card',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="analysis-results"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="meal-history"
          options={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 150,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 150,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 200,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Hide the splash screen after the app is ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <RootLayoutNav />
      </UserProvider>
    </AuthProvider>
  );
}
