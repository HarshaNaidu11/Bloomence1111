const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Import Routes and Middleware ---
const resultsRoutes = require('./routes/results');
const geminiRoutes = require('./routes/gemini');
const { verifyToken, admin } = require('./middleware/auth'); // ✅ fixed
const notificationsRoutes = require('./routes/notifications');
const chatRoutes = require('./routes/chat');
const { startNotificationsScheduler } = require('./jobs/scheduler');
const { sendEmail } = require('./utils/mailer');
const User = require('./models/User');
const ChatMessage = require('./models/ChatMessage');

// --- MongoDB Connection ---
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log(' MongoDB connected successfully.'))
  .catch(err => console.error(' MongoDB connection error:', err));

// --- Middleware ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://bloomence-2.onrender.com',
  'https://bloomence-mss1.onrender.com',
  'https://bloomence-5bn4.onrender.com'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// --- Routes ---
app.use('/api/results', verifyToken, resultsRoutes); // 
app.use('/api/gemini', verifyToken, geminiRoutes);   // 
app.use('/api/notifications', verifyToken, notificationsRoutes);
app.use('/api/chat', verifyToken, chatRoutes);

// Basic health route (moved off '/')
app.get('/health', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).send('Backend is running and MongoDB is READY.');
  } else {
    res.status(503).send('Backend is running, but MongoDB connection failed.');
  }
});

// --- Serve Frontend Build & SPA Fallback ---
// Serve static assets from the Vite build output
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Important: place SPA fallback AFTER API routes but BEFORE server start.
// This ensures non-API routes are handled by React Router.
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// --- Realtime ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins }
});

io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.auth && socket.handshake.auth.token
      ? `Bearer ${socket.handshake.auth.token}`
      : socket.handshake.headers && socket.handshake.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next(new Error('unauthorized'));
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    socket.data.user = decoded;
    socket.join(decoded.uid);
    return next();
  } catch (e) {
    return next(e);
  }
});

io.on('connection', (socket) => {
  // Join a specific community room
  socket.on('chat:join', ({ roomId }) => {
    if (typeof roomId !== 'string' || !roomId) return;
    socket.join(roomId);
  });

  // Leave room (optional)
  socket.on('chat:leave', ({ roomId }) => {
    if (typeof roomId !== 'string' || !roomId) return;
    socket.leave(roomId);
  });

  // Broadcast message, persist, and handle @mentions (@email only)
  socket.on('chat:message', async ({ roomId, text, user }) => {
    try {
      if (typeof roomId !== 'string' || !roomId) return;
      const msgText = (text || '').toString();
      if (!msgText.trim()) return;

      const payload = {
        roomId,
        text: msgText,
        user: {
          uid: (user && user.uid) || socket.data?.user?.uid,
          name: (user && user.name) || 'User',
          email: (user && user.email) || undefined,
        },
        ts: Date.now(),
      };

      // Persist message
      try { await ChatMessage.create(payload); } catch (_) { }

      // Emit to room
      io.to(roomId).emit('chat:message', payload);

      // Detect @mentions like @email
      const mentionMatches = msgText.match(/@([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g) || [];
      if (mentionMatches.length) {
        // normalize emails
        const emails = Array.from(new Set(mentionMatches.map(m => m.slice(1).toLowerCase())));

        if (emails.length) {
          const candidates = await User.find({ email: { $in: emails } }).lean();
          const appUrl = process.env.APP_URL || 'http://localhost:5173/#';
          await Promise.all((candidates || []).map(async (u) => {
            if (!u?.email) return;
            try {
              const subject = `You were mentioned in a Bloomence chat`;
              const html = `
                <div style="font-family:Arial,sans-serif;background:#f7f9fc;padding:20px;">
                  <div style="max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;">
                    <div style="text-align:center;font-size:22px;">🌿 <span style="color:#10b981;font-weight:700;">Bloomence</span></div>
                    <h3 style="color:#111827;">You were mentioned</h3>
                    <p style="color:#374151;">${payload.user.name || 'Someone'} mentioned you in a community chat.</p>
                    <blockquote style="margin:12px 0;padding:12px;background:#f3f4f6;border-radius:8px;color:#111827;">${msgText.replace(/</g, '&lt;')}</blockquote>
                    <a href="${appUrl}/community" style="display:inline-block;margin-top:8px;background:#10b981;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;">Open Bloomence</a>
                    <p style="color:#6b7280;margin-top:16px;">With care,<br/>Bloomence Team</p>
                  </div>
                </div>`;
              await sendEmail(u.email, subject, html);
              // Optionally notify via socket to their personal room
              try { io.to(u.firebaseUid).emit('email:sent', { kind: 'mention', to: u.email }); } catch (_) { }
            } catch (_) { }
          }));
        }
      }
    } catch (e) {
      // swallow to avoid crashing the socket handler
    }
  });
});

app.set('io', io);

// --- Server Start ---
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
startNotificationsScheduler();