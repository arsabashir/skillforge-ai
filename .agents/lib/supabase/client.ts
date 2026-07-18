import { createClient } from "@supabase/supabase-js";
import type { WeakSpotStore } from "@/lib/weak-spots";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

// TODO: Add browser/server client factories once Supabase auth is enabled.
// TODO: Replace null with a Supabase-backed WeakSpotStore after auth and RLS are configured.
export const weakSpotStore: WeakSpotStore | null = null;
