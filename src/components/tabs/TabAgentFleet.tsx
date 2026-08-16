import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  Terminal, 
  CheckCircle2, 
  Brain, 
  Search, 
  MessageSquare, 
  ShieldCheck, 
  Megaphone, 
  Handshake, 
  RefreshCw,
  Zap,
  Layers,
  Send
} from 'lucide-react';
import { FLEET_AGENTS, INITIAL_LOGS } from '../../data/mockData';
import { AgentInfo, AgentLog } from '../../types';

export const TabAgentFleet: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>(FLEET_AGENTS);
  const [logs, setLogs] = useState<AgentLog[]>(INITIAL_LOGS);
  const [logFilter, setLogFilter] = useState<'ALL' | 'info' | 'success' | 'warning'>('ALL');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isDispatchingBulk, setIsDispatchingBulk] = useState(false);

  // Icon mapping helper
  const renderAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'Search': return <Search className="w-5 h-5" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5" />;
      case 'Handshake': return <Handshake className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  // Trigger Mass Dispatcher Bulk Action
  const handleTriggerBulkDispatch = () => {
    if (isDispatchingBulk) return;
    setIsDispatchingBulk(true);

    const timeNow = () => new Date().toLocaleTimeString();

    // Set dispatcher to PROCESSING
    setAgents((prev) =>
      prev.map((ag) =>
        ag.id === 'agent-dispatcher'
          ? {
              ...ag,
              status: 'PROCESSING',
              currentTask: '🚀 Envoi groupé en cours : 54 campagnes WhatsApp & API vers Riads Tanger & Casablanca...',
            }
          : ag
      )
    );

    setLogs((prev) => [
      {
        id: 'bulk-log-1-' + Date.now(),
        timestamp: timeNow(),
        agentId: 'agent-dispatcher',
        agentName: 'Mass Regional Dispatcher',
        state: 'EXECUTED',
        message: '📢 [Mass Regional Dispatcher] Campaign triggered: Dispatched 54 bulk audits with rate-limiting (20 req/min max) across Tanger & Casablanca.',
        level: 'warning',
      },
      ...prev,
    ]);

    setTimeout(() => {
      setAgents((prev) =>
        prev.map((ag) =>
          ag.id === 'agent-dispatcher'
            ? {
                ...ag,
                status: 'ACTIVE',
                tasksCompleted: ag.tasksCompleted + 54,
                currentTask: 'Actif • 54 établissements notifiés avec succès • Prêt pour le prochain créneau.',
              }
            : ag
        )
      );

      setLogs((prev) => [
        {
          id: 'bulk-log-2-' + Date.now(),
          timestamp: timeNow(),
          agentId: 'agent-dispatcher',
          agentName: 'Mass Regional Dispatcher',
          state: 'EXECUTED',
          message: '✅ [Mass Regional Dispatcher] Bulk delivery confirmed: 54 WhatsApp pitches delivered with 0 webhook drops.',
          level: 'success',
        },
        ...prev,
      ]);

      setIsDispatchingBulk(false);
    }, 2800);
  };

  // Trigger interactive multi-agent pipeline simulation
  const runAgentPipelineSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);

    const timeNow = () => new Date().toLocaleTimeString();

    // Step 1: Planner
    setTimeout(() => {
      setActiveStep(1);
      setAgents((prev) =>
        prev.map((ag) =>
          ag.id === 'agent-planner'
            ? { ...ag, status: 'PROCESSING', currentTask: '🧠 Analyse de la file : Déclenchement mission Tanger & Fès...' }
            : ag
        )
      );
      setLogs((prev) => [
        {
          id: 'sim-log-' + Date.now(),
          timestamp: timeNow(),
          agentId: 'agent-planner',
          agentName: 'Planner Agent',
          state: 'PLANNING',
          message: '🧠 [Planner] Evaluated queue: Dispatched scraping mission for 14 new reviews in Tanger & Fès.',
          level: 'info',
        },
        ...prev,
      ]);
    }, 600);

    // Step 2: Auditor
    setTimeout(() => {
      setActiveStep(2);
      setAgents((prev) =>
        prev.map((ag) => {
          if (ag.id === 'agent-planner') return { ...ag, status: 'ACTIVE', tasksCompleted: ag.tasksCompleted + 1 };
          if (ag.id === 'agent-auditor') return { ...ag, status: 'PROCESSING', currentTask: '🔍 Scraping furtif Google Maps & TripAdvisor (Riad Kasbah)...' };
          return ag;
        })
      );
      setLogs((prev) => [
        {
          id: 'sim-log-' + Date.now(),
          timestamp: timeNow(),
          agentId: 'agent-auditor',
          agentName: 'Auditor Agent',
          state: 'SCRAPING',
          message: '🔍 [Auditor] Scraped Google Maps & TripAdvisor. Flagged 1★ review: "Service lent & climatisation bruyante" at Riad Kasbah.',
          level: 'warning',
        },
        ...prev,
      ]);
    }, 1500);

    // Step 3: Reply Rescue
    setTimeout(() => {
      setActiveStep(3);
      setAgents((prev) =>
        prev.map((ag) => {
          if (ag.id === 'agent-auditor') return { ...ag, status: 'ACTIVE', tasksCompleted: ag.tasksCompleted + 1 };
          if (ag.id === 'agent-responder') return { ...ag, status: 'PROCESSING', currentTask: '🛡️ Rédaction réponse Darija & Français avec tags SEO locaux...' };
          return ag;
        })
      );
      setLogs((prev) => [
        {
          id: 'sim-log-' + Date.now(),
          timestamp: timeNow(),
          agentId: 'agent-responder',
          agentName: 'Reply Rescue Agent',
          state: 'DRAFTING',
          message: '🛡️ [Reply Rescue] Generated empathetic Darija & French draft with SEO tags ["médina Marrakech", "service dévoué", "hospitalité marocaine"].',
          level: 'info',
        },
        ...prev,
      ]);
    }, 2400);

    // Step 4: QC Reviewer
    setTimeout(() => {
      setActiveStep(4);
      setAgents((prev) =>
        prev.map((ag) => {
          if (ag.id === 'agent-responder') return { ...ag, status: 'ACTIVE', tasksCompleted: ag.tasksCompleted + 1 };
          if (ag.id === 'agent-qc') return { ...ag, status: 'PROCESSING', currentTask: '⚖️ Audit de conformité de ton & safety guardrails (Seuil > 98.4%)...' };
          return ag;
        })
      );
      setLogs((prev) => [
        {
          id: 'sim-log-' + Date.now(),
          timestamp: timeNow(),
          agentId: 'agent-qc',
          agentName: 'QC Reviewer Agent',
          state: 'QC_CHECK',
          message: '✅ [QC Reviewer] Audit score passed: 99.6% (Tone compliance: 100%, Brand Voice: 99%, Legal Safety: 100%).',
          level: 'success',
        },
        ...prev,
      ]);
    }, 3300);

    // Step 5: Dispatcher
    setTimeout(() => {
      setActiveStep(5);
      setAgents((prev) =>
        prev.map((ag) => {
          if (ag.id === 'agent-qc') return { ...ag, status: 'ACTIVE', tasksCompleted: ag.tasksCompleted + 1 };
          if (ag.id === 'agent-dispatcher') return { ...ag, status: 'PROCESSING', currentTask: '🚀 Publication directe API GBP & notification WhatsApp à Si Mohamed...' };
          return ag;
        })
      );
      setLogs((prev) => [
        {
          id: 'sim-log-' + Date.now(),
          timestamp: timeNow(),
          agentId: 'agent-dispatcher',
          agentName: 'Mass Regional Dispatcher',
          state: 'EXECUTED',
          message: '🚀 [LangGraph Pipeline] Published directly to Google Business Profile via API webhook. Notification sent to Si Mohamed (WhatsApp).',
          level: 'success',
        },
        ...prev,
      ]);
    }, 4200);

    // Step 6: Completion & Reset to Active
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((ag) => {
          if (ag.id === 'agent-dispatcher') {
            return {
              ...ag,
              status: 'ACTIVE',
              tasksCompleted: ag.tasksCompleted + 1,
              currentTask: 'Actif • Monitoring des webhooks WhatsApp & quotas API (Tanger & Casablanca)',
            };
          }
          return ag;
        })
      );
      setIsSimulating(false);
      setActiveStep(0);
    }, 5200);
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.level === logFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Fleet Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-lg font-bold text-white font-display">
              Flotte Multi-Agents Autonome (CrewAI + LangGraph Orchestration)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            7 Agents spécialisés synchronisés en graphe d'états asynchrone pour la prospection, l'audit, la rédaction et la conformité QC.
          </p>
        </div>

        <button
          onClick={runAgentPipelineSimulation}
          disabled={isSimulating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Exécution LangGraph en cours...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Simuler Pipeline Multi-Agents (Live)</span>
            </>
          )}
        </button>
      </div>

      {/* LangGraph Visual State Machine Flow */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Visualiseur d'États LangGraph (Graphe Déterministe &amp; Guardrails)
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            Tolérance Erreur : 0.00% • Seuil QC : &gt; 98.4%
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          
          {/* Node 1: Ingestion & Planning */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeStep === 1
                ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/40'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 font-mono">NODE 1</span>
              <Brain className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-white block">Plan &amp; Ingestion</span>
            <span className="text-[10px] text-slate-400 mt-1 block">CrewAI Dispatcher</span>
          </div>

          {/* Node 2: 5P Scraping */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeStep === 2
                ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-500/40'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 font-mono">NODE 2</span>
              <Search className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-white block">Audit 5-Plateformes</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Scraping Furtif</span>
          </div>

          {/* Node 3: AI Rescue Drafting */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeStep === 3
                ? 'bg-sky-950/80 border-sky-400 ring-2 ring-sky-500/40'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 font-mono">NODE 3</span>
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <span className="text-xs font-bold text-white block">Réponse &amp; SEO</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Moroccan Warmth</span>
          </div>

          {/* Node 4: QC Gate */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeStep === 4
                ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/40'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 font-mono">NODE 4</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-white block">Contrôle QC (&gt;98.4%)</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Filtre Hallucination</span>
          </div>

          {/* Node 5: Output Router */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeStep === 5
                ? 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-500/40'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 font-mono">NODE 5</span>
              <Zap className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-white block">Publication Directe</span>
            <span className="text-[10px] text-slate-400 mt-1 block">API Webhook GBP / OTA</span>
          </div>

        </div>
      </div>

      {/* 7 Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const statusBadge = {
            ONLINE: 'bg-emerald-950 text-emerald-300 border-emerald-800',
            ACTIVE: 'bg-emerald-950 text-emerald-400 border-emerald-700 animate-pulse',
            PROCESSING: 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse',
            STANDBY: 'bg-slate-800 text-slate-400 border-slate-700',
          }[agent.status];

          const isDispatcher = agent.id === 'agent-dispatcher';

          return (
            <div
              key={agent.id}
              className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      {renderAgentIcon(agent.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{agent.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.2 bg-slate-950 rounded border border-slate-800">
                        {agent.framework}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                    {agent.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 font-medium mt-2 leading-tight">
                  {agent.role}
                </p>

                <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              {/* Special Action Button for Mass Regional Dispatcher */}
              {isDispatcher && (
                <div className="pt-2">
                  <button
                    onClick={handleTriggerBulkDispatch}
                    disabled={isDispatchingBulk}
                    className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-lg text-[10px] font-bold transition-all shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isDispatchingBulk ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Dispatch en cours (Tanger/Casa)...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Déclencher Dispatch Régional (54 Riads)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Live Task & Metrics */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-semibold">Tâche en cours :</span>
                  <span className="text-[10px] text-emerald-300 font-mono block truncate">
                    {agent.currentTask}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px] text-center text-slate-400">
                  <div className="p-1 bg-slate-950/60 rounded border border-slate-800/40">
                    <span className="text-slate-500 block">Tâches</span>
                    <span className="font-bold text-slate-200">{agent.tasksCompleted.toLocaleString()}</span>
                  </div>
                  <div className="p-1 bg-slate-950/60 rounded border border-slate-800/40">
                    <span className="text-slate-500 block">Latence</span>
                    <span className="font-mono text-amber-300">{agent.avgLatencyMs}ms</span>
                  </div>
                  <div className="p-1 bg-slate-950/60 rounded border border-slate-800/40">
                    <span className="text-slate-500 block">Précision</span>
                    <span className="font-bold text-emerald-400">{agent.accuracy}%</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Live Execution Console Stream */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Console d'Exécution Asynchrone LangGraph (Logs Temps Réel)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              {(['ALL', 'info', 'success', 'warning'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2.5 py-0.5 rounded font-mono ${
                    logFilter === lvl ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setLogs(INITIAL_LOGS)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 text-xs"
              title="Réinitialiser les logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#020617] font-mono text-[11px] space-y-2 max-h-64 overflow-y-auto">
          {filteredLogs.map((log) => {
            const levelColor = {
              info: 'text-sky-400',
              success: 'text-emerald-400',
              warning: 'text-amber-400',
              error: 'text-rose-400',
            }[log.level];

            return (
              <div key={log.id} className="flex items-start gap-3 hover:bg-slate-900/40 p-1 rounded transition-colors">
                <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                <span className={`font-bold shrink-0 ${levelColor}`}>
                  [{log.agentName.split(' ')[0]}]
                </span>
                <span className="text-slate-300 leading-relaxed break-words">
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
