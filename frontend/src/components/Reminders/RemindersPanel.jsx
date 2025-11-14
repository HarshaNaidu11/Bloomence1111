import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function Row({ label, children }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, alignItems: 'center' }}>
            <div style={{ color: '#cbd5e1' }}>{label}</div>
            <div>{children}</div>
        </div>
    );
}

export default function RemindersPanel() {
    const { currentUser } = useAuth();
    const userKey = useMemo(() => `u:${currentUser?.uid || 'anon'}:${currentUser?.email || 'noemail'}`, [currentUser]);
    const LS_KEY = `${userKey}:reminders:settings`;

    const [settings, setSettings] = useState(() => {
        try { const v = localStorage.getItem(LS_KEY); return v ? JSON.parse(v) : { hydration: true, steps: true, bedtime: true, quietHours: { start: '22:00', end: '07:00' } }; } catch { return { hydration: true, steps: true, bedtime: true, quietHours: { start: '22:00', end: '07:00' } }; }
    });

    useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(settings)); } catch { } }, [LS_KEY, settings]);

    return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
            <div style={{ color: '#e5e7eb', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>⏰</span>
                <span>Reminders</span>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
                <Row label="Hydration">
                    <label style={{ color: '#e5e7eb' }}>
                        <input type="checkbox" checked={settings.hydration} onChange={() => setSettings(s => ({ ...s, hydration: !s.hydration }))} />
                        <span style={{ marginLeft: 8 }}>Enable gentle prompts</span>
                    </label>
                </Row>
                <Row label="Steps">
                    <label style={{ color: '#e5e7eb' }}>
                        <input type="checkbox" checked={settings.steps} onChange={() => setSettings(s => ({ ...s, steps: !s.steps }))} />
                        <span style={{ marginLeft: 8 }}>Encourage movement breaks</span>
                    </label>
                </Row>
                <Row label="Bedtime">
                    <label style={{ color: '#e5e7eb' }}>
                        <input type="checkbox" checked={settings.bedtime} onChange={() => setSettings(s => ({ ...s, bedtime: !s.bedtime }))} />
                        <span style={{ marginLeft: 8 }}>Suggest screen-off and wind-down</span>
                    </label>
                </Row>
                <Row label="Quiet Hours">
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="time" value={settings.quietHours.start} onChange={e => setSettings(s => ({ ...s, quietHours: { ...s.quietHours, start: e.target.value } }))} style={{ background: '#0b1622', color: '#e5e7eb', border: '1px solid #1f2a37', borderRadius: 8, padding: '6px 8px' }} />
                        <span style={{ color: '#9ca3af' }}>to</span>
                        <input type="time" value={settings.quietHours.end} onChange={e => setSettings(s => ({ ...s, quietHours: { ...s.quietHours, end: e.target.value } }))} style={{ background: '#0b1622', color: '#e5e7eb', border: '1px solid #1f2a37', borderRadius: 8, padding: '6px 8px' }} />
                    </div>
                </Row>
            </div>
            <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 8 }}>Lightweight prompts appear inline; no disruptive notifications.</div>
        </div>
    );
}
