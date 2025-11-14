import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

function Section({ label, value, sub }) {
    return (
        <div style={{ background: '#0a1a27', border: '1px solid #1f2a37', borderRadius: 10, padding: 12 }}>
            <div style={{ color: '#9ca3af', marginBottom: 6 }}>{label}</div>
            <div style={{ color: '#e5e7eb', fontSize: 18, fontWeight: 700 }}>{value}</div>
            {sub ? <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>{sub}</div> : null}
        </div>
    );
}

export default function WeeklyProgressCard() {
    const { currentUser } = useAuth();
    const userKey = useMemo(() => {
        const uid = currentUser?.uid || 'anon';
        const email = currentUser?.email || 'noemail';
        return `u:${uid}:${email}`;
    }, [currentUser]);

    const days = useMemo(() => {
        const out = [];
        const d = new Date();
        for (let i = 0; i < 7; i++) {
            const dt = new Date(d);
            dt.setDate(d.getDate() - (6 - i));
            out.push(dt.toISOString().slice(0, 10));
        }
        return out;
    }, []);

    const readJSON = (key, fallback) => {
        try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    };
    const readNum = (key, fallback = 0) => {
        try { const v = localStorage.getItem(key); const n = v == null ? fallback : Number(v); return isNaN(n) ? fallback : n; } catch { return fallback; }
    };

    // Sleep logs (array with date, hours, score)
    const sleepLogs = readJSON(`${userKey}:sleep:logs`, []);
    const last7Sleep = days.map(d => sleepLogs.find(e => e.date === d)).filter(Boolean);
    const avgSleepHrs = last7Sleep.length ? (last7Sleep.reduce((a, b) => a + (b.hours || 0), 0) / last7Sleep.length) : 0;
    const avgSleepScore = last7Sleep.length ? Math.round(last7Sleep.reduce((a, b) => a + (b.score || 0), 0) / last7Sleep.length) : 0;

    // Steps per day (stored as numeric per-day keys)
    const stepsPerDay = days.map(d => readNum(`${userKey}:steps:${d}`, 0));
    const totalSteps = stepsPerDay.reduce((a, b) => a + b, 0);
    const avgSteps = Math.round(totalSteps / 7);

    // Hydration per day
    const hydrationPerDay = days.map(d => readNum(`${userKey}:hydration:${d}`, 0));
    const avgHydration = Math.round(hydrationPerDay.reduce((a, b) => a + b, 0) / 7);

    // Movement streak info
    const movementHistory = readJSON(`${userKey}:movement:history`, {});
    let streak = 0; {
        // compute current streak up to most recent day in days[]
        for (let i = days.length - 1; i >= 0; i--) {
            const key = days[i];
            if (movementHistory[key]) streak++; else break;
        }
    }

    return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622', marginBottom: 16 }}>
            <div style={{ color: '#e5e7eb', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>📈</span>
                <span>Weekly Progress</span>
            </div>
            <div style={{ color: '#9ca3af', marginBottom: 10 }}>A quick snapshot from your last 7 days.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
                <Section label="Avg Sleep" value={`${avgSleepHrs.toFixed(1)} hrs`} sub={`Score ~ ${avgSleepScore}/100`} />
                <Section label="Steps (avg)" value={avgSteps.toLocaleString()} sub={`Total ${totalSteps.toLocaleString()}`} />
                <Section label="Hydration (avg)" value={`${avgHydration} glasses`} sub={`Goal 8/day`} />
                <Section label="Movement streak" value={`${streak} days`} sub={`Past 7 days`} />
            </div>
        </div>
    );
}
