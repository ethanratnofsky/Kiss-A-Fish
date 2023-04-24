import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_KISS_A_FISH_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_KISS_A_FISH_SUPABASE_API_KEY;
console.log(supabaseUrl, supabaseKey);
export const supabase = createClient(supabaseUrl, supabaseKey);
