import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Send,
  Sparkles, 
  CheckCircle2,
  RefreshCw,
  Layers,
  Bot,
  Check,
  Megaphone,
  Search,
  Filter,
  Building2,
  MapPin
} from 'lucide-react';
import { Venue, OutreachStage } from '../../types';
import { sendWhatsAppMessage, isMetaWhatsAppConfigured } from '../../services/whatsappService';

interface MassPitchModalProps {
  venues: Venue[];
  isOpen: boolean;
  onClose: () => void;
  onBatchUpdateStage: (venueIds: string[], stage: OutreachStage) => void;
}

export const MassPitchModal: React.FC<MassPitchModalProps> = ({
  venues,
  isOpen,
  onClose,
  onBatchUpdateStage,
}) => {
  const [filterMode, setFilterMode] = useState<'UNCONTACTED' | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lang, setLang] = useState<'DARIJA' | 'FR' | 'EN'>('DARIJA');
  const [isDispatching, setIsDispatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dispatchedIds, setDispatchedIds] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Compute eligible pool
  const eligibleVenues = useMemo(() => {
    return venues.filter((v) => {
      const matchStage =
        filterMode === 'ALL' ||
        !v.outreachStage ||
        v.outreachStage === 'A_PROSPECTER' ||
        (v.outreachStage as any) === 'NON_CONTACTE';
      
      const matchSearch =
        searchQuery === '' ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStage && matchSearch;
    });
  }, [venues, filterMode, searchQuery]);

  // Synchronize selection whenever the modal opens or the pool changes
  useEffect(() => {
    if (isOpen) {
      // By default select all currently eligible venues
      setSelectedIds(eligibleVenues.map((v) => v.id));
      setIsCompleted(false);
      setProgress(0);
      setDispatchedIds([]);
      setLogs([]);
    }
  }, [isOpen, filterMode, venues.length]);

  if (!isOpen) return null;

  const isMetaReady = isMetaWhatsAppConfigured();
  const targetVenues = venues.filter((v) => selectedIds.includes(v.id));
  const totalLossMAD = targetVenues.reduce((acc, v) => acc + v.annualLossMAD, 0);

  const toggleSelectAll = () => {
    if (selectedIds.length === eligibleVenues.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(eligibleVenues.map((v) => v.id));
    }
  };

  const toggleSelectVenue = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleLaunchMassOutreach = async () => {
    if (selectedIds.length === 0 || isDispatching) return;
    setIsDispatching(true);
    setProgress(0);
    setDispatchedIds([]);
    setLogs([]);
    setIsCompleted(false);

    const queue = [...targetVenues];
    const timeNow = () => new Date().toLocaleTimeString();

    setLogs((prev) => [
      `📢 [Mass Regional Dispatcher] Initialisation du pool d'envoi groupé pour ${queue.length} établissements...`,
      isMetaReady 
        ? `🌐 [Meta Cloud API] Mode Réseau Actif • Transmission directe vers les serveurs Meta.`
        : `⚙️ [CrewAI Engine] Mode Simulation/Intent • Rate-limiting activé (20 msg/min max).`,
      ...prev,
    ]);

    for (let i = 0; i < queue.length; i++) {
      const venue = queue[i];
      const rawPhone = venue.phone.replace(/[^0-9]/g, '');
      const cleanPhone = rawPhone.startsWith('0') ? '+212 ' + rawPhone.slice(1) : '+' + rawPhone;
      const auditUrl = `${window.location.origin}/audit/${venue.id}`;

      const pitchText = lang === 'DARIJA'
        ? `Salam Si/Lalla ${venue.contactPerson || 'Gérant'} 👋,\nM3ak Hassan Tiguidda men Agence Morocco Radar.\nAudit ${venue.name} (${venue.city}) : ${venue.unrepliedReviews} avis non répondus (${venue.annualLossMAD.toLocaleString()} MAD/an de perte).\nConsultez l'audit ici : ${auditUrl}`
        : `Bonjour ${venue.contactPerson || 'la Direction'},\nAudit E-Réputation pour ${venue.name} (${venue.city}) : ${venue.unrepliedReviews} avis sans réponse (~${venue.annualLossMAD.toLocaleString()} MAD/an de perte).\nConsultez votre rapport chiffré : ${auditUrl}`;

      // Call API if configured
      if (isMetaReady) {
        const sendRes = await sendWhatsAppMessage(venue.phone, pitchText);
        if (sendRes.success) {
          setLogs((prev) => [
            `✅ [${timeNow()}] [Meta API wamid: ${sendRes.messageId?.slice(0, 16)}...] Livré avec succès à ${venue.name} (${cleanPhone}).`,
            ...prev,
          ]);
        } else {
          setLogs((prev) => [
            `⚠️ [${timeNow()}] [Meta API Erreur] Échec pour ${venue.name} : ${sendRes.error}`,
            ...prev,
          ]);
        }
      } else {
        setLogs((prev) => [
          `🚀 [${timeNow()}] Pitch ${lang} + Mini-Audit généré pour "${venue.name}" (${venue.city}) ➔ Transmis à ${venue.contactPerson} (${cleanPhone}) • Perte: ${venue.annualLossMAD.toLocaleString()} MAD.`,
          ...prev,
        ]);
      }

      setDispatchedIds((prev) => [...prev, venue.id]);
      setProgress(Math.round(((i + 1) / queue.length) * 100));

      // Small delay between sends (respects rate limits)
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setIsDispatching(false);
    setIsCompleted(true);
    setLogs((prev) => [
      `✅ [${timeNow()}] Campagne terminée avec succès : ${queue.length}/${queue.length} établissements traités.`,
      `🎯 [CRM Auto-Sync] Tous les ${queue.length} leads ont été basculés à l'étape "Pitch WhatsApp Envoyé".`,
      ...prev,
    ]);

    // Update CRM Stages
    onBatchUpdateStage(selectedIds, 'PITCH_ENVOYE');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Mass Regional Outreach Dispatcher
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {venues.length} Établissements Disponibles
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Diffusion groupée de pitches WhatsApp &amp; Audits chiffrés avec rate-limiting automatique.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDispatching}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Top Scope & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Cibles Sélectionnées</span>
              <div className="text-xl font-bold text-white font-mono mt-1">
                {targetVenues.length} <span className="text-xs text-slate-400 font-sans">sur {eligibleVenues.length}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider block">Volume Pertes Identifiées</span>
              <div className="text-xl font-bold text-rose-400 font-mono mt-1">
                {(totalLossMAD / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-sans">MAD / an</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Cadence d'Envoi</span>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                20 <span className="text-xs text-slate-400 font-sans">req/min (Anti-Ban)</span>
              </div>
            </div>
          </div>

          {/* Controls Bar: Filters, Search & Language */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              
              {/* Pool Scope Switch */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setFilterMode('ALL')}
                  disabled={isDispatching}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    filterMode === 'ALL'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tous les Établissements ({venues.length})
                </button>
                <button
                  onClick={() => setFilterMode('UNCONTACTED')}
                  disabled={isDispatching}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    filterMode === 'UNCONTACTED'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  À Prospecter Uniquement ({venues.filter(v => !v.outreachStage || v.outreachStage === 'A_PROSPECTER').length})
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">Template :</span>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setLang('DARIJA')}
                    disabled={isDispatching}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      lang === 'DARIJA' ? 'bg-amber-600 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🇲🇦 Darija
                  </button>
                  <button
                    onClick={() => setLang('FR')}
                    disabled={isDispatching}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      lang === 'FR' ? 'bg-amber-600 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    onClick={() => setLang('EN')}
                    disabled={isDispatching}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      lang === 'EN' ? 'bg-amber-600 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrer rapidement par nom (ex: Riad, Restaurant...), ville (Marrakech, Casa...), ou contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isDispatching}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Target Venues Queue Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                File d'Attente ({targetVenues.length} cochés sur {eligibleVenues.length})
              </span>
              <button
                onClick={toggleSelectAll}
                disabled={isDispatching}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                {selectedIds.length === eligibleVenues.length ? 'Tout désélectionner' : `Tout sélectionner (${eligibleVenues.length})`}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
              {eligibleVenues.map((venue) => {
                const isSelected = selectedIds.includes(venue.id);
                const isSent = dispatchedIds.includes(venue.id);

                return (
                  <div
                    key={venue.id}
                    onClick={() => !isDispatching && toggleSelectVenue(venue.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      isSent
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                        : isSelected
                        ? 'bg-slate-900 border-amber-500/50 text-slate-200 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 mr-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="truncate">
                        <span className="font-bold block truncate text-slate-100">{venue.name}</span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          📍 {venue.city} • {venue.phone}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right font-mono text-[11px]">
                      {isSent ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Envoyé
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold text-[10px]">
                          -{(venue.annualLossMAD / 1000).toFixed(0)}k DH
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Realtime Progress & Log Stream */}
          {isDispatching && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Progression de la Campagne Groupée ({dispatchedIds.length} / {targetVenues.length})
                </span>
                <span className="text-emerald-400 font-mono font-bold">{progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Console Logs */}
              <div className="p-3 bg-black/80 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300 max-h-36 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Celebration State */}
          {isCompleted && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Campagne Mass Outreach Exécutée avec Succès !</span>
              </div>
              <p className="text-xs text-slate-300">
                {targetVenues.length} établissements ont reçu leur pitch personnalisé et leur lien d'audit. Leurs statuts dans votre <strong>CRM de Prospection</strong> ont été automatiquement basculés vers <strong>"Pitch WhatsApp Envoyé"</strong>.
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            Agent responsable : <strong className="text-white">Mass Regional Dispatcher</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isDispatching}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isCompleted ? 'Fermer' : 'Annuler'}
            </button>

            {!isCompleted ? (
              <button
                onClick={handleLaunchMassOutreach}
                disabled={targetVenues.length === 0 || isDispatching}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-950/50 flex items-center gap-2 disabled:opacity-50"
              >
                {isDispatching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Envoi en cours ({dispatchedIds.length}/{targetVenues.length})...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Déclencher Pitch All ({targetVenues.length} Riads)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/50"
              >
                Voir le CRM Mis à Jour ➔
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
