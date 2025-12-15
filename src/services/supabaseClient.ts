import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = "https://youkuglyuzozoaeqceql.supabase.co";
const supabaseAnonKey: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdWt1Z2x5dXpvem9hZXFjZXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjQ3MzYsImV4cCI6MjA4MTM0MDczNn0.y8S7BJppMUjknWChSyoOgKDhbtdvkMqkE8tLmaFOp40";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== "" && supabaseAnonKey !== "";
};
