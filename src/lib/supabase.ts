import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined')

// Create and export the Supabase client only if configured
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase not configured - using fallback mode')
}