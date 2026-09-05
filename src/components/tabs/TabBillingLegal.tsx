import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Building, 
  Check, 
  Copy, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  Sparkles, 
  Plus, 
  Trash2,
  Send
} from 'lucide-react';
import { AGENCY_METADATA, PRICING_PLANS } from '../../data/mockData';
import { Venue, PricingPlan, InvoiceData } from '../../types';

interface TabBillingLegalProps {
  venues: Venue[];
  onOpenCertificate: (venue: Venue) => void;
  initialPlan?: PricingPlan | null;
}

export const TabBillingLegal: React.FC<TabBillingLegalProps> = ({
  venues,
  onOpenCertificate,
  initialPlan,
}) => {
  const [docType, setDocType] = useState<'PRO_FORMA' | 'INVOICE'>('PRO_FORMA');
  const [selectedVenueId, setSelectedVenueId] = useState<string>(venues[0]?.id || 'custom');
  
  // Custom client form state initialized with real establishment
  const [customClient, setCustomClient] = useState(() => {
    const v = venues[0];
    if (v) {
      return {
        name: v.name,
        ice: '003189452000091',
        address: v.address,
        city: v.city,
        email: v.email,
        phone: v.phone,
      };
    }
    return {
      name: 'La Mamounia Palace Marrakech',
      ice: '002891823000084',
      address: 'Avenue Bab Jdid, Marrakech',
      city: 'Marrakech',
      email: 'direction@mamounia.com',
      phone: '0661284920',
    };
  });

  const [selectedPlanId, setSelectedPlanId] = useState<'starter' | 'professional' | 'vip'>(
    initialPlan?.id || 'professional'
  );
  const [billingPeriod, setBillingPeriod] = useState<'Monthly' | 'Annual'>('Monthly');

  // Add-ons
  const [addons, setAddons] = useState<{ id: string; name: string; priceMAD: number; checked: boolean }[]>([
    { id: 'add-1', name: 'Audit Flash 5-Plateformes & Extraction Concurrentielle', priceMAD: 500, checked: true },
    { id: 'add-2', name: 'Pack Protection Juridique & Retrait Avis Diffamatoire (Art. 447)', priceMAD: 1200, checked: false },
    { id: 'add-3', name: 'Délégation Zero-Password & Configuration API Webhooks', priceMAD: 0, checked: true },
  ]);

  const [copiedRIB, setCopiedRIB] = useState(false);

  // Active Plan
  const plan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[1];
  const basePriceMAD = billingPeriod === 'Annual' ? plan.priceMADAnnual * 12 : plan.priceMADMonthly;
  const activeAddonsTotal = addons.filter((a) => a.checked).reduce((acc, curr) => acc + curr.priceMAD, 0);
  const subtotalMAD = basePriceMAD + activeAddonsTotal;
  const discountMAD = billingPeriod === 'Annual' ? (plan.priceMADMonthly * 12 - plan.priceMADAnnual * 12) : 0;
  const totalMAD = subtotalMAD;
  const totalEUR = Math.round(totalMAD / 10.85);

  const invoiceNumber = `${docType === 'PRO_FORMA' ? 'PF' : 'FAC'}-2026-0884`;
  const dateNow = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleVenueChange = (venueId: string) => {
    setSelectedVenueId(venueId);
    if (venueId !== 'custom') {
      const v = venues.find((item) => item.id === venueId);
      if (v) {
        setCustomClient({
          name: v.name,
          ice: '003189452000091',
          address: v.address,
          city: v.city,
          email: v.email,
          phone: v.phone,
        });
      }
    }
  };

  const handleCopyRIB = () => {
    navigator.clipboard.writeText(AGENCY_METADATA.rib);
    setCopiedRIB(true);
    setTimeout(() => setCopiedRIB(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Legal Entity Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <Building className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-display">
                  {AGENCY_METADATA.entity}
                </h2>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono font-bold rounded">
                  REGISTRE AE MAROC
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {AGENCY_METADATA.brandName} • E-Réputation &amp; Solutions Numériques Hôtellerie
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`https://wa.me/${customClient.phone.replace(/[^0-9]/g, '').startsWith('0') ? '212' + customClient.phone.replace(/[^0-9]/g, '').slice(1) : customClient.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Salam / Bonjour ${customClient.name},\n\nVoici votre Devis Pro Forma officiel pour la gestion de votre E-Réputation & Flotte IA par ${AGENCY_METADATA.brandName} :\n\n📄 N° : ${invoiceNumber}\n💰 Formule : ${plan.name} (${billingPeriod === 'Annual' ? '12 Mois' : '1 Mois'})\n💵 Montant Total : ${totalMAD.toLocaleString()} MAD (${AGENCY_METADATA.taxExemptionClause})\n\n🏦 Coordonnées Bancaires (Virement) :\n- Banque : ${AGENCY_METADATA.bankName} (${AGENCY_METADATA.bankBranch})\n- RIB : ${AGENCY_METADATA.rib}\n- ICE Agence : ${AGENCY_METADATA.ice}\n- Compte Délégué GBP/Booking : ${AGENCY_METADATA.email}\n\nRestant à votre entière disposition,\nHassan Tiguidda (Tél : ${AGENCY_METADATA.phone})`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-colors"
            >
              <Send className="w-4 h-4" />
              Envoyer par WhatsApp
            </a>

            <a
              href={`mailto:${customClient.email}?subject=${encodeURIComponent(`Devis Pro Forma ${invoiceNumber} - ${customClient.name} - Morocco Radar`)}&body=${encodeURIComponent(
                `Bonjour ${customClient.name},\n\nVeuillez trouver ci-dessous les détails de votre Devis Pro Forma pour la formule ${plan.name} :\n\n- Prestation : ${plan.name} (${plan.tagline})\n- Montant Total : ${totalMAD.toLocaleString()} MAD Net (${AGENCY_METADATA.taxExemptionClause})\n- RIB BMCE : ${AGENCY_METADATA.rib}\n- ICE : ${AGENCY_METADATA.ice}\n\nPour activer la gestion déléguée sans partage de mot de passe, vous pouvez ajouter l'adresse ${AGENCY_METADATA.email} en tant que gestionnaire sur votre compte Google Business Profile et Booking.com.\n\nBien cordialement,\nHassan Tiguidda — Morocco Radar\nTél : ${AGENCY_METADATA.phone}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700 text-xs font-medium rounded-xl transition-colors"
            >
              <Send className="w-4 h-4 text-sky-400" />
              Envoyer par Email
            </a>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Imprimer PDF
            </button>
          </div>
        </div>

        {/* Enterprise Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Identifiant Fiscal (ICE)</span>
            <span className="text-white font-mono font-bold mt-0.5 block">{AGENCY_METADATA.ice}</span>
            <span className="text-[10px] text-slate-400">Registre National</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Siège &amp; Adresse</span>
            <span className="text-slate-200 font-medium mt-0.5 block line-clamp-1">{AGENCY_METADATA.address}</span>
            <span className="text-[10px] text-emerald-400">{AGENCY_METADATA.city}, Maroc</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Contact &amp; WhatsApp</span>
            <span className="text-emerald-400 font-mono font-bold mt-0.5 block">{AGENCY_METADATA.phone}</span>
            <span className="text-[10px] text-slate-400 truncate block">{AGENCY_METADATA.email}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Banque &amp; RIB Maroc</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-amber-400 font-mono font-bold text-[11px] truncate">{AGENCY_METADATA.rib}</span>
              <button onClick={handleCopyRIB} className="text-slate-400 hover:text-white ml-1">
                {copiedRIB ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400">{AGENCY_METADATA.bankName} • SWIFT: {AGENCY_METADATA.swift}</span>
          </div>
        </div>

        {/* Legal Tax Exemption clause */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-amber-300 font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Clause Fiscale Légale : « {AGENCY_METADATA.taxExemptionClause} »</span>
        </div>
      </div>

      {/* Interactive Generator Controls & Live Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4 no-print">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Paramètres du Document
            </h3>

            {/* Document type switch */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setDocType('PRO_FORMA')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  docType === 'PRO_FORMA' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Devis Pro Forma
              </button>
              <button
                onClick={() => setDocType('INVOICE')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  docType === 'INVOICE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Facture Définitive
              </button>
            </div>

            {/* Client selector */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400 font-medium">Sélectionner Établissement Client :</label>
              <select
                value={selectedVenueId}
                onChange={(e) => handleVenueChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900">
                    {v.name} ({v.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Formula Plan Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400 font-medium">Formule d'Abonnement :</label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="starter" className="bg-slate-900">Starter Tier (700 MAD/mois)</option>
                <option value="professional" className="bg-slate-900">Professional Tier (2,000 MAD/mois)</option>
                <option value="vip" className="bg-slate-900">Enterprise VIP Tier (4,000 MAD/mois)</option>
              </select>
            </div>

            {/* Billing period */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400 font-medium">Périodicité :</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setBillingPeriod('Monthly')}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    billingPeriod === 'Monthly'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setBillingPeriod('Annual')}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    billingPeriod === 'Annual'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Annuel (-20%)
                </button>
              </div>
            </div>

            {/* Addons selection */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-slate-400 font-medium text-xs block">Modules &amp; Options Supplémentaires :</label>
              {addons.map((add) => (
                <label
                  key={add.id}
                  className="flex items-start gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs cursor-pointer hover:border-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={add.checked}
                    onChange={(e) =>
                      setAddons((prev) =>
                        prev.map((item) => (item.id === add.id ? { ...item, checked: e.target.checked } : item))
                      )
                    }
                    className="mt-0.5 accent-emerald-500 rounded"
                  />
                  <div className="flex-1">
                    <span className="text-slate-200 block text-[11px] leading-tight">{add.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {add.priceMAD > 0 ? `+${add.priceMAD.toLocaleString()} MAD` : 'Inclus Gratuitement'}
                    </span>
                  </div>
                </label>
              ))}
            </div>

          </div>
        </div>

        {/* Right Column: Live Printable Invoice Canvas (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl print-container text-slate-200 space-y-6">
            
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-[11px] font-extrabold text-amber-400 font-mono uppercase tracking-widest block">
                  ROYAUME DU MAROC
                </span>
                <h1 className="text-2xl font-black text-white font-display tracking-tight">
                  {AGENCY_METADATA.entity}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Agence E-Réputation &amp; Solutions Numériques Hôtelières
                </p>
                <div className="text-[11px] text-slate-400 space-y-0.5 mt-2 font-mono">
                  <p>ICE : <strong className="text-emerald-400">{AGENCY_METADATA.ice}</strong></p>
                  <p>{AGENCY_METADATA.address}</p>
                  <p>Tél : {AGENCY_METADATA.phone} | Email : {AGENCY_METADATA.email}</p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                  {docType === 'PRO_FORMA' ? 'DEVIS PRO FORMA' : 'FACTURE ACQUITTÉE'}
                </span>
                <p className="text-base font-extrabold text-white font-mono mt-1">
                  N° {invoiceNumber}
                </p>
                <p className="text-xs text-slate-400">Date d'émission : <span className="text-slate-200">{dateNow}</span></p>
                <p className="text-xs text-slate-400">Date d'échéance : <span className="text-slate-200">{dueDate}</span></p>
              </div>
            </div>

            {/* Client Details Box */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">FACTURÉ À :</span>
                <h3 className="text-sm font-bold text-white mt-1">{customClient.name}</h3>
                <p className="text-slate-300">{customClient.address}</p>
                <p className="text-slate-300">{customClient.city}, Maroc</p>
              </div>
              <div className="sm:text-right space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">COORDONNÉES CLIENT :</span>
                <p className="text-slate-300">ICE : <span className="font-mono text-slate-200">{customClient.ice}</span></p>
                <p className="text-slate-300 font-mono">{customClient.phone}</p>
                <p className="text-slate-300 font-mono">{customClient.email}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Description des Prestations</th>
                    <th className="py-2.5 px-3 text-center">Période</th>
                    <th className="py-2.5 px-3 text-center">Qté</th>
                    <th className="py-2.5 px-3 text-right">Montant (MAD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-3">
                      <strong className="text-white block">{plan.name}</strong>
                      <span className="text-[10px] text-slate-400 block">{plan.tagline}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400">
                      {billingPeriod === 'Annual' ? '12 Mois' : '1 Mois'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">1</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {basePriceMAD.toLocaleString()} DH
                    </td>
                  </tr>

                  {addons.filter((a) => a.checked).map((add) => (
                    <tr key={add.id}>
                      <td className="py-2.5 px-3 text-[11px]">
                        <span className="text-slate-200">{add.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-400">Inclus</td>
                      <td className="py-2.5 px-3 text-center font-mono">1</td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-400">
                        {add.priceMAD > 0 ? `${add.priceMAD.toLocaleString()} DH` : '0.00 DH'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Banking Details */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              
              {/* Banking coordinates */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  COORDONNÉES BANCAIRES POUR RÈGLEMENT
                </span>
                <p className="text-slate-300 font-medium">Banque : <strong className="text-white">{AGENCY_METADATA.bankName}</strong></p>
                <p className="text-slate-300 font-mono">RIB : <strong className="text-emerald-400 select-all">{AGENCY_METADATA.rib}</strong></p>
                <p className="text-slate-300 font-mono">Code SWIFT / BIC : <strong className="text-slate-200">{AGENCY_METADATA.swift}</strong></p>
                <p className="text-[10px] text-slate-500 italic mt-1">
                  Virement bancaire ou chèque à l'ordre de « {AGENCY_METADATA.entity} »
                </p>
              </div>

              {/* Totals calculation */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Sous-total Hors Taxe :</span>
                  <span className="font-mono text-slate-200">{subtotalMAD.toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taux TVA :</span>
                  <span className="font-mono text-emerald-400">0.00% (Exonéré)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Montant TVA :</span>
                  <span className="font-mono text-slate-200">0.00 MAD</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
                  <span>NET À PAYER :</span>
                  <span className="font-mono text-emerald-400 text-base">{totalMAD.toLocaleString()} MAD</span>
                </div>
                <span className="text-[10px] text-slate-500 block text-right font-mono">
                  Soit environ {totalEUR.toLocaleString()} EUR
                </span>
              </div>
            </div>

            {/* Legal mention footer */}
            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 text-center font-mono leading-relaxed">
              <p>« {AGENCY_METADATA.taxExemptionClause} »</p>
              <p className="text-slate-500 mt-0.5">
                {AGENCY_METADATA.entity} • ICE : {AGENCY_METADATA.ice} • {AGENCY_METADATA.address}
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
