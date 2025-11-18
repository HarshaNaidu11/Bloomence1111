import { io } from 'socket.io-client';
import { getAuth } from 'firebase/auth';

export async function connectRealtime() {
  const token = await getAuth().currentUser.getIdToken();
  const isDev = !!(import.meta.env && import.meta.env.DEV);
  const defaultLocal = isDev ? 'http://localhost:3001' : 'https://bloomence-5bn4.onrender.com';
  const url = import.meta.env.VITE_SOCKET_URL || defaultLocal;
  const socket = io(url, {
    transports: ['websocket'],
    auth: { token },
  });

  const isDevLog = import.meta.env && import.meta.env.DEV;

  socket.on('connect', () => {
    if (isDevLog) console.log('[socket] connected');
  });
  socket.on('connect_error', (err) => {
    if (isDevLog) console.error('[socket] connect_error', err?.message || err);
  });
  socket.on('disconnect', () => {
    if (isDevLog) console.warn('[socket] disconnect');
  });

  socket.on('email:sent', () => { if (isDevLog) console.log('[socket] email:sent'); });
  socket.on('auth:login', () => { if (isDevLog) console.log('[socket] auth:login'); });
  socket.on('result:saved', () => { if (isDevLog) console.log('[socket] result:saved'); });
  socket.on('result:highScoreAlert', () => { if (isDevLog) console.log('[socket] result:highScoreAlert'); });

  return socket;
}
