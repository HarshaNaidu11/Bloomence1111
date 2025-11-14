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
        </div>
    );
}
