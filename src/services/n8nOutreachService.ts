export interface IntegrationConfig {
  n8nWebhookUrl: string;
  resendApiKey: string;
  metaWhatsAppToken: string;
  metaPhoneId: string;
  metaWabaId: string;
  senderEmail: string;
  senderName: string;
}

const STORAGE_KEY = 'mrr_integration_config_v1';

export function getIntegrationConfig(): IntegrationConfig {
  let saved: Partial<IntegrationConfig> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) saved = JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read integration config from localStorage:', e);
  }

  return {
    n8nWebhookUrl: saved.n8nWebhookUrl || 'http://localhost:5678/webhook/morocco-outreach',
    resendApiKey: saved.resendApiKey || (import.meta.env.VITE_RESEND_API_KEY as string) || '',
    metaWhatsAppToken: saved.metaWhatsAppToken || (import.meta.env.VITE_META_WHATSAPP_TOKEN as string) || '',
    metaPhoneId: saved.metaPhoneId || (import.meta.env.VITE_META_PHONE_ID as string) || '',
    metaWabaId: saved.metaWabaId || (import.meta.env.VITE_META_WABA_ID as string) || '',
    senderEmail: saved.senderEmail || (import.meta.env.VITE_SENDER_EMAIL as string) || 'tiguidda76@gmail.com',
    senderName: saved.senderName || 'Hassan Tiguidda — Morocco Radar'
  };
}

export function saveIntegrationConfig(config: Partial<IntegrationConfig>): IntegrationConfig {
  const current = getIntegrationConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save integration config:', e);
  }
  return updated;
}

export function getActiveDeliveryStatus(): {
  hasN8n: boolean;
  hasResend: boolean;
  hasMeta: boolean;
  isRealDeliveryAvailable: boolean;
  activeChannelDescription: string;
} {
  const cfg = getIntegrationConfig();
  const hasN8n = Boolean(cfg.n8nWebhookUrl && cfg.n8nWebhookUrl.trim().startsWith('http'));
  const hasResend = Boolean(cfg.resendApiKey && cfg.resendApiKey.trim().startsWith('re_'));
  const hasMeta = Boolean(cfg.metaWhatsAppToken && cfg.metaPhoneId && cfg.metaWhatsAppToken.trim().length > 10);
  const isRealDeliveryAvailable = hasN8n || hasResend || hasMeta;

  let activeChannelDescription = 'Mode Brouillon / Simulation (Aucune API configurée)';
  if (hasN8n) {
    activeChannelDescription = 'n8n Automation Webhook (Actif)';
  } else if (hasResend && hasMeta) {
    activeChannelDescription = 'Resend API & Meta Cloud WhatsApp (Actifs)';
  } else if (hasResend) {
    activeChannelDescription = 'Resend Email API (Actif)';
  } else if (hasMeta) {
    activeChannelDescription = 'Meta Cloud WhatsApp API (Actif)';
  }

  return {
    hasN8n,
    hasResend,
    hasMeta,
    isRealDeliveryAvailable,
    activeChannelDescription
  };
}

export interface OutreachWebhookPayload {
  eventType: 'EMAIL_AUDIT' | 'WHATSAPP_PITCH' | 'MASS_DISPATCH' | 'TEST_PING';
  timestamp: string;
  recipient: {
    venueId: string;
    venueName: string;
    city: string;
    contactPerson: string;
    phone: string;
    email: string;
    unrepliedReviews: number;
    annualLossMAD: number;
  };
  content: {
    subject?: string;
    messageText: string;
    htmlBody?: string;
    language: 'FR' | 'DARIJA' | 'EN';
    auditPublicUrl: string;
    signedPdfUrl?: string;
  };
  sender: {
    agencyName: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    ice: string;
  };
}

export async function testN8nConnection(webhookUrl: string): Promise<{ success: boolean; message: string; data?: any }> {
  if (!webhookUrl || !webhookUrl.trim().startsWith('http')) {
    return { success: false, message: 'URL Webhook invalide. Doit débuter par http:// ou https://' };
  }

  const testPayload = {
    eventType: 'TEST_PING',
    timestamp: new Date().toISOString(),
    testMessage: 'Ping de test de connexion depuis Morocco Reputation Radar',
    sender: {
      agencyName: 'Morocco Radar Agency',
      founder: 'Hassan Tiguidda'
    }
  };

  try {
    const res = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    if (res.ok) {
      let data = {};
      try {
        data = await res.json();
      } catch (_) {
        data = { status: res.statusText };
      }
      return {
        success: true,
        message: `Connexion n8n réussie (HTTP ${res.status} ${res.statusText})`,
        data
      };
    } else {
      return {
        success: false,
        message: `Le webhook n8n a répondu avec une erreur HTTP ${res.status}: ${res.statusText}`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Impossible de contacter le webhook n8n: ${err.message || 'Erreur réseau/CORS'}`
    };
  }
}

export async function dispatchToN8n(
  payload: OutreachWebhookPayload
): Promise<{ success: boolean; messageId?: string; error?: string; rawResponse?: any }> {
  const cfg = getIntegrationConfig();
  if (!cfg.n8nWebhookUrl) {
    return {
      success: false,
      error: 'Webhook n8n non configuré.'
    };
  }

  try {
    const res = await fetch(cfg.n8nWebhookUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        error: `Erreur HTTP ${res.status} reçue de n8n: ${errText.slice(0, 120)}`
      };
    }

    let resData: any = {};
    try {
      resData = await res.json();
    } catch (_) {
      resData = { status: 'OK' };
    }

    return {
      success: true,
      messageId: resData.messageId || resData.executionId || `n8n_exec_${Date.now()}`,
      rawResponse: resData
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Échec d'envoi réseau vers n8n: ${err.message || 'Erreur inconnue'}`
    };
  }
}
