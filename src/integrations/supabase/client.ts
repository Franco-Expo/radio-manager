import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hkbuzbbzbobscdjnhitd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_tpmxzxcyBv2V8pxW27bfKQ_NrXfewWQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
