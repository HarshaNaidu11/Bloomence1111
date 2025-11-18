// src/pages/Community/Explore.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
    {
        key: 'anxiety',
        title: 'Anxiety',
        color: '#0ea5e9',
        problems: [
            { key: 'social-anxiety', label: 'Social anxiety', image: 'https://picsum.photos/seed/social-anxiety/400/240' },
            { key: 'panic-attacks', label: 'Panic attacks', image: 'https://picsum.photos/seed/panic-attacks/400/240' },
            { key: 'health-anxiety', label: 'Health anxiety', image: 'https://picsum.photos/seed/health-anxiety/400/240' },
        ],
    },
    {
        key: 'depression',
        title: 'Depression',
        color: '#8b5cf6',
        problems: [
            { key: 'low-motivation', label: 'Low motivation', image: 'https://picsum.photos/seed/low-motivation/400/240' },
            { key: 'negative-thoughts', label: 'Negative thoughts', image: 'https://picsum.photos/seed/negative-thoughts/400/240' },
            { key: 'sleep-issues', label: 'Sleep issues', image: 'https://picsum.photos/seed/sleep-issues/400/240' },
        ],
    },
    {
        key: 'stress',
        title: 'Stress',
        color: '#f59e0b',
        problems: [
            { key: 'work-burnout', label: 'Work burnout', image: 'https://picsum.photos/seed/work-burnout/400/240' },
            { key: 'academic-stress', label: 'Academic stress', image: 'https://picsum.photos/seed/academic-stress/400/240' },
            { key: 'life-changes', label: 'Life changes', image: 'https://picsum.photos/seed/life-changes/400/240' },
        ],
    },
    {
        key: 'relationships',
        title: 'Relationships',
        color: '#10b981',
        problems: [
            { key: 'conflict', label: 'Conflict & boundaries', image: 'https://picsum.photos/seed/conflict/400/240' },
            { key: 'breakup', label: 'Breakup & loss', image: 'https://picsum.photos/seed/breakup/400/240' },
            { key: 'loneliness', label: 'Loneliness', image: 'https://picsum.photos/seed/loneliness/400/240' },
        ],
    },
    {
        key: 'selfgrowth',
        title: 'Self Growth',
        color: '#ef4444',
        problems: [
            { key: 'procrastination', label: 'Procrastination', image: 'https://picsum.photos/seed/procrastination/400/240' },
            { key: 'habits', label: 'Building habits', image: 'https://picsum.photos/seed/habits/400/240' },
            { key: 'confidence', label: 'Confidence', image: 'https://picsum.photos/seed/confidence/400/240' },
        ],
    },
    {
        key: 'trauma',
        title: 'Trauma',
        color: '#ec4899',
        problems: [
            { key: 'ptsd', label: 'PTSD support', image: 'https://picsum.photos/seed/ptsd/400/240' },
            { key: 'childhood-trauma', label: 'Childhood trauma', image: 'https://picsum.photos/seed/childhood-trauma/400/240' },
            { key: 'healing', label: 'Healing & coping', image: 'https://picsum.photos/seed/healing/400/240' },
        ],
    },
    {
        key: 'addiction',
        title: 'Addiction',
        color: '#22c55e',
        problems: [
            { key: 'alcohol', label: 'Alcohol recovery', image: 'https://picsum.photos/seed/alcohol/400/240' },
            { key: 'digital', label: 'Digital addiction', image: 'https://picsum.photos/seed/digital-addiction/400/240' },
            { key: 'relapse', label: 'Relapse prevention', image: 'https://picsum.photos/seed/relapse-prevention/400/240' },
        ],
    },
    {
        key: 'adhd',
        title: 'ADHD',
        color: '#06b6d4',
        problems: [
            { key: 'focus', label: 'Focus & routines', image: 'https://picsum.photos/seed/focus/400/240' },
            { key: 'organization', label: 'Organization', image: 'https://picsum.photos/seed/organization/400/240' },
            { key: 'study', label: 'Study strategies', image: 'https://picsum.photos/seed/study/400/240' },
        ],
    },
    {
        key: 'eating',
        title: 'Eating & Body Image',
        color: '#a855f7',
        problems: [
            { key: 'binging', label: 'Binging & urges', image: 'https://picsum.photos/seed/binging/400/240' },
            { key: 'body-image', label: 'Body image', image: 'https://picsum.photos/seed/body-image-2/400/240' },
            { key: 'mindful-eating', label: 'Mindful eating', image: 'https://picsum.photos/seed/mindful-eating/400/240' },
        ],
    },
];

const SELF_HELP_GROUPS = [
    {
        key: 'daily-check-in',
        title: 'Daily Check-in Circle',
        tagline: 'Share how you feel today in a safe space.',
        color: '#10b981',
        description: 'A gentle space to do quick mood check-ins, celebrate small wins, and ask for encouragement.',
        route: '/community/selfhelp/daily-check-in'
    },
    {
        key: 'anxiety-coping',
        title: 'Anxiety Coping Squad',
        tagline: 'Breathe, ground, and support each other.',
        color: '#0ea5e9',
        description: 'Swap coping tools for racing thoughts, panic feelings, or difficult days.',
        route: '/community/selfhelp/anxiety-coping'
    },
    {
        key: 'low-mood',
        title: 'Low Mood Support',
        tagline: 'You do not have to go through this alone.',
        color: '#8b5cf6',
        description: 'For days that feel heavy—share, listen, and be heard without judgement.',
        route: '/community/selfhelp/low-mood'
    },
    {
        key: 'study-focus',
        title: 'Study & Focus Pod',
        tagline: 'Stay accountable with others like you.',
        color: '#f59e0b',
        description: 'Students and professionals co-working virtually, sharing focus tips and routines.',
        route: '/community/selfhelp/study-focus'
    },
    {
        key: 'relationships',
        title: 'Relationships & Boundaries',
        tagline: 'Talk through conflict, loss, and connection.',
        color: '#ec4899',
        description: 'Discuss breakups, family stress, and boundary setting with people who understand.',
        route: '/community/selfhelp/relationships'
    },
    {
        key: 'habits-growth',
        title: 'Habits & Growth Lab',
        tagline: 'Tiny steps towards a better you.',
        color: '#22c55e',
        description: 'Work on small daily habits together—sleep, exercise, journaling, and more.',
        route: '/community/selfhelp/habits-growth'
    },
];

export default function ExploreCommunity() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto', color: '#e5e7eb' }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '0.02em', color: '#ffffff', marginBottom: 8 }}>Explore Community</h1>
            <p style={{ color: '#a3a3a3', marginBottom: 24 }}>Choose a category and join conversations that matter to you. Be kind and supportive.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {CATEGORIES.map((cat) => (
                    <section key={cat.key} style={{ background: '#0b1622', border: '1px solid #1f2a37', borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{ background: cat.color, height: 6 }} />
                        <div style={{ padding: 16 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: '#ffffff' }}>{cat.title}</h2>
                            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
                                {cat.problems.map((p) => (
                                    <div key={p.key} style={{ minWidth: 240, border: '1px solid #203040', borderRadius: 10, background: '#0d1b29', overflow: 'hidden' }}>
                                        <div style={{ height: 120, background: `linear-gradient(135deg, ${cat.color}33, #0b1622 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={p.image || 'https://picsum.photos/seed/placeholder/400/240'} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                            <div style={{ color: '#e5e7eb', fontWeight: 600 }}>{p.label}</div>
                                            <button
                                                onClick={() => navigate(`/community/${cat.key}/${p.key}`)}
                                                style={{
                                                    background: '#10b981',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: 8,
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    boxShadow: '0 6px 18px rgba(16,185,129,0.25)'
                                                }}
                                            >
                                                Chat Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            <section style={{ marginTop: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '0.02em', color: '#ffffff' }}>Self Help Groups</h2>
                    <p style={{ color: '#9ca3af', fontSize: 14, maxWidth: 420 }}>
                        Join a small, focused group and stay connected with people facing similar challenges. These are
                        peer-led spaces—be kind, respectful, and avoid sharing personal identifying details.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    {SELF_HELP_GROUPS.map((g) => (
                        <div key={g.key} style={{ borderRadius: 14, border: '1px solid #1f2a37', background: '#020817', overflow: 'hidden', boxShadow: '0 18px 45px rgba(0,0,0,0.55)' }}>
                            <div style={{ height: 4, background: g.color }} />
                            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f9fafb' }}>{g.title}</h3>
                                    <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.09em', padding: '4px 8px', borderRadius: 999, border: `1px solid ${g.color}55`, color: '#e5e7eb', background: '#020617' }}>
                                        Self help
                                    </span>
                                </div>
                                <p style={{ color: '#a3a3a3', fontSize: 13 }}>{g.tagline}</p>
                                <p style={{ color: '#6b7280', fontSize: 12, lineHeight: 1.5 }}>{g.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 11, color: '#9ca3af' }}>
                                        <span>Approx. 10–30 members</span>
                                        <span style={{ color: '#22c55e' }}>Open 24/7 • Text only</span>
                                    </div>
                                    <button
                                        onClick={() => navigate(g.route)}
                                        style={{
                                            background: g.color,
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '8px 14px',
                                            borderRadius: 999,
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            letterSpacing: '0.04em',
                                            fontSize: 12,
                                            boxShadow: '0 10px 25px rgba(16,185,129,0.35)'
                                        }}
                                    >
                                        Join Group
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
