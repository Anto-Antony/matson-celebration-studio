import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPERBASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPERBASE_PUBLIC_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not set.");
  }
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

  