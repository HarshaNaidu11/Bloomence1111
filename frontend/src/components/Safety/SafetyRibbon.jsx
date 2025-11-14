import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SafetyRibbon() {
    const navigate = useNavigate();
    return (
        <div style={{ background: '#0a1e2e', borderBottom: '1px solid #123047', color: '#d1fae5' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span role="img" aria-label="safety" style={{ fontSize: 18 }}>🛟</span>
                    <span style={{ fontWeight: 700 }}>Need help now?</span>
                    <span style={{ color: '#a7f3d0' }}>If you or someone is in danger, contact local emergency services immediately.</span>
                </div>
                <button onClick={() => navigate('/emergency-contact')} style={{ background: '#10b981', color: '#07211f', border: '0', borderRadius: 8, padding: '6px 10px', fontWeight: 800, boxShadow: '0 6px 16px rgba(16,185,129,0.25)' }}>
                    Emergency Contacts
                </button>
            </div>
        </div>
    );
}
