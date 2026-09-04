import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_FILE = path.join(__dirname, '..', '.env');

// Auto-load .env if exists
if (fs.existsSync(ENV_FILE)) {
  const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.trim().match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) {
      const key = match[1];
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const PORT = process.env.OUTREACH_PORT || 5678;
const LOG_FILE = path.join(__dirname, 'outreach_delivery_log.json');

// Ensure log file exists
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
}

function getLogs() {
  try {
    const raw = fs.readFileSync(LOG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function appendLog(entry) {
  try {
    const logs = getLogs();
    logs.unshift(entry);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs.slice(0, 300), null, 2));
  } catch (err) {
    console.error('Error writing log:', err);
  }
}

function updateLogEntry(id, updater) {
  try {
    const logs = getLogs();
    const index = logs.findIndex(l => l.executionId === id || l.delivery?.messageId === id);
    if (index !== -1) {
      updater(logs[index]);
      fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    }
  } catch (err) {
    console.error('Error updating log entry:', err);
  }
}

// Create nodemailer transporter
function createMailTransporter() {
  const user = process.env.GMAIL_USER || 'tiguidda76@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD || 'bfgznhusgoyrlpml';

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  return null;
}

// Retry with Exponential Backoff
async function sendMailWithRetry(transporter, mailOptions, maxRetries = 3) {
  let attempt = 0;
  let delay = 1000;

  while (attempt < maxRetries) {
    try {
      attempt++;
      const info = await transporter.sendMail(mailOptions);
      return { success: true, info, attempts: attempt };
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
      console.warn(`[SMTP] Échec tentative ${attempt}/${maxRetries}: ${err.message}. Nouvel essai dans ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

// 1x1 Transparent PNG Buffer
const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = reqUrl.pathname;

  // 1. Pixel Open Tracking
  if (pathname === '/track/open') {
    const execId = reqUrl.searchParams.get('id');
    const now = new Date().toISOString();

    if (execId) {
      updateLogEntry(execId, (entry) => {
        if (!entry.tracking) entry.tracking = {};
        entry.tracking.opened = true;
        entry.tracking.lastOpenedAt = now;
        entry.tracking.openCount = (entry.tracking.openCount || 0) + 1;
      });
      console.log(`👁️ [Email Ouvert] ID: ${execId} à ${now}`);
    }

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': PIXEL_PNG.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private'
    });
    res.end(PIXEL_PNG);
    return;
  }

  // 2. Click Tracking & Redirection
  if (pathname === '/track/click') {
    const execId = reqUrl.searchParams.get('id');
    const targetUrl = reqUrl.searchParams.get('url') || 'https://wa.me/212632155430';
    const now = new Date().toISOString();

    if (execId) {
      updateLogEntry(execId, (entry) => {
        if (!entry.tracking) entry.tracking = {};
        entry.tracking.clicked = true;
        entry.tracking.lastClickedAt = now;
        entry.tracking.clickCount = (entry.tracking.clickCount || 0) + 1;
        entry.tracking.clickedUrl = targetUrl;
      });
      console.log(`🖱️ [Lien Cliqué] ID: ${execId} vers ${targetUrl}`);
    }

    res.writeHead(302, { 'Location': targetUrl });
    res.end();
    return;
  }

  // 3. Telemetry Stats API
  if (pathname === '/api/telemetry/stats') {
    const logs = getLogs();
    const totalSent = logs.filter(l => l.eventType === 'EMAIL_AUDIT').length;
    const delivered = logs.filter(l => l.delivery?.status === 'SENT' || l.delivery?.status === 'DELIVERED_REAL').length;
    const opened = logs.filter(l => l.tracking?.opened).length;
    const clicked = logs.filter(l => l.tracking?.clicked).length;
    const bounced = logs.filter(l => l.delivery?.status === 'ERROR' || l.delivery?.status === 'BOUNCED').length;

    const deliveryRate = totalSent > 0 ? Number(((delivered / totalSent) * 100).toFixed(1)) : 100;
    const openRate = delivered > 0 ? Number(((opened / delivered) * 100).toFixed(1)) : 0;
    const clickRate = opened > 0 ? Number(((clicked / opened) * 100).toFixed(1)) : 0;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      totalSent,
      delivered,
      opened,
      clicked,
      bounced,
      deliveryRate,
      openRate,
      clickRate,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 4. Inbound Webhook Dispatcher
  if (pathname === '/webhook/morocco-outreach' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const eventType = payload.eventType || 'UNKNOWN';
        const timestamp = new Date().toISOString();
        const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        console.log(`\n⚡ [Outreach Server] Reçu: ${eventType} | Cible: ${payload.recipient?.venueName || 'N/A'}`);

        let actualEmailDelivery = null;
        const transporter = createMailTransporter();

        if (eventType === 'EMAIL_AUDIT' && payload.recipient?.email) {
          const toEmail = payload.recipient.email;
          const subject = payload.content?.subject || `[Audit Réputation] ${payload.recipient.venueName}`;
          let html = payload.content?.htmlBody || payload.content?.messageText;

          // Inject tracking pixel
          const trackingPixel = `<img src="http://localhost:${PORT}/track/open?id=${executionId}" width="1" height="1" style="display:none;" alt="" />`;
          html = `${html}\n${trackingPixel}`;

          if (transporter) {
            try {
              const result = await sendMailWithRetry(transporter, {
                from: `"${payload.sender?.senderName || 'Hassan Tiguidda — E-Réputation Maroc'}" <${process.env.GMAIL_USER || 'tiguidda76@gmail.com'}>`,
                to: toEmail,
                subject,
                html
              });

              actualEmailDelivery = {
                provider: 'GMAIL_SMTP',
                messageId: result.info.messageId,
                status: 'SENT',
                attempts: result.attempts
              };
              console.log(`📧 [Email Envoyé Réellement via SMTP] vers ${toEmail} (ID: ${result.info.messageId})`);
            } catch (smtpErr) {
              console.error('SMTP Send Error après retries:', smtpErr.message);
              actualEmailDelivery = {
                provider: 'GMAIL_SMTP',
                status: 'ERROR',
                error: smtpErr.message
              };
            }
          }
        }

        const logEntry = {
          executionId,
          timestamp,
          eventType,
          recipient: payload.recipient,
          contentSummary: {
            subject: payload.content?.subject,
            preview: payload.content?.messageText?.slice(0, 140),
            language: payload.content?.language
          },
          delivery: actualEmailDelivery || {
            status: 'DISPATCHED_TO_WEBHOOK_QUEUE',
            note: 'Payload reçu et journalisé avec succès.'
          },
          tracking: {
            opened: false,
            clicked: false,
            openCount: 0,
            clickCount: 0
          }
        };

        appendLog(logEntry);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          executionId,
          messageId: actualEmailDelivery?.messageId || `msg_${executionId}`,
          recipient: payload.recipient?.email || payload.recipient?.phone,
          status: actualEmailDelivery?.status === 'SENT' ? 'DELIVERED_REAL' : 'QUEUED_AND_RECORDED',
          deliveryDetails: actualEmailDelivery,
          deliveredAt: timestamp
        }));

      } catch (err) {
        console.error('❌ Error handling webhook payload:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: `Erreur de traitement: ${err.message}`
        }));
      }
    });
    return;
  }

  // 5. Health check
  if (pathname === '/health' || pathname === '/') {
    const hasTransporter = Boolean(createMailTransporter());

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ONLINE',
      service: 'Morocco Radar Automation & Outreach Engine',
      port: PORT,
      webhookEndpoint: `http://localhost:${PORT}/webhook/morocco-outreach`,
      liveDeliveryEnabled: hasTransporter,
      activeProvider: 'Gmail SMTP (tiguidda76@gmail.com)'
    }));
    return;
  }

  // 6. View Logs endpoint
  if (pathname === '/logs') {
    const logs = getLogs();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(logs, null, 2));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint non trouvé' }));
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🇲🇦 MOROCCO RADAR OUTREACH ENGINE EN LIGNE (Port ${PORT})`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook/morocco-outreach`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});
