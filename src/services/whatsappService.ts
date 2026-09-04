/**
 * Morocco Reputation Radar - WhatsApp & Multi-Channel Outreach Dispatcher
 * Supporte : n8n Webhook, Meta Cloud Graph API, et Fallback Web Intent (wa.me)
 */

import { getIntegrationConfig, dispatchToN8n, OutreachWebhookPayload } from './n8nOutreachService';
import { AGENCY_METADATA } from '../data/mockData';

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  recipientPhone: string;
  mode: 'N8N_WEBHOOK' | 'META_CLOUD_API' | 'FALLBACK_WEB_INTENT';
  error?: string;
  rawResponse?: any;
}

const META_API_VERSION = 'v21.0';

/**
 * Vérifie si les identifiants Meta Cloud API sont présents et configurés
 */
export const isMetaWhatsAppConfigured = (): boolean => {
  const cfg = getIntegrationConfig();
  return Boolean(
    cfg.metaWhatsAppToken && 
    cfg.metaPhoneId && 
    cfg.metaWhatsAppToken.trim() !== '' && 
    cfg.metaPhoneId.trim() !== '' &&
    !cfg.metaWhatsAppToken.includes('placeholder')
  );
};

/**
 * Nettoie et formate un numéro de téléphone marocain au format international E.164 (ex: 212632155430)
 */
export const formatMoroccanPhoneE164 = (rawPhone: string): string => {
  const digitsOnly = rawPhone.replace(/[^0-9]/g, '');
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    return '212' + digitsOnly.slice(1);
  }
  if (digitsOnly.startsWith('212')) {
    return digitsOnly;
  }
  return digitsOnly;
};

/**
 * Envoie un message texte libre (avec lien d'audit)
 * Priorité 1: n8n Webhook
 * Priorité 2: Meta Cloud API
 * Priorité 3: WhatsApp Web Intent
 */
export const sendWhatsAppMessage = async (
  toPhone: string,
  messageBody: string,
  venueContext?: {
    venueId: string;
    venueName: string;
    city: string;
    contactPerson: string;
    unrepliedReviews: number;
    annualLossMAD: number;
    language?: 'FR' | 'DARIJA' | 'EN';
  }
): Promise<WhatsAppSendResult> => {
  const cleanPhone = formatMoroccanPhoneE164(toPhone);
  const config = getIntegrationConfig();

  // 1. Canal Prioritaire : n8n Webhook
  if (config.n8nWebhookUrl && config.n8nWebhookUrl.startsWith('http')) {
    const payload: OutreachWebhookPayload = {
      eventType: 'WHATSAPP_PITCH',
      timestamp: new Date().toISOString(),
      recipient: {
        venueId: venueContext?.venueId || 'venue_direct',
        venueName: venueContext?.venueName || 'Établissement',
        city: venueContext?.city || 'Maroc',
        contactPerson: venueContext?.contactPerson || 'Direction',
        phone: cleanPhone,
        email: '',
        unrepliedReviews: venueContext?.unrepliedReviews || 0,
        annualLossMAD: venueContext?.annualLossMAD || 0
      },
      content: {
        messageText: messageBody,
        language: venueContext?.language || 'FR',
        auditPublicUrl: venueContext?.venueId ? `https://morocco-radar.agency/audit/${venueContext.venueId}` : ''
      },
      sender: {
        agencyName: 'Morocco Radar Agency',
        senderName: config.senderName,
        senderEmail: config.senderEmail,
        senderPhone: '+212632155430',
        ice: AGENCY_METADATA.ice
      }
    };

    const n8nRes = await dispatchToN8n(payload);
    if (n8nRes.success) {
      return {
        success: true,
        messageId: n8nRes.messageId,
        recipientPhone: cleanPhone,
        mode: 'N8N_WEBHOOK',
        rawResponse: n8nRes.rawResponse
      };
    }
  }

  // 2. Canal : Meta Cloud API direct
  if (isMetaWhatsAppConfigured()) {
    try {
      const endpoint = `https://graph.facebook.com/${META_API_VERSION}/${config.metaPhoneId}/messages`;

      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'text',
        text: {
          preview_url: true,
          body: messageBody,
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.metaWhatsAppToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          recipientPhone: cleanPhone,
          mode: 'META_CLOUD_API',
          error: data.error?.message || `Erreur HTTP ${response.status}`,
          rawResponse: data,
        };
      }

      const messageId = data.messages?.[0]?.id || 'wamid.success';
      return {
        success: true,
        messageId,
        recipientPhone: cleanPhone,
        mode: 'META_CLOUD_API',
        rawResponse: data,
      };
    } catch (err: any) {
      return {
        success: false,
        recipientPhone: cleanPhone,
        mode: 'META_CLOUD_API',
        error: err.message || 'Erreur réseau inconnue',
      };
    }
  }

  // 3. Mode Fallback Web Intent (wa.me)
  const fallbackUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`;
  return {
    success: true,
    recipientPhone: cleanPhone,
    mode: 'FALLBACK_WEB_INTENT',
    messageId: 'intent_' + Date.now(),
    rawResponse: { url: fallbackUrl },
  };
};
