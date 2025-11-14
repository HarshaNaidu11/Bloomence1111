import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function Card({ title, emoji, children }) {
    return (
        <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
            <div style={{ color: '#e5e7eb', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <span>{title}</span>
            </div>
            <div style={{ color: '#cbd5e1' }}>{children}</div>
        </div>
    );
}

function useLocalState(prefixedKey, initial) {
    const [val, setVal] = useState(() => {
        try { const v = localStorage.getItem(prefixedKey); return v ? JSON.parse(v) : initial; } catch { return initial; }
    });
    useEffect(() => { try { localStorage.setItem(prefixedKey, JSON.stringify(val)); } catch { } }, [prefixedKey, val]);
    return [val, setVal];
}

export default function Lifestyle() {
    const { currentUser } = useAuth();
    const userKey = useMemo(() => {
        const uid = currentUser?.uid || 'anon';
        const email = currentUser?.email || 'noemail';
        return `u:${uid}:${email}`;
    }, [currentUser]);
    const k = (name) => `${userKey}:${name}`;
    const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

    // Sleep
    const [sleepStart, setSleepStart] = useLocalState(k('sleep:start'), '23:00');
    const [sleepEnd, setSleepEnd] = useLocalState(k('sleep:end'), '07:00');
    const [sleepLogs, setSleepLogs] = useLocalState(k('sleep:logs'), []);
    const [routine, setRoutine] = useLocalState(k('sleep:routine'), { screensOff: false, stretch: false, journal: false });
    const sleepDurationHrs = useMemo(() => {
        const [sh, sm] = sleepStart.split(':').map(Number);
        const [eh, em] = sleepEnd.split(':').map(Number);
        let start = sh + sm / 60; let end = eh + em / 60;
        if (isNaN(start) || isNaN(end)) return 0;
        if (end <= start) end += 24;
        return +(end - start).toFixed(2);
    }, [sleepStart, sleepEnd]);
    const sleepScore = useMemo(() => {
        const dur = sleepDurationHrs;
        const base = Math.max(0, Math.min(100, (dur / 8) * 85));
        const bonus = (routine.screensOff ? 5 : 0) + (routine.stretch ? 5 : 0) + (routine.journal ? 5 : 0);
        return Math.round(Math.min(100, base + bonus));
    }, [sleepDurationHrs, routine]);
    const logSleep = () => {
        const entry = { date: todayKey, start: sleepStart, end: sleepEnd, hours: sleepDurationHrs, score: sleepScore };
        setSleepLogs(prev => {
            const others = prev.filter(e => e.date !== todayKey);
            return [...others, entry];
        });
    };

    // Fitness
    const [steps, setSteps] = useLocalState(k(`steps:${todayKey}`), 0);
    const stepGoal = 8000;
    const incSteps = (n) => setSteps(s => s + n);
    const resetSteps = () => setSteps(0);
    const [workouts, setWorkouts] = useLocalState(k(`workouts:${todayKey}`), { hiit: false, walk: false, stretch: false });
    const toggleWorkout = (k) => setWorkouts(w => ({ ...w, [k]: !w[k] }));
    const [yogaDone, setYogaDone] = useLocalState(k(`yoga:${todayKey}`), false);
    const [movementHistory, setMovementHistory] = useLocalState(k('movement:history'), {});
    useEffect(() => {
        setMovementHistory(h => ({ ...h, [todayKey]: (steps >= stepGoal) }));
    }, [steps, stepGoal, todayKey, setMovementHistory]);
    const movementStreak = useMemo(() => {
        const dates = Object.keys(movementHistory).sort();
        let streak = 0;
        let d = new Date(todayKey);
        while (true) {
            const key = d.toISOString().slice(0, 10);
            if (movementHistory[key]) { streak++; d.setDate(d.getDate() - 1); }
            else break;
        }
        return streak;
    }, [movementHistory, todayKey]);

    // Nutrition
    const [glasses, setGlasses] = useLocalState(k(`hydration:${todayKey}`), 0);
    const addGlass = () => setGlasses(g => Math.min(20, g + 1));
    const resetGlasses = () => setGlasses(0);
    const [journal, setJournal] = useLocalState(k(`foodmood:${todayKey}`), '');
    const [mealPlan, setMealPlan] = useLocalState(k('mealplan:week'), {});
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const sampleMeals = [
        'Oats + berries', 'Eggs + toast', 'Greek yogurt + nuts',
        'Grilled chicken + quinoa', 'Lentil bowl', 'Salmon + veggies', 'Veggie wrap'
    ];
    const generatePlan = () => {
        const plan = {};
        days.forEach((d, i) => plan[d] = { lunch: sampleMeals[(i) % sampleMeals.length], dinner: sampleMeals[(i + 3) % sampleMeals.length] });
        setMealPlan(plan);
    };

    return (
        <div style={{ padding: 24, color: '#e5e7eb', maxWidth: 1100, margin: '0 auto' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Lifestyle</h1>
            <p style={{ color: '#9ca3af', marginBottom: 16 }}>Daily habits that support your mental health. Start small, stay consistent.</p>

            <Card title="Sleep Health" emoji="😴">
                <p style={{ margin: '6px 0 10px' }}>Sleep influences mood, anxiety, focus, and overall balance.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Sleep tracker</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <input type="time" value={sleepStart} onChange={e => setSleepStart(e.target.value)} style={{ background: '#0b1622', color: '#e5e7eb', border: '1px solid #1f2a37', borderRadius: 8, padding: '6px 8px' }} />
                            <input type="time" value={sleepEnd} onChange={e => setSleepEnd(e.target.value)} style={{ background: '#0b1622', color: '#e5e7eb', border: '1px solid #1f2a37', borderRadius: 8, padding: '6px 8px' }} />
                            <button onClick={logSleep} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 700 }}>Log</button>
                            <span style={{ color: '#9ca3af' }}>{sleepDurationHrs} hrs</span>
                        </div>
                    </div>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Sleep score</div>
                        <div style={{ fontSize: 24 }}>💤 {sleepScore}/100</div>
                        <div style={{ color: '#9ca3af', fontSize: 12 }}>Target: 7–9 hrs, consistent schedule</div>
                    </div>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Bedtime routine</div>
                        <label style={{ display: 'block', marginBottom: 6 }}><input type="checkbox" checked={routine.screensOff} onChange={() => setRoutine(r => ({ ...r, screensOff: !r.screensOff }))} /> <span style={{ marginLeft: 6 }}>Screen off 30 mins before bed</span></label>
                        <label style={{ display: 'block', marginBottom: 6 }}><input type="checkbox" checked={routine.stretch} onChange={() => setRoutine(r => ({ ...r, stretch: !r.stretch }))} /> <span style={{ marginLeft: 6 }}>Light stretch</span></label>
                        <label style={{ display: 'block' }}><input type="checkbox" checked={routine.journal} onChange={() => setRoutine(r => ({ ...r, journal: !r.journal }))} /> <span style={{ marginLeft: 6 }}>Journaling 5 minutes</span></label>
                    </div>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Recent logs</div>
                        <div style={{ color: '#e5e7eb', fontSize: 12 }}>
                            {sleepLogs.length ? sleepLogs.sort((a, b) => a.date.localeCompare(b.date)).slice(-5).map((e, i) => (
                                <div key={i}>{e.date}: {e.hours}h • score {e.score}</div>
                            )) : 'No entries yet.'}
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 10, color: '#86efac', fontWeight: 600 }}>👉 This is the #1 lifestyle lever for mental health.</div>
            </Card>

            <div style={{ height: 12 }} />
            <Card title="Physical Fitness & Movement" emoji="🏃‍♀️">
                <p style={{ margin: '6px 0 10px' }}>Movement boosts serotonin, dopamine, and endorphins.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Daily steps</div>
                        <div style={{ fontSize: 24 }}>👣 {steps.toLocaleString()} / {stepGoal.toLocaleString()}</div>
                        <div style={{ marginTop: 8 }}>
                            <button onClick={() => incSteps(500)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 700 }}>+500</button>
                            <button onClick={resetSteps} style={{ background: '#1f2a37', color: '#e5e7eb', border: 'none', borderRadius: 8, padding: '6px 10px', marginLeft: 8 }}>Reset</button>
                        </div>
                    </div>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Quick workouts</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button onClick={() => toggleWorkout('hiit')} style={{ background: workouts.hiit ? '#10b981' : '#1f2a37', color: '#e5e7eb', border: 'none', borderRadius: 8, padding: '6px 10px' }}>💪 10-min HIIT {workouts.hiit ? '✓' : ''}</button>
                            <button onClick={() => toggleWorkout('walk')} style={{ background: workouts.walk ? '#10b981' : '#1f2a37', color: '#e5e7eb', border: 'none', borderRadius: 8, padding: '6px 10px' }}>🚶 15-min Walk {workouts.walk ? '✓' : ''}</button>
                            <button onClick={() => toggleWorkout('stretch')} style={{ background: workouts.stretch ? '#10b981' : '#1f2a37', color: '#e5e7eb', border: 'none', borderRadius: 8, padding: '6px 10px' }}>🧘 Stretch {workouts.stretch ? '✓' : ''}</button>
                        </div>
                    </div>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Yoga / stretching</div>
                        <button onClick={() => setYogaDone(v => !v)} style={{ background: yogaDone ? '#10b981' : '#1f2a37', color: '#e5e7eb', border: 'none', borderRadius: 8, padding: '6px 10px' }}>{yogaDone ? '✅ Completed today' : 'Mark done today'}</button>
                    </div>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Movement streak</div>
                        <div>🔥 {movementStreak}-day streak • Goal: {stepGoal.toLocaleString()} steps</div>
                    </div>
                </div>
                <div style={{ marginTop: 10, color: '#86efac', fontWeight: 600 }}>👉 Exercise can be as effective as medication for mild depression.</div>
            </Card>

            <div style={{ height: 12 }} />
            <Card title="Nutrition for Mental Health" emoji="🥗">
                <p style={{ margin: '6px 0 10px' }}>Food influences stress, cognition, and energy.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Mood‑boosting foods</div>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            <li>🍫 Dark chocolate (in moderation)</li>
                            <li>🐟 Omega‑3 rich fish</li>
                            <li>🥜 Nuts & seeds</li>
                            <li>🍓 Berries</li>
                        </ul>
                    </div>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Weekly meal plan</div>
                        <div>📅 Mon–Sun planner with simple, balanced options.</div>
                        <button onClick={generatePlan} style={{ marginTop: 8, background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 700 }}>Generate simple plan</button>
                        <div style={{ marginTop: 10, color: '#e5e7eb', fontSize: 12 }}>
                            {Object.keys(mealPlan).length ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8 }}>
                                    {days.map((d, i) => (
                                        <div key={i} style={{ background: '#0b1622', border: '1px solid #1f2a37', borderRadius: 8, padding: 8 }}>
                                            <div style={{ color: '#9ca3af', marginBottom: 4 }}>{d}</div>
                                            <div>Lunch: {mealPlan[d]?.lunch || '-'}</div>
                                            <div>Dinner: {mealPlan[d]?.dinner || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : 'No plan yet.'}
                        </div>
                    </div>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Hydration tracker</div>
                        <div>💧 {glasses} / 8 glasses today</div>
                        <div style={{ marginTop: 8 }}>
                            <button onClick={addGlass} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 700 }}>+1 glass</button>
                            <button onClick={resetGlasses} style={{ background: '#1f2a37', color: '#e5e7eb', border: 'none', borderRadius: 8, padding: '6px 10px', marginLeft: 8 }}>Reset</button>
                        </div>
                    </div>
                    <div style={{ background: '#0a1a27', borderRadius: 10, padding: 12 }}>
                        <div style={{ color: '#9ca3af', marginBottom: 6 }}>Food–mood journal</div>
                        <textarea value={journal} onChange={e => setJournal(e.target.value)} placeholder="How did meals impact your mood today?" rows={3} style={{ width: '100%', background: '#0b1622', color: '#e5e7eb', border: '1px solid #1f2a37', borderRadius: 8, padding: 8 }} />
                    </div>
                </div>
                <div style={{ marginTop: 10, color: '#86efac', fontWeight: 600 }}>👉 Keep it simple. Small, consistent choices compound.</div>
            </Card>
        </div>
    );
}
