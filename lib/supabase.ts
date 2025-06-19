import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Read environment variables with proper validation
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Validate Supabase configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase configuration. Please check your .env file and ensure SUPABASE_URL and SUPABASE_ANON_KEY are set."
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
  global: {
    headers: { "X-Supabase-Debug": "true" }, // Enable debugging headers
  },
});

// Helper function to get the current user
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Helper function to get the current session
export const getCurrentSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

// Add error handling for Supabase operations
export const handleSupabaseError = (error: any) => {
  console.error("[SUPABASE] Error:", {
    message: error.message,
    details: error.details,
    code: error.code,
    hint: error.hint,
  });

  // Return a user-friendly error message
  return error.message || "An unexpected error occurred";
};
