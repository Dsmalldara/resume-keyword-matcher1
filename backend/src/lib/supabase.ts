// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Use service role key for backend - bypasses RLS
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role, not anon key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

