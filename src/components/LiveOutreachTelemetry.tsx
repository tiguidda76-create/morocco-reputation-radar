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
  Sparkles
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
        if (Array.isArray(logData)) setLogs(logData);
      } else {
        const local = getOutreachAuditLog();
        setLogs(local);
      }
    } catch (e) {
      calculateFromLocalLogs();
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFromLocalLogs = () => {
    const local = getOutreachAuditLog();
    setLogs(local);
    const total = local.length;
    const delivered = local.filter((l: any) => l.status === 'DELIVERED_REAL' || l.status === 'SENT').length;
    const opened = local.filter((l: any) => l.tracking?.opened).length;
    const clicked = local.filter((l: any) => l.tracking?.clicked).length;
    const bounced = local.filter((l: any) => l.status === 'FAILED' || l.status === 'BOUNCED').length;

    setStats({
      totalSent: total,
      delivered,
      opened,
      clicked,
      bounced,
      deliveryRate: total > 0 ? Number(((delivered / total) * 100).toFixed(1)) : 0,
      openRate: delivered > 0 ? Number(((opened / delivered) * 100).toFixed(1)) : 0,
      clickRate: opened > 0 ? Number(((clicked / opened) * 100).toFixed(1)) : 0
    });
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
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
                Gmail SMTP Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Traçabilité réelle des emails envoyés via <code className="text-amber-300">tiguidda76@gmail.com</code> (Statuts, Ouvertures, Clics WhatsApp).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            <span>Emails Envoyés</span>
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
            <span>Clics WhatsApp Direct</span>
            <MousePointerClick className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-xl font-bold text-teal-400 tracking-tight">{stats.clicked}</div>
          <div className="text-[10px] text-teal-500/80 mt-1">Échanges 0632155430 initiés</div>
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
                <span>Gmail SMTP Délivré</span>
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
                Journal d'Exécution Réel & Logs SMTP ({logs.length})
              </span>
              <span className="text-[10px] text-slate-500">Horodatage ISO 8601</span>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 text-center rounded-lg bg-[#141420] border border-[#222234] text-xs text-slate-500">
                Aucun email envoyé pour le moment. Cliquez sur "Envoyer le Pitch" sur l'un des 12 établissements pour déclencher un envoi réel.
              </div>
            ) : (
              <div className="rounded-lg bg-[#0a0a10] border border-[#222234] overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#12121e] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#222234]">
                    <tr>
                      <th className="py-2.5 px-3">Date/Heure</th>
                      <th className="py-2.5 px-3">Établissement & Destinataire</th>
                      <th className="py-2.5 px-3">Sujet</th>
                      <th className="py-2.5 px-3">Statut SMTP</th>
                      <th className="py-2.5 px-3">Message-ID</th>
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
                              isSent 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {isSent ? '✓ Envoyé Réel' : 'En Queue'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-500 text-[10px] truncate max-w-[140px]">
                            {log.delivery?.messageId || log.messageId || 'N/A'}
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
