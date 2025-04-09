import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Read environment variables directly
const SUPABASE_URL = 'https://ebqnxvvkcwxbyhrabiij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicW54dnZrY3d4YnlocmFiaWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDU5NDgsImV4cCI6MjA1OTcyMTk0OH0._WgVFbET7ynHr24WOdWj177VtOGJEghc4mioZvWSTIM';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to get the current session
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
