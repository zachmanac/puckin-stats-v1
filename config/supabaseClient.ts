import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = `https://cserpqafduzvhzigjtwa.supabase.co`;
const supabaseAnonKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZXJwcWFmZHV6dmh6aWdqdHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NDgxODUsImV4cCI6MjA1NjEyNDE4NX0.sKjF8KmoymgWVnisaHRDxKesibIZHReNTyVXdThY6p0`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
