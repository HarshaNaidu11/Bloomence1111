import React from 'react';

export default function ChatSafetyHint() {
    return (
        <div style={{ background: '#0a1a27', border: '1px solid #1f2a37', color: '#e5e7eb', borderRadius: 10, padding: 10, margin: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span aria-hidden style={{ fontSize: 16 }}>🤝</span>
                <div>
                    <div style={{ fontWeight: 700 }}>Be kind. Stay safe.</div>
                    <div style={{ color: '#9ca3af', fontSize: 12 }}>Avoid sharing personal info (address, phone, passwords). If in crisis, use Emergency Contacts.</div>
                </div>
            </div>
        </div>
    );
}
