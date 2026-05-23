import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

let supabaseAdminInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get the admin client - only call this on the server side
 */
export function getSupabaseAdmin() {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }
  
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  
  supabaseAdminInstance = createClient<Database>(supabaseUrl, supabaseServiceKey);
  return supabaseAdminInstance;
}

// Lazy export for backward compatibility
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const admin = getSupabaseAdmin();
    return (admin as any)[prop];
  },
}) as any;

