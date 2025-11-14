// src/pages/Community/ChatRoom.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { connectRealtime } from '../../realtime';
import { getAuth } from 'firebase/auth';

export default function ChatRoom() {
    const { category, problem } = useParams();
    const { currentUser } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [connecting, setConnecting] = useState(true);
    const bottomRef = useRef(null);

    const roomId = useMemo(() => `community:${category}:${problem}`, [category, problem]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const s = await connectRealtime();
                if (!mounted) return;
                setSocket(s);
                s.emit('chat:join', { roomId });
                s.on('chat:message', (msg) => setMessages((prev) => [...prev, msg]));
                s.on('connect', () => setConnecting(false));
            } catch (e) {
                setConnecting(false);
            }
        })();
        return () => {
            mounted = false;
            if (socket) {
                socket.emit('chat:leave', { roomId });
                socket.off('chat:message');
                socket.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    // Load persisted history
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const token = await getAuth().currentUser.getIdToken();
                const isDev = !!(import.meta.env && import.meta.env.DEV);
                const base = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.length > 0)
                    ? import.meta.env.VITE_API_URL
                    : (isDev ? 'http://localhost:3001' : '');
                const res = await fetch(`${base}/api/chat/${encodeURIComponent(roomId)}/messages`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled && Array.isArray(data.messages)) {
                    setMessages(data.messages);
                }
            } catch (_) { }
        })();
        return () => { cancelled = true; };
    }, [roomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        const text = input.trim();
        if (!text || !socket) return;
        const user = {
            uid: currentUser?.uid,
            name: currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'User'),
            email: currentUser?.email,
        };
        socket.emit('chat:message', { roomId, text, user });
        setInput('');
    };

    return (
        <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 12 }}>
                <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, letterSpacing: '0.02em' }}>
                    {category} • {problem}
                </h1>
                <p style={{ color: '#9ca3af' }}>Be supportive, avoid personal health advice, and respect privacy.</p>
            </div>

            <div style={{ border: '1px solid #1f2a37', borderRadius: 12, overflow: 'hidden', background: '#0b1622' }}>
                <div style={{ height: 420, overflowY: 'auto', padding: 12 }}>
                    {messages.map((m, idx) => {
                        const isOwn = m?.user?.uid && (m.user.uid === currentUser?.uid);
                        return (
                            <div key={idx} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                                <div style={{
                                    maxWidth: '80%',
                                    background: isOwn ? '#134e4a' : '#0d1b29',
                                    border: `1px solid ${isOwn ? '#115e59' : '#203040'}`,
                                    borderRadius: 12,
                                    padding: 10,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                        <div style={{ color: isOwn ? '#a7f3d0' : '#a7f3d0', fontWeight: 700, fontSize: 13 }}>
                                            {m.user?.name || 'User'}
                                        </div>
                                        {m.user?.email && (
                                            <div style={{ color: isOwn ? '#d1fae5' : '#86efac', fontSize: 12 }}>
                                                {m.user.email}
                                            </div>
                                        )}
                                        <div style={{ color: '#6b7280', marginLeft: 'auto', fontWeight: 400, fontSize: 12 }}>
                                            {new Date(m.ts || Date.now()).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div style={{ color: '#e5e7eb', whiteSpace: 'pre-wrap', marginTop: 2, textAlign: isOwn ? 'right' : 'left' }}>{m.text}</div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
                <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #1f2a37', background: '#0d1b29' }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                        placeholder={connecting ? 'Connecting…' : 'Type a message. Use @email to mention.'}
                        style={{
                            flex: 1,
                            padding: '10px 12px',
                            borderRadius: 8,
                            border: '1px solid #203040',
                            background: '#091421',
                            color: '#e5e7eb',
                            outline: 'none',
                        }}
                        disabled={connecting}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={connecting}
                        style={{
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 14px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            boxShadow: '0 6px 18px rgba(16,185,129,0.25)'
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
