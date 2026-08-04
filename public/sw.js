// Minimal service worker — just enough for "Add to Home Screen" / install prompts to work.
// Not doing offline caching on purpose: this app needs a live connection to Supabase anyway.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
self.addEventListener("fetch", () => {}); // no-op: pass everything through to the network
