import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Send, 
  CheckCircle2, 
  Eye, 
  MousePointerClick, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  Clock, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  Sparkles,
  Trash2
} from 'lucide-react';
import { getOutreachAuditLog } from '../services/emailDeliveryService';

interface TelemetryStats {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

export const LiveOutreachTelemetry: React.FC = () => {
  const [stats, setStats] = useState<TelemetryStats>({
    totalSent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    deliveryRate: 100,
    openRate: 0,
    clickRate: 0
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTelemetry = async () => {
    setIsLoading(true);
    try {
      // 1. Try local outreach server
      const res = await fetch('http://localhost:5678/api/telemetry/stats', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        calculateFromLocalLogs();
      }

      const logRes = await fetch('http://localhost:5678/logs', { cache: 'no-store' });
      if (logRes.ok) {
        const logData = await logRes.json();
        if (Array.isArray(logData)) {
          const cleaned = logData.filter((l: any) => 
            l.status !== 'SIMULATED_DRAFT' &&
            l.delivery?.provider !== 'SIMULATION' &&
            !l.delivery?.isTestRoute &&
            !l.isTestRoute &&
            !l.recipient?.venueName?.includes('Test') &&
            l.recipient?.city !== 'Paris' &&
            l.recipient?.city !== 'Nice / Cannes' &&
            l.recipient?.city !== 'Courchevel / Megeve'
          );
          setLogs(cleaned);
        }
      } else {
        calculateFromLocalLogs();
      }
    } catch (e) {
      calculateFromLocalLogs();
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFromLocalLogs = () => {
    const local = getOutreachAuditLog();
    const realLogs = local.filter((l: any) => 
      l.status !== 'SIMULATED_DRAFT' &&
      l.delivery?.provider !== 'SIMULATION' &&
      !l.delivery?.isTestRoute &&
      !l.isTestRoute &&
      !l.recipient?.venueName?.includes('Test') &&
      l.recipient?.city !== 'Paris' &&
      l.recipient?.city !== 'Nice / Cannes' &&
      l.recipient?.city !== 'Courchevel / Megeve'
    );
    setLogs(realLogs);
    const total = realLogs.length;
    const delivered = realLogs.filter((l: any) => l.status === 'DELIVERED_REAL' || l.delivery?.status === 'SENT').length;
    const opened = realLogs.filter((l: any) => l.tracking?.opened).length;
    const clicked = realLogs.filter((l: any) => l.tracking?.clicked || l.eventType === 'WHATSAPP_PITCH').length;
    const bounced = realLogs.filter((l: any) => l.status === 'FAILED' || l.status === 'BOUNCED' || l.delivery?.status === 'FAILED').length;

    setStats({
      totalSent: total,
      delivered,
      opened,
      clicked,
      bounced,
      deliveryRate: total > 0 ? Number(((delivered / total) * 100).toFixed(1)) : 100,
      openRate: delivered > 0 ? Number(((opened / delivered) * 100).toFixed(1)) : 0,
      clickRate: total > 0 ? Number(((clicked / total) * 100).toFixed(1)) : 0
    });
  };

  const handleClearLogs = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Voulez-vous purger l\'historique des envois (effacer les anciens logs de test et de rebonds) ?')) {
      localStorage.removeItem('mrr_outreach_audit_logs_v1');
      calculateFromLocalLogs();
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#12121a] border border-[#2a2a3c] rounded-xl overflow-hidden shadow-2xl transition-all">
      {/* Top Banner Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-[#181824] to-[#12121a] flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-[#1a1a28] transition-colors border-b border-[#2a2a3c]"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                TRAÇABILITÉ & TÉLÉMÉTRIE D'ENVOI EN DIRECT
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Gmail SMTP Pro &amp; WhatsApp Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Traçabilité réelle des emails et WhatsApp envoyés (Statuts, Ouvertures, Rejets, Clics).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              title="Purger l'historique des envois"
              className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Purger</span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchTelemetry();
            }}
            className="p-2 rounded-lg bg-[#222233] hover:bg-[#2c2c42] text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
          <div className="text-slate-400">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#2a2a3c]">
        <div className="bg-[#151520] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pitches Déclenchés</span>
            <Send className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{stats.totalSent}</div>
          <div className="text-[10px] text-slate-500 mt-1">Audit légal & pitch direct</div>
        </div>

        <div className="bg-[#151520] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Délivrabilité Réelle</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 tracking-tight">
            {stats.totalSent === 0 ? '—' : `${stats.deliveryRate}%`}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1">
            {stats.totalSent === 0 ? 'Aucun envoi effectué' : `${stats.delivered} délivrés avec succès`}
          </div>
        </div>

        <div className="bg-[#151520] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Taux d'Ouverture</span>
            <Eye className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 tracking-tight">{stats.openRate}%</div>
          <div className="text-[10px] text-amber-500/80 mt-1">{stats.opened} ouvertures détectées</div>
        </div>

        <div className="bg-[#151520] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Clics & Intéractions</span>
            <MousePointerClick className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-xl font-bold text-teal-400 tracking-tight">{stats.clicked}</div>
          <div className="text-[10px] text-teal-500/80 mt-1">Échanges WhatsApp / Email initiés</div>
        </div>
      </div>

      {/* Expanded Console & Stepper */}
      {isOpen && (
        <div className="p-5 space-y-5 bg-[#0f0f17]">
          {/* Pipeline Stepper Visualizer */}
          <div className="p-4 rounded-lg bg-[#151522] border border-[#262638]">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Cycle de Vie d'un Prospect (Pipeline d'Exécution Réel)
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded bg-[#1c1c2e] text-slate-300 border border-[#2e2e46]">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px]">1</span>
                <span>Scrapé Google Maps</span>
              </div>
              <span className="text-slate-600 font-bold">➔</span>
              <div className="flex items-center gap-2 p-2 rounded bg-[#1c1c2e] text-slate-300 border border-[#2e2e46]">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">2</span>
                <span>Avis 1★ Audités</span>
              </div>
              <span className="text-slate-600 font-bold">➔</span>
              <div className="flex items-center gap-2 p-2 rounded bg-[#1c1c2e] text-slate-300 border border-[#2e2e46]">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px]">3</span>
                <span>Pitch Généré</span>
              </div>
              <span className="text-slate-600 font-bold">➔</span>
              <div className="flex items-center gap-2 p-2 rounded bg-[#1c1c2e] text-emerald-300 border border-emerald-500/30">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">4</span>
                <span>Email Pro (Gmail SMTP)</span>
              </div>
              <span className="text-slate-600 font-bold">➔</span>
              <div className="flex items-center gap-2 p-2 rounded bg-[#1c1c2e] text-teal-300 border border-teal-500/30">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-[10px]">5</span>
                <span>WhatsApp 1-Clic</span>
              </div>
            </div>
          </div>

          {/* Real-time Log Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Journal d'Exécution Réel & Logs d'Envoi ({logs.length})
              </span>
              <span className="text-[10px] text-slate-500">Horodatage ISO 8601</span>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 text-center rounded-lg bg-[#141420] border border-[#222234] text-xs text-slate-500">
                Aucun envoi enregistré pour le moment. Cliquez sur "Mass Regional Outreach Dispatcher" pour lancer la diffusion.
              </div>
            ) : (
              <div className="rounded-lg bg-[#0a0a10] border border-[#222234] overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#12121e] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#222234]">
                    <tr>
                      <th className="py-2.5 px-3">Date/Heure</th>
                      <th className="py-2.5 px-3">Établissement & Destinataire</th>
                      <th className="py-2.5 px-3">Sujet</th>
                      <th className="py-2.5 px-3">Statut</th>
                      <th className="py-2.5 px-3">Détails / ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181828] text-slate-300 font-mono text-[11px]">
                    {logs.map((log: any, idx: number) => {
                      const dateStr = log.timestamp || log.deliveredAt || new Date().toISOString();
                      const formattedTime = new Date(dateStr).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      });

                      const isSent = log.delivery?.status === 'SENT' || log.status === 'DELIVERED_REAL';
                      const isTest = log.delivery?.isTestRoute;
                      const isFailed = log.status === 'FAILED' || log.delivery?.status === 'FAILED';

                      return (
                        <tr key={idx} className="hover:bg-[#121220] transition-colors">
                          <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{formattedTime}</td>
                          <td className="py-2 px-3 font-sans">
                            <div className="font-semibold text-white">{log.recipient?.venueName || 'Établissement'}</div>
                            <div className="text-[10px] text-slate-400">{log.recipient?.email || log.recipient?.phone}</div>
                          </td>
                          <td className="py-2 px-3 text-slate-300 font-sans max-w-xs truncate">
                            {log.contentSummary?.subject || log.subject || 'Audit E-Réputation'}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                              isFailed
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : isTest
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : isSent 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-slate-700/30 text-slate-400 border border-slate-700'
                            }`}>
                              {isFailed ? '⚠️ Échec' : isTest ? '✓ Test (tiguidda76)' : isSent ? '✓ Envoyé Réel' : 'En Queue'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-400 text-[10px] truncate max-w-[180px]">
                            {isFailed 
                              ? (log.delivery?.error || 'Domaine non vérifié') 
                              : (log.delivery?.messageId || log.messageId || 'N/A')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
