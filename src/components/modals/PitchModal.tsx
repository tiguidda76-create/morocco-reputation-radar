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
  TrendingDown,
  Building,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Venue, OutreachStage } from '../../types';
import { AGENCY_METADATA } from '../../data/mockData';
import { sendWhatsAppMessage, isMetaWhatsAppConfigured } from '../../services/whatsappService';

interface PitchModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage?: (venueId: string, stage: OutreachStage) => void;
  onOpenShareableAudit?: (venue: Venue) => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({ 
  venue, 
  isOpen, 
  onClose,
  onUpdateStage,
  onOpenShareableAudit
}) => {
  const [lang, setLang] = useState<'DARIJA' | 'FR' | 'EN'>('FR');
  const [copied, setCopied] = useState(false);
  const [isSendingMeta, setIsSendingMeta] = useState(false);
  const [metaSendSuccess, setMetaSendSuccess] = useState<string | null>(null);
  const [metaSendError, setMetaSendError] = useState<string | null>(null);

  if (!isOpen || !venue) return null;

  const isMetaReady = isMetaWhatsAppConfigured();

  // Format clean phone for WhatsApp link
  const rawPhone = venue.phone.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.startsWith('0') ? '212' + rawPhone.slice(1) : rawPhone;
  const auditPublicUrl = `${window.location.origin}/audit/${venue.id}`;

  // Dynamic customized pitches with Audit Link
  const pitches = {
    DARIJA: `Salam Si/Lalla ${venue.contactPerson || 'Gérant'} 👋,

M3ak Hassan Tiguidda men Agence Morocco Radar (Spécialiste E-Réputation & IA Hôtelière à Marrakech).

Khedemna audit rapide 3la l-profil dyal "${venue.name}" f ${venue.city} :
🔴 L9ina 9rib ${venue.unrepliedReviews} avis bla jawb (khousoussan f Google Maps & Booking).
📉 Had l-retard kay-dya3 lik ta9riban ${venue.annualLossMAD.toLocaleString()} MAD f l-3am dyal les réservations directes l-competiteurs.

📊 Chof l-audit dial l-etablissement dyalk f had l-lien :
👉 ${auditPublicUrl}

Kan-werriw l-les Riads w Palaces kifach n-jawbou f a9al men 2 d-swaye3 b l-Français, Darija, Anglais w Espagnol b n-nabra dyal l-diyafa l-maghribia 🇲🇦 w l-mots clés SEO (bla ma t-3tina aucun mot de passe).

N-9der n-werik un exemple gratuit f WhatsApp ?
📞 Tél : 0632155430 | Hassan Tiguidda`,

    FR: `Bonjour ${venue.contactPerson || 'Madame, Monsieur la Direction'},

Je suis Hassan Tiguidda, fondateur de l'Agence Morocco Radar (E-Réputation IA pour l'hôtellerie marocaine).

Nous venons de réaliser un audit de réputation sur "${venue.name}" à ${venue.city} :
⚠️ ${venue.unrepliedReviews} avis récents sont actuellement sans réponse (temps moyen constaté : ${venue.avgResponseTimeHours}h).
📉 Manque à gagner estimé : ~${venue.annualLossMAD.toLocaleString()} MAD/an en réservations directes perdues au profit d'établissements concurrents.

📊 Consultez votre rapport d'audit chiffré complet ici :
👉 ${auditPublicUrl}

Notre flotte IA répond en moins de 2h sur 5 plateformes (Google, Booking, TripAdvisor, Airbnb, Yelp) avec la chaleur de l'hospitalité marocaine et un score QC > 98.4% (par simple accès gestionnaire invité, 0 mot de passe requis).

Seriez-vous disponible pour un court échange de 5 min ou pour recevoir un exemple de réponse gratuit pour votre établissement ?

Bien cordialement,
Hassan Tiguidda — Morocco Radar
Tél/WhatsApp : 0632155430 | Email : ${AGENCY_METADATA.email}`,

    EN: `Hello ${venue.contactPerson || 'General Manager'},

I am Hassan Tiguidda, director of Morocco Radar (AI Reputation & Sales Engine for Moroccan Luxury Hospitality).

We just conducted a 5-platform reputation audit for "${venue.name}" in ${venue.city}:
⚠️ ${venue.unrepliedReviews} reviews remain unreplied with an average lag of ${venue.avgResponseTimeHours} hours.
📉 Estimated revenue leakage: ~${venue.annualLossMAD.toLocaleString()} MAD/year in lost direct bookings.

📊 Access your full live reputation audit here:
👉 ${auditPublicUrl}

Our autonomous AI fleet rescues and crafts empathetic, SEO-rich responses in French, Darija, English, and Spanish in < 2 hours with >98.4% QC accuracy (simple guest delegation, zero password sharing).

May I send you a free sample response tailored to your venue via WhatsApp?

Warm regards,
Hassan Tiguidda — Morocco Radar Agency
Phone/WhatsApp: +212 632 155 430 | Email: ${AGENCY_METADATA.email}`
  };

  const currentPitch = pitches[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(currentPitch)}`;
  const mailtoUrl = `mailto:${venue.email}?subject=${encodeURIComponent(`Audit E-Réputation & Fuite de Réservations : ${venue.name}`)}&body=${encodeURIComponent(currentPitch)}`;

  const handleSendViaMetaApi = async () => {
    setIsSendingMeta(true);
    setMetaSendSuccess(null);
    setMetaSendError(null);

    const result = await sendWhatsAppMessage(venue.phone, currentPitch);
    setIsSendingMeta(false);

    if (result.success && result.mode === 'META_CLOUD_API') {
      setMetaSendSuccess(`Message WhatsApp délivré avec succès via Meta API (ID: ${result.messageId})`);
      if (onUpdateStage) {
        onUpdateStage(venue.id, 'PITCH_ENVOYE');
      }
    } else if (!result.success) {
      setMetaSendError(result.error || 'Erreur lors de l\'envoi Meta API');
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
                  Générateur de Pitch WhatsApp &amp; Meta Cloud API
                </h3>
                {isMetaReady ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Meta API Connectée
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Mode Web Intent
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
          {metaSendSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{metaSendSuccess}</span>
            </div>
          )}

          {metaSendError && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <span>⚠️ {metaSendError}</span>
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

          {/* Quick link to shareable audit */}
          {onOpenShareableAudit && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                Lien public intégré dans le pitch : <code className="text-emerald-300 font-mono text-[10px]">/audit/{venue.id}</code>
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenShareableAudit(venue);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline text-xs transition-colors"
              >
                Prévisualiser le Rapport Partageable ➔
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            Numéro : <span className="text-slate-200 font-mono">{cleanPhone}</span>
          </div>

          <div className="flex items-center gap-2">
            {venue.email ? (
              <a
                href={mailtoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  if (onUpdateStage) {
                    onUpdateStage(venue.id, 'PITCH_ENVOYE');
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-sky-950/40"
              >
                <Mail className="w-3.5 h-3.5 text-white" />
                <span>📧 Envoyer Email VIP</span>
              </a>
            ) : (
              <span className="text-[10px] text-slate-500 italic">Pas d'email renseigné</span>
            )}

            {/* Direct Meta Cloud API Send Button (If configured) */}
            {isMetaReady && (
              <button
                onClick={handleSendViaMetaApi}
                disabled={isSendingMeta}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {isSendingMeta ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi Meta API...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Envoyer via Meta API (Réseau)</span>
                  </>
                )}
              </button>
            )}

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
              <span>{isMetaReady ? 'Ouvrir WhatsApp Web' : 'Ouvrir WhatsApp & Marquer Envoyé'}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
