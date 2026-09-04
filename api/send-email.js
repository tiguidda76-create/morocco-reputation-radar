export default async function handler(req, res) {
  // Enable CORS if ever needed from preview deployments
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY || '';
  if (!apiKey || !apiKey.trim().startsWith('re_')) {
    return res.status(500).json({
      success: false,
      error: 'VITE_RESEND_API_KEY manquant ou invalide sur le serveur Vercel'
    });
  }

  const { from, to, subject, html, reply_to, tags, venue } = req.body || {};
  const recipient = Array.isArray(to) ? to[0] : (to || 'tiguidda76@gmail.com');
  const fromAddress = from || process.env.VITE_RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    // Attempt 1: Send with configured parameters
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
        tags: tags || [],
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
              <strong>⚠️ Note d'acheminement Test :</strong> Cet email est destiné à <strong>${venue?.name || 'Établissement'}</strong> (&lt;${recipient}&gt;). Il vous est acheminé directement car le domaine de production est en cours de validation DNS sur Resend.
            </div>
            ${html}
          `,
          reply_to: 'tiguidda76@gmail.com',
          tags: [
            ...(tags || []),
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
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `Erreur serveur d'envoi: ${err.message || err}`
    });
  }
}
