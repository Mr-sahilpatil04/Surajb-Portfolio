/* =============================================
   SUPABASE CONFIG (file storage only)
   -----------------------------------------------
   Firestore still handles all data (notes metadata, access logs) and
   Firebase Authentication still handles faculty login. Supabase is used
   ONLY to store the actual PDF/PPT/PPTX files, since Firebase Storage now
   requires a paid Blaze plan even at zero usage.

   1. Create a free project at https://supabase.com (no card required).
   2. Project Settings → API → copy "Project URL" and the "anon public" key.
   3. Storage → New bucket → name it exactly "notes" → toggle "Public bucket" ON.
   4. See SETUP.md for the storage policy to paste in the SQL editor.
   ============================================= */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ⬇️ REPLACE with your Supabase project's values
const SUPABASE_URL = "https://ddixzmjdtvzizzjwzukw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkaXh6bWpkdHZ6aXp6and6dWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjI0NzgsImV4cCI6MjEwNDAzODQ3OH0.QL_YrpMhWhKvEqery8-gBUlCrdH7B3K_90Rq4rHkdn0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const NOTES_BUCKET = "notes";
