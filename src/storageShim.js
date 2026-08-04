// Replicates the window.storage API used throughout App.jsx (get/set/delete/list),
// so the CRM code — originally written for Claude's built-in artifact storage —
// works unchanged here. "shared" data goes to Supabase (real multi-device sync);
// personal (non-shared) data — like the local username — stays in this browser only.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
    "(locally in .env, or in your Vercel project's Environment Variables)."
  );
}

const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");

async function get(key, shared) {
  if (!shared) {
    const value = localStorage.getItem(key);
    if (value === null) throw new Error(`Key not found: ${key}`);
    return { key, value, shared: false };
  }
  const { data, error } = await supabase.from("kv_store").select("value").eq("key", key).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error(`Key not found: ${key}`);
  return { key, value: data.value, shared: true };
}

async function set(key, value, shared) {
  if (!shared) {
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  }
  const { error } = await supabase.from("kv_store").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
  return { key, value, shared: true };
}

async function del(key, shared) {
  if (!shared) {
    localStorage.removeItem(key);
    return { key, deleted: true, shared: false };
  }
  const { error } = await supabase.from("kv_store").delete().eq("key", key);
  if (error) throw error;
  return { key, deleted: true, shared: true };
}

async function list(prefix, shared) {
  if (!shared) {
    const keys = Object.keys(localStorage).filter((k) => !prefix || k.startsWith(prefix));
    return { keys, prefix, shared: false };
  }
  let query = supabase.from("kv_store").select("key");
  if (prefix) query = query.like("key", `${prefix}%`);
  const { data, error } = await query;
  if (error) throw error;
  return { keys: (data || []).map((r) => r.key), prefix, shared: true };
}

window.storage = { get, set, delete: del, list };
