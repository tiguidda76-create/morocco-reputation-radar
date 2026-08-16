import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  MapPin, 
  Building, 
  Phone, 
  Mail, 
  ArrowRight,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  FileCheck,
  Zap,
  Lock,
  Layers
} from 'lucide-react';
import { Venue, PlatformType } from '../../types';
import { AGENCY_METADATA } from '../../data/mockData';

interface ShareableAuditModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchPitch?: (venue: Venue) => void;
  onGenerateInvoice?: (venue: Venue) => void;
}

export const ShareableAuditModal: React.FC<ShareableAuditModalProps> = ({
  venue,
  isOpen,
  onClose,
  onDispatchPitch,
  onGenerateInvoice
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !venue) return null;

  const rawPhone = venue.phone.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.startsWith('0') ? '212' + rawPhone.slice(1) : rawPhone;

  const auditPublicUrl = `${window.location.origin}/audit/${venue.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(auditPublicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Get worst review for demonstration
  const sampleReview = venue.recentReviews?.[0] || {
    id: 'demo-rev',
    author: 'Voyageur International',
    authorCountry: 'France 🇫🇷',
    date: 'Récemment',
    rating: 1,
    title: 'Manque de réactivité à l\'arrivée',
    comment: 'L\'établissement est très charmant mais notre demande n\'a pas été prise en compte et le service était ralenti. Dommage pour un séjour au Maroc.',
    aiDraft: {
      content: `Chère Direction & Chers Visiteurs, Nous vous remercions chaleureusement pour votre retour. L'hospitalité et la bienveillance marocaine sont au cœur de notre engagement. Nous avons immédiatement ajusté nos plannings pour que chaque hôte vive une expérience magique et personnalisée dès son arrivée. Nous serions enchantés de vous accueillir à nouveau pour vous faire découvrir toute la douceur de notre établissement. — La Direction.`,
      seoKeywords: [`séjour authentique ${venue.city}`, 'hospitalité marocaine', 'service personnalisé'],
      qcScore: 99.2
    }
  };

  const platformsList: { key: PlatformType; name: string; iconBg: string }[] = [
    { key: 'google', name: 'Google Maps / Business Profile', iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    { key: 'booking', name: 'Booking.com', iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { key: 'tripadvisor', name: 'TripAdvisor', iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { key: 'airbnb', name: 'Airbnb', iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
    { key: 'yelp', name: 'Yelp', iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Rapport d'Audit E-Réputation Partageable (Format Client)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700"
              title="Copier le lien public pour l'envoyer sur WhatsApp"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Lien copié !' : 'Copier Lien'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable & Shareable Client Audit Document */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0 print:space-y-4">
          
          {/* Header Document Branding */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest print:text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>MOROCCO RADAR • AUDIT OFFICIEL E-RÉPUTATION</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1 print:text-black">
                {venue.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2 print:text-slate-600">
                <span>📍 {venue.address || venue.city}</span>
                <span>•</span>
                <span>Catégorie : <strong>{venue.category}</strong></span>
                <span>•</span>
                <span>Contact : <strong>{venue.contactPerson}</strong></span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-bold print:border-amber-500 print:text-amber-800">
                <Sparkles className="w-3.5 h-3.5" />
                Audit de Vulnérabilité 5-Plateformes
              </div>
              <p className="text-[11px] text-slate-400 mt-1 print:text-slate-600">
                Généré par Agence Hassan Tiguidda (ICE: {AGENCY_METADATA.ice})
              </p>
            </div>
          </div>

          {/* Key Financial Impact Metric Hero Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex flex-col justify-between print:border-rose-300 print:bg-rose-50">
              <div>
                <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1.5 print:text-rose-700">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  Manque à Gagner Estimé
                </span>
                <div className="text-3xl font-black text-rose-400 font-mono mt-2 print:text-rose-700">
                  -{venue.annualLossMAD.toLocaleString()} <span className="text-sm font-sans font-bold text-slate-300 print:text-slate-700">MAD / an</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed print:text-slate-600">
                Calculé sur la base de <strong>{venue.unrepliedReviews} avis non répondus</strong> détournant les réservations directes vers vos concurrents.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between print:border-slate-300 print:bg-slate-50">
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 print:text-slate-600">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Score Global & Délai
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-white font-mono print:text-black">{venue.overallScore}</span>
                  <span className="text-sm text-slate-400 print:text-slate-600">/ 5.0 ({venue.totalReviews} avis)</span>
                </div>
              </div>
              <div className="text-xs text-slate-300 mt-3 flex items-center justify-between print:text-slate-700">
                <span>Temps de réponse moyen :</span>
                <strong className="text-amber-400 font-mono print:text-amber-700">{venue.avgResponseTimeHours}h (Standard IA : &lt;2h)</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col justify-between print:border-emerald-300 print:bg-emerald-50">
              <div>
                <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5 print:text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Protection E-Réputation IA
                </span>
                <div className="text-2xl font-bold text-white font-display mt-2 print:text-black">
                  Prise en Charge 100%
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mt-3 leading-relaxed print:text-slate-700">
                Réponses rédigées en Français, Darija, Anglais & Espagnol avec respect strict du ton et mots-clés SEO locaux.
              </p>
            </div>

          </div>

          {/* 5-Platform Breakdown Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 print:text-black">
              <Layers className="w-4 h-4 text-emerald-400" />
              État des Lieux par Plateforme
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {platformsList.map((p) => {
                const data = venue.platforms[p.key];
                if (!data || data.totalReviews === 0) return null;

                return (
                  <div
                    key={p.key}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 print:border-slate-300 print:bg-slate-50"
                  >
                    <span className="text-[11px] font-bold text-slate-300 block truncate print:text-black">
                      {p.name.split('/')[0]}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold text-white font-mono print:text-black">
                        ⭐ {data.score > 0 ? data.score : 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-400 print:text-slate-600">
                        {data.totalReviews} avis
                      </span>
                    </div>
                    <div className="text-[10px] pt-1 border-t border-slate-800/60 print:border-slate-200">
                      {data.negativeUnreplied > 0 ? (
                        <span className="text-rose-400 font-semibold print:text-rose-700">
                          ⚠️ {data.negativeUnreplied} avis 1★ en suspens
                        </span>
                      ) : (
                        <span className="text-emerald-400 print:text-emerald-700">
                          ✓ {data.unrepliedCount} sans réponse
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Demonstration: Unreplied Negative Review vs AI Crafted Rescue Response */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 print:border-slate-300 print:bg-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 print:text-amber-800">
                <Sparkles className="w-4 h-4" />
                Exemple Concret : Réponse Rédigée par l'Agence
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 print:bg-emerald-100 print:text-emerald-800">
                Score Qualité & Politesse : 99.4%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Problem: The Negative Review */}
              <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/20 space-y-2 print:bg-white print:border-rose-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-rose-400 print:text-rose-700">Avis Critique Non Répondu</span>
                  <span className="text-slate-400 print:text-slate-600">{sampleReview.author} ({sampleReview.authorCountry})</span>
                </div>
                <div className="text-amber-400 text-xs">
                  {'★'.repeat(sampleReview.rating)}{'☆'.repeat(5 - sampleReview.rating)}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed print:text-slate-700">
                  "{sampleReview.comment}"
                </p>
              </div>

              {/* Solution: AI Rescue Draft */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 print:bg-white print:border-emerald-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-400 print:text-emerald-700">Réponse Proposée (Sous &lt; 2h)</span>
                  <span className="text-slate-400 print:text-slate-600">SEO & Bienveillance</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed print:text-slate-800">
                  {sampleReview.aiDraft?.content}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sampleReview.aiDraft?.seoKeywords?.map((kw, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 print:bg-emerald-50 print:text-emerald-800">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* 3-Step Zero Password Delegation Process */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3 print:border-slate-300 print:bg-white">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 print:text-black">
              <Lock className="w-4 h-4 text-emerald-400" />
              Comment démarrer sans mot de passe (Délégation en 2 min)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <span className="text-amber-400 font-bold block mb-1">1. Aucun mot de passe</span>
                <p className="text-slate-300 text-[11px] leading-relaxed print:text-slate-700">
                  Vous restez 100% propriétaire de vos fiches. Vous nous ajoutez simplement en <strong>Gestionnaire Invité</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <span className="text-emerald-400 font-bold block mb-1">2. Prise en main IA</span>
                <p className="text-slate-300 text-[11px] leading-relaxed print:text-slate-700">
                  Nos agents traitent chaque avis sous 2 heures avec votre validation ou en auto-pilote sécurisé.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <span className="text-sky-400 font-bold block mb-1">3. Rapport WhatsApp</span>
                <p className="text-slate-300 text-[11px] leading-relaxed print:text-slate-700">
                  Vous recevez chaque fin de mois votre bilan de réservations sauvées directement sur WhatsApp.
                </p>
              </div>

            </div>
          </div>

          {/* Bottom Action Section (WhatsApp & Closing CTA) */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="text-xs text-slate-400">
              📞 Assistance WhatsApp : <strong className="text-white">+212 632 155 430</strong> (Hassan Tiguidda)
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onDispatchPitch && (
                <button
                  onClick={() => {
                    onClose();
                    onDispatchPitch(venue);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer Pitch WhatsApp</span>
                </button>
              )}

              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Bonjour ${venue.contactPerson || 'la Direction'}, voici votre audit de réputation complet pour ${venue.name} : ${auditPublicUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Ouvrir WhatsApp avec le Lien d'Audit</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
