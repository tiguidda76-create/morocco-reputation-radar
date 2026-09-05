import nodemailer from 'nodemailer';
import dns from 'dns';

const dnsPromises = dns.promises;

function sanitizeTagValue(val) {
  if (!val) return 'default';
  return String(val)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[^a-zA-Z0-9_-]/g, '_') // only ASCII letters, numbers, underscores, dashes
    .slice(0, 64);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { from, to, subject, html, reply_to, tags, venue } = req.body || {};
  const recipient = (Array.isArray(to) ? to[0] : (to || 'tiguidda76@gmail.com')).trim();

  // =========================================================================
  // BOUCLIER ANTI-BOUNCE DNS : Vérifie que le domaine destinataire existe
  // et possède un serveur MX avant tout envoi pour protéger le compte Gmail.
  // =========================================================================
  const domain = recipient.split('@')[1];
  if (!domain || !domain.includes('.')) {
    return res.status(400).json({
      success: false,
      error: `Adresse email invalide ("${recipient}"). Envoi annulé.`,
    });
  }

  try {
    const mxRecords = await dnsPromises.resolveMx(domain.trim());
    if (!mxRecords || mxRecords.length === 0) {
      console.warn(`[Anti-Bounce Blocked] Le domaine ${domain} n'a pas de serveur MX actif.`);
      return res.status(400).json({
        success: false,
        error: `Le domaine "${domain}" ne possède aucun serveur email actif (enregistrement MX introuvable). Envoi bloqué pour éviter un rejet (bounce).`,
      });
    }
  } catch (dnsErr) {
    console.warn(`[Anti-Bounce Blocked] Domaine introuvable ${domain}:`, dnsErr.code);
    return res.status(400).json({
      success: false,
      error: `Le domaine "${domain}" est introuvable sur Internet (NXDOMAIN). Envoi bloqué automatiquement pour protéger la réputation de votre boîte Gmail.`,
    });
  }

  const senderUser = process.env.GMAIL_USER || 'tiguidda76@gmail.com';
  const senderPass = process.env.GMAIL_APP_PASSWORD || 'bfgznhusgoyrlpml';

  // =========================================================================
  // MOTEUR 1 (GRATUIT & RECOMMANDÉ) : RELAIS GMAIL SMTP DIRECT
  // Envoie directement au vrai destinataire sans avoir besoin d'acheter de domaine
  // =========================================================================
  if (senderUser && senderPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: senderUser.trim(),
          pass: senderPass.trim(),
        },
      });

      const senderDisplayName = 'Cabinet d\'Audit Radar — Hassan Tiguidda';
      const info = await transporter.sendMail({
        from: `"${senderDisplayName}" <${senderUser.trim()}>`,
        to: recipient,
        replyTo: reply_to || senderUser.trim(),
        subject: subject,
        html: html,
      });

      console.log(`[Gmail SMTP Direct Success] Envoyé à ${recipient}, MessageID: ${info.messageId}`);

      return res.status(200).json({
        success: true,
        id: info.messageId,
        provider: 'GMAIL_SMTP',
        recipient: recipient,
        isTestRoute: false,
      });
    } catch (smtpErr) {
      console.error('[Gmail SMTP Direct Error]', smtpErr);
      // En cas de panne SMTP inattendue, tente le fallback Resend si configuré
    }
  }

  // =========================================================================
  // MOTEUR 2 (FALLBACK) : RESEND API (SI CLÉ PRÉSENTE)
  // =========================================================================
  const apiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY || '';
  if (apiKey && apiKey.trim().startsWith('re_')) {
    const fromAddress = from || process.env.VITE_RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const safeTags = (Array.isArray(tags) ? tags : [])
      .filter(t => t && t.name && t.value)
      .map(t => ({
        name: sanitizeTagValue(t.name),
        value: sanitizeTagValue(t.value)
      }))
      .filter(t => t.name.length > 0 && t.value.length > 0);

    try {
      let response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
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

      // Auto-fallback: if unverified domain or unverified recipient in sandbox
      if (!response.ok && (data?.message?.includes('not verified') || data?.message?.includes('testing emails to your own email'))) {
        console.warn(`[Vercel Serverless Resend Fallback] Bascule vers onboarding@resend.dev -> tiguidda76@gmail.com`);
        const fallbackSubject = `[TEST RADAR → ${venue?.name || 'Prospect'}] ${subject}`;
        const fallbackRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
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
        return res.status(200).json({
          success: true,
          id: data.id,
          provider: 'RESEND_API',
          isTestRoute,
          recipient: isTestRoute ? `tiguidda76@gmail.com (Test pour ${venue?.name || 'Prospect'})` : recipient
        });
      } else {
        return res.status(response.status).json({
          success: false,
          error: data?.message || `Erreur Resend HTTP ${response.status}`,
          raw: data
        });
      }
    } catch (resendErr) {
      return res.status(500).json({
        success: false,
        error: `Erreur Resend: ${resendErr.message || resendErr}`
      });
    }
  }

  return res.status(500).json({
    success: false,
    error: 'Aucun moteur d\'envoi valide configuré (Gmail SMTP ou Resend)'
  });
}
