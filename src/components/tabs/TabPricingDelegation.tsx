import React, { useState } from 'react';
import { 
  Building2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  ArrowRight,
  Calculator,
  Lock,
  Mail
} from 'lucide-react';
import { PRICING_PLANS, AGENCY_METADATA } from '../../data/mockData';
import { PricingPlan } from '../../types';

interface TabPricingDelegationProps {
  onSelectPlanForInvoice: (plan: PricingPlan) => void;
}

export const TabPricingDelegation: React.FC<TabPricingDelegationProps> = ({
  onSelectPlanForInvoice,
}) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // ROI Calculator state
  const [monthlyReviews, setMonthlyReviews] = useState<number>(65);
  const [avgBookingMAD, setAvgBookingMAD] = useState<number>(2200);

  // ROI calculation formulas
  const estimatedUnrepliedRisk = Math.round(monthlyReviews * 0.18); // 18% at risk
  const savedBookingsYear = Math.round(estimatedUnrepliedRisk * 0.65 * 12); // 65% conversion rescue
  const savedRevenueYearMAD = savedBookingsYear * avgBookingMAD;
  const proCostYearMAD = 2000 * 12;
  const roiMultiplier = (savedRevenueYearMAD / proCostYearMAD).toFixed(1);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(AGENCY_METADATA.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-10">
      
      {/* Section 1: Pricing Matrix Header & Billing Toggle */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-700/60 rounded-full text-xs font-semibold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          Offres d'Abonnement Sans Engagement • Facturation Officielle Maroc (Exonéré TVA)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Tarification Calibrée pour le Secteur Hôtelier Marocain
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Du snack de quartier au Palace de la Palmeraie, choisissez la formule adaptée pour protéger votre réputation, sauver vos réservations et dominer les classements OTA.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className={`text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
            Facturation Mensuelle
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isAnnual ? 'bg-emerald-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1 ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
            Facturation Annuelle
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-bold font-mono">
              -20% ÉCONOMIE
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING_PLANS.map((plan) => {
          const price = isAnnual ? plan.priceMADAnnual : plan.priceMADMonthly;
          const isPop = plan.isPopular;

          return (
            <div
              key={plan.id}
              className={`glass-panel rounded-3xl p-6 relative flex flex-col justify-between transition-all duration-200 ${
                isPop
                  ? 'border-2 border-emerald-500 shadow-2xl shadow-emerald-950/60 ring-1 ring-emerald-500/50 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30 md:-translate-y-2'
                  : 'border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-600 to-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-display">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-snug">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="my-5 p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-mono">
                      {price.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">MAD / mois</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    (~{plan.priceEUR} € / mois) • {isAnnual ? 'Facturé annuellement' : 'Sans engagement'}
                  </span>
                </div>

                {/* Target & SLA summary */}
                <div className="space-y-2 text-xs py-2 border-y border-slate-800/80 mb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>SLA Réponse :</span>
                    <span className="font-bold text-emerald-300">{plan.responseTimeSLA}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Canaux :</span>
                    <span className="text-slate-200 font-medium">{plan.platformsIncluded}</span>
                  </div>
                </div>

                {/* Feature List */}
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectPlanForInvoice(plan)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    isPop
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-950/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>Générer Devis Pro Forma (0 DH d'avance)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Section 2: Interactive ROI Profit Calculator */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Calculateur de Rentabilité &amp; ROI Immédiat
              </h3>
              <p className="text-xs text-slate-400">
                Estimez le chiffre d'affaires annuel préservé grâce au sauvetage des avis négatifs.
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-full font-mono text-xs font-bold">
            ROI Estimé : ~{roiMultiplier}x Investissement
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Slider 1: Monthly Reviews */}
          <div className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Volume d'avis reçus par mois :</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{monthlyReviews} avis / mois</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={monthlyReviews}
              onChange={(e) => setMonthlyReviews(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 (Petit Riad)</span>
              <span>250 (Boutique Hôtel)</span>
              <span>500 (Palace 5★)</span>
            </div>
          </div>

          {/* Slider 2: Average Booking / Night Value */}
          <div className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Prix moyen de réservation / nuitée :</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{avgBookingMAD.toLocaleString()} MAD</span>
            </div>
            <input
              type="range"
              min="300"
              max="15000"
              step="100"
              value={avgBookingMAD}
              onChange={(e) => setAvgBookingMAD(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>300 DH (Snack/Café)</span>
              <span>2,500 DH (Riad Charme)</span>
              <span>15,000 DH (Palace Suite)</span>
            </div>
          </div>
        </div>

        {/* Dynamic ROI Metrics Output */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-center">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Réservations Sauvées / An</span>
            <span className="text-2xl font-extrabold text-white font-mono mt-1 block">
              {savedBookingsYear} séjours
            </span>
            <span className="text-[10px] text-emerald-400">Évite le décrochage OTA</span>
          </div>

          <div className="p-4 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 rounded-2xl border border-emerald-800/60">
            <span className="text-xs text-emerald-300 block font-medium">Chiffre d'Affaires Préservé</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 block">
              +{savedRevenueYearMAD.toLocaleString()} MAD
            </span>
            <span className="text-[10px] text-slate-400">Gain net direct pour l'établissement</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Coût Abonnement Pro</span>
            <span className="text-2xl font-extrabold text-slate-200 font-mono mt-1 block">
              {proCostYearMAD.toLocaleString()} MAD
            </span>
            <span className="text-[10px] text-amber-400">Remboursé dès la 1ère semaine</span>
          </div>
        </div>
      </div>

      {/* Section 3: Zero-Password Manager Delegation Guide (1-2-3 Walkthrough) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Guide de Délégation Sécurisée Sans Partage de Mot de Passe (Zero-Password)
              </h3>
              <p className="text-xs text-slate-400">
                Vos clients gardent 100% de la propriété de leurs comptes. Ils nous invitent simplement comme Gestionnaire de Réponses.
              </p>
            </div>
          </div>

          {/* Copyable Delegation Email Pill */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-emerald-700/60">
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-300 font-bold">{AGENCY_METADATA.email}</span>
            <button
              onClick={handleCopyEmail}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors"
              title="Copier l'email de délégation"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 3 Step Interactive Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Step 1: Google Business Profile */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono">ÉTAPE 1</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded">
                Google Maps
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Google Business Profile</h4>
            <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Ouvrez votre profil Google Maps</li>
              <li>Cliquez sur <em>Paramètres de la fiche</em> ➔ <em>Gestionnaires</em></li>
              <li>Cliquez sur <em>Ajouter</em> et collez : <code className="text-emerald-300 font-mono text-[11px] bg-slate-900 px-1 rounded">{AGENCY_METADATA.email}</code></li>
              <li>Rôle : <strong>Gestionnaire des communications</strong></li>
            </ol>
          </div>

          {/* Step 2: Booking.com Partner Hub */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono">ÉTAPE 2</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded">
                Booking.com
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Booking Extranet</h4>
            <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Connectez-vous à l'Extranet Booking</li>
              <li>Allez dans <em>Compte</em> ➔ <em>Créer et gérer les utilisateurs</em></li>
              <li>Invitez : <code className="text-emerald-300 font-mono text-[11px] bg-slate-900 px-1 rounded">{AGENCY_METADATA.email}</code></li>
              <li>Autorisations : <strong>Avis clients &amp; Messagerie uniquement</strong></li>
            </ol>
          </div>

          {/* Step 3: TripAdvisor Management Center */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono">ÉTAPE 3</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                TripAdvisor
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">TripAdvisor Espace Propriétaire</h4>
            <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Accédez à l'Espace Gestion TripAdvisor</li>
              <li>Section <em>Avis</em> ➔ <em>Répondre aux avis</em></li>
              <li>Déléguez l'accès mandataire agence : <code className="text-emerald-300 font-mono text-[11px] bg-slate-900 px-1 rounded">{AGENCY_METADATA.email}</code></li>
              <li>Activation instantanée sous 1 heure</li>
            </ol>
          </div>

        </div>

      </div>

    </div>
  );
};
