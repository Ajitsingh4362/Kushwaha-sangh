import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).'
  )
}

// createClient throws synchronously if the URL is missing/malformed, which
// (since this file is imported at app startup) used to crash the entire
// React tree into a blank white page. Guard it so the rest of the site
// still renders even if Supabase isn't configured yet.
let client = null
try {
  if (isSupabaseConfigured) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  }
} catch (err) {
  console.error('Failed to initialize Supabase client:', err)
}

export const supabase =
  client ||
  new Proxy(
    {},
    {
      get() {
        throw new Error(
          'Supabase is not configured — check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
        )
      },
    }
  )
