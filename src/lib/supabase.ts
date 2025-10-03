import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase not configured - using fallback mode')
}