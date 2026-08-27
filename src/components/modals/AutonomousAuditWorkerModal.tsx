import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  Send, 
  ExternalLink, 
  Download, 
  Printer, 
  ShieldCheck, 
  Layers, 
  TrendingDown, 
  AlertCircle, 
  Clock, 
  Database, 
  Mail, 
  Zap,
  Code
} from 'lucide-react';
import { Venue } from '../../types';
import { AuditJob, StructuredAuditReport } from '../../types/schemas';
import { asyncQueueService } from '../../services/asyncQueueService';
import { openOrDownloadAuditPdf } from '../../services/pdfAuditService';

interface AutonomousAuditWorkerModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
  existingJobId?: string | null;
}

export const AutonomousAuditWorkerModal: React.FC<AutonomousAuditWorkerModalProps> = ({
  venue,
  isOpen,
  onClose,
  existingJobId,
}) => {
  const [currentJob, setCurrentJob] = useState<AuditJob | null>(null);
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'JSON_SCHEMA' | 'PDF_PREVIEW' | 'DELIVERY'>('TELEMETRY');

  useEffect(() => {
    if (!isOpen || !venue) return;

    let unsubscribe: (() => void) | undefined;

    if (existingJobId) {
      // Subscribe to existing job
      unsubscribe = asyncQueueService.subscribeToJob(existingJobId, (job) => {
        setCurrentJob({ ...job });
      });
    } else {
      // Trigger new asynchronous job (Immediate 202 Accepted response)
      const res = asyncQueueService.submitAuditJob(venue, {
        autoGeneratePdf: true,
        autoUploadStorage: true,
        autoDispatchEmail: true,
        language: 'FR'
      });

      unsubscribe = asyncQueueService.subscribeToJob(res.jobId, (job) => {
        setCurrentJob({ ...job });
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen, venue, existingJobId]);

  if (!isOpen || !venue) return null;

  const isCompleted = currentJob?.status === 'COMPLETED';
  const isFailed = currentJob?.status === 'FAILED';
  const report = currentJob?.report;

  const stagesList = [
    { key: 'QUEUED', label: '1. File d\'Attente (202 Accepted)', icon: Clock },
    { key: 'SCRAPING', label: '2. Extraction Live & Fallback', icon: Database },
    { key: 'SENTIMENT_ANALYSIS', label: '3. Analyse Sémantique', icon: Sparkles },
    { key: 'RISK_SCORING', label: '4. Scoring & Chiffrage MAD', icon: TrendingDown },
    { key: 'ACTIONABLE_RECOMMENDATIONS', label: '5. Plan d\'Action SLA <2h', icon: Zap },
    { key: 'PDF_GENERATION', label: '6. Compilation PDF WeasyPrint', icon: FileText },
    { key: 'STORAGE_UPLOAD', label: '7. Object Storage & URL Signée', icon: Layers },
    { key: 'EMAIL_DISPATCH', label: '8. Envoi Email Direction', icon: Mail },
    { key: 'COMPLETED', label: '9. Pipeline Autonome Achevé', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Moteur Autonome de Production (Pipeline Asynchrone)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  {currentJob?.status || 'QUEUED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cible : <strong className="text-white">{venue.name}</strong> ({venue.city}) • Job ID : <code className="text-emerald-300 font-mono text-[11px]">{currentJob?.jobId || 'En cours...'}</code>
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

        {/* Top Progress Bar & Live Stage Indicator */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {!isCompleted && !isFailed && <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />}
              {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isFailed && <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span className="font-semibold text-slate-200">
                {isCompleted 
                  ? 'Pipeline 100% exécuté avec succès (0 intervention humaine requise).' 
                  : isFailed 
                  ? 'Erreur lors du traitement du pipeline.'
                  : `Exécution du nœud [${currentJob?.status}] en cours...`}
              </span>
            </div>
            <span className="font-mono text-emerald-400 font-bold text-sm">
              {currentJob?.progressPercent || 0}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${currentJob?.progressPercent || 5}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`px-4 py-2 font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'TELEMETRY'
                ? 'border-emerald-400 text-emerald-300 bg-slate-950/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Télémétrie &amp; Nœuds IA</span>
          </button>

          <button
            onClick={() => setActiveTab('JSON_SCHEMA')}
            className={`px-4 py-2 font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'JSON_SCHEMA'
                ? 'border-emerald-400 text-emerald-300 bg-slate-950/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Schéma Structuré JSON (Sans CoT)</span>
          </button>

          <button
            onClick={() => setActiveTab('PDF_PREVIEW')}
            className={`px-4 py-2 font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'PDF_PREVIEW'
                ? 'border-emerald-400 text-emerald-300 bg-slate-950/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Rapport PDF (WeasyPrint)</span>
          </button>

          <button
            onClick={() => setActiveTab('DELIVERY')}
            className={`px-4 py-2 font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'DELIVERY'
                ? 'border-emerald-400 text-emerald-300 bg-slate-950/60'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Livraison &amp; Pitch Direction</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* TAB 1: TELEMETRY & STAGES LOG */}
          {activeTab === 'TELEMETRY' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Left: Stage Checklist */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Workflow Séquentiel (9 Étapes)
                </span>

                <div className="space-y-1.5">
                  {stagesList.map((st, idx) => {
                    const StageIcon = st.icon;
                    const logForStage = currentJob?.logs.find(l => l.stage === st.key);
                    const isDone = Boolean(logForStage && logForStage.status === 'SUCCESS');
                    const isWarning = Boolean(logForStage && logForStage.status === 'WARNING');
                    const isCurrent = currentJob?.status === st.key;

                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                          isDone
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                            : isWarning
                            ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                            : isCurrent
                            ? 'bg-emerald-900/40 border-emerald-400 text-white font-bold animate-pulse'
                            : 'bg-slate-900/30 border-slate-800/60 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <StageIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[11px]">{st.label}</span>
                        </div>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {isWarning && <span className="text-[9px] font-bold text-amber-400">FALLBACK</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Live Telemetry Terminal */}
              <div className="lg:col-span-2 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col min-h-[350px]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Terminal de Télémétrie Asynchrone
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {currentJob?.logs.length || 0} événements enregistrés
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] text-slate-300 max-h-[360px] pr-1">
                  {currentJob?.logs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 rounded-lg border ${
                        log.status === 'ERROR' 
                          ? 'bg-rose-950/40 border-rose-800/60 text-rose-300' 
                          : log.status === 'WARNING'
                          ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
                          : 'bg-slate-900/60 border-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="text-emerald-400 font-bold">[{log.stage}] • {log.workerId}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()} {log.durationMs ? `(${log.durationMs}ms)` : ''}</span>
                      </div>
                      <p className="leading-relaxed">{log.message}</p>
                      {log.payloadSnippet && (
                        <pre className="text-[9px] bg-slate-950/90 p-1.5 rounded mt-1 overflow-x-auto text-slate-400">
                          {JSON.stringify(log.payloadSnippet, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: JSON SCHEMA VIEWER (CoT STRIPPED) */}
          {activeTab === 'JSON_SCHEMA' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                <span>✨ <strong>Schéma Pydantic / TypeScript Pur :</strong> Traces de pensées internes (CoT) éliminées. Uniquement les métriques structurées requises.</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
                    alert('Schéma JSON copié dans le presse-papier !');
                  }}
                  className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition-colors"
                >
                  Copier JSON
                </button>
              </div>

              <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[420px]">
                {report ? JSON.stringify(report, null, 2) : '// En attente de finalisation du pipeline...'}
              </pre>
            </div>
          )}

          {/* TAB 3: WEASYPRINT PDF PREVIEW & DOWNLOAD */}
          {activeTab === 'PDF_PREVIEW' && (
            <div className="space-y-4">
              {report ? (
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Rapport d'Audit E-Réputation &amp; ROI (Format WeasyPrint A4 Haute Définition)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Comprend l'indice de santé réputationnel, le chiffrage scientifique du manque à gagner en MAD, la matrice des avis et le plan de sauvetage SLA &lt; 2h.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => openOrDownloadAuditPdf(report, 'PRINT')}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimer / Exporter PDF Direct</span>
                    </button>

                    <button
                      onClick={() => openOrDownloadAuditPdf(report, 'DOWNLOAD')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-sky-400" />
                      <span>Télécharger Document HTML/PDF</span>
                    </button>
                  </div>

                  {report.storagePdfUrl && (
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-center gap-2">
                      <span>URL Archivée Cloud Storage :</span>
                      <code className="text-emerald-400 font-mono text-[10px] truncate max-w-sm">{report.storagePdfUrl}</code>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-800">
                  Génération du PDF en cours par le worker...
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DELIVERY & B2B COPIES */}
          {activeTab === 'DELIVERY' && (
            <div className="space-y-4">
              {report ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* B2B Email */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Email de Prospection B2B (Avec Lien PDF)
                      </span>
                      <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                        DIRECTION
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1">
                      <div>Objet : <strong className="text-white">{report.recommendations.b2bEmailPitchCopy.subject}</strong></div>
                    </div>

                    <textarea
                      readOnly
                      rows={9}
                      value={report.recommendations.b2bEmailPitchCopy.bodyText}
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 resize-none focus:outline-none"
                    />

                    <a
                      href={`mailto:${extractionEmailOrDefault(venue)}?subject=${encodeURIComponent(report.recommendations.b2bEmailPitchCopy.subject)}&body=${encodeURIComponent(report.recommendations.b2bEmailPitchCopy.bodyText)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer via Client Email ➔</span>
                    </a>
                  </div>

                  {/* WhatsApp Pitch */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Pitch WhatsApp 1-Clic (Darija / FR)
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                        WHATSAPP DIRECT
                      </span>
                    </div>

                    <textarea
                      readOnly
                      rows={9}
                      value={report.recommendations.whatsAppPitchCopy.darijaMessage}
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 resize-none focus:outline-none"
                    />

                    <a
                      href={report.recommendations.whatsAppPitchCopy.waDirectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ouvrir WhatsApp Web &amp; Marquer Envoyé ➔</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-800">
                  En attente de finalisation des drafts de pitch...
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Architecture Asynchrone Haute Disponibilité • Conforme Loi 09-08 (CNDP)</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

function extractionEmailOrDefault(venue: Venue): string {
  return venue.email || 'direction@etablissement.ma';
}
