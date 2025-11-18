const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const fromEmail = process.env.FROM_EMAIL || user;
const fromName = process.env.FROM_NAME || 'Bloomence';
const sendGridKey = process.env.SENDGRID_API_KEY;

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }
  return transporter;
}

async function sendWithSendGrid(to, subject, html, text) {
  const body = {
    personalizations: [
      {
        to: [{ email: to }],
      },
    ],
    from: { email: fromEmail, name: fromName },
    subject,
    content: [
      { type: 'text/plain', value: text || html.replace(/<[^>]+>/g, ' ') },
      { type: 'text/html', value: html },
    ],
  };

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sendGridKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errText = '';
    try { errText = await res.text(); } catch (_) { }
    throw new Error(`SendGrid error ${res.status}: ${errText}`);
  }

  return { messageId: res.headers.get('x-message-id') || undefined };
}

async function sendEmail(to, subject, html, text) {
  // Prefer SendGrid HTTP API if configured, to avoid SMTP connectivity limits on hosts like Render
  if (sendGridKey) {
    return sendWithSendGrid(to, subject, html, text);
  }

  const t = getTransporter();
  const info = await t.sendMail({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    text: text || html.replace(/<[^>]+>/g, ' '),
    html,
  });
  return info;
}

module.exports = { sendEmail };
