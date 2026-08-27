import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Building2,
  TrendingDown,
  Scale,
  FileText,
  ExternalLink,
  Zap,
  CheckCircle2,
  Star,
  Copy,
  Check,
  RefreshCw,
  Search,
  ChevronRight,
  Radio,
  Layers
} from 'lucide-react';
import { Venue, DefamationCase, PricingPlan, MoroccanRegion } from '../../types';
import { 
  askManagerRadar, 
  ManagerRadarResponse, 
  ManagerRadarAction, 
  ManagerRadarKPI 
} from '../../services/managerRadarBrainService';
import { formatMoroccanPhoneE164 } from '../../services/whatsappService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'manager';
  text: string;
  timestamp: string;
  kpis?: ManagerRadarKPI[];
  venueCards?: Venue[];
  actions?: ManagerRadarAction[];
  quickFollowUps?: string[];
  source?: 'LLM_LIVE' | 'LOCAL_BRAIN';
}

interface ManagerRadarCopilotProps {
  venues: Venue[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenAudit?: (venue: Venue) => void;
  onDispatchPitch?: (venue: Venue) => void;
  onOpenAutonomousPipeline?: (venue: Venue) => void;
  onOpenLegalNotice?: (defCase: DefamationCase) => void;
  onSelectPlanForInvoice?: (plan: PricingPlan) => void;
  onOpenCertificate?: (venue: Venue) => void;
}

export const ManagerRadarCopilot: React.FC<ManagerRadarCopilotProps> = ({
  venues,
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onOpenAudit,
  onDispatchPitch,
  onOpenAutonomousPipeline,
  onOpenLegalNotice,
  onSelectPlanForInvoice,
  onOpenCertificate,
}) => {
  const [viewMode, setViewMode] = useState<'floating' | 'drawer' | 'fullscreen'>('floating');
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Message History
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [
      {
        id: 'msg-welcome',
        sender: 'manager',
        timestamp: timeNow,
        text: `Salam Si Hassan ! 🇲🇦 Je suis **Manager Radar**, l'IA d'orchestration globale de ta flotte de réputation.

J'ai une vision 360° en temps réel sur l'ensemble de nos **${venues.length} établissements marocains** (Marrakech, Casablanca, Agadir, Tanger, Fès, etc.).

Tu peux me demander de **tout vérifier ("check everything")**, de scanner une ville, d'auditer un établissement spécifique, ou de détecter les risques juridiques et les avis négatifs.`,
        kpis: [
          { label: 'Établissements', value: `${venues.length}`, subtext: 'Base Synchronisée', color: 'emerald' },
          { label: 'Surveillance', value: '24/7 Live', subtext: '5 Plateformes (OTA & Maps)', color: 'indigo' },
          { label: 'Précision QC', value: '98.4%', subtext: 'Calibrage Marocain', color: 'amber' },
        ],
        quickFollowUps: [
          '📊 Check everything (Bilan global 412 venues)',
          '🚨 Top 5 établissements en risque critique',
          '🏨 Scanner les Riads de Marrakech',
          '⚖️ Détecter les avis diffamatoires (Art. 447)',
          '💰 Manque à gagner global en MAD'
        ],
        source: 'LOCAL_BRAIN'
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  // Handle Speech Synthesis (Audio Readout)
  const speakText = (text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Remove markdown chars
      const clean = text.replace(/[*#`_\[\]]/g, '').slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  };

  // Handle Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('La reconnaissance vocale n\'est pas supportée par ce navigateur.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Handle Send Message
  const handleSend = async (queryOverride?: string) => {
    const text = (queryOverride || inputText).trim();
    if (!text) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const radarResponse: ManagerRadarResponse = await askManagerRadar(text, venues, activeTab);
      
      const managerMsg: ChatMessage = {
        id: `manager-${Date.now()}`,
        sender: 'manager',
        text: radarResponse.text,
        timestamp: radarResponse.timestamp,
        kpis: radarResponse.kpis,
        venueCards: radarResponse.venueCards,
        actions: radarResponse.actions,
        quickFollowUps: radarResponse.quickFollowUps,
        source: radarResponse.source
      };

      setMessages((prev) => [...prev, managerMsg]);
      speakText(radarResponse.text);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `manager-${Date.now()}`,
        sender: 'manager',
        text: `⚠️ Une anomalie temporaire est survenue lors de l'analyse. Tous les flux opérationnels restent sous surveillance.`,
        timestamp: timeNow,
        source: 'LOCAL_BRAIN'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Execute Action triggered from chat card or button
  const handleExecuteAction = (action: ManagerRadarAction) => {
    const targetVenue = action.targetVenueId ? venues.find((v) => v.id === action.targetVenueId) : undefined;

    switch (action.actionType) {
      case 'AUDIT':
        if (targetVenue && onOpenAudit) {
          onOpenAudit(targetVenue);
        }
        break;
      case 'PITCH':
        if (targetVenue && onDispatchPitch) {
          onDispatchPitch(targetVenue);
        }
        break;
      case 'AUTONOMOUS':
        if (targetVenue && onOpenAutonomousPipeline) {
          onOpenAutonomousPipeline(targetVenue);
        }
        break;
      case 'LEGAL':
        if (onOpenLegalNotice) {
          const v = targetVenue || venues[0];
          const defCase: DefamationCase = {
            id: `def-chat-${Date.now()}`,
            venueId: v.id,
            venueName: v.name,
            platform: 'google',
            author: 'Avis Furtif Signalé',
            dateFlagged: 'Aujourd\'hui',
            rating: 1,
            reviewSnippet: 'Tentative avérée de diffamation commerciale et nuisance concurrentielle.',
            stage: 'LEGAL_NOTICE_DRAFTED',
            moroccanLawArticle: 'Article 447 du Code Pénal Marocain (Loi 103-13)',
            violationReason: 'Dénigrement mensonger avec préjudice commercial direct',
            evidenceNotes: 'Capture horodatée et requêtes IP transmises par @Legal-Shield',
            estimatedDamageMAD: v.annualLossMAD || 350000,
            daysActive: 1,
          };
          onOpenLegalNotice(defCase);
        }
        break;
      case 'INVOICE':
        if (onSelectPlanForInvoice) {
          onSelectPlanForInvoice({
            id: 'plan-pro',
            name: 'Pack Professional',
            priceMonthlyMAD: 1500,
            tagline: 'Standard Recommandé Riad & Hôtels',
            badge: 'Populaire',
            highlighted: true,
            features: [
              'Réponses trilingues FR/DARIJA/EN',
              'Score QC > 98.5%',
              'Surveillance 5 plateformes',
              'Devis Pro Forma BMCE Bank'
            ],
            colorTheme: 'emerald'
          });
          setActiveTab('billing');
        }
        break;
      case 'SWITCH_TAB':
        if (action.targetTab) {
          setActiveTab(action.targetTab);
        }
        break;
      case 'RUN_QUERY':
        if (action.payload) {
          handleSend(action.payload);
        }
        break;
      default:
        break;
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  // Layout sizing based on mode
  const containerClasses = 
    viewMode === 'fullscreen'
      ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl flex flex-col bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/30'
      : viewMode === 'drawer'
      ? 'fixed top-0 right-0 bottom-0 w-full md:w-[580px] z-50 shadow-2xl flex flex-col bg-slate-950/95 backdrop-blur-2xl border-l border-emerald-500/30 animate-in slide-in-from-right duration-300'
      : 'fixed bottom-4 right-4 w-[95vw] sm:w-[480px] md:w-[540px] h-[640px] max-h-[90vh] z-50 rounded-2xl shadow-2xl flex flex-col bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/30 animate-in zoom-in-95 duration-200';

  return (
    <div className={containerClasses}>
      {/* Copilot Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                Manager Radar
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-semibold tracking-wide">
                  CO-PILOT AI
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {venues.length} Établissements en Mémoire • Marrakech Time
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {/* Audio Speech Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              audioEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={audioEnabled ? 'Synthèse Vocale Activée' : 'Activer Synthèse Vocale'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* View Mode Toggles */}
          {viewMode === 'floating' && (
            <button
              onClick={() => setViewMode('drawer')}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg text-xs"
              title="Mode Tiroir Latéral"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}

          {viewMode !== 'fullscreen' ? (
            <button
              onClick={() => setViewMode('fullscreen')}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg text-xs"
              title="Plein Écran"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setViewMode('floating')}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg text-xs"
              title="Mode Flottant"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}

          {/* Clear History */}
          <button
            onClick={() => {
              if (confirm('Réinitialiser la conversation avec Manager Radar ?')) {
                setMessages([messages[0]]);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg text-xs"
            title="Effacer l'historique"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-lg text-xs transition-colors"
            title="Fermer (Échap ou Ctrl+K)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            } space-y-2`}
          >
            <div className="flex items-center gap-1.5 px-1 text-[10px] text-slate-400">
              {msg.sender === 'manager' ? (
                <>
                  <span className="font-semibold text-emerald-400">Manager Radar</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.source === 'LLM_LIVE' && (
                    <span className="bg-teal-900/40 text-teal-300 border border-teal-500/30 px-1 py-0.2 rounded text-[9px] font-mono">
                      LIVE LLM
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="font-semibold text-slate-300">Hassan Tiguidda</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`relative max-w-[92%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-none shadow-emerald-900/20'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800/90 rounded-bl-none shadow-black/30'
              }`}
            >
              {/* Copy message button */}
              {msg.sender === 'manager' && (
                <button
                  onClick={() => handleCopyText(msg.id, msg.text)}
                  className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-300 p-1 transition-colors"
                  title="Copier le texte"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              {/* Render Markdown content */}
              <div className="whitespace-pre-wrap space-y-2">
                {msg.text.split('\n\n').map((para, i) => {
                  if (para.startsWith('### ')) {
                    return (
                      <h4 key={i} className="font-bold text-emerald-300 text-xs mt-2 border-b border-slate-800 pb-1">
                        {para.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (para.startsWith('- ') || para.startsWith('• ') || para.startsWith('1. ')) {
                    return (
                      <div key={i} className="space-y-1 pl-1">
                        {para.split('\n').map((line, j) => {
                          const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                          return (
                            <p
                              key={j}
                              className="text-slate-300 flex items-start gap-1.5"
                              dangerouslySetInnerHTML={{ __html: formatted }}
                            />
                          );
                        })}
                      </div>
                    );
                  }
                  const formatted = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  return (
                    <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
                  );
                })}
              </div>

              {/* Embedded KPIs Cards */}
              {msg.kpis && msg.kpis.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
                  {msg.kpis.map((kpi, kIdx) => (
                    <div
                      key={kIdx}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col"
                    >
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                        {kpi.label}
                      </span>
                      <span
                        className={`text-sm font-bold mt-0.5 ${
                          kpi.color === 'emerald'
                            ? 'text-emerald-400'
                            : kpi.color === 'rose'
                            ? 'text-rose-400'
                            : kpi.color === 'amber'
                            ? 'text-amber-400'
                            : kpi.color === 'indigo'
                            ? 'text-indigo-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        {kpi.value}
                      </span>
                      {kpi.subtext && (
                        <span className="text-[9px] text-slate-500 mt-0.5">
                          {kpi.subtext}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Embedded Interactive Venue Cards */}
              {msg.venueCards && msg.venueCards.length > 0 && (
                <div className="space-y-2 mt-3 pt-3 border-t border-slate-800/80">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-emerald-400" />
                    Établissements Ciblés & Actions Immédiates :
                  </div>

                  {msg.venueCards.map((v) => (
                    <div
                      key={v.id}
                      className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                            {v.name}
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                                v.threatLevel === 'CRITICAL'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {v.threatLevel}
                            </span>
                          </h5>
                          <p className="text-[10px] text-slate-400">
                            {v.category} • {v.city} ({v.region})
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-rose-400 font-bold text-xs">
                            -{((v.annualLossMAD || 0) / 1000).toFixed(0)}k MAD
                          </div>
                          <div className="text-[9px] text-slate-400 flex items-center justify-end gap-1">
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            <strong>{v.overallScore}★</strong> ({v.unrepliedReviews} non rép.)
                          </div>
                        </div>
                      </div>

                      {/* Direct Action Buttons for Venue */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {onOpenAudit && (
                          <button
                            onClick={() => onOpenAudit(v)}
                            className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            Audit Express
                          </button>
                        )}

                        {onDispatchPitch && (
                          <button
                            onClick={() => onDispatchPitch(v)}
                            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors"
                          >
                            <Send className="w-3 h-3 text-amber-400" />
                            Pitch WhatsApp
                          </button>
                        )}

                        {onOpenAutonomousPipeline && (
                          <button
                            onClick={() => onOpenAutonomousPipeline(v)}
                            className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors"
                          >
                            <Zap className="w-3 h-3 text-indigo-400" />
                            Pipeline Auto
                          </button>
                        )}

                        <button
                          onClick={() => setActiveTab('leads')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors"
                        >
                          Voir Fiche <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Direct Global Action Buttons */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                  {msg.actions.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => handleExecuteAction(act)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                        act.variant === 'emerald'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                          : act.variant === 'amber'
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
                          : act.variant === 'rose'
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                          : act.variant === 'indigo'
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {act.label}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs px-2 py-1 animate-pulse">
            <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Manager Radar analyse la flotte et prépare la réponse...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-Up Prompts */}
      {messages.length > 0 && messages[messages.length - 1].quickFollowUps && (
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[11px]">
            {messages[messages.length - 1].quickFollowUps?.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-800/80 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/40 rounded-full transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pose une question à Manager Radar ('check everything', audit, riad, ville...)"
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all pr-8"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Voice Input */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-colors ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title={isListening ? 'Écoute en cours...' : 'Dictée Vocale'}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:hover:from-emerald-600 text-white rounded-xl shadow-md shadow-emerald-950/40 transition-all"
            title="Envoyer (Entrée)"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400" />
            Flotte Connectée : <strong>{venues.length} venues</strong>
          </span>
          <span className="hidden sm:inline">Raccourci clavier : <strong className="text-slate-400 font-mono">Ctrl + K</strong></span>
        </div>
      </div>
    </div>
  );
};
