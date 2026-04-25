import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// CONFIG — remplace ces 2 valeurs par les tiennes
// ============================================================
const SUPABASE_URL = "https://mamiervnrsnpnkusgvgu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_r95oTdvQUGpXJJwQKgKU6Q_HAX9aCGl";
// ============================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GOLD = "#f0b429";
const GOLD_LIGHT = "#ffd166";
const GOLD_DARK = "#b8860b";
const BG = "#070709";
const BG2 = "#0e0e12";
const BG3 = "#13131a";

const SPORTS = [
  { id: "football", label: "Football", icon: "⚽", color: "#f0b429" },
  { id: "nba", label: "NBA", icon: "🏀", color: "#e07b39" },
  { id: "tennis", label: "Tennis", icon: "🎾", color: "#8bc34a" },
  { id: "f1", label: "F1", icon: "🏎️", color: "#e53935" },
];

const LEAGUES_NATIONAL = [
  { id: "premier_league", label: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "#3d0e5e" },
  { id: "ligue1", label: "Ligue 1", flag: "🇫🇷", color: "#003f8a" },
  { id: "laliga", label: "LaLiga", flag: "🇪🇸", color: "#c00b2f" },
  { id: "bundesliga", label: "Bundesliga", flag: "🇩🇪", color: "#d3010c" },
  { id: "serie_a", label: "Serie A", flag: "🇮🇹", color: "#1a56db" },
  { id: "saudi", label: "Saudi Pro League", flag: "🇸🇦", color: "#006c35" },
  { id: "liga_portugal", label: "Liga Portugal", flag: "🇵🇹", color: "#006600" },
  { id: "super_lig", label: "Süper Lig", flag: "🇹🇷", color: "#e30a17" },
  { id: "eredivisie", label: "Eredivisie", flag: "🇳🇱", color: "#e87722" },
];

const LEAGUES_INTERNATIONAL = [
  { id: "champions_league", label: "Champions League", flag: "🏆", color: "#0e1f6e" },
  { id: "world_cup", label: "World Cup", flag: "🌍", color: "#8B6914" },
];

const ALL_LEAGUES = [...LEAGUES_NATIONAL, ...LEAGUES_INTERNATIONAL];

const TENNIS_TOURS = [
  { id: "atp", label: "ATP", flag: "🔵", color: "#1565c0" },
  { id: "wta", label: "WTA", flag: "🟣", color: "#ad1457" },
];
const TENNIS_SLAMS = [
  { id: "open_australie", label: "Open d'Australie", flag: "🇦🇺", color: "#29b6f6" },
  { id: "roland_garros", label: "Roland Garros", flag: "🇫🇷", color: "#ffa726" },
  { id: "wimbledon", label: "Wimbledon", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "#66bb6a" },
  { id: "us_open", label: "US Open", flag: "🇺🇸", color: "#42a5f5" },
];
const ALL_TENNIS = [...TENNIS_TOURS, ...TENNIS_SLAMS];
const BET_TYPES = ["1", "N", "2", "1/N", "1/2", "N/2", "Plus de 2.5", "Moins de 2.5", "BTTS Oui", "BTTS Non", "Personnalisé"];

const CONFIDENCE_CONFIG = {
  1: { color: "#444455", label: "Très risqué" },
  2: { color: "#ef5350", label: "Risqué" },
  3: { color: "#ffa726", label: "Modéré" },
  4: { color: "#ffd166", label: "Bon" },
  5: { color: "#f0b429", label: "Excellent" },
};

const inputStyle = {
  width: "100%", background: BG3, border: "1px solid #1e1e28",
  borderRadius: "10px", padding: "13px 16px", color: "#fff",
  fontSize: "15px", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "4px 0" }}>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}33)` }} />
      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: GOLD, opacity: 0.4 }} />
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${GOLD}33, transparent)` }} />
    </div>
  );
}

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={() => onChange(s)}
            onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
            style={{
              background: "none", border: "none", cursor: "pointer", fontSize: "26px",
              color: s <= active ? (CONFIDENCE_CONFIG[active]?.color || GOLD) : "#1e1e28",
              transition: "all 0.15s",
              filter: s <= active ? `drop-shadow(0 0 8px ${CONFIDENCE_CONFIG[active]?.color}88)` : "none",
              transform: s <= active ? "scale(1.2)" : "scale(1)", padding: "0",
            }}>★</button>
        ))}
      </div>
      {value > 0 && (
        <div style={{ marginTop: "8px", color: CONFIDENCE_CONFIG[value].color, fontSize: "11px", fontFamily: "monospace", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: CONFIDENCE_CONFIG[value].color }} />
          {CONFIDENCE_CONFIG[value].label.toUpperCase()}
        </div>
      )}
    </div>
  );
}

function TipCard({ tip, onDelete, onToggleResult, isAdmin }) {
  const sport = SPORTS.find(s => s.id === tip.sport) || SPORTS[0];
  const conf = CONFIDENCE_CONFIG[tip.confidence];
  return (
    <div style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "14px", overflow: "hidden" }}>
      <div style={{ height: "2px", background: tip.result === "win" ? "linear-gradient(90deg, #66bb6a, #43a047)" : tip.result === "loss" ? "linear-gradient(90deg, #ef5350, #e53935)" : `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD})` }} />
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "22px" }}>{sport.icon}</span>
            <div>
              <div style={{ color: sport.color, fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px" }}>{sport.label.toUpperCase()}</div>
              <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace" }}>{tip.date}</div>
            </div>
          </div>
          {isAdmin && (
            <button onClick={() => onDelete(tip.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#222", fontSize: "18px", padding: "0" }}
              onMouseEnter={e => e.target.style.color = "#ef5350"}
              onMouseLeave={e => e.target.style.color = "#222"}>✕</button>
          )}
        </div>
        <div style={{ color: "#fff", fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>{tip.match}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <div style={{ background: BG3, borderRadius: "6px", padding: "4px 10px", color: GOLD, fontSize: "12px", fontFamily: "monospace", fontWeight: "700", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{tip.bet}</div>
          {tip.odds && <div style={{ background: BG3, borderRadius: "6px", padding: "4px 10px", color: "#fff", fontSize: "12px", fontFamily: "monospace" }}>{tip.odds}</div>}
        </div>
        {tip.note && <div style={{ color: "#444", fontSize: "12px", fontStyle: "italic", marginBottom: "10px" }}>{tip.note}</div>}
        <GoldDivider />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= tip.confidence ? conf?.color : "#1e1e28", fontSize: "14px" }}>★</span>)}
          </div>
          {isAdmin ? (
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => onToggleResult(tip.id, "win")} style={{ background: tip.result === "win" ? "#66bb6a22" : "none", border: `1px solid ${tip.result === "win" ? "#66bb6a" : "#1e1e28"}`, borderRadius: "6px", padding: "4px 10px", color: tip.result === "win" ? "#66bb6a" : "#333", fontSize: "11px", cursor: "pointer", fontFamily: "monospace" }}>WIN</button>
              <button onClick={() => onToggleResult(tip.id, "loss")} style={{ background: tip.result === "loss" ? "#ef535022" : "none", border: `1px solid ${tip.result === "loss" ? "#ef5350" : "#1e1e28"}`, borderRadius: "6px", padding: "4px 10px", color: tip.result === "loss" ? "#ef5350" : "#333", fontSize: "11px", cursor: "pointer", fontFamily: "monospace" }}>LOSS</button>
            </div>
          ) : (
            tip.result && <div style={{ background: tip.result === "win" ? "#66bb6a18" : "#ef535018", border: `1px solid ${tip.result === "win" ? "#66bb6a44" : "#ef535044"}`, borderRadius: "6px", padding: "4px 12px", color: tip.result === "win" ? "#66bb6a" : "#ef5350", fontSize: "11px", fontFamily: "monospace", letterSpacing: "1px" }}>{tip.result === "win" ? "✓ WIN" : "✗ LOSS"}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function RadialProgress({ value, size = 80, stroke = 7, color = GOLD }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a22" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
}

function MiniBar({ wins, losses, total, color }) {
  const pct = total > 0 ? (wins / total) * 100 : 0;
  return (
    <div style={{ height: "4px", background: "#1a1a22", borderRadius: "4px", overflow: "hidden", marginTop: "8px" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "4px" }} />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0" }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: `3px solid #1a1a22`, borderTopColor: GOLD, animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function HomeView({ tips, onLogoTap, loading }) {
  const total = tips.length;
  const wins = tips.filter(t => t.result === "win").length;
  const losses = tips.filter(t => t.result === "loss").length;
  const rate = (wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : null;

  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <div style={{ padding: "40px 28px 36px", background: `linear-gradient(180deg, #0e0c08 0%, ${BG} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}08 0%, transparent 70%)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div onClick={onLogoTap} style={{ width: "56px", height: "56px", borderRadius: "14px", background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", cursor: "pointer", boxShadow: `0 0 20px ${GOLD}44` }}>🏆</div>
          <div>
            <div style={{ fontFamily: "'Georgia', serif", fontWeight: "900", fontSize: "22px", background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_DARK})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Bet Sport</div>
            <div style={{ color: "#2a2a35", fontSize: "9px", fontFamily: "monospace", letterSpacing: "3px" }}>PRONOSTICS PREMIUM</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "#1a1a22", borderRadius: "14px", overflow: "hidden" }}>
          {[
            { label: "CONSEILS", value: loading ? "…" : total, color: "#fff" },
            { label: "GAGNÉS", value: loading ? "…" : wins, color: "#66bb6a" },
            { label: "RÉUSSITE", value: loading ? "…" : (rate !== null ? `${rate}%` : "—"), color: rate !== null && rate >= 60 ? "#66bb6a" : rate !== null && rate >= 40 ? GOLD : "#ef5350" },
          ].map(s => (
            <div key={s.label} style={{ background: "#0b0a07", padding: "20px 8px", textAlign: "center" }}>
              <div style={{ color: s.color, fontSize: "28px", fontWeight: "900", fontFamily: "monospace" }}>{s.value}</div>
              <div style={{ color: "#888", fontSize: "8px", fontFamily: "monospace", letterSpacing: "2px", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "24px 20px" }}>
        {tips.filter(t => t.result).length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ color: "#888", fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "8px" }}>DERNIERS RÉSULTATS</div>
            <div style={{ display: "flex", gap: "6px" }}>
              {tips.filter(t => t.result).slice(0, 5).map((t, i) => (
                <div key={i} style={{ flex: 1, height: "36px", borderRadius: "10px", background: t.result === "win" ? "#66bb6a22" : "#ef535022", border: `1px solid ${t.result === "win" ? "#66bb6a44" : "#ef535044"}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.result === "win" ? "#66bb6a" : "#ef5350", fontSize: "12px", fontFamily: "monospace", fontWeight: "700" }}>
                  {t.result === "win" ? "W" : "L"}
                </div>
              ))}
              {Array(Math.max(0, 5 - tips.filter(t => t.result).length)).fill(0).map((_, i) => (
                <div key={i} style={{ flex: 1, height: "36px", borderRadius: "10px", background: "#0e0e12", border: "1px solid #1a1a22" }} />
              ))}
            </div>
          </div>
        )}
        <div style={{ background: "#0b0b0f", border: "1px solid #13131a", borderRadius: "16px", padding: "20px" }}>
          <div style={{ width: "28px", height: "2px", background: `linear-gradient(90deg, ${GOLD}, transparent)`, marginBottom: "12px" }} />
          <div style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginBottom: "10px" }}>
            Bienvenue sur <span style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_DARK})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Bet Sport</span>
          </div>
          <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.75", margin: 0 }}>
            Une équipe de pronostiqueurs professionnels partage ses meilleurs pronostics <span style={{ color: GOLD }}>gratuitement</span>.<br/>Analyses rigoureuses, conseils fiables et résultats transparents.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatsView({ tips, loading }) {
  const total = tips.length;
  const wins = tips.filter(t => t.result === "win").length;
  const losses = tips.filter(t => t.result === "loss").length;
  const rate = (wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : null;
  const roi = tips.filter(t => t.result).reduce((acc, t) => t.result === "win" ? acc + (parseFloat(t.odds) - 1 || 0) : acc - 1, 0);
  const resolved = [...tips].filter(t => t.result).reverse();
  let streak = 0, streakType = null;
  for (const t of resolved) {
    if (streakType === null) { streakType = t.result; streak = 1; }
    else if (t.result === streakType) streak++;
    else break;
  }
  const bySport = SPORTS.map(s => {
    const st = tips.filter(t => t.sport === s.id);
    const sw = st.filter(t => t.result === "win").length;
    const sl = st.filter(t => t.result === "loss").length;
    return { ...s, total: st.length, wins: sw, losses: sl, rate: (sw+sl) > 0 ? Math.round(sw/(sw+sl)*100) : null };
  });
  const byConf = [5,4,3,2,1].map(c => {
    const ct = tips.filter(t => t.confidence === c);
    const cw = ct.filter(t => t.result === "win").length;
    const cl = ct.filter(t => t.result === "loss").length;
    return { c, total: ct.length, wins: cw, losses: cl, rate: (cw+cl)>0 ? Math.round(cw/(cw+cl)*100) : null };
  }).filter(c => c.total > 0);
  const last5 = tips.filter(t => t.result).slice(0, 5);
  const pending = total - wins - losses;

  if (loading) return <LoadingSpinner />;
  if (total === 0) return (
    <div style={{ padding: "24px", textAlign: "center", paddingTop: "60px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
      <div style={{ color: "#222", fontFamily: "monospace", fontSize: "12px", letterSpacing: "2px" }}>AUCUNE DONNÉE</div>
    </div>
  );

  return (
    <div style={{ padding: "20px 20px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ width: "3px", height: "24px", background: `linear-gradient(${GOLD}, ${GOLD_DARK})`, borderRadius: "2px" }} />
        <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#fff" }}>Statistiques</h2>
      </div>
      <div style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <RadialProgress value={rate ?? 0} size={90} stroke={8} color={rate >= 60 ? "#66bb6a" : rate >= 40 ? GOLD : "#ef5350"} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <div style={{ color: "#fff", fontFamily: "monospace", fontWeight: "900", fontSize: "16px" }}>{rate ?? "—"}{rate !== null ? "%" : ""}</div>
            <div style={{ color: "#333", fontSize: "8px", fontFamily: "monospace", letterSpacing: "1px" }}>WIN</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { label: "Conseils", value: total, color: "#fff" },
              { label: "ROI estimé", value: roi >= 0 ? `+${roi.toFixed(1)}u` : `${roi.toFixed(1)}u`, color: roi >= 0 ? "#66bb6a" : "#ef5350" },
              { label: "Gagnés", value: wins, color: "#66bb6a" },
              { label: "Perdus", value: losses, color: "#ef5350" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ color: s.color, fontSize: "20px", fontWeight: "900", fontFamily: "monospace" }}>{s.value}</div>
                <div style={{ color: "#333", fontSize: "9px", fontFamily: "monospace", letterSpacing: "1px" }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        <div style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "12px", padding: "16px" }}>
          <div style={{ fontSize: "22px", marginBottom: "4px" }}>{streakType === "win" ? "🔥" : streakType === "loss" ? "❄️" : "➖"}</div>
          <div style={{ color: streakType === "win" ? "#66bb6a" : streakType === "loss" ? "#ef5350" : "#333", fontFamily: "monospace", fontSize: "18px", fontWeight: "900" }}>{streak > 0 ? `${streak} ${streakType === "win" ? "W" : "L"}` : "—"}</div>
          <div style={{ color: "#333", fontSize: "9px", fontFamily: "monospace", letterSpacing: "1px", marginTop: "2px" }}>SÉRIE EN COURS</div>
        </div>
        <div style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "12px", padding: "16px" }}>
          <div style={{ fontSize: "22px", marginBottom: "4px" }}>⏳</div>
          <div style={{ color: GOLD, fontFamily: "monospace", fontSize: "18px", fontWeight: "900" }}>{pending}</div>
          <div style={{ color: "#333", fontSize: "9px", fontFamily: "monospace", letterSpacing: "1px", marginTop: "2px" }}>EN ATTENTE</div>
        </div>
      </div>
      {last5.length > 0 && (
        <div style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
          <div style={{ color: "#333", fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>5 DERNIERS RÉSULTATS</div>
          <div style={{ display: "flex", gap: "8px" }}>
            {last5.map((t, i) => (
              <div key={i} style={{ flex: 1, height: "32px", borderRadius: "8px", background: t.result === "win" ? "#66bb6a22" : "#ef535022", border: `1px solid ${t.result === "win" ? "#66bb6a44" : "#ef535044"}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.result === "win" ? "#66bb6a" : "#ef5350", fontSize: "11px", fontFamily: "monospace", fontWeight: "700" }}>
                {t.result === "win" ? "W" : "L"}
              </div>
            ))}
            {Array(5 - last5.length).fill(0).map((_, i) => (
              <div key={i} style={{ flex: 1, height: "32px", borderRadius: "8px", background: "#0e0e12", border: "1px solid #1a1a22" }} />
            ))}
          </div>
        </div>
      )}
      <GoldDivider />
      <div style={{ marginTop: "14px", marginBottom: "14px" }}>
        <div style={{ color: "#333", fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>PAR SPORT</div>
        {bySport.map(s => (
          <div key={s.id} style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "10px", padding: "12px 14px", marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>{s.icon}</span>
                <span style={{ color: s.color, fontSize: "11px", fontFamily: "monospace", letterSpacing: "1px" }}>{s.label.toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", gap: "10px", fontSize: "11px", fontFamily: "monospace" }}>
                <span style={{ color: "#66bb6a" }}>{s.wins}W</span>
                <span style={{ color: "#ef5350" }}>{s.losses}L</span>
                <span style={{ color: s.rate !== null ? (s.rate >= 60 ? "#66bb6a" : s.rate >= 40 ? GOLD : "#ef5350") : "#333" }}>{s.rate !== null ? `${s.rate}%` : "—"}</span>
              </div>
            </div>
            <MiniBar wins={s.wins} losses={s.losses} total={s.wins + s.losses} color={s.color} />
          </div>
        ))}
      </div>
      {byConf.length > 0 && (
        <div>
          <GoldDivider />
          <div style={{ marginTop: "14px" }}>
            <div style={{ color: "#333", fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>PAR CONFIANCE</div>
            {byConf.map(({ c, total: ct, wins: cw, losses: cl, rate: cr }) => (
              <div key={c} style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "10px", padding: "12px 14px", marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "3px" }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= c ? CONFIDENCE_CONFIG[c].color : "#1e1e28", fontSize: "14px" }}>★</span>)}</div>
                  <div style={{ display: "flex", gap: "10px", fontSize: "11px", fontFamily: "monospace" }}>
                    <span style={{ color: "#66bb6a" }}>{cw}W</span>
                    <span style={{ color: "#ef5350" }}>{cl}L</span>
                    <span style={{ color: cr !== null ? (cr >= 60 ? "#66bb6a" : cr >= 40 ? GOLD : "#ef5350") : "#333" }}>{cr !== null ? `${cr}%` : "—"}</span>
                  </div>
                </div>
                <MiniBar wins={cw} losses={cl} total={cw+cl} color={CONFIDENCE_CONFIG[c].color} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tips, setTips] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home");
  const [filterSport, setFilterSport] = useState("football");
  const [footballLevel, setFootballLevel] = useState(null);
  const [activeLeague, setActiveLeague] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showComboForm, setShowComboForm] = useState(false);
  const [comboForm, setComboForm] = useState({
    confidence: 0, note: "",
    date: new Date().toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }),
    selections: [
      { match: "", bet: "1", odds: "" },
      { match: "", bet: "1", odds: "" },
    ],
  });
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const [form, setForm] = useState({
    sport: "football", match: "", bet: "1",
    customBet: "", odds: "", confidence: 0, note: "",
    league: null, date: new Date().toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }),
  });

  useEffect(() => {
    fetchTips();
    fetchCombos();
  }, []);

  const fetchTips = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tips")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setTips(data);
    setLoading(false);
  };

  const fetchCombos = async () => {
    const { data, error } = await supabase
      .from("combos")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCombos(data);
  };

  const handleLogoTap = () => {
    if (isAdmin) return;
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setShowAdminModal(true);
    } else {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
    }
  };

  const handleAdminLogin = async () => {
    setAdminError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    if (error) {
      setAdminError("Email ou mot de passe incorrect");
    } else {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminEmail("");
      setAdminPassword("");
    }
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const handleAdd = async () => {
    if (!form.match || form.confidence === 0) return;
    setSaving(true);
    const betLabel = form.bet === "Personnalisé" ? form.customBet : form.bet;
    const { data, error } = await supabase.from("tips").insert([{
      sport: form.sport, league: form.league, match: form.match,
      bet: betLabel, odds: form.odds, confidence: form.confidence,
      note: form.note, date: form.date, result: null,
    }]).select();
    if (!error && data) {
      setTips([data[0], ...tips]);
      setForm({ sport: "football", match: "", bet: "1", customBet: "", odds: "", confidence: 0, note: "", league: null, date: new Date().toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }) });
      setView("list");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("tips").delete().eq("id", id);
    setTips(tips.filter(t => t.id !== id));
  };

  const handleToggleResult = async (id, res) => {
    const tip = tips.find(t => t.id === id);
    const newResult = tip.result === res ? null : res;
    await supabase.from("tips").update({ result: newResult }).eq("id", id);
    setTips(tips.map(t => t.id === id ? { ...t, result: newResult } : t));
  };

  const handleAddCombo = async () => {
    const validSelections = comboForm.selections
      .filter(s => s.match && s.odds)
      .map(s => ({ match: s.match, bet: s.bet === "Personnalisé" ? (s.customBet || s.bet) : s.bet, odds: s.odds }));
    if (validSelections.length < 2 || comboForm.confidence === 0) return;
    setSaving(true);
    const totalOdds = validSelections.reduce((acc, s) => acc * parseFloat(s.odds), 1).toFixed(2);
    const { data, error } = await supabase.from("combos").insert([{
      date: comboForm.date,
      selections: validSelections,
      total_odds: totalOdds,
      confidence: comboForm.confidence,
      note: comboForm.note,
      result: null,
    }]).select();
    if (!error && data) {
      setCombos([data[0], ...combos]);
      setComboForm({
        confidence: 0, note: "",
        date: new Date().toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }),
        selections: [{ match: "", bet: "1", odds: "" }, { match: "", bet: "1", odds: "" }],
      });
      setShowComboForm(false);
      setFootballLevel("combine");
    }
    setSaving(false);
  };

  const handleDeleteCombo = async (id) => {
    await supabase.from("combos").delete().eq("id", id);
    setCombos(combos.filter(c => c.id !== id));
  };

  const handleToggleComboResult = async (id, res) => {
    const combo = combos.find(c => c.id === id);
    const newResult = combo.result === res ? null : res;
    await supabase.from("combos").update({ result: newResult }).eq("id", id);
    setCombos(combos.map(c => c.id === id ? { ...c, result: newResult } : c));
  };

  const filtered = tips.filter(t => {
    if (filterSport && t.sport !== filterSport) return false;
    if (filterSport === "football" && activeLeague && t.league !== activeLeague) return false;
    if (filterSport === "tennis" && activeLeague && t.league !== activeLeague) return false;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: "480px", margin: "0 auto", paddingBottom: "80px" }}>

      {view !== "home" && (
        <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid #0e0e12", background: BG, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div onClick={handleLogoTap} style={{ width: "44px", height: "44px", borderRadius: "12px", background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", cursor: "pointer" }}>🏆</div>
            <div>
              <div style={{ fontFamily: "'Georgia', serif", fontWeight: "900", fontSize: "20px", background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_DARK})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Bet Sport</div>
              <div style={{ color: "#2a2a35", fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace" }}>PRONOSTICS PREMIUM</div>
            </div>
          </div>
          {view === "list" && (
            <div style={{ marginTop: "14px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {SPORTS.map(s => (
                <button key={s.id} onClick={() => { setFilterSport(s.id); setActiveLeague(null); setFootballLevel(null); }}
                  style={{ background: filterSport === s.id ? `${s.color}22` : "none", border: `1px solid ${filterSport === s.id ? s.color : "#1e1e28"}`, borderRadius: "20px", padding: "6px 14px", color: filterSport === s.id ? s.color : "#444", fontSize: "12px", cursor: "pointer", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "6px" }}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "home" && <HomeView tips={tips} onLogoTap={handleLogoTap} loading={loading} />}

      {view === "list" && (
        <div style={{ padding: "20px" }}>
          {filterSport === "football" && (
            <div style={{ marginBottom: "20px" }}>
              {!footballLevel && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { id: "nationale", label: "Nationale", icon: "🏟️", sub: "9 championnats", color: GOLD },
                    { id: "combine", label: "Combiné du jour", icon: "♾️", sub: "Sélections combinées", color: "#a78bfa" },
                    { id: "internationale", label: "Internationale", icon: "🌐", sub: "Champions League & World Cup", color: "#8b5cf6" },
                  ].map(cat => (
                    <button key={cat.id} onClick={() => setFootballLevel(cat.id)}
                      style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "14px", padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = cat.color + "66"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a22"}>
                      <span style={{ fontSize: "32px" }}>{cat.icon}</span>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div style={{ color: "#fff", fontSize: "15px", fontWeight: "700", marginBottom: "4px" }}>{cat.label}</div>
                        <div style={{ color: "#444", fontSize: "11px", fontFamily: "monospace" }}>{cat.sub}</div>
                      </div>
                      <span style={{ color: "#333", fontSize: "20px" }}>›</span>
                    </button>
                  ))}
                </div>
              )}
              {footballLevel && footballLevel !== "combine" && !activeLeague && (
                <div>
                  <button onClick={() => setFootballLevel(null)} style={{ background: "none", border: "none", color: "#444", fontSize: "12px", cursor: "pointer", fontFamily: "monospace", marginBottom: "16px", padding: 0 }}>← Retour</button>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <span style={{ fontSize: "20px" }}>{footballLevel === "nationale" ? "🏟️" : "🌐"}</span>
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: "700" }}>{footballLevel === "nationale" ? "Nationale" : "Internationale"}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                    {(footballLevel === "nationale" ? LEAGUES_NATIONAL : LEAGUES_INTERNATIONAL).map(league => (
                      <button key={league.id} onClick={() => setActiveLeague(league.id)}
                        style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "10px", padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}
                        onMouseEnter={e => { e.currentTarget.style.background = league.color + "22"; e.currentTarget.style.borderColor = league.color + "44"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = BG2; e.currentTarget.style.borderColor = "#1a1a22"; }}>
                        <span style={{ fontSize: "24px" }}>{league.flag}</span>
                        <span style={{ color: "#ccc", fontSize: "13px", fontWeight: "600", flex: 1, textAlign: "left" }}>{league.label}</span>
                        <span style={{ color: "#333", fontSize: "18px" }}>›</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {activeLeague && (
                <div>
                  <button onClick={() => setActiveLeague(null)} style={{ background: "none", border: "none", color: "#444", fontSize: "12px", cursor: "pointer", fontFamily: "monospace", marginBottom: "16px", padding: 0 }}>← Retour</button>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "24px" }}>{ALL_LEAGUES.find(l => l.id === activeLeague)?.flag}</span>
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: "700" }}>{ALL_LEAGUES.find(l => l.id === activeLeague)?.label}</span>
                  </div>
                  {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px 0", color: "#2a2a35", fontFamily: "monospace", fontSize: "11px", letterSpacing: "2px" }}>AUCUN PRONOSTIC</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {filtered.map(tip => <TipCard key={tip.id} tip={tip} isAdmin={isAdmin} onDelete={handleDelete} onToggleResult={handleToggleResult} />)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
              {footballLevel === "combine" && (
                <div>
                  <button onClick={() => setFootballLevel(null)} style={{ background: "none", border: "none", color: "#444", fontSize: "12px", cursor: "pointer", fontFamily: "monospace", marginBottom: "16px", padding: 0 }}>← Retour</button>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "24px" }}>♾️</span>
                    <span style={{ color: "#a78bfa", fontSize: "14px", fontWeight: "700" }}>Combiné du jour</span>
                  </div>
                  {isAdmin && (
                    <button onClick={() => setShowComboForm(!showComboForm)}
                      style={{ width: "100%", padding: "12px", background: "#a78bfa22", border: "1px solid #a78bfa44", borderRadius: "10px", color: "#a78bfa", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", marginBottom: "16px" }}>
                      {showComboForm ? "✕ Annuler" : "+ Nouveau combiné"}
                    </button>
                  )}
                  {showComboForm && isAdmin && (
                    <div style={{ background: BG2, border: "1px solid #a78bfa33", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
                      <div style={{ color: "#a78bfa", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "16px" }}>CRÉER UN COMBINÉ</div>
                      {comboForm.selections.map((sel, i) => (
                        <div key={i} style={{ marginBottom: "14px", background: BG3, borderRadius: "10px", padding: "14px" }}>
                          <div style={{ color: "#555", fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>SÉLECTION {i + 1}</div>
                          <input value={sel.match} onChange={e => { const s = [...comboForm.selections]; s[i].match = e.target.value; setComboForm({ ...comboForm, selections: s }); }} placeholder="Ex: PSG vs Lyon" style={{ ...inputStyle, marginBottom: "8px", fontSize: "13px" }} />
                          <div style={{ display: "flex", gap: "8px" }}>
                            <select value={sel.bet} onChange={e => { const s = [...comboForm.selections]; s[i].bet = e.target.value; setComboForm({ ...comboForm, selections: s }); }} style={{ ...inputStyle, cursor: "pointer", fontSize: "13px", flex: 1 }}>
                              {BET_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            {sel.bet === "Personnalisé" && <textarea value={sel.customBet || ""} onChange={e => { const s = [...comboForm.selections]; s[i].customBet = e.target.value; setComboForm({ ...comboForm, selections: s }); }} placeholder="Ton pari..." style={{ ...inputStyle, fontSize: "13px", marginTop: "6px", minHeight: "60px", resize: "vertical" }} />}
                            <input value={sel.odds} onChange={e => { const s = [...comboForm.selections]; s[i].odds = e.target.value; setComboForm({ ...comboForm, selections: s }); }} placeholder="Cote" style={{ ...inputStyle, fontSize: "13px", width: "90px" }} type="number" step="0.01" />
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                        {comboForm.selections.length < 4 && (
                          <button onClick={() => setComboForm({ ...comboForm, selections: [...comboForm.selections, { match: "", bet: "1", odds: "" }] })}
                            style={{ flex: 1, padding: "10px", background: "none", border: "1px dashed #333", borderRadius: "8px", color: "#444", fontSize: "12px", cursor: "pointer", fontFamily: "monospace" }}>
                            + Ajouter sélection
                          </button>
                        )}
                        {comboForm.selections.length > 2 && (
                          <button onClick={() => setComboForm({ ...comboForm, selections: comboForm.selections.slice(0, -1) })}
                            style={{ padding: "10px 14px", background: "none", border: "1px solid #ef535044", borderRadius: "8px", color: "#ef5350", fontSize: "12px", cursor: "pointer", fontFamily: "monospace" }}>
                            - Retirer
                          </button>
                        )}
                      </div>
                      {comboForm.selections.filter(s => s.odds).length >= 2 && (
                        <div style={{ background: "#a78bfa22", border: "1px solid #a78bfa44", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#888", fontSize: "11px", fontFamily: "monospace" }}>COTE TOTALE</span>
                          <span style={{ color: "#a78bfa", fontSize: "18px", fontWeight: "900", fontFamily: "monospace" }}>
                            {comboForm.selections.filter(s => s.odds).reduce((acc, s) => acc * parseFloat(s.odds || 1), 1).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div style={{ marginBottom: "14px" }}>
                        <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>CONFIANCE</div>
                        <StarRating value={comboForm.confidence} onChange={v => setComboForm({ ...comboForm, confidence: v })} />
                      </div>
                      <div style={{ marginBottom: "14px" }}>
                        <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>NOTE (optionnel)</div>
                        <textarea value={comboForm.note} onChange={e => setComboForm({ ...comboForm, note: e.target.value })} placeholder="Analyse..." style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} />
                      </div>
                      <button onClick={handleAddCombo} disabled={comboForm.selections.filter(s => s.match && s.odds).length < 2 || comboForm.confidence === 0 || saving}
                        style={{ width: "100%", padding: "13px", background: (comboForm.selections.filter(s => s.match && s.odds).length < 2 || comboForm.confidence === 0 || saving) ? "#1a1a22" : "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "800", cursor: "pointer", fontFamily: "monospace", letterSpacing: "2px" }}>
                        {saving ? "ENREGISTREMENT..." : "PUBLIER LE COMBINÉ"}
                      </button>
                    </div>
                  )}
                  {loading ? <LoadingSpinner /> : combos.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px 0", color: "#2a2a35", fontFamily: "monospace", fontSize: "11px", letterSpacing: "2px" }}>AUCUN COMBINÉ</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {combos.map(combo => (
                        <div key={combo.id} style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "14px", overflow: "hidden" }}>
                          <div style={{ height: "2px", background: combo.result === "win" ? "linear-gradient(90deg, #66bb6a, #43a047)" : combo.result === "loss" ? "linear-gradient(90deg, #ef5350, #e53935)" : "linear-gradient(90deg, #7c3aed, #a78bfa)" }} />
                          <div style={{ padding: "16px 18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "20px" }}>♾️</span>
                                <div>
                                  <div style={{ color: "#a78bfa", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px" }}>COMBINÉ DU JOUR</div>
                                  <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace" }}>{combo.date}</div>
                                </div>
                              </div>
                              {isAdmin && <button onClick={() => handleDeleteCombo(combo.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#222", fontSize: "18px" }} onMouseEnter={e => e.target.style.color = "#ef5350"} onMouseLeave={e => e.target.style.color = "#222"}>✕</button>}
                            </div>
                            {combo.selections.map((sel, i) => (
                              <div key={i} style={{ background: BG3, borderRadius: "8px", padding: "10px 12px", marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                  <div style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>{sel.match}</div>
                                  <div style={{ color: "#a78bfa", fontSize: "11px", fontFamily: "monospace", marginTop: "2px" }}>{sel.bet}</div>
                                </div>
                                <div style={{ color: GOLD, fontSize: "13px", fontFamily: "monospace", fontWeight: "700" }}>{sel.odds}</div>
                              </div>
                            ))}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", background: "#a78bfa11", borderRadius: "8px", padding: "10px 12px" }}>
                              <span style={{ color: "#888", fontSize: "11px", fontFamily: "monospace", letterSpacing: "1px" }}>COTE TOTALE</span>
                              <span style={{ color: "#a78bfa", fontSize: "20px", fontWeight: "900", fontFamily: "monospace" }}>{combo.total_odds}</span>
                            </div>
                            {combo.note && <div style={{ color: "#444", fontSize: "12px", fontStyle: "italic", marginTop: "10px" }}>{combo.note}</div>}
                            <GoldDivider />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                              <div style={{ display: "flex", gap: "4px" }}>
                                {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= combo.confidence ? CONFIDENCE_CONFIG[combo.confidence]?.color : "#1e1e28", fontSize: "14px" }}>★</span>)}
                              </div>
                              {isAdmin ? (
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button onClick={() => handleToggleComboResult(combo.id, "win")} style={{ background: combo.result === "win" ? "#66bb6a22" : "none", border: `1px solid ${combo.result === "win" ? "#66bb6a" : "#1e1e28"}`, borderRadius: "6px", padding: "4px 10px", color: combo.result === "win" ? "#66bb6a" : "#333", fontSize: "11px", cursor: "pointer", fontFamily: "monospace" }}>WIN</button>
                                  <button onClick={() => handleToggleComboResult(combo.id, "loss")} style={{ background: combo.result === "loss" ? "#ef535022" : "none", border: `1px solid ${combo.result === "loss" ? "#ef5350" : "#1e1e28"}`, borderRadius: "6px", padding: "4px 10px", color: combo.result === "loss" ? "#ef5350" : "#333", fontSize: "11px", cursor: "pointer", fontFamily: "monospace" }}>LOSS</button>
                                </div>
                              ) : (
                                combo.result && <div style={{ background: combo.result === "win" ? "#66bb6a18" : "#ef535018", border: `1px solid ${combo.result === "win" ? "#66bb6a44" : "#ef535044"}`, borderRadius: "6px", padding: "4px 12px", color: combo.result === "win" ? "#66bb6a" : "#ef5350", fontSize: "11px", fontFamily: "monospace" }}>{combo.result === "win" ? "✓ WIN" : "✗ LOSS"}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          {filterSport === "tennis" && (
            <div style={{ marginBottom: "20px" }}>
              {!activeLeague && (
                <div>
                  <div style={{ color: "#333", fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "12px" }}>CIRCUITS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "16px" }}>
                    {TENNIS_TOURS.map(t => (
                      <button key={t.id} onClick={() => setActiveLeague(t.id)}
                        style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "10px", padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}
                        onMouseEnter={e => { e.currentTarget.style.background = t.color + "22"; e.currentTarget.style.borderColor = t.color + "44"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = BG2; e.currentTarget.style.borderColor = "#1a1a22"; }}>
                        <span style={{ fontSize: "22px" }}>{t.flag}</span>
                        <span style={{ color: "#fff", fontSize: "13px", fontWeight: "700", flex: 1, textAlign: "left" }}>{t.label}</span>
                        <span style={{ color: "#333", fontSize: "18px" }}>›</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ color: "#333", fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "12px" }}>GRAND CHELEM</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                    {TENNIS_SLAMS.map(t => (
                      <button key={t.id} onClick={() => setActiveLeague(t.id)}
                        style={{ background: BG2, border: "1px solid #1a1a22", borderRadius: "10px", padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}
                        onMouseEnter={e => { e.currentTarget.style.background = t.color + "22"; e.currentTarget.style.borderColor = t.color + "44"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = BG2; e.currentTarget.style.borderColor = "#1a1a22"; }}>
                        <span style={{ fontSize: "22px" }}>{t.flag}</span>
                        <span style={{ color: t.color, fontSize: "13px", fontWeight: "700", flex: 1, textAlign: "left" }}>{t.label}</span>
                        <span style={{ color: "#333", fontSize: "18px" }}>›</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {activeLeague && (
                <div>
                  <button onClick={() => setActiveLeague(null)} style={{ background: "none", border: "none", color: "#444", fontSize: "12px", cursor: "pointer", fontFamily: "monospace", marginBottom: "16px", padding: 0 }}>← Retour</button>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "24px" }}>{ALL_TENNIS.find(t => t.id === activeLeague)?.flag}</span>
                    <span style={{ color: ALL_TENNIS.find(t => t.id === activeLeague)?.color, fontSize: "14px", fontWeight: "700" }}>{ALL_TENNIS.find(t => t.id === activeLeague)?.label}</span>
                  </div>
                  {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px 0", color: "#2a2a35", fontFamily: "monospace", fontSize: "11px", letterSpacing: "2px" }}>AUCUN PRONOSTIC</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {filtered.map(tip => <TipCard key={tip.id} tip={tip} isAdmin={isAdmin} onDelete={handleDelete} onToggleResult={handleToggleResult} />)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {filterSport === "nba" && (
            loading ? <LoadingSpinner /> : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#2a2a35", fontFamily: "monospace", fontSize: "11px", letterSpacing: "2px" }}>AUCUN PRONOSTIC</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filtered.map(tip => <TipCard key={tip.id} tip={tip} isAdmin={isAdmin} onDelete={handleDelete} onToggleResult={handleToggleResult} />)}
              </div>
            )
          )}
          {filterSport === "f1" && (
            loading ? <LoadingSpinner /> : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#2a2a35", fontFamily: "monospace", fontSize: "11px", letterSpacing: "2px" }}>AUCUN PRONOSTIC</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filtered.map(tip => <TipCard key={tip.id} tip={tip} isAdmin={isAdmin} onDelete={handleDelete} onToggleResult={handleToggleResult} />)}
              </div>
            )
          )}
        </div>
      )}

      {view === "add" && isAdmin && (
        <div style={{ padding: "24px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "3px", height: "24px", background: `linear-gradient(${GOLD}, ${GOLD_DARK})`, borderRadius: "2px" }} />
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#fff" }}>Nouveau pronostic</h2>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>SPORT</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {SPORTS.map(s => (
                <button key={s.id} onClick={() => setForm({ ...form, sport: s.id })}
                  style={{ background: form.sport === s.id ? `${s.color}22` : BG3, border: `1px solid ${form.sport === s.id ? s.color : "#1e1e28"}`, borderRadius: "10px", padding: "10px 14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "22px" }}>{s.icon}</span>
                  <span style={{ color: form.sport === s.id ? s.color : "#333", fontSize: "10px", fontFamily: "monospace" }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          {form.sport === "football" && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>COMPÉTITION</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span>🏟️</span><span style={{ color: "#444", fontSize: "10px", fontFamily: "monospace" }}>NATIONALE</span>
                <div style={{ flex: 1, height: "1px", background: "#1e1e28" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" }}>
                {LEAGUES_NATIONAL.map(league => (
                  <button key={league.id} onClick={() => setForm({ ...form, league: league.id })}
                    style={{ background: form.league === league.id ? `${league.color}22` : BG3, border: `1px solid ${form.league === league.id ? league.color : "#1e1e28"}`, borderRadius: "8px", padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{league.flag}</span>
                    <span style={{ color: form.league === league.id ? "#fff" : "#555", fontSize: "12px", fontWeight: "600" }}>{league.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span>🌐</span><span style={{ color: "#444", fontSize: "10px", fontFamily: "monospace" }}>INTERNATIONALE</span>
                <div style={{ flex: 1, height: "1px", background: "#1e1e28" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {LEAGUES_INTERNATIONAL.map(league => (
                  <button key={league.id} onClick={() => setForm({ ...form, league: league.id })}
                    style={{ background: form.league === league.id ? `${league.color}22` : BG3, border: `1px solid ${form.league === league.id ? league.color : "#1e1e28"}`, borderRadius: "8px", padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{league.flag}</span>
                    <span style={{ color: form.league === league.id ? "#fff" : "#555", fontSize: "12px", fontWeight: "600" }}>{league.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {form.sport === "tennis" && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>COMPÉTITION</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span>🎾</span><span style={{ color: "#444", fontSize: "10px", fontFamily: "monospace" }}>CIRCUITS</span>
                <div style={{ flex: 1, height: "1px", background: "#1e1e28" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" }}>
                {TENNIS_TOURS.map(t => (
                  <button key={t.id} onClick={() => setForm({ ...form, league: t.id })}
                    style={{ background: form.league === t.id ? `${t.color}22` : BG3, border: `1px solid ${form.league === t.id ? t.color : "#1e1e28"}`, borderRadius: "8px", padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{t.flag}</span>
                    <span style={{ color: form.league === t.id ? t.color : "#555", fontSize: "12px", fontWeight: "600" }}>{t.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span>🏆</span><span style={{ color: "#444", fontSize: "10px", fontFamily: "monospace" }}>GRAND CHELEM</span>
                <div style={{ flex: 1, height: "1px", background: "#1e1e28" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {TENNIS_SLAMS.map(t => (
                  <button key={t.id} onClick={() => setForm({ ...form, league: t.id })}
                    style={{ background: form.league === t.id ? `${t.color}22` : BG3, border: `1px solid ${form.league === t.id ? t.color : "#1e1e28"}`, borderRadius: "8px", padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{t.flag}</span>
                    <span style={{ color: form.league === t.id ? t.color : "#555", fontSize: "12px", fontWeight: "600" }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>MATCH</div>
            <input value={form.match} onChange={e => setForm({ ...form, match: e.target.value })} placeholder="Ex: PSG vs Real Madrid" style={inputStyle} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>TYPE DE PARI</div>
            <select value={form.bet} onChange={e => setForm({ ...form, bet: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
              {BET_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {form.bet === "Personnalisé" && <textarea value={form.customBet} onChange={e => setForm({ ...form, customBet: e.target.value })} placeholder="Décris ton pari..." style={{ ...inputStyle, marginTop: "8px", minHeight: "70px", resize: "vertical" }} />}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>COTE</div>
            <input value={form.odds} onChange={e => setForm({ ...form, odds: e.target.value })} placeholder="Ex: 1.85" style={inputStyle} type="number" step="0.01" />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>CONFIANCE</div>
            <StarRating value={form.confidence} onChange={v => setForm({ ...form, confidence: v })} />
          </div>
          <div style={{ marginBottom: "28px" }}>
            <div style={{ color: "#333", fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>NOTE (optionnel)</div>
            <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Analyse, contexte..." style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
          </div>
          <button onClick={handleAdd} disabled={!form.match || form.confidence === 0 || saving}
            style={{ width: "100%", padding: "15px", background: (!form.match || form.confidence === 0 || saving) ? "#1a1a22" : `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`, border: "none", borderRadius: "12px", color: (!form.match || form.confidence === 0 || saving) ? "#333" : "#000", fontSize: "15px", fontWeight: "800", cursor: (!form.match || form.confidence === 0 || saving) ? "not-allowed" : "pointer", fontFamily: "monospace", letterSpacing: "2px" }}>
            {saving ? "ENREGISTREMENT..." : "PUBLIER LE PRONOSTIC"}
          </button>
        </div>
      )}

      {view === "stats" && <StatsView tips={tips} loading={loading} />}

      {showAdminModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#0e0e12", border: `1px solid ${GOLD}33`, borderRadius: "20px", padding: "32px 28px", width: "100%", maxWidth: "320px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔐</div>
              <div style={{ color: "#fff", fontWeight: "700", fontSize: "16px", marginBottom: "6px" }}>Accès Administrateur</div>
              <div style={{ color: "#333", fontSize: "11px", fontFamily: "monospace", letterSpacing: "2px" }}>CONNEXION SÉCURISÉE</div>
            </div>
            <input type="email" value={adminEmail} onChange={e => { setAdminEmail(e.target.value); setAdminError(""); }} placeholder="Email" style={{ ...inputStyle, marginBottom: "10px" }} />
            <input type="password" value={adminPassword} onChange={e => { setAdminPassword(e.target.value); setAdminError(""); }} placeholder="Mot de passe" style={{ ...inputStyle, marginBottom: "16px" }} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} />
            {adminError && <div style={{ color: "#ef5350", fontSize: "11px", fontFamily: "monospace", marginBottom: "12px", textAlign: "center" }}>{adminError}</div>}
            <button onClick={handleAdminLogin} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`, border: "none", borderRadius: "10px", color: "#000", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>CONNEXION</button>
            <button onClick={() => { setShowAdminModal(false); setAdminEmail(""); setAdminPassword(""); setAdminError(""); }} style={{ width: "100%", padding: "11px", background: "none", border: "1px solid #1e1e28", borderRadius: "10px", color: "#444", fontSize: "13px", cursor: "pointer", fontFamily: "monospace" }}>Annuler</button>
          </div>
        </div>
      )}

      {isAdmin && (
        <>
          <button onClick={() => setView("add")} style={{ position: "fixed", bottom: "90px", right: "20px", width: "56px", height: "56px", borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`, border: "none", fontSize: "26px", cursor: "pointer", boxShadow: `0 4px 20px ${GOLD}44`, zIndex: 50 }}>+</button>
          <button onClick={handleAdminLogout} style={{ position: "fixed", top: "16px", right: "16px", background: "#ef535022", border: "1px solid #ef535044", borderRadius: "8px", padding: "6px 12px", color: "#ef5350", fontSize: "11px", cursor: "pointer", fontFamily: "monospace", zIndex: 50 }}>LOGOUT</button>
        </>
      )}

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "480px", background: "#08080a", borderTop: "1px solid #0e0e12", display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 20 }}>
        {[
          { id: "home", icon: "🏠", label: "ACCUEIL" },
          { id: "list", icon: "📋", label: "CONSEILS" },
          { id: "stats", icon: "📊", label: "STATS" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "6px 20px" }}>
            <span style={{ fontSize: "22px", filter: view === tab.id ? `drop-shadow(0 0 8px ${GOLD})` : "none" }}>{tab.icon}</span>
            <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "1px", color: view === tab.id ? GOLD : "#222" }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
