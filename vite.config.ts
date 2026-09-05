import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import nodemailer from 'nodemailer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-email-dispatcher-middleware',
        configureServer(server) {
          server.middlewares.use('/api/send-email', (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
              res.statusCode = 200;
              res.end();
              return;
            }

            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            let rawBody = '';
            req.on('data', (chunk) => {
              rawBody += chunk;
            });

            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json');

              try {
                const body = JSON.parse(rawBody || '{}');
                const { from, to, subject, html, reply_to, tags, venue } = body;
                const recipient = Array.isArray(to) ? to[0] : (to || 'tiguidda76@gmail.com');

                const senderUser = process.env.GMAIL_USER || env.GMAIL_USER || 'tiguidda76@gmail.com';
                const senderPass = process.env.GMAIL_APP_PASSWORD || env.GMAIL_APP_PASSWORD || 'bfgznhusgoyrlpml';

                // 1. MOTEUR 1 : GMAIL SMTP DIRECT (Gratuit, 500/j, zéro domaine requis)
                if (senderUser && senderPass) {
                  try {
                    const transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: senderUser.trim(),
                        pass: senderPass.trim(),
                      },
                    });

                    const senderDisplayName = "Cabinet d'Audit Radar — Hassan Tiguidda";
                    const info = await transporter.sendMail({
                      from: `"${senderDisplayName}" <${senderUser.trim()}>`,
                      to: recipient,
                      replyTo: reply_to || senderUser.trim(),
                      subject: subject,
                      html: html,
                    });

                    console.log(`[Local Vite Dev - Gmail SMTP Direct] Envoyé à ${recipient}, MessageID: ${info.messageId}`);
                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      success: true,
                      id: info.messageId,
                      provider: 'GMAIL_SMTP',
                      recipient: recipient,
                      isTestRoute: false,
                    }));
                    return;
                  } catch (smtpErr: any) {
                    console.error('[Local Vite Dev - Gmail SMTP Error]', smtpErr?.message || smtpErr);
                  }
                }

                // 2. MOTEUR 2 : RESEND API (Fallback)
                const apiKey = env.VITE_RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '';
                if (apiKey && apiKey.trim().startsWith('re_')) {
                  const fromAddress = from || env.VITE_RESEND_FROM_EMAIL || 'onboarding@resend.dev';

                  const sanitize = (val: any) =>
                    String(val || 'default')
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-zA-Z0-9_-]/g, '_')
                      .slice(0, 64);

                  const safeTags = (Array.isArray(tags) ? tags : [])
                    .filter((t) => t && t.name && t.value)
                    .map((t) => ({ name: sanitize(t.name), value: sanitize(t.value) }))
                    .filter((t) => t.name.length > 0 && t.value.length > 0);

                  let response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${apiKey.trim()}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      from: fromAddress.includes('<') ? fromAddress : `Hassan Tiguidda — Morocco Radar <${fromAddress}>`,
                      to: [recipient],
                      subject,
                      html,
                      reply_to: reply_to || 'tiguidda76@gmail.com',
                      tags: safeTags,
                    }),
                  });

                  let data = await response.json();
                  let isTestRoute = false;

                  // Auto-fallback if unverified domain or sandbox restriction
                  if (!response.ok && (data?.message?.includes('not verified') || data?.message?.includes('testing emails to your own email'))) {
                    console.warn(`[Local Vite Middleware] Fallback vers onboarding@resend.dev -> tiguidda76@gmail.com`);
                    const fallbackSubject = `[TEST RADAR → ${venue?.name || 'Prospect'}] ${subject}`;
                    const fallbackRes = await fetch('https://api.resend.com/emails', {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${apiKey.trim()}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        from: 'Hassan Tiguidda — Morocco Radar <onboarding@resend.dev>',
                        to: ['tiguidda76@gmail.com'],
                        subject: fallbackSubject,
                        html: `
                          <div style="background:#fef3c7;border:1px solid #f59e0b;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-family:sans-serif;font-size:12px;color:#92400e;">
                            <strong>⚠️ Note d'acheminement Test :</strong> Cet email est destiné à <strong>${venue?.name || 'Établissement'}</strong> (&lt;${recipient}&gt;).
                          </div>
                          ${html}
                        `,
                        reply_to: 'tiguidda76@gmail.com',
                        tags: [
                          ...safeTags,
                          { name: 'test_route', value: 'true' }
                        ],
                      }),
                    });

                    if (fallbackRes.ok) {
                      response = fallbackRes;
                      data = await fallbackRes.json();
                      isTestRoute = true;
                    }
                  }

                  if (response.ok) {
                    res.statusCode = 200;
                    res.end(JSON.stringify({
                      success: true,
                      id: data.id,
                      provider: 'RESEND_API',
                      isTestRoute,
                      recipient: isTestRoute ? `tiguidda76@gmail.com (Test pour ${venue?.name || 'Prospect'})` : recipient
                    }));
                    return;
                  } else {
                    res.statusCode = response.status || 400;
                    res.end(JSON.stringify({
                      success: false,
                      error: data?.message || `Erreur Resend HTTP ${response.status}`,
                      raw: data
                    }));
                    return;
                  }
                }

                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: 'Aucun moteur d\'envoi valide configuré' }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message || 'Erreur interne' }));
              }
            });
          });
        }
      }
    ],
  };
});
