import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

function Tip({ emoji, text }) {
    return (
        <div style={{ background: '#0a1a27', border: '1px solid #1f2a37', borderRadius: 10, padding: 10, color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>{emoji}</span>
            <span style={{ fontSize: 14 }}>{text}</span>
        </div>
    );
}

export default function InlineReminders() {
    const { currentUser } = useAuth();
    const userKey = useMemo(() => `u:${currentUser?.uid || 'anon'}:${currentUser?.email || 'noemail'}`, [currentUser]);
    const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const readJSON = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } };
    const readNum = (k, f = 0) => { try { const v = localStorage.getItem(k); const n = v == null ? f : Number(v); return isNaN(n) ? f : n; } catch { return f; } };

    const settings = readJSON(`${userKey}:reminders:settings`, { hydration: true, steps: true, bedtime: true, quietHours: { start: '22:00', end: '07:00' } });
    const glasses = readNum(`${userKey}:hydration:${today}`, 0);
    const steps = readNum(`${userKey}:steps:${today}`, 0);
    const stepGoal = 8000;

    const now = new Date();
    const toMins = (hhmm) => { const [h, m] = (hhmm || '00:00').split(':').map(Number); return h * 60 + (m || 0); };
    const minsNow = now.getHours() * 60 + now.getMinutes();
    const quietStart = toMins(settings.quietHours?.start || '22:00');
    const quietEnd = toMins(settings.quietHours?.end || '07:00');
    const inQuiet = quietStart < quietEnd ? (minsNow >= quietStart && minsNow <= quietEnd) : (minsNow >= quietStart || minsNow <= quietEnd);

    const tips = [];
    if (settings.hydration && !inQuiet && glasses < 8) {
        tips.push({ emoji: '💧', text: `Hydration: ${glasses}/8 today. A quick glass helps mood and focus.` });
    }
    // Only suggest steps during daytime (7am - 9pm) and if below goal
    if (settings.steps && !inQuiet && minsNow >= 7 * 60 && minsNow <= 21 * 60 && steps < stepGoal) {
        tips.push({ emoji: '👟', text: `Steps: ${steps.toLocaleString()}/${stepGoal.toLocaleString()}. Try a 5‑min walk break.` });
    }
    // Bedtime wind-down within 60 minutes before quietStart
    const withinWindDown = (() => {
        const diff = (quietStart - minsNow);
        return diff > 0 && diff <= 60; // within next hour
    })();
    if (settings.bedtime && withinWindDown) {
        tips.push({ emoji: '🌙', text: 'Wind‑down: dim screens, light stretching, or a short journal.' });
    }

    if (!tips.length) return null;

    return (
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
            {tips.map((t, i) => <Tip key={i} emoji={t.emoji} text={t.text} />)}
        </div>
    );
}
