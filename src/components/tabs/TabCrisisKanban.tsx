import React, { useState } from 'react';
import { 
  Scale, 
  AlertOctagon, 
  ShieldAlert, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { INITIAL_DEFAMATION_CASES } from '../../data/mockData';
import { DefamationCase } from '../../types';

interface TabCrisisKanbanProps {
  onOpenLegalNotice: (defCase: DefamationCase) => void;
}

export const TabCrisisKanban: React.FC<TabCrisisKanbanProps> = ({ onOpenLegalNotice }) => {
  const [cases, setCases] = useState<DefamationCase[]>(INITIAL_DEFAMATION_CASES);

  const stages: { key: DefamationCase['stage']; title: string; badgeColor: string; icon: string }[] = [
    { key: 'DETECTED', title: '1. 🚨 Détecté / Signalé', badgeColor: 'border-rose-800 text-rose-300 bg-rose-950/40', icon: '🚨' },
    { key: 'LEGAL_NOTICE_DRAFTED', title: '2. ⚖️ Mise en Demeure Rédigée', badgeColor: 'border-amber-800 text-amber-300 bg-amber-950/40', icon: '⚖️' },
    { key: 'ESCALATED_PLATFORM', title: '3. 📨 Escaladé Juridique Plateforme', badgeColor: 'border-sky-800 text-sky-300 bg-sky-950/40', icon: '📨' },
    { key: 'REMOVED_SUCCESS', title: '4. ✨ Supprimé avec Succès', badgeColor: 'border-emerald-800 text-emerald-300 bg-emerald-950/40', icon: '✨' },
  ];

  // Move stage forward or backward
  const moveStage = (id: string, direction: 'forward' | 'backward') => {
    const stageOrder: DefamationCase['stage'][] = [
      'DETECTED',
      'LEGAL_NOTICE_DRAFTED',
      'ESCALATED_PLATFORM',
      'REMOVED_SUCCESS',
    ];

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const currentIndex = stageOrder.indexOf(c.stage);
          const nextIndex =
            direction === 'forward'
              ? Math.min(currentIndex + 1, stageOrder.length - 1)
              : Math.max(currentIndex - 1, 0);
          return { ...c, stage: stageOrder[nextIndex] };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-white font-display">
              Pipeline Anti-Diffamation &amp; Gestion de Crise E-Réputation (Droit Marocain)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Traitement contentieux et précontentieux selon les <strong>Articles 447-1 &amp; 447-2 du Code Pénal Marocain</strong> et la <strong>Loi 09-08 (CNDP)</strong> pour la suppression immédiate des faux avis calomnieux.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-rose-950/80 border border-rose-700/60 rounded-xl text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            4 Dossiers Juridiques Actifs
          </span>
        </div>
      </div>

      {/* Kanban Board Grid (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageCases = cases.filter((c) => c.stage === stage.key);

          return (
            <div
              key={stage.key}
              className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col justify-between min-h-[440px] space-y-3"
            >
              <div>
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200">
                    {stage.title}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono font-bold text-slate-300 flex items-center justify-center">
                    {stageCases.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 pt-3">
                  {stageCases.map((defCase) => (
                    <div
                      key={defCase.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 space-y-2.5 transition-all shadow-md group"
                    >
                      {/* Venue & Rating */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                            {defCase.venueName}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            📍 {defCase.city} • {defCase.platform.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900">
                          ★ 1.0
                        </span>
                      </div>

                      {/* Review Snippet */}
                      <p className="text-[11px] text-slate-300 italic line-clamp-2 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                        "{defCase.reviewSnippet}"
                      </p>

                      {/* Legal Article & Damage */}
                      <div className="space-y-1 text-[10px]">
                        <span className="text-rose-400 font-mono font-semibold block truncate">
                          ⚖️ {defCase.moroccanLawArticle}
                        </span>
                        <div className="flex justify-between text-slate-400">
                          <span>Préjudice estimé :</span>
                          <span className="font-mono font-bold text-amber-400">{defCase.estimatedDamageMAD.toLocaleString()} MAD</span>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1">
                        <button
                          onClick={() => onOpenLegalNotice(defCase)}
                          className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors"
                          title="Générer l'acte juridique de mise en demeure"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Mise en Demeure</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {defCase.stage !== 'DETECTED' && (
                            <button
                              onClick={() => moveStage(defCase.id, 'backward')}
                              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors"
                              title="Reculer d'une étape"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {defCase.stage !== 'REMOVED_SUCCESS' && (
                            <button
                              onClick={() => moveStage(defCase.id, 'forward')}
                              className="p-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded transition-colors"
                              title="Avancer à l'étape suivante"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}

                  {stageCases.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-600 italic">
                      Aucun dossier à cette étape
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center font-mono pt-2 border-t border-slate-800/40">
                SLA Réquisition : &lt; 48H Ouvrées
              </div>

            </div>
          );
        })}
      </div>

      {/* Competitor Benchmarking Radar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Benchmark Concurrentiel &amp; Radar de Vélocité (Cluster Marrakech-Médina)
              </h3>
              <p className="text-xs text-slate-400">
                Comparatif direct entre les établissements sous pavillon Morocco Radar et les concurrents non accompagnés.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-full font-mono text-xs font-bold">
            Avantage Compétitif Net : +72% Taux de Réservation
          </span>
        </div>

        {/* Benchmarking Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Statut Protection</th>
                <th className="py-3 px-4 text-center">Taux Réponse %</th>
                <th className="py-3 px-4 text-center">Délai Moyen</th>
                <th className="py-3 px-4 text-center">Vélocité Nouveaux Avis</th>
                <th className="py-3 px-4 text-center">Note Moyenne</th>
                <th className="py-3 px-4 text-right">Part de Marché Sentiment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="bg-emerald-950/20 hover:bg-emerald-950/30 font-medium">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Riad Kasbah &amp; Spa (Client Radar)
                </td>
                <td className="py-3.5 px-4 text-emerald-300 font-semibold">
                  🛡️ Protégé (5 Plateformes)
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">
                  100%
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-emerald-300">
                  1.8h
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-white">
                  +48 avis / mois
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400">
                  ★ 4.8 / 5
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                  96.2% Positif
                </td>
              </tr>

              <tr className="hover:bg-slate-900/40">
                <td className="py-3.5 px-4 text-slate-300">
                  Riad Concurrent A (Médina)
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  ❌ Sans Agence
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-rose-400">
                  34%
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-rose-400">
                  96.0h
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                  +12 avis / mois
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                  ★ 4.1 / 5
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                  68.0% Positif
                </td>
              </tr>

              <tr className="hover:bg-slate-900/40">
                <td className="py-3.5 px-4 text-slate-300">
                  Riad Concurrent B (Kasbah)
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  ❌ Sans Agence
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-rose-400">
                  18%
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-rose-400">
                  144.0h
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                  +8 avis / mois
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                  ★ 3.9 / 5
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-rose-400">
                  54.5% Positif
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
