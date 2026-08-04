import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Hammer, Plus, Trash2, Pencil, X, AlertTriangle, CheckCircle2, Clock,
  LayoutDashboard, ClipboardList, Ruler, ArrowLeft, Play, Square, MessageSquarePlus,
  Megaphone, Star, Phone, Instagram, Send, Users, Radio, TrendingUp, ChevronRight,
  Camera, Image as ImageIcon, Mic, Volume2, Loader2, Sparkles, ThumbsUp, ThumbsDown
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

const COLORS = {
  paper: "#F2ECDE", paperDark: "#E8DFC9", card: "#FFFDF8",
  ink: "#2B2320", inkSoft: "#7A6C5D", line: "rgba(43,35,32,0.16)",
  stain: "#B5651D", stainDark: "#8C4A14", blue: "#3E5C76",
  sage: "#5F7A61", brick: "#A63446", gold: "#C7962C",
};

const STAGE_KEYS = ["design", "production", "installation"];
const STAGE_LABELS = { design: "Конструювання", production: "Виготовлення", installation: "Монтаж" };
const STAGE_COLORS = { design: COLORS.blue, production: COLORS.stain, installation: COLORS.sage };

const SOURCE_OPTIONS = [
  { v: "instagram", l: "Instagram", icon: Instagram },
  { v: "telegram", l: "Telegram", icon: Send },
  { v: "referral", l: "Сарафанне радіо", icon: Users },
  { v: "ads", l: "Реклама", icon: Megaphone },
  { v: "other", l: "Інше", icon: Radio },
];
const sourceLabel = (v) => (SOURCE_OPTIONS.find((s) => s.v === v) || {}).l || v;
const sourceIcon = (v) => (SOURCE_OPTIONS.find((s) => s.v === v) || {}).icon || Radio;

const STATUS_OPTIONS = [
  { v: "lead", l: "Новий лід", color: COLORS.blue, bg: "#E9EEF3" },
  { v: "in_progress", l: "В роботі", color: COLORS.stainDark, bg: "#FBF1DE" },
  { v: "done", l: "Завершено", color: COLORS.sage, bg: "#E7EFE7" },
  { v: "lost", l: "Відмова", color: COLORS.brick, bg: "#FBEAEA" },
];
const statusMeta = (v) => STATUS_OPTIONS.find((s) => s.v === v) || STATUS_OPTIONS[0];

const ITEM_CATEGORIES = [
  { v: "material", l: "Матеріал", color: "#3E5C76" },
  { v: "edge", l: "Кромка", color: "#4A7C6F" },
  { v: "hardware", l: "Фурнітура", color: "#B5651D" },
  { v: "extra", l: "Додаткова опція", color: "#C7962C" },
  { v: "production", l: "Виготовлення", color: "#5F7A61" },
  { v: "assembly", l: "Збірка меблів", color: "#8C6D9C" },
  { v: "delivery", l: "Доставка", color: "#A63446" },
  { v: "other", l: "Інше", color: "#7A6C5D" },
];
const categoryMeta = (v) => ITEM_CATEGORIES.find((c) => c.v === v) || ITEM_CATEGORIES.find((c) => c.v === "other");
const CLIENT_VISIBLE_CATEGORIES = ["material", "edge", "hardware", "extra"];
const HARDWARE_BRAND_PRESETS = [
  "Blum (Австрія)", "Hafele (Німеччина)", "Hettich (Німеччина)", "GTV (Польща)", "Muller",
];
const MATERIAL_BRAND_PRESETS = [
  "Egger (Австрія)", "Kronospan (Австрія)", "Swisspan (Україна)", "Saviola (Італія)",
];

const PHOTO_CATEGORIES = [
  { v: "design", l: "Конструювання" },
  { v: "production", l: "Виготовлення" },
  { v: "installation", l: "Монтаж" },
  { v: "final", l: "Готовий результат" },
];
const photoLabel = (v) => (PHOTO_CATEGORIES.find((c) => c.v === v) || {}).l || v;

const SURVEY_QUESTIONS = [
  "Наскільки ви загалом задоволені результатом — від 1 до 10?",
  "Що вам найбільше сподобалось у співпраці з нами?",
  "Чи були якісь незручності, затримки або те, що засмутило?",
  "Чи порекомендували б ви нас знайомим і чому?",
];

const LOGO_DATA_URI = "data:image/png;base64,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V19zyCGHPPOZz/yzP/3TG2+8sWkWqUrZ9ndklar3/uf//K4//3P2k1fEqHunhNs+9KEbb7xxbe3Axo0b//qv//r3//XvN80ipZQjmuuvf9vzTz/98MO3bN26devWrfP5nCy58D7SSei69phjj7nhhv/Q9fTrMeoeWABJOrKqqltuueXmm28GTCSfqtR13ZVX/sbrL7/i0E2bDtu8+YYbbnjnO9/ZtE1KKbNvxwxH0y6zHyQ94ctcKkyAooXRBUvd1bqeLf+b/1n1P5zZF9TV8p/DT6q6rpa/qsdfDX9bz+p6tmFlg4hce+0b+/FV/ddRW4+qlh9R9y+4/m3XX3fddf1vt2zZct9995166qm9QZvVs5X5iohcfvnlf/mXf/nh2277lVf+iojM5yv6I9727992zz33VIOgzkknnfyiF724StVsNqvrWZWq1Q2rd91115YtW/Smn+V7rMbb7G9hNpuLyHOec9odd9wxn8/VC8aVWVlZEZHXX/H6v/qrv/rQbbe99jWv7Xl9M3VrN9/87t/93d/NN/7II49s3HgIgNlsVldq3Sq9bu77Ovyw+M/avTiZ2vsynANHUj99c7HpIUd+uSLAwIgQi3TsUkpf+MLnD9/yjHe/+90XX3xxSunRnz7aV1IwxICzlflS8kdk15O71tfXq6p2mdTVV19z6623fuSjH73m2mu0FWvapq5nr33d697ylre2bXvIxkNWV1cfeujBHTu+hjR07gFN09R1fckllzzvec978Yte/NzTnjufzamldhUPIb9/13VVXfWiLWKIPlgqs4hc85vX3HrLrbf91w9dfc3VGnXs33mxWDvzzDNe+MIX/uIv/uK/+T/+zW23ffjAgQOz2ZykHRVvxu9YFztVElVq+hY5Up0NcDN8lLIxJZAFvUgyaIkmplNDRNh1rOvZfffdd+m//Je/93u/d9NNN9V1/da3vvXTn/70QDoXEdm/b//LX37+1VdfXdf1FVe8fsfXdnz3u/9zZb7SdR0g64v1c87+Z3VVffaznxXB7/zO75x44kkPP/yDvuWka7tDN28G5MEHv59SapqmbduVlRUgLZqmJwCmlJrFQkT+8A+v2/mTH29YXX3ooR9c+5u/qfpePLssy2cmpK7rxkikr1IDABaLxdkvOZvk333q70Tkf/vff68n9S2nigtFZN++/a9+9WuOOOLIDRs2PP/5L7jxxv+r61rJk0HNHD+rN0KYqczAREg7GXDVZn5WGeRnganru2sQ2gr0rJeeXC7f+c533vjGNwL49V//9VtvvfXMM8544sknB9UxEeExxx575plnbNiw+uEP3/a+972vV/mlSF1Vi8Xi9Vdeceq2U9/97pu7js9+9rMv+9VffedN76xSatq2ntVPPbV73759LzrrRffff39V1wL0pJxZPVvu8K7dsGGDiPz6lVd+895vVlUlgqqq0AqLHWPD/aSUerHhuqqWcW+31EevqpqL9Tdc9YZt27b9p5v/Eztu23bqFVdc8ba3vS1VVbNY9G+6efPmW2+95frrr69SvXHj6p1fuXPHjh133nnnfL7Sta1IaAOHGTgUBR3EtyGzEOH2D7hMe56aummZusu+byB0qUJfTaqqxWL9wgsuPHTzoR/72MdI3vWVu2az2Ww2Z0eplrezcXXjh2+77YYbblheWVX33LaUsL6+2Lr16PPOO/8P/uAP+g7u7373u294wxv+9M/+dNEsEhKQSP6X9/6XP3vXn331H7764IMPisgv//NXzOb1Jz/5yT516bPnruue2vNUT74RkbZt+h1Q0npe/rNrW5J9z/hQYJ73O399fe3oo4+56KKLrr/+/9y/b29H3n//A9dcfdWNN75jsVjPvL6Uqn4Ufds164v1+Xxl06ZNBQq9GXipx2rbgcFlym0xFUJdaGn1nASWcSItFQAUeuVyyVUEQFVX73jHO6699trHn3j83Jede9NNN/1k50+WWzhJ76o3bdpU1/WGDauLxaJfVgApVYvF4rd+64333nvPBz7wgfwBr371qy+99NLbb7+9Xqnbtp3P5n9xy18cufXIT33qU/d8857VldWTTzn5uuuuw8CRSJLW1teA9IEPfGDnzp1VVa2urr79hrd/6ctfms3mS82GAKf1Dv7kk0/+6Ec/ulgsNh2y6dvf/tZb3vrWXgdi8fTi6quv+sY3vnHLLX+RX/+v/tWrXvva13zgAx+o61m/Qvv377vqqqvOOOMMQLZt2/7FL37h85/7/Gw2a7MKuZ7ooGkqvtVMAuYVaqykhjqh6pq0uhcFGcmSOqib0F1CxIRAWizWV1c3nnfeeYdvPuzur999/wP3z2Z9x6YAqWN7zNHHAPjxj3+cUqLRj5aO3bOedequXU/u3r27X/u264466qj5bPbwww8j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";
const DEALS_KEY = "crm-deals-v1";
const CAMPAIGNS_KEY = "crm-campaigns-v1";
const CONTENT_KEY = "crm-content-v1";
const USERNAME_KEY = "crm-username-v1"; // personal (not shared) — each device remembers its own owner's name

const STOPWORDS = new Set(["і","та","й","а","але","це","що","як","не","на","з","із","для","або","чи","дуже","трохи","було","була","був","були","ще","вже","до","по","при","так","то","же","цей","ця","всі","все","також","бо","у","в","на","за","від","про"]);

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function genOrderCode() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function num(v) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
function fmtMoney(v) { return Math.round(v).toLocaleString("uk-UA") + " ₴"; }
function fmtHrs(seconds) {
  if (!seconds || seconds <= 0) return "0 год";
  const h = seconds / 3600;
  if (h < 1) return Math.round(seconds / 60) + " хв";
  return (Math.round(h * 10) / 10) + " год";
}
function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString("uk-UA"); } catch { return iso; }
}
function fmtDateTime(ts) {
  try { return new Date(ts).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch { return ""; }
}
function emptyStage() { return { totalSeconds: 0, running: false, startedAt: null, log: [] }; }
function emptyDeal() {
  return {
    id: uid(), client: "", contact: "", source: "instagram", request: "",
    campaignId: null, referredBy: "", referralPayout: { amount: "", paid: false, paidAt: "" }, referralInformed: false,
    project: "", createdAt: new Date().toISOString().slice(0, 10), dueDate: "", status: "lead",
    stages: { design: emptyStage(), production: emptyStage(), installation: emptyStage() },
    revenue: "", items: [], photos: [], feedback: null, voiceSurvey: null,
    installedAt: "", warrantyDone: false, contentPosted: false, orderCode: genOrderCode(), projectCode: "",
    deposit: "", depositDate: "", lastEditedBy: "", lastEditedAt: "",
  };
}
function emptyItem(category) { return { id: uid(), category: category || "material", name: "", qty: "", price: "" }; }
// keeps older saved deals (before itemized costs / photos / voice survey existed) working without losing data
function normalizeDeal(d) {
  const items = (Array.isArray(d.items) ? d.items : []).map((it) => ({ ...it, qty: it.qty || "" }));
  if (items.length === 0 && num(d.costs) > 0) {
    items.push({ id: uid(), category: "other", name: "Витрати (перенесено)", qty: "", price: d.costs });
  }
  return {
    ...d, items, photos: Array.isArray(d.photos) ? d.photos : [], voiceSurvey: d.voiceSurvey || null,
    referredBy: d.referredBy || "", dueDate: d.dueDate || "", project: d.project || "",
    referralPayout: d.referralPayout || { amount: "", paid: false, paidAt: "" },
    referralInformed: d.referralInformed || false,
    installedAt: d.installedAt || "", warrantyDone: d.warrantyDone || false, contentPosted: d.contentPosted || false,
    orderCode: d.orderCode || genOrderCode(), projectCode: d.projectCode || "",
    deposit: d.deposit || "", depositDate: d.depositDate || "", lastEditedBy: d.lastEditedBy || "", lastEditedAt: d.lastEditedAt || "",
  };
}
function itemsTotal(deal) { return (deal.items || []).reduce((s, i) => s + num(i.price), 0); }
function netProfit(deal) { return num(deal.revenue) - itemsTotal(deal); }
function emptyCampaign() {
  return { id: uid(), name: "", platform: "instagram", budget: "", startDate: new Date().toISOString().slice(0, 10), note: "" };
}

// resizes + compresses a photo before it goes into storage (keeps each entry small and fast)
function fileToCompressedDataURL(file, maxWidth = 1000, quality = 0.62) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Не вдалося прочитати файл"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Не вдалося обробити фото"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---------- Stage ruler visual ----------
function StageRuler({ stages }) {
  const total = STAGE_KEYS.reduce((s, k) => s + stages[k].totalSeconds, 0);
  if (total === 0) return <div style={{ color: COLORS.inkSoft, fontSize: 12, fontStyle: "italic" }}>Часу по етапах ще не зафіксовано</div>;
  return (
    <div>
      <div style={{ display: "flex", height: 10, borderRadius: 3, overflow: "hidden", border: `1px solid ${COLORS.line}` }}>
        {STAGE_KEYS.map((k) => {
          const s = stages[k].totalSeconds;
          if (s <= 0) return null;
          return <div key={k} title={`${STAGE_LABELS[k]}: ${fmtHrs(s)}`} style={{ width: `${(s / total) * 100}%`, backgroundColor: STAGE_COLORS[k] }} />;
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
        {STAGE_KEYS.map((k) => (
          <span key={k} style={{ fontSize: 11, color: COLORS.inkSoft, fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: STAGE_COLORS[k], display: "inline-block" }} />
            {STAGE_LABELS[k]} · {fmtHrs(stages[k].totalSeconds)}
          </span>
        ))}
      </div>
    </div>
  );
}

function CostRuler({ items }) {
  const byCategory = {};
  ITEM_CATEGORIES.forEach((c) => { byCategory[c.v] = 0; });
  items.forEach((it) => { byCategory[it.category] = (byCategory[it.category] || 0) + num(it.price); });
  const total = ITEM_CATEGORIES.reduce((s, c) => s + byCategory[c.v], 0);
  if (total === 0) return null;
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", height: 8, borderRadius: 3, overflow: "hidden", border: `1px solid ${COLORS.line}` }}>
        {ITEM_CATEGORIES.map((c) => {
          const v = byCategory[c.v];
          if (v <= 0) return null;
          return <div key={c.v} title={`${c.l}: ${fmtMoney(v)}`} style={{ width: `${(v / total) * 100}%`, backgroundColor: c.color }} />;
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [clientOrderCode] = useState(() => {
    try { return new URLSearchParams(window.location.search).get("order"); } catch (e) { return null; }
  });
  const [clientProjectCode] = useState(() => {
    try { return new URLSearchParams(window.location.search).get("project"); } catch (e) { return null; }
  });
  const [deals, setDeals] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [contentPosts, setContentPosts] = useState([]);
  const [userName, setUserName] = useState("");
  const [userNameLoaded, setUserNameLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newDeal, setNewDeal] = useState(emptyDeal());
  const [newCampaign, setNewCampaign] = useState(emptyCampaign());
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(Date.now());
  const [loadError, setLoadError] = useState(false);
  const touchStartRef = useRef(null);
  const goBack = () => { setTab("pipeline"); setSelectedId(null); };
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || tab !== "detail") return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = Math.abs(t.clientY - touchStartRef.current.y);
    // right-swipe starting near the left edge, mostly horizontal — like iOS "back"
    if (touchStartRef.current.x < 60 && dx > 70 && dy < 60) goBack();
    touchStartRef.current = null;
  };
  const noteDraftsRef = useRef({});
  const [, forceNote] = useState(0);

  // ---------- Load (with one retry — a failed fetch on first try doesn't always mean "empty") ----------
  const fetchKeyWithRetry = async (key) => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await window.storage.get(key, true);
      } catch (e) {
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1200));
      }
    }
    throw new Error("load-failed");
  };

  useEffect(() => {
    (async () => {
      let dealsFailed = false, campaignsFailed = false;
      try {
        const res = await fetchKeyWithRetry(DEALS_KEY);
        if (res && res.value) {
          const raw = JSON.parse(res.value);
          const normalized = raw.map(normalizeDeal);
          setDeals(normalized);
          const anyCodeAdded = normalized.some((d, i) => !raw[i] || !raw[i].orderCode);
          if (anyCodeAdded) {
            window.storage.set(DEALS_KEY, JSON.stringify(normalized), true).catch(() => {});
          }
        }
      } catch (e) { dealsFailed = true; }
      try {
        const res2 = await fetchKeyWithRetry(CAMPAIGNS_KEY);
        if (res2 && res2.value) setCampaigns(JSON.parse(res2.value));
      } catch (e) { campaignsFailed = true; }
      try {
        const res3 = await fetchKeyWithRetry(CONTENT_KEY);
        if (res3 && res3.value) setContentPosts(JSON.parse(res3.value));
      } catch (e) { /* no content yet — fine */ }
      try {
        const res4 = await window.storage.get(USERNAME_KEY, false);
        if (res4 && res4.value) setUserName(res4.value);
      } catch (e) { /* not set yet — fine */ }
      setUserNameLoaded(true);
      // can't reliably tell "genuinely empty" apart from "failed to load" from here —
      // so if the main deals fetch still failed after a retry, say so plainly instead of guessing
      if (dealsFailed) setLoadError(true);
      setLoading(false);
    })();
  }, []);

  const dealsSaveTimer = useRef(null);
  const campaignsSaveTimer = useRef(null);
  const contentSaveTimer = useRef(null);

  const persistDeals = useCallback((next) => {
    setDeals(next);
    if (dealsSaveTimer.current) clearTimeout(dealsSaveTimer.current);
    dealsSaveTimer.current = setTimeout(async () => {
      try { await window.storage.set(DEALS_KEY, JSON.stringify(next), true); setError(""); }
      catch (e) { setError("Не вдалося зберегти дані. Перевірте звʼязок і спробуйте ще раз."); }
    }, 700);
  }, []);
  const persistCampaigns = useCallback((next) => {
    setCampaigns(next);
    if (campaignsSaveTimer.current) clearTimeout(campaignsSaveTimer.current);
    campaignsSaveTimer.current = setTimeout(async () => {
      try { await window.storage.set(CAMPAIGNS_KEY, JSON.stringify(next), true); setError(""); }
      catch (e) { setError("Не вдалося зберегти дані. Перевірте звʼязок і спробуйте ще раз."); }
    }, 700);
  }, []);
  const persistContent = useCallback((next) => {
    setContentPosts(next);
    if (contentSaveTimer.current) clearTimeout(contentSaveTimer.current);
    contentSaveTimer.current = setTimeout(async () => {
      try { await window.storage.set(CONTENT_KEY, JSON.stringify(next), true); setError(""); }
      catch (e) { setError("Не вдалося зберегти дані. Перевірте звʼязок і спробуйте ще раз."); }
    }, 700);
  }, []);

  // saves immediately if the tab is closed/hidden mid-typing, so a pending debounce isn't lost
  useEffect(() => {
    const flush = () => {
      if (dealsSaveTimer.current) { clearTimeout(dealsSaveTimer.current); window.storage.set(DEALS_KEY, JSON.stringify(deals), true).catch(() => {}); }
      if (campaignsSaveTimer.current) { clearTimeout(campaignsSaveTimer.current); window.storage.set(CAMPAIGNS_KEY, JSON.stringify(campaigns), true).catch(() => {}); }
      if (contentSaveTimer.current) { clearTimeout(contentSaveTimer.current); window.storage.set(CONTENT_KEY, JSON.stringify(contentPosts), true).catch(() => {}); }
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("beforeunload", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, [deals, campaigns, contentPosts]);

  // ---------- Live ticking while any timer runs ----------
  const anyRunning = deals.some((d) => STAGE_KEYS.some((k) => d.stages[k].running));
  useEffect(() => {
    if (!anyRunning) return;
    const iv = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [anyRunning]);

  // ---------- Deal helpers ----------
  const saveUserName = (name) => {
    setUserName(name);
    window.storage.set(USERNAME_KEY, name, false).catch(() => {});
  };
  const updateDeal = (id, patch) => {
    let finalPatch = patch;
    if (Object.prototype.hasOwnProperty.call(patch, "project")) {
      const trimmed = (patch.project || "").trim();
      if (trimmed) {
        const sibling = deals.find((d) => d.id !== id && (d.project || "").trim().toLowerCase() === trimmed.toLowerCase() && d.projectCode);
        const current = deals.find((d) => d.id === id);
        finalPatch = { ...patch, projectCode: sibling ? sibling.projectCode : (current?.projectCode || genOrderCode()) };
      } else {
        finalPatch = { ...patch, projectCode: "" };
      }
    }
    persistDeals(deals.map((d) => (d.id === id ? { ...d, ...finalPatch, lastEditedBy: userName || d.lastEditedBy, lastEditedAt: new Date().toISOString() } : d)));
  };
  const updateStage = (id, stageKey, patch) =>
    persistDeals(deals.map((d) => d.id === id ? { ...d, stages: { ...d.stages, [stageKey]: { ...d.stages[stageKey], ...patch } }, lastEditedBy: userName || d.lastEditedBy, lastEditedAt: new Date().toISOString() } : d));

  const startStage = (id, stageKey) => updateStage(id, stageKey, { running: true, startedAt: Date.now() });
  const stopStage = (id, stageKey, note) => {
    const d = deals.find((x) => x.id === id);
    const st = d.stages[stageKey];
    const elapsed = st.startedAt ? Math.max(0, Math.round((Date.now() - st.startedAt) / 1000)) : 0;
    const entry = { id: uid(), ts: Date.now(), type: "session", seconds: elapsed, note: note || "" };
    updateStage(id, stageKey, {
      running: false, startedAt: null,
      totalSeconds: st.totalSeconds + elapsed,
      log: [entry, ...st.log],
    });
  };
  const addNoteToStage = (id, stageKey, note) => {
    if (!note.trim()) return;
    const d = deals.find((x) => x.id === id);
    const st = d.stages[stageKey];
    const entry = { id: uid(), ts: Date.now(), type: "note", seconds: null, note: note.trim() };
    updateStage(id, stageKey, { log: [entry, ...st.log] });
  };
  const addItem = (dealId, category) => {
    const d = deals.find((x) => x.id === dealId);
    persistDeals(deals.map((x) => x.id === dealId ? { ...x, items: [...(x.items || []), emptyItem(category)] } : x));
  };
  const updateItem = (dealId, itemId, patch) => {
    persistDeals(deals.map((d) => d.id === dealId ? { ...d, items: d.items.map((it) => it.id === itemId ? { ...it, ...patch } : it) } : d));
  };
  const removeItem = (dealId, itemId) => {
    persistDeals(deals.map((d) => d.id === dealId ? { ...d, items: d.items.filter((it) => it.id !== itemId) } : d));
  };
  const addPhoto = async (dealId, category, file) => {
    try {
      const dataUrl = await fileToCompressedDataURL(file);
      const photoId = uid();
      await window.storage.set(`photo:${photoId}`, dataUrl, true);
      const d = deals.find((x) => x.id === dealId);
      const photo = { id: photoId, category, caption: "", ts: Date.now() };
      await persistDeals(deals.map((x) => x.id === dealId ? { ...x, photos: [...(x.photos || []), photo] } : x));
    } catch (e) {
      setError("Не вдалося завантажити фото. Спробуйте ще раз.");
    }
  };
  const removePhoto = async (dealId, photoId) => {
    try { await window.storage.delete(`photo:${photoId}`, true); } catch (e) {}
    persistDeals(deals.map((d) => d.id === dealId ? { ...d, photos: d.photos.filter((p) => p.id !== photoId) } : d));
  };
  const saveVoiceSurvey = (dealId, survey) => updateDeal(dealId, { voiceSurvey: survey });
  const removeDeal = async (id) => {
    await persistDeals(deals.filter((d) => d.id !== id));
    if (selectedId === id) { setSelectedId(null); setTab("pipeline"); }
  };
  const removeProject = async (dealIds) => {
    await persistDeals(deals.filter((d) => !dealIds.includes(d.id)));
    if (selectedId && dealIds.includes(selectedId)) { setSelectedId(null); setTab("pipeline"); }
  };
  const submitNewDeal = async (e) => {
    e.preventDefault();
    if (!newDeal.client.trim()) { setError("Вкажіть імʼя клієнта."); return; }
    setError("");
    const trimmedProject = (newDeal.project || "").trim();
    const sibling = trimmedProject ? deals.find((d) => (d.project || "").trim().toLowerCase() === trimmedProject.toLowerCase() && d.projectCode) : null;
    const projectCode = trimmedProject ? (sibling ? sibling.projectCode : genOrderCode()) : "";
    await persistDeals([{ ...newDeal, client: newDeal.client.trim(), request: newDeal.request.trim(), projectCode }, ...deals]);
    setNewDeal(emptyDeal());
    setShowAdd(false);
  };
  const submitFeedback = (id, fb) => updateDeal(id, { feedback: { ...fb, createdAt: new Date().toISOString() } });
  const submitNewCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) { setError("Вкажіть назву кампанії."); return; }
    setError("");
    await persistCampaigns([{ ...newCampaign, name: newCampaign.name.trim() }, ...campaigns]);
    setNewCampaign(emptyCampaign());
    setShowAddCampaign(false);
  };
  const removeCampaign = async (id) => {
    await persistCampaigns(campaigns.filter((c) => c.id !== id));
  };
  const addContentPost = (post) => persistContent([{ ...post, id: uid(), createdAt: new Date().toISOString(), posted: false }, ...contentPosts]);
  const toggleContentPosted = (id) => persistContent(contentPosts.map((p) => p.id === id ? { ...p, posted: !p.posted } : p));
  const removeContentPost = (id) => persistContent(contentPosts.filter((p) => p.id !== id));

  // ---------- Stats ----------
  const stats = useMemo(() => {
    const withStageData = deals.filter((d) => STAGE_KEYS.some((k) => d.stages[k].totalSeconds > 0));
    const done = deals.filter((d) => d.status === "done");
    const lost = deals.filter((d) => d.status === "lost");
    const withProfit = done.filter((d) => num(d.revenue) > 0);

    const costByCategory = {};
    ITEM_CATEGORIES.forEach((c) => { costByCategory[c.v] = 0; });
    deals.forEach((d) => (d.items || []).forEach((it) => { costByCategory[it.category] = (costByCategory[it.category] || 0) + num(it.price); }));
    const costBarData = ITEM_CATEGORIES.map((c) => ({ name: c.l, сума: Math.round(costByCategory[c.v]) })).filter((c) => c.сума > 0);

    const referralMap = {};
    deals.filter((d) => d.source === "referral" && d.referredBy && d.referredBy.trim()).forEach((d) => {
      const key = d.referredBy.trim();
      const keyLower = key.toLowerCase();
      if (!referralMap[keyLower]) referralMap[keyLower] = { name: key, count: 0, won: 0, revenue: 0, owed: 0, paid: 0 };
      referralMap[keyLower].count++;
      if (d.status === "done") { referralMap[keyLower].won++; referralMap[keyLower].revenue += netProfit(d); }
      const payoutAmount = num(d.referralPayout?.amount);
      if (payoutAmount > 0) {
        if (d.referralPayout.paid) referralMap[keyLower].paid += payoutAmount;
        else referralMap[keyLower].owed += payoutAmount;
      }
    });
    const topReferrers = Object.values(referralMap).sort((a, b) => b.count - a.count).slice(0, 6);
    const pastClientsToInform = deals.filter((d) => d.status === "done" && !d.referralInformed);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const warrantyDue = deals
      .filter((d) => d.status === "done" && d.installedAt && !d.warrantyDone)
      .map((d) => {
        const installed = new Date(d.installedAt);
        const monthsSince = (today - installed) / (1000 * 60 * 60 * 24 * 30.44);
        return { ...d, monthsSince };
      })
      .filter((d) => d.monthsSince >= 5.5)
      .sort((a, b) => b.monthsSince - a.monthsSince);

    const contentReady = deals.filter((d) => d.status === "done" && !d.contentPosted && d.photos.some((p) => p.category === "final"));

    const avgByStage = {};
    STAGE_KEYS.forEach((k) => {
      const vals = withStageData.map((d) => d.stages[k].totalSeconds).filter((v) => v > 0);
      avgByStage[k] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
    const totalAvg = STAGE_KEYS.reduce((s, k) => s + avgByStage[k], 0);
    let weakStage = null, weakPct = 0;
    if (totalAvg > 0) {
      weakStage = STAGE_KEYS.reduce((a, b) => (avgByStage[a] > avgByStage[b] ? a : b));
      weakPct = (avgByStage[weakStage] / totalAvg) * 100;
    }
    const avgProfit = withProfit.length ? withProfit.reduce((s, d) => s + netProfit(d), 0) / withProfit.length : 0;

    const winRate = (done.length + lost.length) > 0 ? (done.length / (done.length + lost.length)) * 100 : null;

    const bySource = {};
    SOURCE_OPTIONS.forEach((s) => { bySource[s.v] = { total: 0, won: 0 }; });
    deals.forEach((d) => { if (bySource[d.source]) { bySource[d.source].total++; if (d.status === "done") bySource[d.source].won++; } });
    const sourceBarData = SOURCE_OPTIONS.map((s) => ({ name: s.l, ліди: bySource[s.v].total, угоди: bySource[s.v].won }));

    const barData = STAGE_KEYS.map((k) => ({ stage: STAGE_LABELS[k], год: Math.round((avgByStage[k] / 3600) * 10) / 10 }));

    const feedbacks = deals.filter((d) => d.feedback).map((d) => ({ ...d.feedback, client: d.client, title: d.request }));
    const avgRating = feedbacks.length ? feedbacks.reduce((s, f) => s + num(f.rating), 0) / feedbacks.length : null;
    const dislikedWords = {};
    feedbacks.forEach((f) => {
      (f.disliked || "").toLowerCase().replace(/[.,!?;:()"']/g, "").split(/\s+/).forEach((w) => {
        if (w.length > 3 && !STOPWORDS.has(w)) dislikedWords[w] = (dislikedWords[w] || 0) + 1;
      });
    });
    const topDisliked = Object.entries(dislikedWords).filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return {
      total: deals.length, doneCount: done.length, lostCount: lost.length,
      avgByStage, weakStage, weakPct, avgProfit, winRate, sourceBarData, barData, costBarData, topReferrers, pastClientsToInform,
      warrantyDue, contentReady,
      feedbacks, avgRating, topDisliked, hasData: withStageData.length > 0, hasProfitData: withProfit.length > 0,
    };
  }, [deals]);

  const itemNameSuggestions = useMemo(() => {
    const lib = {};
    ITEM_CATEGORIES.forEach((c) => { lib[c.v] = new Set(); });
    HARDWARE_BRAND_PRESETS.forEach((b) => lib.hardware.add(b));
    MATERIAL_BRAND_PRESETS.forEach((b) => lib.material.add(b));
    deals.forEach((d) => (d.items || []).forEach((it) => {
      if (it.name && it.name.trim() && lib[it.category]) lib[it.category].add(it.name.trim());
    }));
    const out = {};
    Object.keys(lib).forEach((k) => { out[k] = [...lib[k]]; });
    return out;
  }, [deals]);

  const campaignStats = useMemo(() => campaigns.map((c) => {
    const linked = deals.filter((d) => d.campaignId === c.id);
    const won = linked.filter((d) => d.status === "done");
    const revenue = won.reduce((s, d) => s + netProfit(d), 0);
    const budget = num(c.budget);
    const costPerLead = linked.length ? budget / linked.length : 0;
    const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : null;
    return { ...c, leadsCount: linked.length, wonCount: won.length, revenue, costPerLead, roi };
  }), [campaigns, deals]);

  const fontImport = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; }
      input, textarea, select { font-family: 'IBM Plex Sans', sans-serif; }
      input:focus, textarea:focus, select:focus { outline: 2px solid ${COLORS.stain}; outline-offset: 1px; }
      ::placeholder { color: #B5AA98; }
      button { font-family: inherit; }
    `}</style>
  );

  if (loading) {
    return <div style={{ minHeight: "100vh", backgroundColor: COLORS.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Sans', sans-serif", color: COLORS.inkSoft }}>{fontImport}Завантаження…</div>;
  }

  // client-facing trackers: reached only via a link with ?order=CODE or ?project=CODE, show nothing of the internal CRM
  if (clientProjectCode) {
    return <div>{fontImport}<ProjectTracker deals={deals} code={clientProjectCode} /></div>;
  }
  if (clientOrderCode) {
    return <div>{fontImport}<ClientTracker deals={deals} code={clientOrderCode} /></div>;
  }

  const selectedDeal = deals.find((d) => d.id === selectedId);

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ minHeight: "100vh", backgroundColor: COLORS.paper, fontFamily: "'IBM Plex Sans', sans-serif", color: COLORS.ink, paddingBottom: tab === "detail" ? 90 : 40 }}>
      {fontImport}

      {/* Header */}
      <div style={{ backgroundColor: COLORS.ink, color: COLORS.paper, padding: "14px 20px 16px", position: "sticky", top: 0, zIndex: 5 }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {tab === "detail" ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  onClick={goBack}
                  style={{
                    background: "none", border: "none", color: COLORS.paper, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 10px 8px 4px", marginLeft: -4,
                  }}
                >
                  <ArrowLeft size={20} />
                  <div style={{ width: 28, height: 28, borderRadius: 7, overflow: "hidden", flexShrink: 0, backgroundColor: "#000" }}>
                    <img src={LOGO_DATA_URI} alt="Space Lab" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 17 }}>Space Lab</span>
                </button>
                {selectedDeal && <ConfirmDeleteButton onConfirm={() => removeDeal(selectedDeal.id)} size={17} dark />}
              </div>
              <div style={{ fontSize: 13, color: "#C9BFAE", padding: "2px 4px 0", fontWeight: 500 }}>
                {selectedDeal?.client || "Замовлення"}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", flexShrink: 0, backgroundColor: "#000" }}>
                <img src={LOGO_DATA_URI} alt="Space Lab" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 19, letterSpacing: "-0.01em" }}>Space Lab</div>
                <div style={{ fontSize: 11.5, color: "#C9BFAE", marginTop: 1 }}>CRM майстерні · ліди · робочий час · реклама · фідбек</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      {tab !== "detail" && (
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", gap: 4, marginTop: 14, borderBottom: `2px solid ${COLORS.line}`, overflowX: "auto" }}>
            {[
              { id: "dashboard", label: "Огляд", icon: LayoutDashboard },
              { id: "pipeline", label: "Замовлення", icon: ClipboardList },
              { id: "ads", label: "Реклама", icon: Megaphone },
              { id: "content", label: "Контент", icon: Sparkles },
            ].map((t) => {
              const Icon = t.icon; const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                  padding: "10px 14px", background: "none", border: "none",
                  borderBottom: active ? `2px solid ${COLORS.stain}` : "2px solid transparent", marginBottom: -2,
                  color: active ? COLORS.ink : COLORS.inkSoft, fontWeight: active ? 600 : 500, fontSize: 14, cursor: "pointer",
                }}>
                  <Icon size={15} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "18px 20px 0" }}>
        {userNameLoaded && !userName && <UserNamePrompt onSave={saveUserName} />}
        {loadError && (
          <div style={{ backgroundColor: "#F2ECDE", border: `1px solid ${COLORS.line}`, color: COLORS.inkSoft, padding: "10px 14px", borderRadius: 8, fontSize: 12.5, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} color={COLORS.stainDark} />
            Не вдалося перевірити попередньо збережені дані (можлива тимчасова помилка сервісу). Якщо ви вже щось вносили раніше, а зараз бачите порожньо — зачекайте хвилину і оновіть сторінку, перш ніж вводити дані знову.
          </div>
        )}
        {error && (
          <div style={{ backgroundColor: "#FBEAEA", border: `1px solid ${COLORS.brick}`, color: COLORS.brick, padding: "10px 14px", borderRadius: 8, fontSize: 13.5, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={15} /> {error}
          </div>
        )}

        {/* ================= DASHBOARD ================= */}
        {tab === "dashboard" && (
          <Dashboard deals={deals} stats={stats} campaignStats={campaignStats} onOpen={(id) => { setSelectedId(id); setTab("detail"); }} updateDeal={updateDeal} />
        )}

        {/* ================= PIPELINE ================= */}
        {tab === "pipeline" && (
          <Pipeline
            deals={deals} campaigns={campaigns}
            showAdd={showAdd} setShowAdd={setShowAdd}
            newDeal={newDeal} setNewDeal={setNewDeal}
            submitNewDeal={submitNewDeal}
            onOpen={(id) => { setSelectedId(id); setTab("detail"); }}
            onDelete={removeDeal}
            onDeleteProject={removeProject}
          />
        )}

        {/* ================= ADS ================= */}
        {tab === "ads" && (
          <Ads
            campaignStats={campaignStats}
            showAddCampaign={showAddCampaign} setShowAddCampaign={setShowAddCampaign}
            newCampaign={newCampaign} setNewCampaign={setNewCampaign}
            submitNewCampaign={submitNewCampaign}
            onDelete={removeCampaign}
          />
        )}

        {/* ================= CONTENT ================= */}
        {tab === "content" && (
          <ContentTab
            deals={deals} posts={contentPosts}
            onAdd={addContentPost} onTogglePosted={toggleContentPosted} onDelete={removeContentPost}
          />
        )}

        {/* ================= DETAIL ================= */}
        {tab === "detail" && selectedDeal && (
          <DealDetail
            deal={selectedDeal} campaigns={campaigns} tick={tick}
            updateDeal={updateDeal} startStage={startStage} stopStage={stopStage}
            addNoteToStage={addNoteToStage} submitFeedback={submitFeedback}
            addItem={addItem} updateItem={updateItem} removeItem={removeItem}
            addPhoto={addPhoto} removePhoto={removePhoto} saveVoiceSurvey={saveVoiceSurvey}
            itemNameSuggestions={itemNameSuggestions}
          />
        )}
      </div>

      {tab === "detail" && (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 10, padding: "10px 16px calc(10px + env(safe-area-inset-bottom))", backgroundColor: COLORS.paper, borderTop: `1px solid ${COLORS.line}` }}>
          <button
            onClick={goBack}
            style={{
              width: "100%", maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              backgroundColor: COLORS.ink, color: COLORS.paper, border: "none", borderRadius: 12, padding: "14px 0",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}
          >
            <ArrowLeft size={19} />
            <div style={{ width: 24, height: 24, borderRadius: 6, overflow: "hidden", flexShrink: 0, backgroundColor: "#000" }}>
              <img src={LOGO_DATA_URI} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontFamily: "'Fraunces', serif" }}>Space Lab</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ deals, stats, campaignStats, onOpen, updateDeal }) {
  if (deals.length === 0) return <EmptyState text="Ще немає жодного замовлення" sub="Додайте перший лід у вкладці «Замовлення»" />;
  const totalAdSpend = campaignStats.reduce((s, c) => s + num(c.budget), 0);
  const totalAdRevenue = campaignStats.reduce((s, c) => s + c.revenue, 0);
  const upcoming = deals
    .filter((d) => d.dueDate && d.status !== "done" && d.status !== "lost")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        <KpiCard label="Всього ліди/угоди" value={stats.total} sub={`${stats.doneCount} завершено · ${stats.lostCount} відмов`} />
        <KpiCard label="Конверсія в угоду" value={stats.winRate !== null ? Math.round(stats.winRate) + "%" : "—"} sub="завершені з тих, що вирішились" accent={COLORS.blue} />
        <KpiCard label="Середній чистий прибуток" value={stats.hasProfitData ? fmtMoney(stats.avgProfit) : "—"} sub="на завершене замовлення" accent={COLORS.sage} />
        <KpiCard label="Середня оцінка клієнтів" value={stats.avgRating !== null ? stats.avgRating.toFixed(1) + " / 5" : "—"} sub={`${stats.feedbacks.length} відгуків`} accent={COLORS.gold} />
      </div>

      <MonthlyReport deals={deals} />

      {upcoming.length > 0 && (
        <ChartCard title="⏱ Найближчі дедлайни">
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 4px" }}>
            {upcoming.map((d) => (
              <div key={d.id} onClick={() => onOpen(d.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px 0" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.client || "Без імені"}</div>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft }}>{d.request ? (d.request.length > 40 ? d.request.slice(0, 40) + "…" : d.request) : "—"}</div>
                </div>
                <DueBadge dueDate={d.dueDate} />
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {stats.weakStage && (
        <Callout icon={AlertTriangle} color={COLORS.brick} bg="#FBEAEA">
          <strong>Слабка ланка: {STAGE_LABELS[stats.weakStage]}.</strong> Цей етап займає в середньому {Math.round(stats.weakPct)}% всього робочого часу над замовленням ({fmtHrs(stats.avgByStage[stats.weakStage])}).
        </Callout>
      )}

      {stats.topDisliked.length > 0 && (
        <Callout icon={AlertTriangle} color={COLORS.stainDark} bg="#FBF1DE">
          <strong>Над чим варто попрацювати (з фідбеку клієнтів):</strong>{" "}
          {stats.topDisliked.map(([w, c]) => `«${w}» (${c})`).join(", ")}
        </Callout>
      )}

      {stats.hasData && (
        <ChartCard title="Середній робочий час по етапах">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={stats.barData} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: COLORS.inkSoft }} axisLine={{ stroke: COLORS.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: `1px solid ${COLORS.line}` }} formatter={(v) => [v + " год", "Середньо"]} />
              <Bar dataKey="год" radius={[4, 4, 0, 0]}>
                {STAGE_KEYS.map((k, i) => <Cell key={i} fill={STAGE_COLORS[k]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <ChartCard title="Джерела звернень: ліди vs угоди">
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={stats.sourceBarData} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: COLORS.inkSoft }} axisLine={{ stroke: COLORS.line }} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: `1px solid ${COLORS.line}` }} />
            <Bar dataKey="ліди" fill={COLORS.paperDark} radius={[3, 3, 0, 0]} />
            <Bar dataKey="угоди" fill={COLORS.sage} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {stats.costBarData.length > 0 && (
        <ChartCard title="Структура витрат (всього по всіх замовленнях)">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={stats.costBarData} layout="vertical" margin={{ top: 4, right: 16, left: 6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: COLORS.inkSoft }} axisLine={{ stroke: COLORS.line }} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: COLORS.inkSoft }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: `1px solid ${COLORS.line}` }} formatter={(v) => [fmtMoney(v), "Витрачено"]} />
              <Bar dataKey="сума" radius={[0, 4, 4, 0]}>
                {stats.costBarData.map((c, i) => <Cell key={i} fill={categoryMeta(ITEM_CATEGORIES.find((x) => x.l === c.name)?.v).color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {campaignStats.length > 0 && (
        <ChartCard title="Реклама: витрачено vs повернулось">
          <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between", padding: "0 6px 10px" }}>
            <span>Витрачено: <strong>{fmtMoney(totalAdSpend)}</strong></span>
            <span>Прибуток з реклами: <strong style={{ color: totalAdRevenue >= totalAdSpend ? COLORS.sage : COLORS.brick }}>{fmtMoney(totalAdRevenue)}</strong></span>
          </div>
        </ChartCard>
      )}

      {stats.pastClientsToInform.length > 0 && (
        <ChartCard title="📞 Кому розповісти про бонус за рекомендацію">
          <div style={{ fontSize: 11.5, color: COLORS.inkSoft, padding: "0 4px 10px" }}>
            Це вже завершені замовлення — саме ці клієнти можуть привести нових просто зараз
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 4px" }}>
            {stats.pastClientsToInform.map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.client || "Без імені"}</div>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft }}>{d.contact || "контакт не вказано"}</div>
                </div>
                <button onClick={() => updateDeal(d.id, { referralInformed: true })} style={{ ...btnSmall(COLORS.blue), fontSize: 11.5 }}>
                  <CheckCircle2 size={12} /> Повідомлено
                </button>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {stats.warrantyDue.length > 0 && (
        <ChartCard title="🛠 Час на гарантійний огляд">
          <div style={{ fontSize: 11.5, color: COLORS.inkSoft, padding: "0 4px 10px" }}>
            Минуло 6+ місяців з монтажу — гарний привід подзвонити і перевірити фурнітуру
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 4px" }}>
            {stats.warrantyDue.map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.client || "Без імені"}</div>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft }}>
                    Монтаж {fmtDate(d.installedAt)} · {Math.round(d.monthsSince)} міс. тому
                  </div>
                </div>
                <button onClick={() => updateDeal(d.id, { warrantyDone: true })} style={{ ...btnSmall(COLORS.sage), fontSize: 11.5 }}>
                  <CheckCircle2 size={12} /> Оглянуто
                </button>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {stats.contentReady.length > 0 && (
        <ChartCard title="📸 Готово для контенту">
          <div style={{ fontSize: 11.5, color: COLORS.inkSoft, padding: "0 4px 10px" }}>
            Завершені роботи з фото, які ще не викладені в Instagram
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 4px" }}>
            {stats.contentReady.map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.client || "Без імені"}</div>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft }}>{d.request ? (d.request.length > 40 ? d.request.slice(0, 40) + "…" : d.request) : "—"}</div>
                </div>
                <button onClick={() => updateDeal(d.id, { contentPosted: true })} style={{ ...btnSmall(COLORS.blue), fontSize: 11.5 }}>
                  <Camera size={12} /> Викладено
                </button>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {stats.topReferrers.length > 0 && (
        <ChartCard title="🏆 Хто найбільше рекомендує вас">
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 4px" }}>
            {stats.topReferrers.map((r, i) => (
              <div key={r.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < stats.topReferrers.length - 1 ? `1px dashed ${COLORS.line}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 99, backgroundColor: i === 0 ? COLORS.gold : COLORS.paperDark,
                    color: i === 0 ? "#fff" : COLORS.inkSoft, fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.name}</span>
                  {r.count >= 2 && <span title="Варто подякувати!" style={{ fontSize: 13 }}>🎁</span>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12.5, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
                    {r.count} {r.count === 1 ? "клієнт" : "клієнти"}
                  </div>
                  {r.owed > 0 && <div style={{ fontSize: 10.5, color: COLORS.brick, fontWeight: 600 }}>🔔 до сплати {fmtMoney(r.owed)}</div>}
                  {r.paid > 0 && <div style={{ fontSize: 10.5, color: COLORS.sage }}>виплачено {fmtMoney(r.paid)}</div>}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {stats.feedbacks.length > 0 && (
        <ChartCard title="Останні відгуки клієнтів">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 4px" }}>
            {stats.feedbacks.slice(-4).reverse().map((f, i) => (
              <div key={i} style={{ borderBottom: i < 3 ? `1px dashed ${COLORS.line}` : "none", paddingBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                  <strong>{f.client}</strong>
                  <StarRow rating={f.rating} size={12} />
                </div>
                {f.liked && <div style={{ fontSize: 12, color: COLORS.sage, marginTop: 2 }}>+ {f.liked}</div>}
                {f.disliked && <div style={{ fontSize: 12, color: COLORS.brick, marginTop: 1 }}>− {f.disliked}</div>}
              </div>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}

// ==================== PIPELINE ====================
function Pipeline({ deals, campaigns, showAdd, setShowAdd, newDeal, setNewDeal, submitNewDeal, onOpen, onDelete, onDeleteProject }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const sorted = [...deals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const clientNames = [...new Set(deals.map((d) => d.client).filter(Boolean))];
  const contactValues = [...new Set(deals.map((d) => d.contact).filter(Boolean))];
  const projectNames = [...new Set(deals.map((d) => d.project).filter(Boolean))];

  const filtered = sorted.filter((d) => {
    const matchesSearch = !search.trim() || (d.client || "").toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    const matchesSource = sourceFilter === "all" || d.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const groupMap = {};
  filtered.forEach((d) => {
    const key = d.project && d.project.trim();
    if (!key) return;
    const lower = key.toLowerCase();
    if (!groupMap[lower]) groupMap[lower] = { name: key, deals: [], totalRevenue: 0 };
    groupMap[lower].deals.push(d);
    groupMap[lower].totalRevenue += netProfit(d);
  });
  const projectGroups = Object.values(groupMap);
  const standalone = filtered.filter((d) => !d.project || !d.project.trim());
  const filtersActive = search.trim() || statusFilter !== "all" || sourceFilter !== "all";

  return (
    <div>
      <button onClick={() => setShowAdd(!showAdd)} style={{
        width: "100%", padding: "12px 0", borderRadius: 8, border: `1px dashed ${COLORS.stain}`,
        backgroundColor: showAdd ? "#FBF1DE" : COLORS.card, color: COLORS.stainDark, fontWeight: 600, fontSize: 14,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16,
      }}>
        <Plus size={16} /> {showAdd ? "Сховати форму" : "Новий лід / звернення"}
      </button>

      {deals.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <input
            style={{ ...inputStyle, flex: "1 1 160px" }}
            placeholder="Пошук за іменем клієнта…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select style={{ ...inputStyle, flex: "1 1 120px" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Всі статуси</option>
            {STATUS_OPTIONS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
          <select style={{ ...inputStyle, flex: "1 1 120px" }} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="all">Всі джерела</option>
            {SOURCE_OPTIONS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>
      )}

      {showAdd && (
        <form onSubmit={submitNewDeal} style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 16, marginBottom: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Клієнт">
              <input
                style={inputStyle} list="client-names-datalist"
                value={newDeal.client}
                onChange={(e) => {
                  const name = e.target.value;
                  const match = deals.find((d) => d.client && d.client.toLowerCase() === name.toLowerCase());
                  setNewDeal({
                    ...newDeal, client: name,
                    contact: (!newDeal.contact && match) ? match.contact : newDeal.contact,
                    project: (!newDeal.project && match) ? match.project : newDeal.project,
                  });
                }}
                placeholder="Ім'я — підкаже, якщо клієнт вже є в базі"
              />
              <datalist id="client-names-datalist">
                {clientNames.map((n) => <option key={n} value={n} />)}
              </datalist>
            </Field>
            <Field label="Контакт">
              <input style={inputStyle} list="client-contacts-datalist" value={newDeal.contact} onChange={(e) => setNewDeal({ ...newDeal, contact: e.target.value })} placeholder="Телефон / Telegram" />
              <datalist id="client-contacts-datalist">
                {contactValues.map((c) => <option key={c} value={c} />)}
              </datalist>
            </Field>
          </div>
          {newDeal.client && deals.some((d) => d.client && d.client.toLowerCase() === newDeal.client.toLowerCase()) && (
            <div style={{ fontSize: 11.5, color: COLORS.sage, display: "flex", alignItems: "center", gap: 5, marginTop: -4 }}>
              <CheckCircle2 size={12} /> Цей клієнт вже є в базі — контакт і проєкт підтягнуто автоматично
            </div>
          )}
          <Field label="Що хоче замовити">
            <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={newDeal.request} onChange={(e) => setNewDeal({ ...newDeal, request: e.target.value })} placeholder="Напр. кухня 4м з островом, дуб" />
          </Field>
          <Field label="Проєкт (якщо кілька приміщень — напр. котедж)">
            <input
              style={inputStyle} list="project-names-list"
              value={newDeal.project} onChange={(e) => setNewDeal({ ...newDeal, project: e.target.value })}
              placeholder="Напр. Котедж — Іваненко (лишити пустим, якщо одне замовлення)"
            />
            <datalist id="project-names-list">
              {projectNames.map((n) => <option key={n} value={n} />)}
            </datalist>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Звідки звернувся">
              <select style={inputStyle} value={newDeal.source} onChange={(e) => setNewDeal({ ...newDeal, source: e.target.value })}>
                {SOURCE_OPTIONS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </select>
            </Field>
            <Field label="Дата звернення"><input type="date" style={inputStyle} value={newDeal.createdAt} onChange={(e) => setNewDeal({ ...newDeal, createdAt: e.target.value })} /></Field>
          </div>
          <Field label="Орієнтовна дата готовності (необов'язково)">
            <input type="date" style={inputStyle} value={newDeal.dueDate} onChange={(e) => setNewDeal({ ...newDeal, dueDate: e.target.value })} />
          </Field>
          {newDeal.source === "ads" && campaigns.length > 0 && (
            <Field label="Рекламна кампанія">
              <select style={inputStyle} value={newDeal.campaignId || ""} onChange={(e) => setNewDeal({ ...newDeal, campaignId: e.target.value || null })}>
                <option value="">Не вказано</option>
                {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          )}
          {newDeal.source === "referral" && (
            <Field label="Хто порекомендував">
              <input
                style={inputStyle} list="client-names-list"
                value={newDeal.referredBy} onChange={(e) => setNewDeal({ ...newDeal, referredBy: e.target.value })}
                placeholder="Ім'я клієнта, який порадив"
              />
              <datalist id="client-names-list">
                {clientNames.map((n) => <option key={n} value={n} />)}
              </datalist>
            </Field>
          )}
          <button type="submit" style={{ backgroundColor: COLORS.stain, color: "#fff", border: "none", padding: "11px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Додати
          </button>
        </form>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          text={filtersActive ? "Нічого не знайдено" : "Список порожній"}
          sub={filtersActive ? "Спробуйте змінити пошук або фільтри" : "Додайте перше звернення клієнта"}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {projectGroups.map((g) => (
            <ProjectGroup key={g.name} group={g} onOpen={onOpen} onDelete={onDelete} onDeleteProject={onDeleteProject} />
          ))}
          {standalone.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {standalone.map((d) => <DealCard key={d.id} d={d} onOpen={onOpen} onDelete={onDelete} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DealCard({ d, onOpen, onDelete }) {
  const meta = statusMeta(d.status);
  const SourceIcon = sourceIcon(d.source);
  const profit = netProfit(d);
  const anyRunning = STAGE_KEYS.some((k) => d.stages[k].running);
  return (
    <div onClick={() => onOpen(d.id)} style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14, cursor: "pointer", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15.5, display: "flex", alignItems: "center", gap: 6 }}>
            {d.client || "Без імені"}
            {anyRunning && <span style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: COLORS.brick, display: "inline-block" }} title="Йде таймер" />}
          </div>
          <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
            <SourceIcon size={12} /> {sourceLabel(d.source)} · {fmtDate(d.createdAt)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ConfirmDeleteButton onConfirm={() => onDelete(d.id)} />
          <ChevronRight size={16} color={COLORS.inkSoft} />
        </div>
      </div>
      {d.request && <div style={{ fontSize: 12.5, color: COLORS.ink, marginTop: 8, opacity: 0.85 }}>{d.request.length > 80 ? d.request.slice(0, 80) + "…" : d.request}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, backgroundColor: meta.bg, color: meta.color, fontWeight: 500 }}>{meta.l}</span>
          {d.dueDate && d.status !== "done" && d.status !== "lost" && <DueBadge dueDate={d.dueDate} />}
        </div>
        {profit !== 0 && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 600, color: profit >= 0 ? COLORS.sage : COLORS.brick }}>{fmtMoney(profit)}</span>}
      </div>
      {d.lastEditedBy && (
        <div style={{ fontSize: 10.5, color: COLORS.inkSoft, marginTop: 6 }}>
          Востаннє редагував(ла): {d.lastEditedBy}
        </div>
      )}
    </div>
  );
}

function ProjectGroup({ group, onOpen, onDelete, onDeleteProject }) {
  const [open, setOpen] = useState(true);
  const doneCount = group.deals.filter((d) => d.status === "done").length;
  return (
    <div style={{ border: `1.5px solid ${COLORS.stain}40`, borderRadius: 12, padding: 12, backgroundColor: "#FBF1DE30" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 15.5, color: COLORS.stainDark, display: "flex", alignItems: "center", gap: 6 }}>
            📁 {group.name}
          </div>
          <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginTop: 2 }}>
            {group.deals.length} {group.deals.length === 1 ? "приміщення" : "приміщень"} · {doneCount}/{group.deals.length} завершено
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ textAlign: "right" }}>
            {group.totalRevenue > 0 && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>{fmtMoney(group.totalRevenue)}</div>}
            <div style={{ fontSize: 10.5, color: COLORS.inkSoft }}>{open ? "згорнути ▲" : "розгорнути ▼"}</div>
          </div>
          <ConfirmDeleteButton onConfirm={() => onDeleteProject(group.deals.map((d) => d.id))} label="Видалити проєкт?" />
        </div>
      </div>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          {group.deals.map((d) => <DealCard key={d.id} d={d} onOpen={onOpen} onDelete={onDelete} />)}
        </div>
      )}
    </div>
  );
}

// ==================== DEAL DETAIL ====================
function DealDetail({ deal, campaigns, tick, updateDeal, startStage, stopStage, addNoteToStage, submitFeedback, addItem, updateItem, removeItem, addPhoto, removePhoto, saveVoiceSurvey, itemNameSuggestions }) {
  const [noteText, setNoteText] = useState({});
  const meta = statusMeta(deal.status);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 30 }}>
      {/* Status + contact */}
      <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {STATUS_OPTIONS.map((s) => (
            <button key={s.v} onClick={() => updateDeal(deal.id, {
              status: s.v,
              installedAt: (s.v === "done" && !deal.installedAt) ? new Date().toISOString().slice(0, 10) : deal.installedAt,
            })} style={{
              fontSize: 12, padding: "6px 11px", borderRadius: 100, cursor: "pointer",
              border: `1px solid ${deal.status === s.v ? s.color : COLORS.line}`,
              backgroundColor: deal.status === s.v ? s.bg : "transparent",
              color: deal.status === s.v ? s.color : COLORS.inkSoft, fontWeight: deal.status === s.v ? 600 : 400,
            }}>{s.l}</button>
          ))}
        </div>
        {deal.status === "done" && (
          <div style={{ marginBottom: 12 }}>
            <Field label="Дата монтажу (для відліку гарантії)">
              <input type="date" style={inputStyle} value={deal.installedAt} onChange={(e) => updateDeal(deal.id, { installedAt: e.target.value })} />
            </Field>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Контакт"><input style={inputStyle} value={deal.contact} onChange={(e) => updateDeal(deal.id, { contact: e.target.value })} placeholder="Телефон / Telegram" /></Field>
          <Field label="Звідки">
            <select style={inputStyle} value={deal.source} onChange={(e) => updateDeal(deal.id, { source: e.target.value })}>
              {SOURCE_OPTIONS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ marginTop: 10 }}>
          <Field label="Що хоче замовити">
            <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={deal.request} onChange={(e) => updateDeal(deal.id, { request: e.target.value })} />
          </Field>
        </div>
        <div style={{ marginTop: 10 }}>
          <Field label="Проєкт (якщо кілька приміщень — напр. котедж)">
            <input style={inputStyle} value={deal.project} onChange={(e) => updateDeal(deal.id, { project: e.target.value })} placeholder="Напр. Котедж — Іваненко" />
          </Field>
        </div>
        <div style={{ marginTop: 10 }}>
          <Field label="Орієнтовна дата готовності">
            <input type="date" style={inputStyle} value={deal.dueDate} onChange={(e) => updateDeal(deal.id, { dueDate: e.target.value })} />
          </Field>
          {deal.dueDate && deal.status !== "done" && deal.status !== "lost" && <DueBadge dueDate={deal.dueDate} style={{ marginTop: 6 }} />}
        </div>

        <ClientLinkBox deal={deal} />
        {deal.lastEditedBy && (
          <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 10 }}>
            Востаннє редагував(ла): <strong>{deal.lastEditedBy}</strong>{deal.lastEditedAt ? ` · ${new Date(deal.lastEditedAt).toLocaleString("uk-UA")}` : ""}
          </div>
        )}
        {deal.source === "ads" && (
          <div style={{ marginTop: 10 }}>
            <Field label="Рекламна кампанія">
              <select style={inputStyle} value={deal.campaignId || ""} onChange={(e) => updateDeal(deal.id, { campaignId: e.target.value || null })}>
                <option value="">Не вказано</option>
                {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
        )}
        {deal.source === "referral" && (
          <div style={{ marginTop: 10 }}>
            <Field label="Хто порекомендував">
              <input style={inputStyle} value={deal.referredBy} onChange={(e) => updateDeal(deal.id, { referredBy: e.target.value })} placeholder="Ім'я клієнта, який порадив" />
            </Field>
            {deal.referredBy && deal.referredBy.trim() && (
              <div style={{ marginTop: 10, backgroundColor: "#FBF1DE", borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.stainDark, marginBottom: 8 }}>💸 Виплата за рекомендацію</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="number" style={{ ...inputStyle, width: 110 }} placeholder="грн"
                    value={deal.referralPayout.amount}
                    onChange={(e) => updateDeal(deal.id, { referralPayout: { ...deal.referralPayout, amount: e.target.value } })}
                  />
                  {!deal.referralPayout.paid ? (
                    <button
                      onClick={() => updateDeal(deal.id, { referralPayout: { ...deal.referralPayout, paid: true, paidAt: new Date().toISOString() } })}
                      style={btnSmall(COLORS.sage)}
                    ><CheckCircle2 size={13} /> Позначити виплачено</button>
                  ) : (
                    <span style={{ fontSize: 12, color: COLORS.sage, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                      <CheckCircle2 size={14} /> Виплачено {fmtDate(deal.referralPayout.paidAt)}
                    </span>
                  )}
                </div>
                {deal.referralPayout.paid && (
                  <button onClick={() => updateDeal(deal.id, { referralPayout: { ...deal.referralPayout, paid: false, paidAt: "" } })} style={{ marginTop: 6, background: "none", border: "none", color: COLORS.inkSoft, fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
                    скасувати позначку
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Specification / itemized costs — right after client wants, before work starts */}
      <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Специфікація замовлення</div>
        <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 10 }}>Матеріали, фурнітура, додаткові опції, робота, доставка — все, що складає собівартість</div>

        {(deal.items || []).length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {deal.items.map((it) => {
              const cm = categoryMeta(it.category);
              const suggestions = (itemNameSuggestions && itemNameSuggestions[it.category]) || [];
              return (
                <div key={it.id} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <select
                    value={it.category}
                    onChange={(e) => updateItem(deal.id, it.id, { category: e.target.value })}
                    style={{ ...inputStyle, width: 110, flexShrink: 0, fontSize: 11.5, padding: "8px 6px", color: cm.color, fontWeight: 600 }}
                  >
                    {ITEM_CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
                  </select>
                  <input
                    style={{ ...inputStyle, flex: "1 1 140px" }}
                    list={`item-names-${it.category}`}
                    placeholder={
                      it.category === "material" ? "Напр. ЛДСП Egger H1176 дуб сонома" :
                      it.category === "edge" ? "Напр. Кромка ПВХ 2мм, колір у тон" :
                      it.category === "hardware" ? "Напр. Напрямні Hafele, завіси Hafele з доتягом" :
                      it.category === "extra" ? "Напр. Скляний фасад, LED-підсвітка" :
                      it.category === "production" ? "Напр. Робота — розкрій, кромкування, фрезерування" :
                      it.category === "assembly" ? "Напр. Збірка коробів, монтаж фурнітури" :
                      it.category === "delivery" ? "Напр. Доставка по місту" : "Назва"
                    }
                    value={it.name}
                    onChange={(e) => updateItem(deal.id, it.id, { name: e.target.value })}
                  />
                  <datalist id={`item-names-${it.category}`}>
                    {suggestions.map((n) => <option key={n} value={n} />)}
                  </datalist>
                  <input
                    type="number" style={{ ...inputStyle, width: 64, flexShrink: 0 }} placeholder="к-сть"
                    value={it.qty}
                    onChange={(e) => updateItem(deal.id, it.id, { qty: e.target.value })}
                  />
                  <input
                    type="number" style={{ ...inputStyle, width: 90, flexShrink: 0 }} placeholder="грн"
                    value={it.price}
                    onChange={(e) => updateItem(deal.id, it.id, { price: e.target.value })}
                  />
                  <button onClick={() => removeItem(deal.id, it.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.brick, flexShrink: 0, padding: 4 }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {ITEM_CATEGORIES.map((c) => (
            <button key={c.v} onClick={() => addItem(deal.id, c.v)} style={{
              fontSize: 11.5, padding: "6px 10px", borderRadius: 100, cursor: "pointer",
              border: `1px solid ${c.color}50`, backgroundColor: "transparent", color: c.color, fontWeight: 500,
              display: "flex", alignItems: "center", gap: 4,
            }}><Plus size={11} /> {c.l}</button>
          ))}
        </div>

        {deal.items && deal.items.length > 0 && <CostRuler items={deal.items} />}

        <div style={{ borderTop: `1px dashed ${COLORS.line}`, marginTop: 12, paddingTop: 12 }}>
          <Field label="Дохід — скільки платить клієнт, грн">
            <input type="number" style={inputStyle} value={deal.revenue} onChange={(e) => updateDeal(deal.id, { revenue: e.target.value })} placeholder="0" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            <Field label="Завдаток отримано, грн">
              <input type="number" style={inputStyle} value={deal.deposit} onChange={(e) => updateDeal(deal.id, { deposit: e.target.value, depositDate: e.target.value && !deal.depositDate ? new Date().toISOString().slice(0, 10) : deal.depositDate })} placeholder="0" />
            </Field>
            <Field label="Дата завдатку">
              <input type="date" style={inputStyle} value={deal.depositDate} onChange={(e) => updateDeal(deal.id, { depositDate: e.target.value })} />
            </Field>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 13.5, fontFamily: "'IBM Plex Mono', monospace" }}>
            <span style={{ color: COLORS.inkSoft }}>Собівартість: {fmtMoney(itemsTotal(deal))}</span>
            <span>Чистими: <strong style={{ color: netProfit(deal) >= 0 ? COLORS.sage : COLORS.brick }}>{fmtMoney(netProfit(deal))}</strong></span>
          </div>
          {num(deal.deposit) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12.5, fontFamily: "'IBM Plex Mono', monospace", color: COLORS.inkSoft }}>
              <span>Отримано завдатком: {fmtMoney(num(deal.deposit))}</span>
              <span>Залишок до сплати: <strong style={{ color: COLORS.ink }}>{fmtMoney(Math.max(0, num(deal.revenue) - num(deal.deposit)))}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Stage timers */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <Ruler size={14} color={COLORS.inkSoft} /> Робочий час по етапах
        </div>
        <StageRuler stages={deal.stages} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {STAGE_KEYS.map((k) => {
            const st = deal.stages[k];
            const liveElapsed = st.running ? Math.max(0, Math.round((tick - st.startedAt) / 1000)) : 0;
            const draft = noteText[k] || "";
            return (
              <div key={k} style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, backgroundColor: STAGE_COLORS[k], display: "inline-block" }} />
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{STAGE_LABELS[k]}</span>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 600, color: st.running ? COLORS.brick : COLORS.ink }}>
                    {fmtHrs(st.totalSeconds + liveElapsed)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  {!st.running ? (
                    <button onClick={() => startStage(deal.id, k)} style={btnSmall(COLORS.sage)}><Play size={13} /> Старт</button>
                  ) : (
                    <button onClick={() => { stopStage(deal.id, k, draft); setNoteText({ ...noteText, [k]: "" }); }} style={btnSmall(COLORS.brick)}><Square size={13} /> Стоп</button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <input
                    style={{ ...inputStyle, flex: 1, fontSize: 12.5, padding: "7px 9px" }}
                    placeholder={st.running ? "Нотатка про поточний момент…" : "Швидка нотатка (без старту таймера)"}
                    value={draft}
                    onChange={(e) => setNoteText({ ...noteText, [k]: e.target.value })}
                  />
                  <button
                    onClick={() => { addNoteToStage(deal.id, k, draft); setNoteText({ ...noteText, [k]: "" }); }}
                    style={{ ...btnSmall(COLORS.blue), padding: "7px 10px" }}
                  ><MessageSquarePlus size={13} /></button>
                </div>
                {st.log.length > 0 && (
                  <div style={{ marginTop: 10, borderTop: `1px dashed ${COLORS.line}`, paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    {st.log.map((entry) => (
                      <div key={entry.id} style={{ fontSize: 11.5, color: COLORS.inkSoft, display: "flex", gap: 6 }}>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>{fmtDateTime(entry.ts)}</span>
                        <span>
                          {entry.type === "session" && <strong style={{ color: COLORS.ink }}>+{fmtHrs(entry.seconds)} </strong>}
                          {entry.note}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <PhotoStrip photos={deal.photos.filter((p) => p.category === k)} onAdd={(file) => addPhoto(deal.id, k, file)} onRemove={(id) => removePhoto(deal.id, id)} label="Проміжне фото" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Final result photos */}
      <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <ImageIcon size={14} color={COLORS.inkSoft} /> Фото після встановлення
        </div>
        <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 10 }}>Готовий результат — це ж і матеріал для портфоліо</div>
        <PhotoStrip photos={deal.photos.filter((p) => p.category === "final")} onAdd={(file) => addPhoto(deal.id, "final", file)} onRemove={(id) => removePhoto(deal.id, id)} label="Фото результату" large />
        {deal.photos.some((p) => p.category === "final") && (
          <button
            onClick={() => updateDeal(deal.id, { contentPosted: !deal.contentPosted })}
            style={{
              marginTop: 10, fontSize: 11.5, padding: "6px 11px", borderRadius: 100, cursor: "pointer",
              border: `1px solid ${deal.contentPosted ? COLORS.sage : COLORS.line}`,
              backgroundColor: deal.contentPosted ? "#E7EFE7" : "transparent",
              color: deal.contentPosted ? COLORS.sage : COLORS.inkSoft, fontWeight: 500,
              display: "inline-flex", alignItems: "center", gap: 5,
            }}
          >
            {deal.contentPosted ? <CheckCircle2 size={12} /> : <Camera size={12} />}
            {deal.contentPosted ? "Викладено в Instagram" : "Позначити викладено"}
          </button>
        )}
      </div>

      {/* Voice survey */}
      <VoiceSurvey deal={deal} onSave={(survey) => saveVoiceSurvey(deal.id, survey)} />
    </div>
  );
}

// ==================== PHOTOS ====================
function PhotoStrip({ photos, onAdd, onRemove, label, large }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [viewerId, setViewerId] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    await onAdd(file);
    setUploading(false);
  };

  return (
    <div style={{ marginTop: large ? 0 : 10 }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            flexShrink: 0, width: large ? 84 : 56, height: large ? 84 : 56, borderRadius: 8,
            border: `1.5px dashed ${COLORS.stain}70`, backgroundColor: "#FBF1DE",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: COLORS.stainDark, cursor: "pointer", gap: 2,
          }}
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={large ? 18 : 15} />}
          <span style={{ fontSize: 9 }}>{uploading ? "..." : label}</span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        {photos.map((p) => (
          <div key={p.id} style={{ position: "relative", flexShrink: 0 }}>
            <PhotoThumb id={p.id} size={large ? 84 : 56} onClick={() => setViewerId(p.id)} />
            <button onClick={() => onRemove(p.id)} style={{
              position: "absolute", top: -5, right: -5, width: 18, height: 18, borderRadius: 99,
              backgroundColor: COLORS.brick, color: "#fff", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
            }}><X size={10} /></button>
          </div>
        ))}
      </div>
      {viewerId && <PhotoViewer id={viewerId} onClose={() => setViewerId(null)} />}
    </div>
  );
}

function PhotoThumb({ id, size, onClick }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await window.storage.get(`photo:${id}`, true);
        if (alive && res) setSrc(res.value);
      } catch (e) {}
    })();
    return () => { alive = false; };
  }, [id]);
  return (
    <div onClick={onClick} style={{
      width: size, height: size, borderRadius: 8, overflow: "hidden", border: `1px solid ${COLORS.line}`,
      backgroundColor: COLORS.paperDark, cursor: "pointer", flexShrink: 0,
    }}>
      {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 size={14} color={COLORS.inkSoft} />
        </div>
      )}
    </div>
  );
}

function PhotoViewer({ id, onClose }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    (async () => {
      try { const res = await window.storage.get(`photo:${id}`, true); if (res) setSrc(res.value); } catch (e) {}
    })();
  }, [id]);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, backgroundColor: "rgba(20,16,12,0.88)", zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#fff", cursor: "pointer" }}><X size={26} /></button>
      {src ? <img src={src} alt="" style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8 }} /> : <Loader2 color="#fff" />}
    </div>
  );
}

// ==================== VOICE SURVEY ====================
function VoiceSurvey({ deal, onSave }) {
  const [step, setStep] = useState(0); // -1 = idle/not started, 0..N-1 = question, N = done
  const [answers, setAnswers] = useState(Array(SURVEY_QUESTIONS.length).fill(""));
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [apiError, setApiError] = useState("");
  const recognitionRef = useRef(null);

  const SpeechRecognitionCtor = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  const supportsVoice = !!SpeechRecognitionCtor;
  const supportsSpeech = typeof window !== "undefined" && !!window.speechSynthesis;

  const speak = (text) => {
    if (!supportsSpeech) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "uk-UA";
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };

  const startListening = (qIndex) => {
    if (!supportsVoice) return;
    const rec = new SpeechRecognitionCtor();
    rec.lang = "uk-UA";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (ev) => {
      let text = "";
      for (let i = 0; i < ev.results.length; i++) text += ev.results[i][0].transcript;
      setInterim(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    setInterim("");
    setListening(true);
    rec.start();
  };
  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };
  const confirmAnswer = (text) => {
    const next = [...answers];
    next[step] = text;
    setAnswers(next);
    setInterim("");
    if (step + 1 < SURVEY_QUESTIONS.length) setStep(step + 1);
    else setStep(SURVEY_QUESTIONS.length);
  };

  const analyze = async () => {
    setAnalyzing(true);
    setApiError("");
    const qa = SURVEY_QUESTIONS.map((q, i) => `${i + 1}. ${q}\nВідповідь: ${answers[i] || "(немає відповіді)"}`).join("\n\n");
    const prompt = `Ти аналізуєш відповіді клієнта меблевої майстерні після монтажу меблів. Ось питання і відповіді:\n\n${qa}\n\nПоверни ТІЛЬКИ JSON без жодних пояснень і без markdown-обгортки у форматі:\n{"summary": "коротке резюме 1-2 речення українською", "positives": ["коротка теза", "..."], "concerns": ["коротка теза", "..."], "estimatedRating": число від 1 до 5}`;
    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || data.error || "Сервер відхилив запит");
      const raw = (data.content || []).map((b) => b.text || "").join("\n").replace(/```json|```/g, "").trim();
      let parsed;
      try { parsed = JSON.parse(raw); } catch { parsed = { summary: raw, positives: [], concerns: [], estimatedRating: null }; }
      const survey = {
        answers: SURVEY_QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] })),
        analysis: parsed, createdAt: new Date().toISOString(),
      };
      onSave(survey);
    } catch (e) {
      setApiError(`Не вдалося проаналізувати: ${e.message || "перевірте зʼєднання і спробуйте ще раз"}.`);
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => { setStep(-1); setAnswers(Array(SURVEY_QUESTIONS.length).fill("")); setInterim(""); };

  return (
    <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
        <Mic size={14} color={COLORS.blue} /> Голосове опитування клієнта
      </div>
      <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 12 }}>
        Дайте телефон клієнту одразу після монтажу — декілька коротких запитань голосом, і ШІ проаналізує відповіді
      </div>

      {!supportsVoice && (
        <div style={{ fontSize: 12, color: COLORS.brick, backgroundColor: "#FBEAEA", padding: "8px 10px", borderRadius: 7, marginBottom: 10 }}>
          Цей браузер не підтримує голосове розпізнавання (спробуйте Chrome на Android). Можна ввести відповіді текстом нижче.
        </div>
      )}

      {deal.voiceSurvey && step === -1 && (
        <VoiceSurveyResult survey={deal.voiceSurvey} onRedo={() => setStep(0)} />
      )}

      {!deal.voiceSurvey && step === -1 && (
        <button onClick={() => setStep(0)} style={{ backgroundColor: COLORS.blue, color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Mic size={14} /> Почати опитування
        </button>
      )}

      {step >= 0 && step < SURVEY_QUESTIONS.length && (
        <div>
          <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 4 }}>Питання {step + 1} з {SURVEY_QUESTIONS.length}</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15.5, marginBottom: 12 }}>{SURVEY_QUESTIONS[step]}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            {supportsSpeech && (
              <button onClick={() => speak(SURVEY_QUESTIONS[step])} style={{ ...btnSmall(COLORS.inkSoft) }}><Volume2 size={13} /> Прослухати</button>
            )}
            {supportsVoice && !listening && (
              <button onClick={() => startListening(step)} style={btnSmall(COLORS.sage)}><Mic size={13} /> Говорити</button>
            )}
            {listening && (
              <button onClick={stopListening} style={btnSmall(COLORS.brick)}><Square size={13} /> Стоп запису</button>
            )}
          </div>
          <textarea
            style={{ ...inputStyle, resize: "vertical" }} rows={3}
            value={listening ? interim : (interim || answers[step])}
            onChange={(e) => setInterim(e.target.value)}
            placeholder="Відповідь з'явиться тут під час запису — або впишіть вручну"
          />
          <button
            onClick={() => confirmAnswer(interim || answers[step])}
            disabled={listening}
            style={{ marginTop: 10, backgroundColor: COLORS.stain, color: "#fff", border: "none", padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: listening ? "default" : "pointer", opacity: listening ? 0.5 : 1 }}
          >
            {step + 1 < SURVEY_QUESTIONS.length ? "Наступне питання" : "Завершити опитування"}
          </button>
        </div>
      )}

      {step === SURVEY_QUESTIONS.length && (
        <div>
          <div style={{ fontSize: 13, color: COLORS.sage, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={15} /> Всі відповіді записано
          </div>
          {apiError && <div style={{ fontSize: 12, color: COLORS.brick, marginBottom: 8 }}>{apiError}</div>}
          <button onClick={analyze} disabled={analyzing} style={{ backgroundColor: COLORS.gold, color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} {analyzing ? "Аналізую…" : "Проаналізувати відповіді"}
          </button>
        </div>
      )}

      {step >= 0 && (
        <button onClick={reset} style={{ marginTop: 10, background: "none", border: "none", color: COLORS.inkSoft, fontSize: 11.5, cursor: "pointer", textDecoration: "underline" }}>
          Скасувати опитування
        </button>
      )}
    </div>
  );
}

function VoiceSurveyResult({ survey, onRedo }) {
  const a = survey.analysis || {};
  return (
    <div>
      {a.estimatedRating != null && <StarRow rating={a.estimatedRating} size={16} />}
      {a.summary && <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>{a.summary}</div>}
      {a.positives && a.positives.length > 0 && (
        <div style={{ marginTop: 8, fontSize: 12, color: COLORS.sage, display: "flex", alignItems: "flex-start", gap: 5 }}>
          <ThumbsUp size={13} style={{ marginTop: 2, flexShrink: 0 }} />
          <span>{a.positives.join(" · ")}</span>
        </div>
      )}
      {a.concerns && a.concerns.length > 0 && (
        <div style={{ marginTop: 5, fontSize: 12, color: COLORS.brick, display: "flex", alignItems: "flex-start", gap: 5 }}>
          <ThumbsDown size={13} style={{ marginTop: 2, flexShrink: 0 }} />
          <span>{a.concerns.join(" · ")}</span>
        </div>
      )}
      <details style={{ marginTop: 10 }}>
        <summary style={{ fontSize: 11.5, color: COLORS.inkSoft, cursor: "pointer" }}>Показати повні відповіді</summary>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          {survey.answers.map((qa, i) => (
            <div key={i} style={{ fontSize: 11.5 }}>
              <div style={{ color: COLORS.inkSoft }}>{qa.question}</div>
              <div style={{ color: COLORS.ink, marginTop: 1 }}>{qa.answer || "—"}</div>
            </div>
          ))}
        </div>
      </details>
      <button onClick={onRedo} style={{ marginTop: 10, background: "none", border: `1px solid ${COLORS.line}`, borderRadius: 7, padding: "6px 12px", fontSize: 11.5, color: COLORS.inkSoft, cursor: "pointer" }}>
        Пройти опитування ще раз
      </button>
    </div>
  );
}

function ReadOnlyGallery({ photos, emptyText }) {
  const [viewerId, setViewerId] = useState(null);
  if (!photos || photos.length === 0) {
    return <div style={{ fontSize: 12, color: COLORS.inkSoft, fontStyle: "italic" }}>{emptyText}</div>;
  }
  return (
    <div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {photos.map((p) => <PhotoThumb key={p.id} id={p.id} size={72} onClick={() => setViewerId(p.id)} />)}
      </div>
      {viewerId && <PhotoViewer id={viewerId} onClose={() => setViewerId(null)} />}
    </div>
  );
}

function ClientTracker({ deals, code }) {
  const deal = deals.find((d) => d.orderCode && d.orderCode.toUpperCase() === (code || "").toUpperCase());

  if (!deal) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: COLORS.paper, fontFamily: "'IBM Plex Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Замовлення не знайдено</div>
          <div style={{ fontSize: 13.5, color: COLORS.inkSoft }}>Перевірте посилання або зверніться до майстра — можливо, посилання застаріло.</div>
        </div>
      </div>
    );
  }

  const steps = [
    { key: "accepted", label: "Замовлення прийнято", done: true },
    { key: "design", label: "Конструювання", stage: "design" },
    { key: "production", label: "Виготовлення", stage: "production" },
    { key: "installation", label: "Монтаж", stage: "installation" },
    { key: "finished", label: "Готово", done: deal.status === "done" },
  ];
  const order = STAGE_KEYS;
  const stageState = (key) => dealStageState(deal, key);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.paper, fontFamily: "'IBM Plex Sans', sans-serif", color: COLORS.ink, paddingBottom: 40 }}>
      <div style={{ backgroundColor: COLORS.ink, padding: "22px 20px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0, backgroundColor: "#000" }}>
            <img src={LOGO_DATA_URI} alt="Space Lab" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: COLORS.paper }}>Space Lab</div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 0" }}>
        <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: COLORS.inkSoft, marginBottom: 4 }}>Ваше замовлення</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 19, marginBottom: 8 }}>{deal.request || "Меблі на замовлення"}</div>
          {deal.dueDate && deal.status !== "done" && <DueBadge dueDate={deal.dueDate} />}
          {deal.status === "done" && (
            <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 100, backgroundColor: "#E7EFE7", color: COLORS.sage, fontWeight: 600 }}>✓ Завершено</span>
          )}
        </div>

        <ClientMaterialsCard deal={deal} />

        <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Прогрес виконання</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((s, i) => {
              const state = s.done !== undefined ? (s.done ? "done" : "pending") : stageState(s.stage);
              const color = state === "done" ? COLORS.sage : state === "active" ? COLORS.blue : COLORS.line;
              const photosForStep = s.stage ? deal.photos.filter((p) => p.category === s.stage) : (s.key === "finished" ? deal.photos.filter((p) => p.category === "final") : []);
              return (
                <div key={s.key} style={{ display: "flex", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: color, flexShrink: 0, marginTop: 3 }} />
                    {i < steps.length - 1 && <div style={{ width: 2, flex: 1, backgroundColor: COLORS.line, minHeight: 24 }} />}
                  </div>
                  <div style={{ paddingBottom: 20, flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: state === "pending" ? 400 : 600, color: state === "pending" ? COLORS.inkSoft : COLORS.ink }}>
                      {s.label}
                      {state === "active" && <span style={{ color: COLORS.blue, fontWeight: 500 }}> · зараз тут</span>}
                    </div>
                    {(state === "done" || state === "active") && photosForStep.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <ReadOnlyGallery photos={photosForStep} emptyText="" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 12, color: COLORS.inkSoft, padding: "0 20px" }}>
          Питання щодо замовлення? Напишіть нам у Telegram чи Instagram — ми на зв'язку.
        </div>
      </div>
    </div>
  );
}

function dealStageState(deal, key) {
  if (deal.status === "done") return "done";
  const idx = STAGE_KEYS.indexOf(key);
  const own = deal.stages[key];
  const laterHasData = STAGE_KEYS.slice(idx + 1).some((k) => deal.stages[k].totalSeconds > 0 || deal.stages[k].running);
  if (laterHasData) return "done";
  if (own.running || own.totalSeconds > 0) return "active";
  return "pending";
}

// client-safe materials summary — names only, no quantities, no prices
function clientMaterialsSummary(deal) {
  const names = (cat) => [...new Set((deal.items || []).filter((it) => it.category === cat && it.name && it.name.trim()).map((it) => it.name.trim()))];
  const decor = [...names("material"), ...names("edge")];
  const hardware = [...names("hardware"), ...names("extra")];
  return { decor, hardware };
}

function ClientMaterialsCard({ deal }) {
  const { decor, hardware } = clientMaterialsSummary(deal);
  if (decor.length === 0 && hardware.length === 0) return null;
  return (
    <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Матеріали й фурнітура</div>
      {decor.length > 0 && (
        <div style={{ marginBottom: hardware.length > 0 ? 8 : 0 }}>
          <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 2 }}>Декор</div>
          <div style={{ fontSize: 13.5 }}>{decor.join(", ")}</div>
        </div>
      )}
      {hardware.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 2 }}>Фурнітура</div>
          <div style={{ fontSize: 13.5 }}>{hardware.join(", ")}</div>
        </div>
      )}
    </div>
  );
}

function ProjectTracker({ deals, code }) {
  const rooms = deals.filter((d) => d.projectCode && d.projectCode.toUpperCase() === (code || "").toUpperCase());

  if (rooms.length === 0) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: COLORS.paper, fontFamily: "'IBM Plex Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Проєкт не знайдено</div>
          <div style={{ fontSize: 13.5, color: COLORS.inkSoft }}>Перевірте посилання або зверніться до майстра — можливо, посилання застаріло.</div>
        </div>
      </div>
    );
  }

  const projectName = rooms[0].project;
  const doneCount = rooms.filter((r) => r.status === "done").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.paper, fontFamily: "'IBM Plex Sans', sans-serif", color: COLORS.ink, paddingBottom: 40 }}>
      <div style={{ backgroundColor: COLORS.ink, padding: "22px 20px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0, backgroundColor: "#000" }}>
            <img src={LOGO_DATA_URI} alt="Space Lab" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: COLORS.paper }}>Space Lab</div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 20px 0" }}>
        <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: COLORS.inkSoft, marginBottom: 4 }}>Ваш проєкт</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{projectName}</div>
          <div style={{ fontSize: 13, color: COLORS.inkSoft }}>{doneCount} з {rooms.length} {rooms.length === 1 ? "приміщення" : "приміщень"} завершено</div>
        </div>

        {rooms.map((deal) => {
          const steps = [
            { key: "accepted", label: "Прийнято", done: true },
            { key: "design", label: "Конструювання", stage: "design" },
            { key: "production", label: "Виготовлення", stage: "production" },
            { key: "installation", label: "Монтаж", stage: "installation" },
            { key: "finished", label: "Готово", done: deal.status === "done" },
          ];
          return (
            <div key={deal.id} style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15.5 }}>{deal.request || "Приміщення"}</div>
                {deal.status === "done" && <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, backgroundColor: "#E7EFE7", color: COLORS.sage, fontWeight: 600 }}>✓ Готово</span>}
                {deal.status !== "done" && deal.dueDate && <DueBadge dueDate={deal.dueDate} />}
              </div>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {steps.map((s, i) => {
                  const state = s.done !== undefined ? (s.done ? "done" : "pending") : dealStageState(deal, s.stage);
                  const color = state === "done" ? COLORS.sage : state === "active" ? COLORS.blue : COLORS.line;
                  return <div key={s.key} title={s.label} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: color }} />;
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.inkSoft }}>
                <span>{steps[0].label}</span>
                <span>{steps[steps.length - 1].label}</span>
              </div>
              {(() => {
                const { decor, hardware } = clientMaterialsSummary(deal);
                if (decor.length === 0 && hardware.length === 0) return null;
                return (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${COLORS.line}`, fontSize: 12.5 }}>
                    {decor.length > 0 && <div style={{ marginBottom: hardware.length > 0 ? 4 : 0 }}><span style={{ color: COLORS.inkSoft }}>Декор: </span>{decor.join(", ")}</div>}
                    {hardware.length > 0 && <div><span style={{ color: COLORS.inkSoft }}>Фурнітура: </span>{hardware.join(", ")}</div>}
                  </div>
                );
              })()}
              {(() => {
                const activeStep = steps.find((s) => s.stage && dealStageState(deal, s.stage) !== "pending");
                const activePhotos = activeStep ? deal.photos.filter((p) => p.category === activeStep.stage) : [];
                const finalPhotos = deal.status === "done" ? deal.photos.filter((p) => p.category === "final") : [];
                const photosToShow = finalPhotos.length > 0 ? finalPhotos : activePhotos;
                return photosToShow.length > 0 ? (
                  <div style={{ marginTop: 12 }}>
                    <ReadOnlyGallery photos={photosToShow} emptyText="" />
                  </div>
                ) : null;
              })()}
            </div>
          );
        })}

        <div style={{ textAlign: "center", fontSize: 12, color: COLORS.inkSoft, padding: "0 20px" }}>
          Питання щодо проєкту? Напишіть нам у Telegram чи Instagram — ми на зв'язку.
        </div>
      </div>
    </div>
  );
}

function ClientLinkBox({ deal }) {
  const [copied, setCopied] = useState(false);
  const [copiedProject, setCopiedProject] = useState(false);
  const base = (() => {
    try { return `${window.location.origin}${window.location.pathname}`; }
    catch (e) { return ""; }
  })();
  const link = `${base}?order=${deal.orderCode}`;
  const projectLink = `${base}?project=${deal.projectCode}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (e) {}
  };
  const copyProject = async () => {
    try { await navigator.clipboard.writeText(projectLink); setCopiedProject(true); setTimeout(() => setCopiedProject(false), 2000); }
    catch (e) {}
  };
  return (
    <div style={{ marginTop: 10, backgroundColor: "#EEF3F6", borderRadius: 8, padding: 12 }}>
      {deal.projectCode ? (
        <>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.blue, marginBottom: 6 }}>🔗 Посилання на весь проєкт "{deal.project}"</div>
          <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 8 }}>
            Одне посилання показує прогрес по всіх кімнатах цього проєкту одразу — саме його й надсилайте клієнту
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, backgroundColor: "#fff", padding: "5px 9px", borderRadius: 6, border: `1px solid ${COLORS.line}` }}>
              {deal.projectCode}
            </span>
            <button onClick={copyProject} style={btnSmall(COLORS.blue)}>
              {copiedProject ? <CheckCircle2 size={12} /> : <Send size={12} />} {copiedProject ? "Скопійовано" : "Копіювати посилання на проєкт"}
            </button>
          </div>
          <details>
            <summary style={{ fontSize: 11, color: COLORS.inkSoft, cursor: "pointer" }}>Або посилання тільки на цю кімнату</summary>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, backgroundColor: "#fff", padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.line}` }}>{deal.orderCode}</span>
              <button onClick={copy} style={{ ...btnSmall(COLORS.inkSoft), backgroundColor: "transparent", color: COLORS.inkSoft, border: `1px solid ${COLORS.line}` }}>
                {copied ? <CheckCircle2 size={11} /> : <Send size={11} />} {copied ? "Скопійовано" : "Копіювати"}
              </button>
            </div>
          </details>
        </>
      ) : (
        <>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.blue, marginBottom: 6 }}>🔗 Посилання для клієнта</div>
          <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 8 }}>
            Клієнт бачить тільки статус свого замовлення й фото — жодних цін чи інших клієнтів
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, backgroundColor: "#fff", padding: "5px 9px", borderRadius: 6, border: `1px solid ${COLORS.line}` }}>
              {deal.orderCode}
            </span>
            <button onClick={copy} style={btnSmall(COLORS.blue)}>
              {copied ? <CheckCircle2 size={12} /> : <Send size={12} />} {copied ? "Скопійовано" : "Копіювати посилання"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== CONTENT ====================
const TOPIC_PRESETS = [
  "ЛДСП проти МДФ — що обрати",
  "Як доглядати за фасадами кухні",
  "Як обрати фурнітуру для шафи-купе",
  "Скільки часу займає виготовлення кухні",
  "Помилки при плануванні гардеробної",
  "Тренди кухонь цього сезону",
];

function buildOrderContext(deal) {
  const materials = (deal.items || [])
    .filter((it) => ["material", "hardware", "extra"].includes(it.category) && it.name)
    .map((it) => it.name).join(", ");
  const liked = deal.feedback?.liked || deal.voiceSurvey?.analysis?.positives?.join("; ") || "";
  const disliked = deal.feedback?.disliked || "";
  const summary = deal.voiceSurvey?.analysis?.summary || "";
  let ctx = `Замовлення: ${deal.request || "меблі на замовлення"}.`;
  if (materials) ctx += ` Використані матеріали/фурнітура: ${materials}.`;
  if (summary) ctx += ` Враження клієнта загалом: ${summary}.`;
  if (liked) ctx += ` Що сподобалось клієнту: ${liked}.`;
  if (disliked) ctx += ` Що можна покращити (не згадувати прямо в пості, врахувати обережно): ${disliked}.`;
  return ctx;
}

async function callClaude(prompt) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 700, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || data.error || "Сервер відхилив запит");
  return (data.content || []).map((b) => b.text || "").join("\n").trim();
}

function ContentTab({ deals, posts, onAdd, onTogglePosted, onDelete }) {
  const [generating, setGenerating] = useState(false);
  const [error, setErr] = useState("");
  const [selectedDealId, setSelectedDealId] = useState("");
  const [customTopic, setCustomTopic] = useState("");

  const eligibleDeals = deals.filter((d) => d.status === "done" && (d.request || d.items?.length));

  const generateFromOrder = async (deal) => {
    setGenerating(true); setErr("");
    try {
      const ctx = buildOrderContext(deal);
      const prompt = `Ти ведеш Instagram меблевої майстерні Space Lab (кухні, шафи, гардеробні на замовлення). Напиши теплий, живий допис для Instagram українською мовою на основі реального виконаного замовлення.\n\n${ctx}\n\nВимоги: 80-150 слів, простою мовою без канцеляризмів, від першої особи майстерні, можна згадати деталь з відгуку клієнта якщо вона позитивна, в кінці — м'який заклик до дії (написати в директ). Після тексту допису онови окремим рядком "Хештеги:" і додай 6-8 доречних хештегів через пробіл. Не додавай жодних пояснень, тільки готовий текст допису.`;
      const text = await callClaude(prompt);
      onAdd({ type: "order", dealId: deal.id, dealClient: deal.client, topic: deal.request, text });
    } catch (e) { setErr(`Не вдалося згенерувати: ${e.message || "перевірте зʼєднання і спробуйте ще раз"}.`); }
    setGenerating(false);
  };

  const generateFromTopic = async (topic) => {
    if (!topic.trim()) return;
    setGenerating(true); setErr("");
    try {
      const prompt = `Ти ведеш Instagram меблевої майстерні Space Lab (кухні, шафи, гардеробні на замовлення). Напиши короткий освітній допис для Instagram українською мовою на тему: "${topic.trim()}".\n\nВимоги: 80-150 слів, простою мовою без жаргону, практична користь для людини, яка планує замовити меблі, в кінці — м'який заклик до дії. Після тексту допису онови окремим рядком "Хештеги:" і додай 6-8 доречних хештегів через пробіл. Не додавай пояснень, тільки готовий текст допису.`;
      const text = await callClaude(prompt);
      onAdd({ type: "topic", dealId: null, dealClient: null, topic: topic.trim(), text });
      setCustomTopic("");
    } catch (e) { setErr(`Не вдалося згенерувати: ${e.message || "перевірте зʼєднання і спробуйте ще раз"}.`); }
    setGenerating(false);
  };

  const copyPost = async (text) => { try { await navigator.clipboard.writeText(text); } catch (e) {} };

  return (
    <div>
      <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={14} color={COLORS.gold} /> З виконаного замовлення
        </div>
        <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 10 }}>Автоматично враховує матеріали й відгук клієнта, якщо він є</div>
        {eligibleDeals.length === 0 ? (
          <div style={{ fontSize: 12, color: COLORS.inkSoft, fontStyle: "italic" }}>Ще немає завершених замовлень для генерації</div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <select style={{ ...inputStyle, flex: 1 }} value={selectedDealId} onChange={(e) => setSelectedDealId(e.target.value)}>
              <option value="">Оберіть замовлення…</option>
              {eligibleDeals.map((d) => <option key={d.id} value={d.id}>{d.client || "Без імені"} — {(d.request || "").slice(0, 40)}</option>)}
            </select>
            <button
              disabled={!selectedDealId || generating}
              onClick={() => generateFromOrder(eligibleDeals.find((d) => d.id === selectedDealId))}
              style={{ ...btnSmall(COLORS.gold), opacity: (!selectedDealId || generating) ? 0.5 : 1 }}
            >
              {generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} Згенерувати
            </button>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Освітній допис на тему</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {TOPIC_PRESETS.map((t) => (
            <button key={t} disabled={generating} onClick={() => generateFromTopic(t)} style={{
              fontSize: 11.5, padding: "6px 10px", borderRadius: 100, cursor: "pointer",
              border: `1px solid ${COLORS.line}`, backgroundColor: "transparent", color: COLORS.inkSoft,
            }}>{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }} placeholder="Або своя тема…" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} />
          <button disabled={generating || !customTopic.trim()} onClick={() => generateFromTopic(customTopic)} style={{ ...btnSmall(COLORS.gold), opacity: (generating || !customTopic.trim()) ? 0.5 : 1 }}>
            {generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} Згенерувати
          </button>
        </div>
      </div>

      {error && <div style={{ fontSize: 12, color: COLORS.brick, marginBottom: 12 }}>{error}</div>}

      {posts.length === 0 ? (
        <EmptyState text="Ще немає згенерованих дописів" sub="Оберіть замовлення або тему вище, щоб отримати перший чернетку" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {posts.map((p) => (
            <div key={p.id} style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, backgroundColor: p.type === "order" ? "#FBF1DE" : "#EEF3F6", color: p.type === "order" ? COLORS.stainDark : COLORS.blue, fontWeight: 500 }}>
                    {p.type === "order" ? `З замовлення: ${p.dealClient || ""}` : "Освітній"}
                  </span>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 4 }}>{fmtDate(p.createdAt)}</div>
                </div>
                <ConfirmDeleteButton onConfirm={() => onDelete(p.id)} />
              </div>
              <div style={{ fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.5, marginBottom: 10 }}>{p.text}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => copyPost(p.text)} style={btnSmall(COLORS.blue)}><Send size={12} /> Копіювати текст</button>
                <button onClick={() => onTogglePosted(p.id)} style={{
                  ...btnSmall(p.posted ? COLORS.sage : COLORS.inkSoft),
                  backgroundColor: p.posted ? COLORS.sage : "transparent", color: p.posted ? "#fff" : COLORS.inkSoft,
                  border: p.posted ? "none" : `1px solid ${COLORS.line}`,
                }}>
                  <CheckCircle2 size={12} /> {p.posted ? "Опубліковано" : "Позначити опубліковано"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== ADS ====================
function Ads({ campaignStats, showAddCampaign, setShowAddCampaign, newCampaign, setNewCampaign, submitNewCampaign, onDelete }) {
  return (
    <div>
      <button onClick={() => setShowAddCampaign(!showAddCampaign)} style={{
        width: "100%", padding: "12px 0", borderRadius: 8, border: `1px dashed ${COLORS.stain}`,
        backgroundColor: showAddCampaign ? "#FBF1DE" : COLORS.card, color: COLORS.stainDark, fontWeight: 600, fontSize: 14,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16,
      }}><Plus size={16} /> {showAddCampaign ? "Сховати форму" : "Нова рекламна кампанія"}</button>

      {showAddCampaign && (
        <form onSubmit={submitNewCampaign} style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 16, marginBottom: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Назва кампанії"><input style={inputStyle} value={newCampaign.name} onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} placeholder="Напр. Таргет кухні — липень" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Платформа">
              <select style={inputStyle} value={newCampaign.platform} onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}>
                <option value="instagram">Instagram</option><option value="facebook">Facebook</option>
                <option value="google">Google</option><option value="tiktok">TikTok</option><option value="other">Інше</option>
              </select>
            </Field>
            <Field label="Дата старту"><input type="date" style={inputStyle} value={newCampaign.startDate} onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })} /></Field>
          </div>
          <Field label="Бюджет, грн"><input type="number" style={inputStyle} value={newCampaign.budget} onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })} placeholder="0" /></Field>
          <button type="submit" style={{ backgroundColor: COLORS.stain, color: "#fff", border: "none", padding: "11px 0", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Додати</button>
        </form>
      )}

      {campaignStats.length === 0 ? <EmptyState text="Ще немає рекламних кампаній" sub="Додайте, щоб рахувати ROI по лідах, привʼязаних до реклами" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {campaignStats.map((c) => (
            <div key={c.id} style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2 }}>{c.platform} · від {fmtDate(c.startDate)}</div>
                </div>
                <ConfirmDeleteButton onConfirm={() => onDelete(c.id)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, fontSize: 12 }}>
                <MiniStat label="Бюджет" value={fmtMoney(num(c.budget))} />
                <MiniStat label="Лідів" value={c.leadsCount} />
                <MiniStat label="Угод" value={c.wonCount} />
                <MiniStat label="Ціна ліда" value={c.leadsCount ? fmtMoney(c.costPerLead) : "—"} />
                <MiniStat label="Прибуток" value={fmtMoney(c.revenue)} />
                <MiniStat label="ROI" value={c.roi !== null ? Math.round(c.roi) + "%" : "—"} color={c.roi !== null ? (c.roi >= 0 ? COLORS.sage : COLORS.brick) : COLORS.ink} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== small shared components ====================
const inputStyle = { width: "100%", padding: "9px 11px", borderRadius: 7, border: `1px solid ${COLORS.line}`, backgroundColor: COLORS.card, fontSize: 14, color: COLORS.ink };
const btnSmall = (color) => ({ display: "flex", alignItems: "center", gap: 5, backgroundColor: color, color: "#fff", border: "none", padding: "7px 12px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: "pointer" });

function DueBadge({ dueDate, style }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate); due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due - today) / 86400000);
  let color, bg, text;
  if (diffDays < 0) { color = COLORS.brick; bg = "#FBEAEA"; text = `Прострочено на ${Math.abs(diffDays)} дн.`; }
  else if (diffDays === 0) { color = COLORS.stainDark; bg = "#FBF1DE"; text = "Готовність сьогодні"; }
  else if (diffDays <= 3) { color = COLORS.stainDark; bg = "#FBF1DE"; text = `Лишилось ${diffDays} дн.`; }
  else { color = COLORS.sage; bg = "#E7EFE7"; text = `Лишилось ${diffDays} дн.`; }
  return (
    <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, backgroundColor: bg, color, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4, ...style }}>
      <Clock size={11} /> {text}
    </span>
  );
}

function Field({ label, children }) {
  return <label style={{ display: "block" }}><div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginBottom: 5, fontWeight: 500 }}>{label}</div>{children}</label>;
}
function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: "14px 14px" }}>
      <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 19, fontWeight: 600, color: accent || COLORS.ink }}>{value}</div>
      <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 3 }}>{sub}</div>
    </div>
  );
}
function MiniStat({ label, value, color }) {
  return (
    <div style={{ backgroundColor: COLORS.paper, borderRadius: 7, padding: "7px 8px" }}>
      <div style={{ fontSize: 10, color: COLORS.inkSoft }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 12.5, color: color || COLORS.ink }}>{value}</div>
    </div>
  );
}
function ChartCard({ title, children }) {
  return (
    <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: "14px 10px 10px", marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, paddingLeft: 6 }}>{title}</div>
      {children}
    </div>
  );
}
function Callout({ icon: Icon, color, bg, children }) {
  return (
    <div style={{ backgroundColor: bg, border: `1px solid ${color}30`, borderLeft: `4px solid ${color}`, borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10 }}>
      <Icon size={17} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}
function UserNamePrompt({ onSave }) {
  const [name, setName] = useState("");
  return (
    <div style={{ backgroundColor: "#EEF3F6", border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: 12, marginBottom: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.blue, marginBottom: 6 }}>👋 Як вас звати?</div>
      <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 8 }}>
        Це збережеться тільки на цьому пристрої — потрібно, щоб бачити, хто саме що редагував
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input style={{ ...inputStyle, flex: 1 }} placeholder="Ваше ім'я" value={name} onChange={(e) => setName(e.target.value)} />
        <button disabled={!name.trim()} onClick={() => onSave(name.trim())} style={{ ...btnSmall(COLORS.blue), opacity: !name.trim() ? 0.5 : 1 }}>Зберегти</button>
      </div>
    </div>
  );
}

function ConfirmDeleteButton({ onConfirm, size = 15, label, dark }) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  const handleClick = (e) => {
    e.stopPropagation();
    if (!armed) {
      setArmed(true);
      timerRef.current = setTimeout(() => setArmed(false), 3000);
    } else {
      clearTimeout(timerRef.current);
      setArmed(false);
      onConfirm();
    }
  };
  const idleColor = dark ? "#C9BFAE" : COLORS.inkSoft;
  const idleBorder = dark ? "1px solid #55524A" : `1px solid ${COLORS.line}`;
  return (
    <button onClick={handleClick} style={{
      background: armed ? COLORS.brick : "none", border: armed ? "none" : idleBorder,
      borderRadius: 7, cursor: "pointer", color: armed ? "#fff" : idleColor, padding: armed ? "5px 9px" : 4,
      display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, flexShrink: 0,
    }}>
      <Trash2 size={size} /> {armed && (label || "Точно?")}
    </button>
  );
}

function IconBtn({ onClick, icon: Icon, danger }) {
  return (
    <button onClick={onClick} style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${COLORS.line}`, backgroundColor: COLORS.paper, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: danger ? COLORS.brick : COLORS.inkSoft }}>
      <Icon size={14} />
    </button>
  );
}
function StarRow({ rating, size }) {
  return <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map((i) => <Star key={i} size={size} fill={i <= rating ? COLORS.gold : "none"} color={COLORS.gold} />)}</div>;
}
function StarPicker({ rating, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
          <Star size={22} fill={i <= rating ? COLORS.gold : "none"} color={COLORS.gold} />
        </button>
      ))}
    </div>
  );
}
function MonthlyReport({ deals }) {
  const [period, setPeriod] = useState("current"); // current | previous

  const now = new Date();
  const targetMonth = period === "current" ? now.getMonth() : (now.getMonth() === 0 ? 11 : now.getMonth() - 1);
  const targetYear = period === "current" ? now.getFullYear() : (now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
  const inRange = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
  };

  const newLeads = deals.filter((d) => inRange(d.createdAt));
  // attribute revenue/profit to the month a project actually closed (installedAt), falling back to createdAt for older records without it
  const closedThisPeriod = deals.filter((d) => d.status === "done" && inRange(d.installedAt || d.createdAt));
  const lostThisPeriod = deals.filter((d) => d.status === "lost" && inRange(d.createdAt));

  const totalRevenue = closedThisPeriod.reduce((s, d) => s + num(d.revenue), 0);
  const totalProfit = closedThisPeriod.reduce((s, d) => s + netProfit(d), 0);
  const totalCosts = totalRevenue - totalProfit;
  const conversion = (closedThisPeriod.length + lostThisPeriod.length) > 0
    ? Math.round((closedThisPeriod.length / (closedThisPeriod.length + lostThisPeriod.length)) * 100)
    : null;

  const monthLabel = new Date(targetYear, targetMonth, 1).toLocaleDateString("uk-UA", { month: "long", year: "numeric" });

  return (
    <ChartCard title="🗓 Місячний звіт">
      <div style={{ display: "flex", gap: 6, padding: "0 4px 12px" }}>
        {[{ v: "current", l: "Цей місяць" }, { v: "previous", l: "Минулий місяць" }].map((p) => (
          <button key={p.v} onClick={() => setPeriod(p.v)} style={{
            fontSize: 12, padding: "6px 12px", borderRadius: 100, cursor: "pointer",
            border: `1px solid ${period === p.v ? COLORS.stain : COLORS.line}`,
            backgroundColor: period === p.v ? "#FBF1DE" : "transparent",
            color: period === p.v ? COLORS.stainDark : COLORS.inkSoft, fontWeight: period === p.v ? 600 : 400,
          }}>{p.l}</button>
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: COLORS.inkSoft, padding: "0 4px 10px", textTransform: "capitalize" }}>{monthLabel}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 4px" }}>
        <MiniStat label="Нові ліди" value={newLeads.length} />
        <MiniStat label="Завершено" value={closedThisPeriod.length} />
        <MiniStat label="Дохід" value={fmtMoney(totalRevenue)} />
        <MiniStat label="Витрати" value={fmtMoney(totalCosts)} />
        <MiniStat label="Чистий прибуток" value={fmtMoney(totalProfit)} color={totalProfit >= 0 ? COLORS.sage : COLORS.brick} />
        <MiniStat label="Конверсія" value={conversion !== null ? conversion + "%" : "—"} />
      </div>
    </ChartCard>
  );
}

function EmptyState({ text, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", backgroundColor: COLORS.card, border: `1px dashed ${COLORS.line}`, borderRadius: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.paperDark, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
        <Ruler size={20} color={COLORS.inkSoft} />
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, marginBottom: 6 }}>{text}</div>
      <div style={{ fontSize: 13, color: COLORS.inkSoft }}>{sub}</div>
    </div>
  );
}
