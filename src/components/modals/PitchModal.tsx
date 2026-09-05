import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageCircle, 
  Mail, 
  Sparkles, 
  PhoneCall, 
  Building, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Zap,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { Venue, OutreachStage } from '../../types';
import { AGENCY_METADATA } from '../../data/mockData';
import { sendWhatsAppMessage } from '../../services/whatsappService';
import { dispatchAuditEmail, dispatchPitchEmail } from '../../services/emailDeliveryService';
import { getActiveDeliveryStatus } from '../../services/n8nOutreachService';

interface PitchModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage?: (venueId: string, stage: OutreachStage) => void;
  onOpenShareableAudit?: (venue: Venue) => void;
  onOpenSettings?: () => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({ 
  venue, 
  isOpen, 
  onClose,
  onUpdateStage,
  onOpenShareableAudit,
  onOpenSettings
}) => {
  const [lang, setLang] = useState<'DARIJA' | 'FR' | 'EN'>('FR');
  const [copied, setCopied] = useState(false);
  const [isSendingAuto, setIsSendingAuto] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);

  if (!isOpen || !venue) return null;

  const deliveryStatus = getActiveDeliveryStatus();

  // Format clean phone for WhatsApp link
  const rawPhone = venue.phone.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.startsWith('0') ? '212' + rawPhone.slice(1) : rawPhone;

  // Dynamic customized pitches (Strictly WhatsApp & Email Direct - No public app links)
  const pitches = {
    DARIJA: `Salam Si/Lalla ${venue.contactPerson || 'Gérant'} 👋,

M3ak Hassan Tiguidda men Agence Morocco Radar (Spécialiste E-Réputation & IA Hôtelière à Marrakech).

Khedemna audit rapide 3la l-profil dyal "${venue.name}" f ${venue.city} :
🔴 L9ina 9rib ${venue.unrepliedReviews} avis bla jawb (khousoussan f Google Maps & Booking).
📉 Had l-retard kay-dya3 lik ta9riban ${venue.annualLossMAD.toLocaleString()} MAD f l-3am dyal les réservations directes l-competiteurs.

Kan-werriw l-les Riads w Palaces kifach n-jawbou f a9al men 2 d-swaye3 b l-Français, Darija, Anglais w Espagnol b n-nabra dyal l-diyafa l-maghribia 🇲🇦 w l-mots clés SEO (bla ma t-3tina aucun mot de passe).

N-9der n-sayfet lik un exemple de réponse gratuit w l-rapport complet f had l-WhatsApp ?
📞 Tél/WhatsApp : 0632155430 | Hassan Tiguidda
✉️ Email : tiguidda76@gmail.com`,

    FR: `Bonjour ${venue.contactPerson || 'Madame, Monsieur la Direction'},

Je suis Hassan Tiguidda, fondateur de l'Agence Morocco Radar (E-Réputation IA pour l'hôtellerie marocaine).

Nous venons de réaliser un audit confidentiel de réputation pour "${venue.name}" à ${venue.city} :
⚠️ ${venue.unrepliedReviews} avis récents sont actuellement sans réponse (temps moyen constaté : ${venue.avgResponseTimeHours}h).
📉 Manque à gagner estimé : ~${venue.annualLossMAD.toLocaleString()} MAD/an en réservations directes perdues au profit d'établissements concurrents.

Notre cellule spécialisée prend en charge vos avis en moins de 2h sur 5 plateformes (Google, Booking, TripAdvisor, Airbnb, Yelp) avec la chaleur de l'hospitalité marocaine et un score QC > 98.4% (par simple accès gestionnaire invité, 0 mot de passe requis).

Puis-je vous transmettre un exemple de réponse gratuit ainsi que votre synthèse d'audit directement par retour de ce message ou par email ?

Bien cordialement,
Hassan Tiguidda — Morocco Radar
Tél/WhatsApp : 0632155430 | Email : tiguidda76@gmail.com`,

    EN: `Hello ${venue.contactPerson || 'General Manager'},

I am Hassan Tiguidda, director of Morocco Radar (AI Reputation & Sales Engine for Moroccan Luxury Hospitality).

We just conducted a confidential 5-platform reputation audit for "${venue.name}" in ${venue.city}:
⚠️ ${venue.unrepliedReviews} reviews remain unreplied with an average lag of ${venue.avgResponseTimeHours} hours.
📉 Estimated revenue leakage: ~${venue.annualLossMAD.toLocaleString()} MAD/year in lost direct bookings.

Our specialized team crafts empathetic, SEO-rich responses in French, Darija, English, and Spanish in < 2 hours with >98.4% QC accuracy (simple guest delegation, zero password sharing).

May I send you a free tailored response sample and your full confidential summary directly via WhatsApp or Email?

Warm regards,
Hassan Tiguidda — Morocco Radar Agency
Phone/WhatsApp: +212 632 155 430 | Email: tiguidda76@gmail.com`
  };

  const currentPitch = pitches[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(currentPitch)}`;

  // Automatic Real Dispatch via n8n / Meta
  const handleSendAutomatic = async () => {
    setIsSendingAuto(true);
    setSendSuccessMessage(null);
    setSendErrorMessage(null);

    const result = await sendWhatsAppMessage(venue.phone, currentPitch, {
      venueId: venue.id,
      venueName: venue.name,
      city: venue.city,
      contactPerson: venue.contactPerson,
      unrepliedReviews: venue.unrepliedReviews,
      annualLossMAD: venue.annualLossMAD,
      language: lang
    });

    setIsSendingAuto(false);

    if (result.success && (result.mode === 'N8N_WEBHOOK' || result.mode === 'META_CLOUD_API')) {
      setSendSuccessMessage(`Message délivré en temps réel via ${result.mode === 'N8N_WEBHOOK' ? 'n8n Automation' : 'Meta Cloud API'} (ID: ${result.messageId})`);
      if (onUpdateStage) {
        onUpdateStage(venue.id, 'PITCH_ENVOYE');
      }
    } else if (!result.success) {
      setSendErrorMessage(result.error || 'Erreur lors de l\'envoi réseau');
    }
  };

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendEmailPitch = async () => {
    if (!venue) return;
    setIsSendingEmail(true);
    setSendErrorMessage(null);
    setSendSuccessMessage(null);
    try {
      const emailRes = await dispatchPitchEmail(venue, lang);
      if (emailRes.success) {
        setSendSuccessMessage(`Email envoyé avec succès à ${emailRes.recipient} via Gmail SMTP Pro`);
        if (onUpdateStage) {
          onUpdateStage(venue.id, 'PITCH_ENVOYE');
        }
      } else {
        setSendErrorMessage(emailRes.error || 'Échec de transmission de l\'email');
      }
    } catch (e: any) {
      setSendErrorMessage(e.message || 'Erreur réseau');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Générateur de Pitch &amp; Outreach Réel
                </h3>
                {deliveryStatus.isRealDeliveryAvailable ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {deliveryStatus.hasN8n ? 'n8n Connecté' : 'Gmail SMTP & WhatsApp Actifs'}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/80 flex items-center gap-1">
                    Mode Direct (Gmail SMTP)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cible : <strong className="text-white">{venue.name}</strong> ({venue.city}) — Contact : {venue.contactPerson}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Target Venue Recap Pill */}
          <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">{venue.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-rose-400 font-semibold">{venue.unrepliedReviews} avis non répondus</span>
              <span className="text-amber-400 font-mono font-bold">-{venue.annualLossMAD.toLocaleString()} MAD/an</span>
            </div>
          </div>

          {/* Success / Error Alerts */}
          {sendSuccessMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{sendSuccessMessage}</span>
            </div>
          )}

          {sendErrorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <span>⚠️ {sendErrorMessage}</span>
            </div>
          )}

          {/* Integration Status Helper Note */}
          {!deliveryStatus.isRealDeliveryAvailable && onOpenSettings && (
            <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between gap-2">
              <span>⚡ Vous n'avez pas encore relié votre webhook n8n ou vos clés API.</span>
              <button
                type="button"
                onClick={onOpenSettings}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg font-semibold flex items-center gap-1 shrink-0"
              >
                <Sliders className="w-3 h-3" />
                <span>Configurer n8n</span>
              </button>
            </div>
          )}

          {/* Language Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sélectionnez la langue du pitch :
            </span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setLang('DARIJA')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  lang === 'DARIJA' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇲🇦 Darija Marocaine
              </button>
              <button
                onClick={() => setLang('FR')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  lang === 'FR' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇫🇷 Français
              </button>
              <button
                onClick={() => setLang('EN')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  lang === 'EN' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Pitch Text Area */}
          <div className="relative">
            <textarea
              readOnly
              value={currentPitch}
              rows={11}
              className="w-full p-4 text-xs font-mono text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500/50 resize-none leading-relaxed"
            />
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>

          {/* Confidentiality Notice */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="text-emerald-400">🔒</span>
              <strong className="text-slate-200">Confidentialité Agence :</strong> Aucun lien vers votre application n'est transmis. Échanges 100% directs par WhatsApp ou Email.
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            Numéro : <span className="text-slate-200 font-mono">+{cleanPhone}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Automatic Network Dispatch Button (If n8n or Meta is configured) */}
            {deliveryStatus.isRealDeliveryAvailable && (
              <button
                onClick={handleSendAutomatic}
                disabled={isSendingAuto}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {isSendingAuto ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi Réseau en cours...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Envoyer via {deliveryStatus.hasN8n ? 'n8n Webhook' : 'Meta API'}</span>
                  </>
                )}
              </button>
            )}

            {/* Direct 1-Click Email Dispatch (Gmail SMTP) */}
            <button
              onClick={handleSendEmailPitch}
              disabled={isSendingEmail}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50"
              title={`Envoyer le pitch directement par email à ${venue.email || 'la direction'}`}
            >
              {isSendingEmail ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Envoi Email...</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Envoyer Email Direct (Gmail SMTP)</span>
                </>
              )}
            </button>

            {/* Fallback Web Intent WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                if (onUpdateStage) {
                  onUpdateStage(venue.id, 'PITCH_ENVOYE');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-950/50"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ouvrir WhatsApp Web Direct</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
