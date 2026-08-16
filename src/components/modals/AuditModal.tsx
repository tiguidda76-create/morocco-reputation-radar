import React from 'react';
import { 
  X, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  Printer, 
  TrendingDown, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Venue, PlatformType } from '../../types';

interface AuditModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchPitch: (venue: Venue) => void;
  onLaunchAutoReviews: (venue: Venue) => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  venue,
  isOpen,
  onClose,
  onDispatchPitch,
  onLaunchAutoReviews,
}) => {
  if (!isOpen || !venue) return null;

  const platformMeta: Record<PlatformType, { name: string; color: string; iconBg: string }> = {
    google: { name: 'Google Maps / GBP', color: '#4285F4', iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    booking: { name: 'Booking.com Extranet', color: '#003580', iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
    tripadvisor: { name: 'TripAdvisor Global', color: '#00AA6C', iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    airbnb: { name: 'Airbnb Experiences/Stays', color: '#FF5A5F', iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    yelp: { name: 'Yelp International', color: '#D32323', iconBg: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">{venue.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 rounded-full">
                  {venue.category}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  📍 {venue.city} ({venue.region})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Rapport d'Audit Approfondi 5-Plateformes & Calculateur de Fuite de Revenus E-Réputation
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Executive Summary Alert & Loss Factor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold text-xl">
                {venue.overallScore}
              </div>
              <div>
                <span className="text-xs text-slate-400">Score Global Agrégé</span>
                <p className="text-sm font-semibold text-white">
                  {venue.totalReviews.toLocaleString()} Avis vérifiés
                </p>
                <span className="text-[11px] text-amber-400 font-medium">5 plateformes analysées</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-rose-900/40 p-4 rounded-xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-display font-bold text-xl">
                {venue.unrepliedReviews}
              </div>
              <div>
                <span className="text-xs text-slate-400">Avis Sans Réponse</span>
                <p className="text-sm font-bold text-rose-400">
                  Délai moyen: {venue.avgResponseTimeHours}h
                </p>
                <span className="text-[11px] text-rose-300">Niveau de menace: {venue.threatLevel}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-900 border border-rose-800/40 p-4 rounded-xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 font-display font-bold">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-rose-300 font-medium">Fuite de CA Estimée</span>
                <p className="text-base font-extrabold text-white font-mono">
                  -{venue.annualLossMAD.toLocaleString()} <span className="text-xs text-amber-400 font-normal">MAD / an</span>
                </p>
                <span className="text-[10px] text-slate-400">Basé sur le taux d'abandon OTA</span>
              </div>
            </div>
          </div>

          {/* 5-Platform Breakdown Grid */}
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Détail d'Audit par Plateforme (Surveillance Multi-Canal)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.keys(venue.platforms) as PlatformType[]).map((key) => {
                const plat = venue.platforms[key];
                const meta = platformMeta[key];
                const isConfigured = plat.totalReviews > 0;

                return (
                  <div
                    key={key}
                    className={`p-3.5 rounded-xl border ${
                      isConfigured
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/30 border-slate-800/40 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${meta.iconBg}`}>
                        {meta.name}
                      </span>
                      {isConfigured && (
                        <span className="text-xs font-bold text-amber-400 font-mono">
                          ★ {plat.score.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {isConfigured ? (
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Volume total :</span>
                          <span className="text-slate-200 font-medium">{plat.totalReviews} avis</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Avis sans réponse :</span>
                          <span className={plat.unrepliedCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {plat.unrepliedCount} avis
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Avis 1★/2★ critiques :</span>
                          <span className={plat.negativeUnreplied > 0 ? 'text-rose-300 font-bold' : 'text-slate-400'}>
                            {plat.negativeUnreplied} non résolus
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-center text-xs text-slate-500 italic">
                        Profil non revendiqué ou non actif
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Strategic Diagnosis */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Diagnostic Stratégique IA & Plan de Sauvetage Immédiat
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              L'établissement <strong>{venue.name}</strong> subit une fuite directe de clients à cause de{' '}
              <strong className="text-rose-400">{venue.unrepliedReviews} avis sans réponse</strong>, particulièrement sur Google Maps et TripAdvisor où le temps de réponse atteint <strong>{venue.avgResponseTimeHours} heures</strong>.
              En déployant la flotte IA de <em>Morocco Radar</em>, le délai moyen chutera à <strong>&lt; 1.8 heure</strong> avec un taux de conformité QC de 99.4%, récupérant environ <strong>{venue.annualLossMAD.toLocaleString()} MAD/an</strong> de réservations directes évitant les annulations.
            </p>
          </div>

          {/* Contact Details & Responsible Person */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Contact Responsable :</span>
              <span className="text-slate-200 font-medium">{venue.contactPerson}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Téléphone / WhatsApp :</span>
              <span className="text-emerald-400 font-mono">{venue.phone}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Email Professionnel :</span>
              <span className="text-slate-300 font-mono truncate block">{venue.email}</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer / Exporter Audit PDF
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onLaunchAutoReviews(venue);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700/60 hover:bg-emerald-600/80 text-white rounded-lg text-xs font-medium transition-colors border border-emerald-600/40"
            >
              <Zap className="w-3.5 h-3.5" />
              Lancer Auto-Réponse IA
            </button>
            <button
              onClick={() => {
                onClose();
                onDispatchPitch(venue);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-lg shadow-amber-950/40"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Pitcher 1-Clic WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
