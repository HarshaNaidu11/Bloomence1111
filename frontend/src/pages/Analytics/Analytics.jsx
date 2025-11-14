// src/pages/Analytics/Analytics.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getAuth } from 'firebase/auth';

// Small helpers
function formatDate(dStr) {
    const d = new Date(dStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Dual-line chart for PHQ-9 and GAD-7 together
function dualLineChart({ phq = [], gad = [], phqColor = "#22d3ee", gadColor = "#a78bfa", height = 220, padding = 40, label }) {
    const all = [...phq, ...gad];
    if (!all.length) return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
            <div style={{ color: '#9ca3af' }}>{label}</div>
            <div style={{ color: '#6b7280' }}>No data yet.</div>
        </div>
    );
    const xs = all.map(d => d.x);
    const ys = all.map(d => d.y);
    let minX = Math.min(...xs), maxX = Math.max(...xs);
    let minY = 0, maxYv = Math.max(...ys, 1);
    // avoid zero ranges
    if (maxX === minX) maxX = minX + 24 * 60 * 60 * 1000; // add a day to spread
    if (maxYv === minY) maxYv = minY + 1;
    const W = 560, H = height;
    const scaleX = x => padding + ((x - minX) / Math.max(1, (maxX - minX))) * (W - padding * 2);
    const scaleY = y => H - padding - (y - minY) / Math.max(1, (maxYv - minY)) * (H - padding * 2);
    const pathOf = (series) => series
        .sort((a, b) => a.x - b.x)
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
        .join(' ');
    const phqPath = pathOf(phq);
    const gadPath = pathOf(gad);
    // grid lines (4 horizontal)
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const yVal = minY + (maxYv - minY) * t;
        const y = scaleY(yVal);
        return <line key={i} x1={padding} y1={y} x2={W - padding} y2={y} stroke="#152232" strokeWidth={1} />;
    });
    // axis baseline
    const axisX = <line x1={padding} y1={H - padding} x2={W - padding} y2={H - padding} stroke="#243447" strokeWidth={1.5} />;
    const axisY = <line x1={padding} y1={padding} x2={padding} y2={H - padding} stroke="#243447" strokeWidth={1.5} />;
    // Y-axis numeric ticks (5 labels)
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const yVal = minY + (maxYv - minY) * t;
        const y = scaleY(yVal);
        return (
            <g key={`yt${i}`}>
                <line x1={padding - 4} y1={y} x2={padding} y2={y} stroke="#3b4a5f" strokeWidth={1} />
                <text x={padding - 8} y={y + 4} fontSize={10} fill="#9ca3af" textAnchor="end">{Math.round(yVal)}</text>
            </g>
        );
    });
    // X-axis date ticks (5 labels)
    const makeDate = (ms) => {
        const d = new Date(ms);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    };
    const xTicksPos = [0, 0.25, 0.5, 0.75, 1].map(t => minX + (maxX - minX) * t);
    const xTicks = xTicksPos.map((ms, i) => {
        const x = scaleX(ms);
        return (
            <g key={`xt${i}`}>
                <line x1={x} y1={H - padding} x2={x} y2={H - padding + 4} stroke="#3b4a5f" strokeWidth={1} />
                <text x={x} y={H - padding + 16} fontSize={10} fill="#9ca3af" textAnchor="middle">{makeDate(ms)}</text>
            </g>
        );
    });
    // points
    const phqDots = phq.map((p, i) => (<circle key={`p${i}`} cx={scaleX(p.x)} cy={scaleY(p.y)} r={3} fill={phqColor} />));
    const gadDots = gad.map((p, i) => (<circle key={`g${i}`} cx={scaleX(p.x)} cy={scaleY(p.y)} r={3} fill={gadColor} />));
    // handle single-point straight marker
    const drawSingle = (series, color) => series.length === 1 ? (
        <line x1={scaleX(series[0].x) - 6} y1={scaleY(series[0].y)} x2={scaleX(series[0].x) + 6} y2={scaleY(series[0].y)} stroke={color} strokeWidth={2} />
    ) : null;
    return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ color: '#e5e7eb', fontWeight: 700 }}>{label}</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9ca3af' }}>
                        <span style={{ width: 12, height: 3, background: phqColor, display: 'inline-block' }} /> PHQ‑9
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9ca3af' }}>
                        <span style={{ width: 12, height: 3, background: gadColor, display: 'inline-block' }} /> GAD‑7
                    </span>
                </div>
            </div>
            <svg width={560} height={height} style={{ width: '100%', maxWidth: '100%' }}>
                <rect x={0} y={0} width={560} height={height} fill="#0b1622" />
                {gridLines}
                {axisX}
                {axisY}
                {yTicks}
                {xTicks}
                {phqPath && <path d={phqPath} fill="none" stroke={phqColor} strokeWidth={2} />}
                {gadPath && <path d={gadPath} fill="none" stroke={gadColor} strokeWidth={2} />}
                {drawSingle(phq, phqColor)}
                {drawSingle(gad, gadColor)}
                {phqDots}
                {gadDots}
            </svg>
        </div>
    );
}

// Simple Pie Chart (SVG)
function pieChart({ segments = [], size = 160, label }) {
    const realTotal = segments.reduce((a, s) => a + s.value, 0);
    const total = realTotal || 1; // avoid div-by-zero for arc math
    let acc = 0;
    const r = size / 2; const cx = r, cy = r; const strokeWidth = r; // use stroke-donut
    // The actual circle radius we draw is r/2 (since strokeWidth=r makes it a donut)
    const drawRadius = r / 2;
    const circumference = 2 * Math.PI * drawRadius;
    const arcs = segments.map((s, i) => {
        const frac = s.value / total;
        const dash = circumference * frac;
        const gap = Math.max(0.0001, circumference - dash);
        const rot = (acc / total) * 360 - 90; // start at top
        acc += s.value;
        return (
            <circle key={i} r={drawRadius} cx={cx} cy={cy}
                stroke={s.color} strokeWidth={strokeWidth}
                strokeLinecap="butt"
                fill="none" strokeDasharray={`${dash} ${gap}`} transform={`rotate(${rot} ${cx} ${cy})`} />
        );
    });
    return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
            <div style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: 8 }}>{label}</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{arcs}</svg>
                <div style={{ display: 'grid', gap: 6 }}>
                    {segments.map((s, i) => {
                        const pct = realTotal ? Math.round((s.value / realTotal) * 100) : 0;
                        return (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e5e7eb' }}>
                                <span style={{ width: 10, height: 10, background: s.color, borderRadius: 2, display: 'inline-block' }} />
                                <span>{s.label}</span>
                                <span style={{ color: '#9ca3af' }}>({s.value} • {pct}%)</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Simple Bar Chart (SVG)
function barChart({ data = [], color = "#10b981", label, height = 160, width = 560 }) {
    if (!data.length) return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
            <div style={{ color: '#9ca3af' }}>{label}</div>
            <div style={{ color: '#6b7280' }}>No data yet.</div>
        </div>
    );
    const padL = 40, padR = 20, padT = 16, padB = 36;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;
    const maxV = Math.max(...data.map(d => d.y), 1);
    const barW = chartW / data.length;

    // helpers
    const scaleX = (i) => padL + i * barW;
    const scaleY = (v) => padT + (1 - (v / Math.max(1, maxV))) * chartH;

    // Y grid + ticks (5 levels)
    const ticks = [0, 0.25, 0.5, 0.75, 1];
    const yGrid = ticks.map((t, i) => {
        const val = t * maxV;
        const y = scaleY(val);
        return (
            <g key={`gy${i}`}>
                <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#152232" strokeWidth={1} />
                <text x={padL - 6} y={y + 4} fontSize={10} fill="#9ca3af" textAnchor="end">{Math.round(val)}</text>
            </g>
        );
    });

    // X axis ticks (week labels)
    const xTicks = data.map((d, i) => {
        const x = scaleX(i) + barW / 2;
        return (
            <g key={`xt${i}`}>
                <line x1={x} y1={padT + chartH} x2={x} y2={padT + chartH + 4} stroke="#3b4a5f" strokeWidth={1} />
                <text x={x} y={padT + chartH + 14} fontSize={9} fill="#9ca3af" textAnchor="middle">{d.label}</text>
            </g>
        );
    });

    return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
            <div style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: 8 }}>{label}</div>
            <svg width={width} height={height} style={{ width: '100%', maxWidth: '100%' }}>
                <rect x={0} y={0} width={width} height={height} fill="#0b1622" />
                {yGrid}
                <line x1={padL} y1={padT + chartH} x2={width - padR} y2={padT + chartH} stroke="#243447" strokeWidth={1.5} />
                <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#243447" strokeWidth={1.5} />
                {data.map((d, i) => {
                    const h = Math.max(2, (d.y / Math.max(1, maxV)) * chartH);
                    const x = scaleX(i);
                    const y = padT + chartH - h;
                    return <rect key={i} x={x + 6} y={y} width={Math.max(2, barW - 12)} height={h} fill={color} rx={4} />
                })}
                {xTicks}
            </svg>
        </div>
    );
}

function groupByDay(results) {
    const map = new Map();
    results.forEach(r => {
        const key = formatDate(r.createdAt);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(r);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([day, items]) => ({ day, items }));
}

function aggregateSeries(results, type) {
    const filtered = results.filter(r => r.questionnaireType === type);
    return filtered.map(r => ({ x: new Date(r.createdAt).getTime(), y: r.totalScore, d: formatDate(r.createdAt) }))
        .sort((a, b) => a.x - b.x);
}

function sparkLine({ data = [], color = "#10b981", maxY = 27, height = 140, padding = 28, label }) {
    if (data.length === 0) return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
            <div style={{ color: '#9ca3af', marginBottom: 8 }}>{label}</div>
            <div style={{ color: '#6b7280' }}>No data yet.</div>
        </div>
    );
    const xs = data.map(d => d.x);
    const ys = data.map(d => d.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = 0, maxYv = Math.max(maxY, Math.max(...ys));
    const W = 560, H = height;
    const scaleX = x => padding + ((x - minX) / Math.max(1, (maxX - minX))) * (W - padding * 2);
    const scaleY = y => H - padding - (y - minY) / Math.max(1, (maxYv - minY)) * (H - padding * 2);
    const path = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
    return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
            <div style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: 8 }}>{label}</div>
            <svg width={560} height={height} style={{ width: '100%', maxWidth: '100%' }}>
                <rect x={0} y={0} width={560} height={height} fill="#0b1622" />
                <path d={path} fill="none" stroke={color} strokeWidth={2} />
            </svg>
            <div style={{ color: '#9ca3af', fontSize: 12 }}>Latest: {data.length ? data[data.length - 1].y : '-'} • Points: {data.length}</div>
        </div>
    );
}

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const token = await getAuth().currentUser.getIdToken();
                const isDev = !!(import.meta.env && import.meta.env.DEV);
                const base = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.length > 0)
                    ? import.meta.env.VITE_API_URL
                    : (isDev ? 'http://localhost:3001' : '');
                const res = await fetch(`${base}/api/results/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
                const data = await res.json();
                if (!cancelled) setResults(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) setError(e.message || 'Failed to load');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const phqSeries = useMemo(() => aggregateSeries(results, 'PHQ-9'), [results]);
    const gadSeries = useMemo(() => aggregateSeries(results, 'GAD-7'), [results]);
    const days = useMemo(() => groupByDay(results), [results]);

    // Severity helpers
    const phqSeverity = (s) =>
        s == null ? '-' : s >= 20 ? 'Severe' : s >= 15 ? 'Moderately severe' : s >= 10 ? 'Moderate' : s >= 5 ? 'Mild' : 'Minimal';
    const gadSeverity = (s) =>
        s == null ? '-' : s >= 15 ? 'Severe' : s >= 10 ? 'Moderate' : s >= 5 ? 'Mild' : 'Minimal';

    const latest = (series) => (series && series.length ? series[series.length - 1] : null);
    const prev = (series) => (series && series.length > 1 ? series[series.length - 2] : null);

    const latestPHQ = latest(phqSeries);
    const prevPHQ = prev(phqSeries);
    const latestGAD = latest(gadSeries);
    const prevGAD = prev(gadSeries);

    const delta = (a, b) => (a != null && b != null ? a - b : null);
    const phqDelta = delta(latestPHQ?.y, prevPHQ?.y);
    const gadDelta = delta(latestGAD?.y, prevGAD?.y);

    // Simple 30-day trend: average of last 30 days vs prior 30
    const daysBack = (n) => Date.now() - n * 24 * 60 * 60 * 1000;
    const avgInRange = (series, start, end) => {
        const pts = series.filter(p => p.x >= start && p.x < end).map(p => p.y);
        if (!pts.length) return null;
        return pts.reduce((a, c) => a + c, 0) / pts.length;
    };
    const now = Date.now();
    const last30 = [daysBack(30), now];
    const prev30 = [daysBack(60), daysBack(30)];
    const phqAvgLast30 = avgInRange(phqSeries, last30[0], last30[1]);
    const phqAvgPrev30 = avgInRange(phqSeries, prev30[0], prev30[1]);
    const gadAvgLast30 = avgInRange(gadSeries, last30[0], last30[1]);
    const gadAvgPrev30 = avgInRange(gadSeries, prev30[0], prev30[1]);

    // Weekly summaries (last 8 weeks)
    function weekKey(ts) {
        const d = new Date(ts);
        const onejan = new Date(d.getFullYear(), 0, 1);
        const diff = Math.round(((d - onejan) / 86400000) + onejan.getDay() + 1);
        const week = Math.ceil(diff / 7);
        return `${d.getFullYear()}-W${week}`;
    }
    function weeklyAvg(series) {
        const m = new Map();
        series.forEach(p => { const k = weekKey(p.x); if (!m.has(k)) m.set(k, []); m.get(k).push(p.y); });
        const arr = [...m.entries()].map(([k, vals]) => ({ label: k, y: vals.reduce((a, c) => a + c, 0) / vals.length }));
        arr.sort((a, b) => a.label.localeCompare(b.label));
        return arr.slice(-8);
    }
    const phqWeekly = weeklyAvg(phqSeries);
    const gadWeekly = weeklyAvg(gadSeries);

    // Streaks (lower is better)
    function currentStreak(series) {
        if (series.length < 2) return { dir: 'flat', len: series.length ? 1 : 0 };
        let len = 0; let dir = 'flat';
        for (let i = series.length - 1; i > 0; i--) {
            const diff = series[i].y - series[i - 1].y;
            const d = diff < 0 ? 'improving' : diff > 0 ? 'worsening' : 'flat';
            if (i === series.length - 1) { dir = d; len = 1; }
            else if (d === dir && d !== 'flat') { len++; } else { break; }
        }
        return { dir, len };
    }
    const phqStreak = currentStreak(phqSeries);
    const gadStreak = currentStreak(gadSeries);

    // Best/Worst days (by score)
    const bestPHQ = phqSeries.length ? phqSeries.reduce((a, c) => c.y < a.y ? c : a) : null;
    const worstPHQ = phqSeries.length ? phqSeries.reduce((a, c) => c.y > a.y ? c : a) : null;
    const bestGAD = gadSeries.length ? gadSeries.reduce((a, c) => c.y < a.y ? c : a) : null;
    const worstGAD = gadSeries.length ? gadSeries.reduce((a, c) => c.y > a.y ? c : a) : null;

    // Severity distributions
    const phqBand = (s) => (s >= 20 ? 'Severe' : s >= 15 ? 'Mod Severe' : s >= 10 ? 'Moderate' : s >= 5 ? 'Mild' : 'Minimal');
    const gadBand = (s) => (s >= 15 ? 'Severe' : s >= 10 ? 'Moderate' : s >= 5 ? 'Mild' : 'Minimal');
    const phqDist = ['Minimal', 'Mild', 'Moderate', 'Mod Severe', 'Severe'].map((b, i) => ({
        label: b,
        value: phqSeries.filter(p => phqBand(p.y) === b).length,
        color: ['#10b981', '#86efac', '#22d3ee', '#f59e0b', '#f43f5e'][i]
    }));
    const gadDist = ['Minimal', 'Mild', 'Moderate', 'Severe'].map((b, i) => ({
        label: b,
        value: gadSeries.filter(p => gadBand(p.y) === b).length,
        color: ['#10b981', '#86efac', '#a78bfa', '#f43f5e'][i]
    }));

    // Benchmarks (90-day)
    const back90 = now - 90 * 24 * 60 * 60 * 1000;
    const phq90 = phqSeries.filter(p => p.x >= back90);
    const phq90avg = phq90.length ? phq90.reduce((a, c) => a + c.y, 0) / phq90.length : null;
    const last3phq = phqSeries.slice(-3);
    const last3phqAvg = last3phq.length ? last3phq.reduce((a, c) => a + c.y, 0) / last3phq.length : null;
    const last3Below90 = (phq90avg != null && last3phqAvg != null) ? (last3phqAvg < phq90avg) : null;

    // Risk flags
    const riskFlags = [];
    if (phqDelta != null && phqDelta >= 5) riskFlags.push(`PHQ‑9 increased by ${phqDelta} since last check‑in`);
    if (gadDelta != null && gadDelta >= 5) riskFlags.push(`GAD‑7 increased by ${gadDelta} since last check‑in`);
    if (phqAvgLast30 != null && phqAvgPrev30 != null && phqAvgLast30 > phqAvgPrev30) riskFlags.push('PHQ‑9 trending higher vs prior 30 days');
    if (gadAvgLast30 != null && gadAvgPrev30 != null && gadAvgLast30 > gadAvgPrev30) riskFlags.push('GAD‑7 trending higher vs prior 30 days');

    const handleDownloadPdf = () => {
        // Easiest cross-browser way: use print-to-PDF
        window.print();
    };

    return (
        <div style={{ padding: 24, color: '#e5e7eb', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800 }}>Analytics & Reporting</h1>
                <button onClick={handleDownloadPdf} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, boxShadow: '0 6px 18px rgba(16,185,129,0.25)' }}>Download as PDF</button>
            </div>
            <p style={{ color: '#9ca3af', marginBottom: 16 }}>Track your mood over months. Progress stats. Identify recurring triggers. Compare scores over time.</p>

            {loading && <div style={{ color: '#9ca3af' }}>Loading…</div>}
            {error && <div style={{ color: '#fca5a5' }}>{error}</div>}

            {!loading && !error && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                    {/* Interpretation */}
                    <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
                        <div style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: 8 }}>Interpretation</div>
                        {(!phqSeries.length && !gadSeries.length) ? (
                            <div style={{ color: '#9ca3af' }}>
                                No questionnaire history yet. Take a quick check‑in to unlock insights.
                                <div style={{ marginTop: 10 }}>
                                    <a href="#/questionnaires" style={{ background: '#10b981', color: '#fff', padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Go to Questionnaires</a>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <div style={{ color: '#9ca3af', marginBottom: 6 }}>PHQ‑9</div>
                                    <div style={{ color: '#e5e7eb' }}>
                                        Latest: <b>{latestPHQ?.y ?? '-'}</b> ({phqSeverity(latestPHQ?.y)})
                                        {phqDelta != null && (
                                            <span style={{ marginLeft: 8, color: phqDelta > 0 ? '#fca5a5' : phqDelta < 0 ? '#86efac' : '#9ca3af' }}>
                                                {phqDelta > 0 ? '↑' : phqDelta < 0 ? '↓' : '→'} {Math.abs(phqDelta)} vs previous
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>
                                        30‑day avg: {phqAvgLast30 == null ? '-' : phqAvgLast30.toFixed(1)}
                                        {phqAvgPrev30 != null && phqAvgLast30 != null && (
                                            <>
                                                {' '}({phqAvgLast30 - phqAvgPrev30 > 0 ? '↑' : phqAvgLast30 - phqAvgPrev30 < 0 ? '↓' : '→'}
                                                {' '}{Math.abs(phqAvgLast30 - phqAvgPrev30).toFixed(1)} vs prior 30d)
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#9ca3af', marginBottom: 6 }}>GAD‑7</div>
                                    <div style={{ color: '#e5e7eb' }}>
                                        Latest: <b>{latestGAD?.y ?? '-'}</b> ({gadSeverity(latestGAD?.y)})
                                        {gadDelta != null && (
                                            <span style={{ marginLeft: 8, color: gadDelta > 0 ? '#fca5a5' : gadDelta < 0 ? '#86efac' : '#9ca3af' }}>
                                                {gadDelta > 0 ? '↑' : gadDelta < 0 ? '↓' : '→'} {Math.abs(gadDelta)} vs previous
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>
                                        30‑day avg: {gadAvgLast30 == null ? '-' : gadAvgLast30.toFixed(1)}
                                        {gadAvgPrev30 != null && gadAvgLast30 != null && (
                                            <>
                                                {' '}({gadAvgLast30 - gadAvgPrev30 > 0 ? '↑' : gadAvgLast30 - gadAvgPrev30 < 0 ? '↓' : '→'}
                                                {' '}{Math.abs(gadAvgLast30 - gadAvgPrev30).toFixed(1)} vs prior 30d)
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {dualLineChart({ phq: phqSeries, gad: gadSeries, phqColor: '#22d3ee', gadColor: '#a78bfa', label: 'PHQ‑9 and GAD‑7 over time (lower is better)' })}

                    {/* Risk flags and CTA */}
                    {(riskFlags.length > 0) && (
                        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
                            <div style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: 8 }}>Risk flags</div>
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {riskFlags.map((r, i) => (
                                    <li key={i} style={{ color: '#fca5a5', marginBottom: 4 }}>{r}</li>
                                ))}
                            </ul>
                            <div style={{ marginTop: 12 }}>
                                <a href="#/ai-recommendation" style={{ background: '#ef4444', color: '#fff', padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Get AI Recommendation</a>
                            </div>
                        </div>
                    )}

                    {/* Severity distributions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {pieChart({ segments: phqDist, label: 'PHQ‑9 severity distribution' })}
                        {pieChart({ segments: gadDist, label: 'GAD‑7 severity distribution' })}
                    </div>

                    {/* Week-over-week averages */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {barChart({ data: phqWeekly, color: '#22d3ee', label: 'PHQ‑9 weekly average (last 8 weeks)' })}
                        {barChart({ data: gadWeekly, color: '#a78bfa', label: 'GAD‑7 weekly average (last 8 weeks)' })}
                    </div>

                    {/* Best/Worst & Streaks */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
                            <div style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: 8 }}>Best/Worst days 🌟 / 🚩</div>
                            <div style={{ color: '#e5e7eb' }}>
                                <div style={{ marginBottom: 6 }}>🌟 PHQ‑9 best: {bestPHQ ? `${bestPHQ.y} on ${new Date(bestPHQ.x).toLocaleDateString()}` : '-'}</div>
                                <div style={{ marginBottom: 6 }}>🚩 PHQ‑9 worst: {worstPHQ ? `${worstPHQ.y} on ${new Date(worstPHQ.x).toLocaleDateString()}` : '-'}</div>
                                <div style={{ marginBottom: 6 }}>🌟 GAD‑7 best: {bestGAD ? `${bestGAD.y} on ${new Date(bestGAD.x).toLocaleDateString()}` : '-'}</div>
                                <div>🚩 GAD‑7 worst: {worstGAD ? `${worstGAD.y} on ${new Date(worstGAD.x).toLocaleDateString()}` : '-'}</div>
                            </div>
                        </div>
                        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
                            <div style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: 8 }}>Streaks 🔁</div>
                            <div style={{ color: '#e5e7eb' }}>
                                <div style={{ marginBottom: 6 }}>{(() => { const map = { improving: '📉 Improving', worsening: '📈 Worsening', flat: '➖ Flat' }; return `PHQ‑9: ${map[phqStreak.dir] || phqStreak.dir} streak ${phqStreak.len || 0}`; })()}</div>
                                <div>{(() => { const map = { improving: '📉 Improving', worsening: '📈 Worsening', flat: '➖ Flat' }; return `GAD‑7: ${map[gadStreak.dir] || gadStreak.dir} streak ${gadStreak.len || 0}`; })()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Benchmarks */}
                    <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
                        <div style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: 8 }}>Benchmarks 📊</div>
                        <div style={{ color: '#e5e7eb' }}>
                            <div style={{ marginBottom: 6 }}>📈 PHQ‑9 last 3 avg: {last3phqAvg == null ? '-' : last3phqAvg.toFixed(1)}</div>
                            <div style={{ marginBottom: 6 }}>📅 PHQ‑9 90‑day avg: {phq90avg == null ? '-' : phq90avg.toFixed(1)}</div>
                            <div>{last3Below90 == null ? '—' : (last3Below90 ? '👍 Last 3 below 90‑day avg: Yes' : '⚠️ Last 3 below 90‑day avg: No')}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Print styles for clean PDF */}
            <style>{`
        @media print {
          body { background: #fff !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          button { display: none !important; }
          a { color: inherit; text-decoration: none; }
          .no-print { display: none; }
        }
      `}</style>
        </div>
    );
}
