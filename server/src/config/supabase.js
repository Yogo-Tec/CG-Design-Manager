import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_ANON_KEY;
export const supabaseEnabled=Boolean(url&&key);
export const supabase=supabaseEnabled?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}}):null;
