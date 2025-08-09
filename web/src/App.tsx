import React, { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { clsx } from 'clsx';
import surpriseIconUrl from './icons/surprise.png?url';
import generateIconUrl from './icons/generate.png?url';
import selectAllIconUrl from './icons/sellectall.png?url';

const allThemes = [
  { key: 'NFTs', emoji: '🖼️', desc: 'Novel mechanics, art logic, soulbound, dynamic' },
  { key: 'DeFi', emoji: '💸', desc: 'Dexes, lending, onchain, MEV-aware' },
  { key: 'Infra', emoji: '🧰', desc: 'Tooling, explorers, analytics, devex' },
  { key: 'Social', emoji: '👥', desc: 'Identity, Farcaster, graphs, feeds' },
  { key: 'Games', emoji: '🎮', desc: 'Onchain gameplay, physics, turn-based' },
  { key: 'AI', emoji: '🤖', desc: 'Agents, inference markets, verifiable compute' },
  { key: 'Payments', emoji: '💳', desc: 'Remittance, streaming, AA' },
  { key: 'Privacy', emoji: '🕵️', desc: 'ZK, mixers, disclosure' },
  { key: 'DAOs', emoji: '🏛️', desc: 'Governance, treasuries, coordination' },
  { key: 'Oracles', emoji: '🔮', desc: 'Data feeds, cross-chain, attestations' },
  { key: 'RWA', emoji: '🏗️', desc: 'Real-world assets, tokenization' },
  { key: 'Security', emoji: '🛡️', desc: 'Audits, monitoring, alerts' },
  { key: 'Indexing', emoji: '📚', desc: 'Subgraphs, ETL, BI' },
  { key: 'Education', emoji: '🎓', desc: 'Tutorials, quests, onboarding' },
];

const MissionSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  rules: z.array(z.string()),
  prizes: z.array(z.string()),
  resources: z.array(z.string()).optional(),
});

type Mission = z.infer<typeof MissionSchema>;

type Theme = { key: string; emoji: string; desc: string };

type HistoryItem = { id: string; themes: string[]; idea?: string; ts: number; missions: Mission[] };

// Discord-style formatter for a mission
function formatMissionDiscord(m: Mission): string {
  const lines: string[] = [];
  lines.push(`**${m.title}**`);
  if (m.subtitle) lines.push(`_${m.subtitle}_`);
  lines.push('');
  lines.push(m.description);
  if (m.rules?.length) {
    lines.push('\n**Rules**');
    for (const r of m.rules) lines.push(`• ${r}`);
  }
  if (m.prizes?.length) {
    lines.push('\n**Prizes**');
    for (const p of m.prizes) lines.push(`• ${p}`);
  }
  if (m.resources?.length) {
    lines.push('\n**Resources**');
    for (const r of m.resources) lines.push(`• ${r}`);
  }
  return lines.join('\n');
}

function ThemeCard({ t, active, onClick }: { t: Theme; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'glass w-full text-left p-4 transition-all relative',
        active ? 'purple-glow' : ''
      )}
    >
      <div className="text-2xl">{t.emoji}</div>
      <div className="mt-2 font-semibold">{t.key}</div>
      <div className="text-sm opacity-70">{t.desc}</div>
      {active && (
        <span className="absolute top-2 right-2 inline-flex items-center justify-center" style={{width:22,height:22,borderRadius:'9999px',background:'#836EF9'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#181818"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
        </span>
      )}
    </button>
  );
}

function MissionCard({ m }: { m: Mission }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatMissionDiscord(m));
      setCopied(true);
      setTimeout(() => setCopied(false), 800);
    } catch {}
  };
  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold" style={{color:'#836EF9'}}>{m.title}</h3>
        {/* icon copy button */}
        <button className={clsx('icon-btn', copied && 'copied-effect')} onClick={handleCopy} aria-label="Copy mission">
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#181818"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#181818"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          )}
        </button>
      </div>
      {m.subtitle ? <div className="text-xs opacity-70 mt-0.5">{m.subtitle}</div> : null}
      <p className="mt-2 whitespace-pre-line">{m.description}</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="font-semibold">Rules</div>
          <ul className="mt-1 list-disc pl-5 opacity-90">
            {m.rules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold">Prizes</div>
          <ul className="mt-1 list-disc pl-5 opacity-90">
            {m.prizes.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
      {m.resources?.length ? (
        <div className="mt-3">
          <div className="font-semibold">Resources</div>
          <ul className="mt-1 list-disc pl-5 opacity-90">
            {m.resources.map((r, i) => (
              <li key={i}><a style={{color:'#836EF9'}} className="hover:underline" href={r} target="_blank" rel="noreferrer">{r}</a></li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10" style={{backdropFilter:'blur(10px)', background:'rgba(24,24,24,0.5)', borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
      <div className="mx-auto max-w-7xl p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Monad Mission Crafter</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-80">build by YOUZY</span>
          <a className="glass p-2" href="https://x.com/YOUZYPOOR" target="_blank" rel="noreferrer" aria-label="X">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#836EF9"><path d="M18.244 2h3.308l-7.227 8.26L23 22h-6.828l-5.35-6.995L4.64 22H1.333l7.73-8.84L1 2h6.996l4.83 6.354L18.244 2zm-1.197 18h1.833L7.03 4H5.086L17.047 20z"/></svg>
          </a>
          <a className="glass p-2" href="https://github.com/YOUZYX" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#836EF9"><path d="M12 .5a12 12 0 0 0-3.792 23.4c.6.112.824-.256.824-.568 0-.28-.012-1.206-.016-2.19-3.351.728-4.06-1.42-4.06-1.42-.546-1.388-1.334-1.758-1.334-1.758-1.09-.744.082-.729.082-.729 1.205.084 1.84 1.236 1.84 1.236 1.072 1.834 2.812 1.304 3.496.998.108-.776.42-1.305.764-1.606-2.676-.305-5.49-1.34-5.49-5.966 0-1.318.47-2.396 1.236-3.24-.124-.306-.536-1.535.116-3.197 0 0 1.008-.322 3.3 1.236a11.49 11.49 0 0 1 6.004 0c2.292-1.558 3.298-1.236 3.298-1.236.654 1.662.242 2.89.118 3.197.768.844 1.234 1.922 1.234 3.24 0 4.638-2.818 5.658-5.502 5.958.432.372.816 1.108.816 2.238 0 1.616-.014 2.92-.014 3.316 0 .314.22.684.828.566A12 12 0 0 0 12 .5z"/></svg>
          </a>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['NFTs']);
  const [idea, setIdea] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem('mission-history');
      return raw ? JSON.parse(raw) as HistoryItem[] : [];
    } catch { return []; }
  });
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [pageDir, setPageDir] = useState<'left'|'right'>('right');

  useEffect(() => {
    localStorage.setItem('mission-history', JSON.stringify(history));
  }, [history]);

  const filteredThemes = useMemo(() => allThemes.filter(t => t.key.toLowerCase().includes(q.toLowerCase())), [q]);

  const pageSize = 4;
  const maxPage = Math.max(0, Math.ceil(filteredThemes.length / pageSize) - 1);
  const pageThemes = filteredThemes.slice(page * pageSize, page * pageSize + pageSize);

  useEffect(() => { if (page > maxPage) { setPageDir('right'); setPage(0); } }, [q]);

  const toggleTheme = (key: string) => {
    setSelectedThemes((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  async function callApi(path: string, body?: any) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const parsed = z.object({ missions: z.array(MissionSchema) }).parse(data);
      setMissions(parsed.missions);
      const item: HistoryItem = { id: crypto.randomUUID(), themes: selectedThemes, idea, ts: Date.now(), missions: parsed.missions };
      setHistory((h) => [item, ...h].slice(0, 100));
    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  const canGenerate = selectedThemes.length > 0;

  const groupedHistory = useMemo(() => {
    const map = new Map<string, HistoryItem[]>();
    for (const h of history) {
      const key = h.themes.sort().join(', ');
      const arr = map.get(key) || [];
      arr.push(h); map.set(key, arr);
    }
    return Array.from(map.entries()).map(([k, items]) => ({ key: k, items }));
  }, [history]);

  return (
    <div className="min-h-screen" style={{background:'#181818'}}>
      <Header />
      <div className="mx-auto max-w-7xl p-4 grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-4">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="glass p-3">
            <div className="text-sm font-semibold mb-2" style={{color:'#836EF9'}}>History</div>
            <div className="space-y-3 max-h-[75vh] overflow-auto pr-1">
              {groupedHistory.length === 0 && <div className="text-sm opacity-70">No history yet</div>}
              {groupedHistory.map((g) => (
                <div key={g.key}>
                  <div className="text-xs opacity-80 mb-1">{g.key}</div>
                  <div className="space-y-2">
                    {g.items.map((it) => (
                      <button key={it.id} className="w-full text-left glass p-2" onClick={() => setMissions(it.missions)}>
                        <div className="text-xs opacity-70">{new Date(it.ts).toLocaleString()}</div>
                        {it.idea ? <div className="text-xs mt-1">{it.idea}</div> : null}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main>
          <section className="glass p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Pick themes</h2>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search theme..."
                className="input-purple flex-1 px-3 py-2"
              />
              <div className="flex items-center gap-2">
                <button title="Select all" className="icon-btn icon-btn-outline" onClick={() => setSelectedThemes(allThemes.map(t=>t.key))}>
                  <img src={selectAllIconUrl} width={18} height={18} alt="Select all" />
                </button>
                <button title="Clear" className="icon-btn icon-btn-outline" onClick={() => setSelectedThemes([])}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#836EF9"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
            </div>
            <div className={clsx('mt-3 grid grid-cols-2 md:grid-cols-4 gap-3', pageDir === 'left' ? 'slide-enter-left' : 'slide-enter-right')}>
              {pageThemes.map((t) => (
                <ThemeCard key={t.key} t={t} active={selectedThemes.includes(t.key)} onClick={() => toggleTheme(t.key)} />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button title="Prev" className="icon-btn icon-btn-outline" onClick={() => { setPageDir('left'); setPage(p => Math.max(0, p-1)); }} disabled={page===0}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#836EF9"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
              </button>
              <div className="text-xs opacity-70">Page {page+1} / {maxPage+1}</div>
              <button title="Next" className="icon-btn icon-btn-outline" onClick={() => { setPageDir('right'); setPage(p => Math.min(maxPage, p+1)); }} disabled={page===maxPage}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#836EF9"><path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>
            </div>
          </section>

          <section className="mt-4 glass p-4">
            <label className="block text-sm opacity-80">Guidance</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. Attestation dashboard bridged to Monad"
                className="input-purple flex-1 px-3 py-2"
              />
              {/* Generate with count badge */}
              <button title="Generate" disabled={!canGenerate || loading}
                onClick={() => callApi('/api/generate', { themes: selectedThemes, idea })}
                className={clsx('icon-btn icon-btn-outline', (!canGenerate || loading) && 'opacity-60 cursor-not-allowed')}
              >
                <img src={generateIconUrl} width={18} height={18} alt="Generate" />
                {selectedThemes.length > 0 && (
                  <span className="icon-badge">{selectedThemes.length}</span>
                )}
              </button>
              {/* Surprise uses provided icon */}
              <button title="Surprise Me" disabled={loading}
                onClick={() => callApi('/api/surprise')}
                className={clsx('icon-btn icon-btn-outline', loading && 'opacity-60')}
              >
                <img src={surpriseIconUrl} width={18} height={18} alt="Surprise me" />
              </button>
            </div>
            {error ? <p className="mt-2" style={{color:'#ff7a7a'}}>{error}</p> : null}
          </section>

          <section className="mt-4 grid gap-4">
            {missions.length === 0 && (
              <div className="glass p-6 opacity-80">
                Generated missions will appear here.
              </div>
            )}
            {missions.map((m, i) => (
              <div key={i} className="slide-enter-right">
                <MissionCard m={m} />
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
