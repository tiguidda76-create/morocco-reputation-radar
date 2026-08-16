/**
 * Morocco Reputation Radar - Meta Cloud API WhatsApp Service
 * 
 * Ce service permet d'envoyer de véritables messages WhatsApp via l'API officielle Meta Graph
 * avec gestion automatique du fallback vers WhatsApp Web (wa.me) si aucune clé n'est configurée.
 */

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  recipientPhone: string;
  mode: 'META_CLOUD_API' | 'FALLBACK_WEB_INTENT';
  error?: string;
  rawResponse?: any;
}

// Configuration depuis les variables d'environnement Vite (.env)
const META_WHATSAPP_TOKEN = import.meta.env.VITE_META_WHATSAPP_TOKEN || '';
const META_PHONE_ID = import.meta.env.VITE_META_PHONE_ID || '';
const META_API_VERSION = 'v21.0';

/**
 * Vérifie si les identifiants Meta Cloud API sont présents et configurés
 */
export const isMetaWhatsAppConfigured = (): boolean => {
  return Boolean(
    META_WHATSAPP_TOKEN && 
    META_PHONE_ID && 
    META_WHATSAPP_TOKEN.trim() !== '' && 
    META_PHONE_ID.trim() !== '' &&
    META_WHATSAPP_TOKEN !== 'your_meta_access_token_here'
  );
};

/**
 * Nettoie et formate un numéro de téléphone marocain au format international E.164 (ex: 212632155430)
 */
export const formatMoroccanPhoneE164 = (rawPhone: string): string => {
  const digitsOnly = rawPhone.replace(/[^0-9]/g, '');
  
  // Format local marocain: 06XXXXXXXX ou 07XXXXXXXX ou 05XXXXXXXX
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    return '212' + digitsOnly.slice(1);
  }
  
  // Déjà au format international avec 212
  if (digitsOnly.startsWith('212')) {
    return digitsOnly;
  }
  
  return digitsOnly;
};

/**
 * Envoie un message texte libre (avec aperçu de lien d'audit) via Meta Cloud API
 */
export const sendWhatsAppMessage = async (
  toPhone: string,
  messageBody: string
): Promise<WhatsAppSendResult> => {
  const cleanPhone = formatMoroccanPhoneE164(toPhone);

  // 1. Si Meta API est configuré, on fait le véritable appel HTTP réseau
  if (isMetaWhatsAppConfigured()) {
    try {
      const endpoint = `https://graph.facebook.com/${META_API_VERSION}/${META_PHONE_ID}/messages`;

      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'text',
        text: {
          preview_url: true, // Génère automatiquement l'aperçu du lien d'audit
          body: messageBody,
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${META_WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Erreur Meta Cloud API:', data);
        return {
          success: false,
          recipientPhone: cleanPhone,
          mode: 'META_CLOUD_API',
          error: data.error?.message || `Erreur HTTP ${response.status}`,
          rawResponse: data,
        };
      }

      const messageId = data.messages?.[0]?.id || 'wamid.success';
      console.log(`✅ Message WhatsApp envoyé avec succès via Meta API (ID: ${messageId}) à +${cleanPhone}`);

      return {
        success: true,
        messageId,
        recipientPhone: cleanPhone,
        mode: 'META_CLOUD_API',
        rawResponse: data,
      };
    } catch (err: any) {
      console.error('❌ Erreur réseau lors de l\'envoi Meta API:', err);
      return {
        success: false,
        recipientPhone: cleanPhone,
        mode: 'META_CLOUD_API',
        error: err.message || 'Erreur réseau inconnue',
      };
    }
  }

  // 2. Mode Fallback (wa.me) si aucune clé Meta n'est configurée
  const fallbackUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`;
  return {
    success: true,
    recipientPhone: cleanPhone,
    mode: 'FALLBACK_WEB_INTENT',
    messageId: 'intent_' + Date.now(),
    rawResponse: { url: fallbackUrl },
  };
};

/**
 * Envoie un message basé sur un template approuvé Meta (utile hors de la fenêtre 24h)
 */
export const sendWhatsAppTemplate = async (
  toPhone: string,
  templateName: string,
  languageCode: string = 'fr',
  components: any[] = []
): Promise<WhatsAppSendResult> => {
  const cleanPhone = formatMoroccanPhoneE164(toPhone);

  if (!isMetaWhatsAppConfigured()) {
    return {
      success: false,
      recipientPhone: cleanPhone,
      mode: 'FALLBACK_WEB_INTENT',
      error: 'Les clés Meta API doivent être configurées pour utiliser les templates officiels.',
    };
  }

  try {
    const endpoint = `https://graph.facebook.com/${META_API_VERSION}/${META_PHONE_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to: cleanPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components: components.length > 0 ? components : undefined,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_WHATSAPP_TOKEN}`,
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

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
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
};
