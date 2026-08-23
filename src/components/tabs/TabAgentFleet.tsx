import React, { useState, useEffect, useRef } from 'react';
import {
  Hash,
  AlertTriangle,
  CheckSquare,
  Scale,
  CreditCard,
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Play,
  RefreshCw,
  Search,
  Building2,
  FileText,
  Globe2,
  Edit3,
  X,
  Info
} from 'lucide-react';
import {
  WAR_ROOM_AGENTS,
  WAR_ROOM_CHANNELS,
  INITIAL_WAR_ROOM_MESSAGES,
  INITIAL_DM_MESSAGES,
  SLASH_COMMANDS,
  WarRoomAgent,
  WarRoomChannel,
  WarRoomMessage,
  IncidentCardData
} from '../../data/warRoomData';
import { Venue, DefamationCase, PricingPlan, PlatformType } from '../../types';
import { INITIAL_VENUES, AGENCY_METADATA } from '../../data/mockData';

interface TabAgentFleetProps {
  venues?: Venue[];
  onOpenAudit?: (venue: Venue) => void;
  onOpenLegalNotice?: (defCase: DefamationCase) => void;
  onSelectPlanForInvoice?: (plan: PricingPlan) => void;
  onOpenCertificate?: (venue: Venue) => void;
}

export const TabAgentFleet: React.FC<TabAgentFleetProps> = ({
  venues = INITIAL_VENUES,
  onOpenAudit,
  onOpenLegalNotice,
  onSelectPlanForInvoice,
  onOpenCertificate,
}) => {
  // Navigation State
  const [activeChannelId, setActiveChannelId] = useState<string>('all-venues-feed');
  const [activeDmHandle, setActiveDmHandle] = useState<string | null>(null);
  
  // Channels and Agents Data State
  const [channels, setChannels] = useState<WarRoomChannel[]>(WAR_ROOM_CHANNELS);
  const [agents, setAgents] = useState<WarRoomAgent[]>(WAR_ROOM_AGENTS);
  const [messages, setMessages] = useState<WarRoomMessage[]>(INITIAL_WAR_ROOM_MESSAGES);
  const [dmThreads, setDmThreads] = useState<Record<string, WarRoomMessage[]>>(INITIAL_DM_MESSAGES);

  // UI States
  const [selectedIncident, setSelectedIncident] = useState<IncidentCardData | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [showSlashMenu, setShowSlashMenu] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingAgent, setTypingAgent] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeSimStep, setActiveSimStep] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState<boolean>(true);
  const [editingIncidentId, setEditingIncidentId] = useState<string | null>(null);
  const [customDraftText, setCustomDraftText] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, dmThreads, activeChannelId, activeDmHandle, isTyping]);

  // Set default selected incident on mount
  useEffect(() => {
    if (!selectedIncident) {
      const firstIncMsg = messages.find((m) => m.incidentCard);
      if (firstIncMsg?.incidentCard) {
        setSelectedIncident(firstIncMsg.incidentCard);
      }
    }
  }, [messages]);

  // Active channel / DM messages
  const currentMessages = activeDmHandle
    ? (dmThreads[activeDmHandle] || [])
    : messages.filter((m) => m.channelId === activeChannelId);

  const filteredMessages = currentMessages.filter((msg) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      msg.content.toLowerCase().includes(q) ||
      msg.sender.name.toLowerCase().includes(q) ||
      msg.incidentCard?.venueName.toLowerCase().includes(q) ||
      msg.incidentCard?.comment.toLowerCase().includes(q)
    );
  });

  // Current context metadata
  const currentChannel = channels.find((c) => c.id === activeChannelId);
  const currentAgent = WAR_ROOM_AGENTS.find((a) => a.handle === activeDmHandle);

  // Handle Channel select
  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveDmHandle(null);
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Handle DM select
  const handleSelectDm = (agentHandle: string) => {
    setActiveDmHandle(agentHandle);
  };

  // Get Venue by ID or Name
  const getVenueForIncident = (venueId?: string, venueName?: string): Venue => {
    if (venueId) {
      const found = venues.find((v) => v.id === venueId);
      if (found) return found;
    }
    if (venueName) {
      const found = venues.find((v) => v.name.toLowerCase().includes(venueName.toLowerCase()));
      if (found) return found;
    }
    return venues[0];
  };

  // Add Emoji Reaction
  const handleToggleReaction = (msgId: string, emoji: string) => {
    const updateMsgList = (list: WarRoomMessage[]) =>
      list.map((m) => {
        if (m.id !== msgId) return m;
        const currentReactions = m.reactions || [];
        const existing = currentReactions.find((r) => r.emoji === emoji);
        if (existing) {
          return {
            ...m,
            reactions: currentReactions.map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.active ? r.count - 1 : r.count + 1, active: !r.active }
                : r
            ).filter((r) => r.count > 0),
          };
        } else {
          return {
            ...m,
            reactions: [...currentReactions, { emoji, count: 1, active: true }],
          };
        }
      });

    if (activeDmHandle) {
      setDmThreads((prev) => ({
        ...prev,
        [activeDmHandle]: updateMsgList(prev[activeDmHandle] || []),
      }));
    } else {
      setMessages((prev) => updateMsgList(prev));
    }
  };

  // Inline Action: Approve and Publish Response
  const handleApproveResponse = (incidentId: string) => {
    const updateCardStatus = (inc: IncidentCardData): IncidentCardData => ({
      ...inc,
      status: 'PUBLISHED',
    });

    setMessages((prev) =>
      prev.map((m) =>
        m.incidentCard && m.incidentCard.id === incidentId
          ? {
              ...m,
              incidentCard: updateCardStatus(m.incidentCard),
            }
          : m
      )
    );

    if (selectedIncident?.id === incidentId) {
      setSelectedIncident((prev) => (prev ? updateCardStatus(prev) : null));
    }

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetInc = messages.find((m) => m.incidentCard?.id === incidentId)?.incidentCard || selectedIncident;
    
    setTimeout(() => {
      const confirmMsg: WarRoomMessage = {
        id: 'msg-pub-conf-' + Date.now(),
        channelId: activeChannelId,
        sender: {
          id: 'agent-manager',
          name: 'Manager Radar',
          handle: '@Manager-Radar',
          avatar: 'MR',
          isAgent: true,
          role: 'Fleet Orchestrator',
          color: 'emerald',
        },
        timestamp: timeNow,
        content: `🚀 **Réponse Approuvée & Publiée avec succès !** La réponse SEO pour **${targetInc?.venueName}** (${targetInc?.platform.toUpperCase()}) a été injectée directement via l'API Webhook. Notification WhatsApp de confirmation envoyée au gérant.`,
        reactions: [{ emoji: '🎉', count: 4, active: true }, { emoji: '✅', count: 5 }],
      };
      setMessages((prev) => [...prev, confirmMsg]);
    }, 400);
  };

  // Inline Action: Request Edit in Darija or French
  const handleRequestEdit = (incident: IncidentCardData) => {
    setEditingIncidentId(incident.id);
    setCustomDraftText(incident.aiDraft?.content || '');
  };

  const handleSaveCustomDraft = (incidentId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.incidentCard && m.incidentCard.id === incidentId && m.incidentCard.aiDraft) {
          return {
            ...m,
            incidentCard: {
              ...m.incidentCard,
              status: 'EDIT_REQUESTED',
              aiDraft: {
                ...m.incidentCard.aiDraft,
                content: customDraftText,
                qcScore: 99.8,
              },
            },
          };
        }
        return m;
      })
    );

    if (selectedIncident?.id === incidentId && selectedIncident.aiDraft) {
      setSelectedIncident({
        ...selectedIncident,
        status: 'EDIT_REQUESTED',
        aiDraft: {
          ...selectedIncident.aiDraft,
          content: customDraftText,
          qcScore: 99.8,
        },
      });
    }

    setEditingIncidentId(null);

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTimeout(() => {
      const replyMsg: WarRoomMessage = {
        id: 'msg-edit-conf-' + Date.now(),
        channelId: activeChannelId,
        sender: {
          id: 'agent-reply',
          name: 'Reply Rescue',
          handle: '@Reply-Rescue',
          avatar: 'RR',
          isAgent: true,
          role: 'Copywriter & SEO',
          color: 'sky',
        },
        timestamp: timeNow,
        content: `✍️ **Brouillon recalibré et enregistré**. Les retouches linguistiques en Darija/Français et les tags de réputation sont validés. Score QC actualisé : **99.8%**.`,
        reactions: [{ emoji: '👌', count: 2 }],
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 300);
  };

  // Inline Action: Trigger Defamation Takedown
  const handleTriggerDefamation = (incident: IncidentCardData) => {
    const venue = getVenueForIncident(incident.venueId, incident.venueName);
    const defCase: DefamationCase = {
      id: 'def-' + incident.id,
      venueName: incident.venueName,
      city: incident.city || venue.city,
      platform: incident.platform,
      author: incident.author,
      dateFlagged: incident.date,
      rating: incident.rating,
      reviewSnippet: incident.comment,
      stage: 'LEGAL_NOTICE_DRAFTED',
      moroccanLawArticle: incident.legalDefamation?.article || 'Article 447 du Code Pénal Marocain (Loi 103-13)',
      violationReason: incident.legalDefamation?.violationType || 'Diffamation commerciale sans preuve avérée de consommation',
      evidenceNotes: 'Capture horodatée effectuée par @Auditor-Agent. IP anonymisée suspectée de concurrence déloyale.',
      estimatedDamageMAD: venue.annualLossMAD || 450000,
      daysActive: 1,
    };

    if (onOpenLegalNotice) {
      onOpenLegalNotice(defCase);
    }

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const legalMsg: WarRoomMessage = {
      id: 'msg-leg-trig-' + Date.now(),
      channelId: activeChannelId,
      sender: {
        id: 'agent-legal',
        name: 'Legal Shield',
        handle: '@Legal-Shield',
        avatar: 'LS',
        isAgent: true,
        role: 'Legal Escalation Officer',
        color: 'rose',
      },
      timestamp: timeNow,
      content: `⚖️ **Procédure d'Escalade Juridique Activée sous l'Art. 447** pour **${incident.venueName}**. La mise en demeure formelle a été générée. Notification d'astreinte transmise au service modération ${incident.platform.toUpperCase()}.`,
      reactions: [{ emoji: '⚖️', count: 5, active: true }, { emoji: '🛡️', count: 3 }],
    };
    setMessages((prev) => [...prev, legalMsg]);
  };

  // Send message or execute slash command
  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (content.startsWith('/')) {
      handleExecuteSlashCommand(content.trim());
      setInputText('');
      setShowSlashMenu(false);
      return;
    }

    const userMsg: WarRoomMessage = {
      id: 'msg-user-' + Date.now(),
      channelId: activeChannelId,
      recipientHandle: activeDmHandle || undefined,
      sender: {
        id: 'user-hassan',
        name: 'Hassan Tiguidda (Toi)',
        handle: '@Hassan-Tiguidda',
        avatar: 'HT',
        isAgent: false,
        role: 'Directeur Agence',
        color: 'emerald',
      },
      timestamp: timeNow,
      content: content,
    };

    if (activeDmHandle) {
      setDmThreads((prev) => ({
        ...prev,
        [activeDmHandle]: [...(prev[activeDmHandle] || []), userMsg],
      }));
    } else {
      setMessages((prev) => [...prev, userMsg]);
    }

    setInputText('');
    setShowSlashMenu(false);

    triggerAgentReply(content);
  };

  // Smart agent reply generator
  const triggerAgentReply = (userPrompt: string) => {
    setIsTyping(true);
    const respondingAgent = activeDmHandle
      ? (WAR_ROOM_AGENTS.find((a) => a.handle === activeDmHandle) || WAR_ROOM_AGENTS[0])
      : WAR_ROOM_AGENTS[0];

    setTypingAgent(respondingAgent.name);

    setTimeout(() => {
      setIsTyping(false);
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let agentResponse = '';

      const lower = userPrompt.toLowerCase();

      if (lower.includes('audit') || lower.includes('mamounia') || lower.includes('kasbah')) {
        agentResponse = `🔍 **Rapport d'Audit Express généré** : Établissement audité sur 5 plateformes (Google Maps, Booking, TripAdvisor, Airbnb, Yelp). **Score moyen : 4.4/5**. 3 avis négatifs sans réponse détectés. Perte estimée : ~420 000 MAD/an. Brouillons de riposte prêts dans #review-approvals-mode-a.`;
      } else if (lower.includes('facture') || lower.includes('devis') || lower.includes('bmce') || lower.includes('rib')) {
        agentResponse = `💼 **Devis Pro Forma édité** : Conformément à la structure légale auto-entrepreneur (*ICE 1161674000043* & *Art 91 - II - 1° CGI*). Coordonnées bancaires jointes : BMCE Bank Guéliz - RIB \`007450001399370030009822\`. Prêt pour transmission WhatsApp ou PDF.`;
      } else if (lower.includes('diffamation') || lower.includes('447') || lower.includes('avocat') || lower.includes('plainte')) {
        agentResponse = `⚖️ **Analyse Juridique Art. 447 Code Pénal Marocain** : L'infraction d'atteinte délibérée à la réputation commerciale est caractérisée. Dossier horodaté et réquisition de suppression prête pour Google Business Profile Legal.`;
      } else if (lower.includes('darija') || lower.includes('arabe') || lower.includes('ton')) {
        agentResponse = `✍️ **Adaptation linguistique validée** : *"Marhaban bikoum f Riadna..."* Le ton est calibré selon les codes d'hospitalité marocaine avec intégration des requêtes géolocalisées Google Maps.`;
      } else {
        agentResponse = `🤖 Bien reçu Si Hassan. J'ai synchronisé les paramètres de la flotte multi-agents. Tous les flux sont opérationnels avec un temps de réponse moyen de **${respondingAgent.avgLatencyMs}ms** et une précision QC de **${respondingAgent.accuracy}%**.`;
      }

      const replyMsg: WarRoomMessage = {
        id: 'msg-reply-' + Date.now(),
        channelId: activeChannelId,
        recipientHandle: activeDmHandle || undefined,
        sender: {
          id: respondingAgent.id,
          name: respondingAgent.name,
          handle: respondingAgent.handle,
          avatar: respondingAgent.avatar,
          isAgent: true,
          role: respondingAgent.role,
          color: respondingAgent.color,
        },
        timestamp: timeNow,
        content: agentResponse,
        reactions: [{ emoji: '⚡', count: 2 }],
      };

      if (activeDmHandle) {
        setDmThreads((prev) => ({
          ...prev,
          [activeDmHandle]: [...(prev[activeDmHandle] || []), replyMsg],
        }));
      } else {
        setMessages((prev) => [...prev, replyMsg]);
      }
    }, 1200);
  };

  // Execute Slash Commands
  const handleExecuteSlashCommand = (cmdStr: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (cmdStr.startsWith('/clear')) {
      if (activeDmHandle) {
        setDmThreads((prev) => ({ ...prev, [activeDmHandle]: [] }));
      } else {
        setMessages((prev) => prev.filter((m) => m.channelId !== activeChannelId));
      }
      return;
    }

    if (cmdStr.startsWith('/simulate')) {
      runMultiAgentSimulation();
      return;
    }

    if (cmdStr.startsWith('/help')) {
      const helpMsg: WarRoomMessage = {
        id: 'msg-help-' + Date.now(),
        channelId: activeChannelId,
        recipientHandle: activeDmHandle || undefined,
        sender: {
          id: 'agent-manager',
          name: 'Manager Radar',
          handle: '@Manager-Radar',
          avatar: 'MR',
          isAgent: true,
          role: 'Fleet Orchestrator',
          color: 'emerald',
        },
        timestamp: timeNow,
        content: `📖 **Commandes Slash Disponibles dans la War Room** :\n- \`/audit "<Nom Établissement>"\` : Déclenche un audit furtif 5-plateformes (@Auditor-Agent)\n- \`/invoice generate "<Nom>" <pro|vip>\` : Génère un devis Pro Forma BMCE (@Billing-Officer)\n- \`/simulate\` : Lance le pipeline live LangGraph\n- \`/takedown "<Nom>"\` : Escalade diffamation Art. 447 (@Legal-Shield)\n- \`/qc check\` : Vérifie la file d'attente Mode A\n- \`/clear\` : Réinitialise l'affichage des messages`,
        reactions: [{ emoji: '💡', count: 3 }],
      };

      if (activeDmHandle) {
        setDmThreads((prev) => ({ ...prev, [activeDmHandle]: [...(prev[activeDmHandle] || []), helpMsg] }));
      } else {
        setMessages((prev) => [...prev, helpMsg]);
      }
      return;
    }

    if (cmdStr.startsWith('/audit')) {
      const match = cmdStr.match(/"([^"]+)"/) || cmdStr.split(' ');
      const venueName = typeof match === 'object' && match[1] ? match[1] : (match[1] || 'La Mamounia');
      const venueObj = getVenueForIncident(undefined, venueName);

      const auditMsg: WarRoomMessage = {
        id: 'msg-audit-cmd-' + Date.now(),
        channelId: activeChannelId,
        recipientHandle: activeDmHandle || undefined,
        sender: {
          id: 'agent-auditor',
          name: 'Auditor Agent',
          handle: '@Auditor-Agent',
          avatar: 'AA',
          isAgent: true,
          role: 'Scraper & Parser',
          color: 'amber',
        },
        timestamp: timeNow,
        content: `🔍 **Mission d'Audit Furtif 5P Exécutée pour "${venueObj.name}"** :\n- Google Maps : **${venueObj.platforms.google.score}★** (${venueObj.platforms.google.totalReviews} avis, ${venueObj.platforms.google.unrepliedCount} non répondus)\n- Booking.com : **${venueObj.platforms.booking.score}★** (${venueObj.platforms.booking.totalReviews} avis)\n- TripAdvisor : **${venueObj.platforms.tripadvisor.score}★** (${venueObj.platforms.tripadvisor.totalReviews} avis)\n- Perte estimée : **${venueObj.annualLossMAD.toLocaleString()} MAD / an**\n\nTu peux consulter le rapport complet via le tiroir latéral contextuel.`,
        incidentCard: {
          id: 'inc-audit-' + Date.now(),
          venueId: venueObj.id,
          venueName: venueObj.name,
          city: venueObj.city,
          category: venueObj.category,
          platform: 'google',
          author: 'Dernier avis scanné',
          authorCountry: 'International 🌍',
          rating: 2,
          date: 'Aujourd\'hui',
          title: 'Avis critique nécessitant réponse immédiate',
          comment: 'Expérience mitigée lors de notre séjour. Le service au restaurant était ralenti et le check-in a pris plus de temps que prévu.',
          sentiment: 'Negative',
          threatLevel: venueObj.threatLevel,
          status: 'PENDING_APPROVAL',
          aiDraft: {
            language: 'FR',
            tone: 'Hospitalité & Rétablissement Prestige',
            content: `Chers hôtes, Nous vous remercions pour votre précieux retour. L'excellence de notre accueil et la rapidité du service sont au cœur de nos priorités à ${venueObj.name}. Nous avons pris les mesures immédiates avec notre brigade pour garantir une expérience sans faille lors de votre prochaine visite. Bien chaleureusement, La Direction.`,
            seoKeywords: [venueObj.name, venueObj.city, 'hospitalité marocaine', 'service client'],
            qcScore: 99.2,
            empathyScore: 98,
            brandVoiceScore: 99,
            legalSafetyScore: 100,
            generatedAt: '2026-08-23 11:40',
          },
        },
        reactions: [{ emoji: '📊', count: 4, active: true }],
      };

      if (activeDmHandle) {
        setDmThreads((prev) => ({ ...prev, [activeDmHandle]: [...(prev[activeDmHandle] || []), auditMsg] }));
      } else {
        setMessages((prev) => [...prev, auditMsg]);
      }
      return;
    }

    if (cmdStr.startsWith('/invoice')) {
      const invMsg: WarRoomMessage = {
        id: 'msg-inv-cmd-' + Date.now(),
        channelId: activeChannelId,
        recipientHandle: activeDmHandle || undefined,
        sender: {
          id: 'agent-billing',
          name: 'Billing Officer',
          handle: '@Billing-Officer',
          avatar: 'BO',
          isAgent: true,
          role: 'Billing & Retainers',
          color: 'indigo',
        },
        timestamp: timeNow,
        content: `💼 **Devis Pro Forma Généré avec Succès** :\n- Client : **Riad Kasbah & Spa (Marrakech)**\n- Formule : **Pack Professional (1 500 MAD / mois)**\n- Émetteur : **${AGENCY_METADATA.entity}** (ICE : \`${AGENCY_METADATA.ice}\`)\n- Exonération TVA : *Art 91 - II - 1° du CGI*\n- RIB BMCE : \`${AGENCY_METADATA.rib}\` (Agence Guéliz)\n\nLe document est prêt pour transmission WhatsApp ou export PDF.`,
        reactions: [{ emoji: '💳', count: 3, active: true }],
      };

      if (activeDmHandle) {
        setDmThreads((prev) => ({ ...prev, [activeDmHandle]: [...(prev[activeDmHandle] || []), invMsg] }));
      } else {
        setMessages((prev) => [...prev, invMsg]);
      }
      return;
    }

    triggerAgentReply(cmdStr);
  };

  // Full Multi-Agent Simulation Pipeline
  const runMultiAgentSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveSimStep(1);

    const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTimeout(() => {
      setActiveSimStep(1);
      const step1Msg: WarRoomMessage = {
        id: 'sim-1-' + Date.now(),
        channelId: activeChannelId,
        sender: {
          id: 'agent-manager',
          name: 'Manager Radar',
          handle: '@Manager-Radar',
          avatar: 'MR',
          isAgent: true,
          role: 'Fleet Orchestrator',
          color: 'emerald',
        },
        timestamp: timeNow(),
        content: '🧠 `[NODE 1: PLANNING & DISPATCH]` Déclenchement de la ronde d\'audit furtif sur 18 Riads à Marrakech et Casablanca. Mission assignée à @Auditor-Agent.',
      };
      setMessages((prev) => [...prev, step1Msg]);
    }, 600);

    setTimeout(() => {
      setActiveSimStep(2);
      const step2Msg: WarRoomMessage = {
        id: 'sim-2-' + Date.now(),
        channelId: activeChannelId,
        sender: {
          id: 'agent-auditor',
          name: 'Auditor Agent',
          handle: '@Auditor-Agent',
          avatar: 'AA',
          isAgent: true,
          role: 'Scraper & Parser',
          color: 'amber',
        },
        timestamp: timeNow(),
        content: '🔍 `[NODE 2: 5P SCRAPING]` Scraping furtif Google Maps & TripAdvisor terminé sans blocage. **1 avis critique 1★ détecté** chez *Riad Kasbah & Spa* ("Service lent & eau tiède"). Transfert immédiat à @Reply-Rescue.',
      };
      setMessages((prev) => [...prev, step2Msg]);
    }, 1800);

    setTimeout(() => {
      setActiveSimStep(3);
      const step3Msg: WarRoomMessage = {
        id: 'sim-3-' + Date.now(),
        channelId: activeChannelId,
        sender: {
          id: 'agent-reply',
          name: 'Reply Rescue',
          handle: '@Reply-Rescue',
          avatar: 'RR',
          isAgent: true,
          role: 'Copywriter & SEO',
          color: 'sky',
        },
        timestamp: timeNow(),
        content: '✍️ `[NODE 3: MOROCCAN COPYWRITING]` Brouillon généré en Français chaleureux + Darija avec inclusion des mots-clés SEO ["riad authentique médina Marrakech", "hospitalité marocaine"]. Transmission à @QC-Reviewer pour vérification du seuil > 98.4%.',
      };
      setMessages((prev) => [...prev, step3Msg]);
    }, 3000);

    setTimeout(() => {
      setActiveSimStep(4);
      const step4Msg: WarRoomMessage = {
        id: 'sim-4-' + Date.now(),
        channelId: activeChannelId,
        sender: {
          id: 'agent-qc',
          name: 'QC Reviewer',
          handle: '@QC-Reviewer',
          avatar: 'QC',
          isAgent: true,
          role: 'QC Auditor',
          color: 'emerald',
        },
        timestamp: timeNow(),
        content: '🛡️ `[NODE 4: QC GUARDRAILS]` **Score QC validé : 99.6%**. Aucune hallucination, respect strict de la marque et sécurité juridique garantie. Prêt pour publication ou approbation client Mode A.',
      };
      setMessages((prev) => [...prev, step4Msg]);
    }, 4200);

    setTimeout(() => {
      setActiveSimStep(5);
      const step5Msg: WarRoomMessage = {
        id: 'sim-5-' + Date.now(),
        channelId: activeChannelId,
        sender: {
          id: 'agent-manager',
          name: 'Manager Radar',
          handle: '@Manager-Radar',
          avatar: 'MR',
          isAgent: true,
          role: 'Fleet Orchestrator',
          color: 'emerald',
        },
        timestamp: timeNow(),
        content: '🚀 `[NODE 5: PIPELINE COMPLETED]` Publication API exécutée et rapport envoyé au gestionnaire. Flotte revenue en veille active.',
        reactions: [{ emoji: '🎉', count: 6, active: true }, { emoji: '🇲🇦', count: 5 }],
      };
      setMessages((prev) => [...prev, step5Msg]);
      setIsSimulating(false);
      setActiveSimStep(0);
    }, 5400);
  };

  const renderPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'google':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <Globe2 className="w-3 h-3" /> Google Maps
          </span>
        );
      case 'booking':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
            <Building2 className="w-3 h-3" /> Booking.com
          </span>
        );
      case 'tripadvisor':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> TripAdvisor
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {platform.toUpperCase()}
          </span>
        );
    }
  };

  const activeVenueObj = getVenueForIncident(selectedIncident?.venueId, selectedIncident?.venueName);

  return (
    <div className="space-y-4">
      
      {/* Top War Room Status Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                💬 AI Reputation War Room
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  SLACK-STYLE FLEET
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Espace de collaboration asynchrone multi-agents CrewAI &amp; LangGraph pour l'hôtellerie marocaine.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-400">Graphe d'états :</span>
            <span className="text-emerald-300 font-semibold">6 Agents en ligne</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-300">QC &gt; 98.4%</span>
          </div>

          <button
            onClick={runMultiAgentSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulation LangGraph ({activeSimStep}/5)...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simuler Multi-Agents (Live)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Column War Room Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[680px]">
        
        {/* LEFT COLUMN: Channels & Direct Agent Roster */}
        <div className="lg:col-span-3 glass-panel rounded-2xl border border-slate-800/90 flex flex-col overflow-hidden bg-slate-950/70">
          
          <div className="p-3.5 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
                MR
              </div>
              <div>
                <h3 className="text-xs font-bold text-white font-display">MOROCCO RADAR HQ</h3>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 6 Agents Connectés
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800">
              v2.4
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-5 no-scrollbar">
            
            {/* Channels Section */}
            <div className="space-y-1">
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Canaux de veille</span>
                <span className="text-[10px] font-mono text-slate-500">5</span>
              </div>

              {channels.map((channel) => {
                const isActive = !activeDmHandle && activeChannelId === channel.id;
                
                const channelIcon = () => {
                  switch (channel.id) {
                    case 'critical-alerts-1star':
                      return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
                    case 'review-approvals-mode-a':
                      return <CheckSquare className="w-3.5 h-3.5 text-amber-400" />;
                    case 'legal-takedowns':
                      return <Scale className="w-3.5 h-3.5 text-purple-400" />;
                    case 'billing-delegations':
                      return <CreditCard className="w-3.5 h-3.5 text-indigo-400" />;
                    default:
                      return <Hash className="w-3.5 h-3.5 text-emerald-400" />;
                  }
                };

                return (
                  <button
                    key={channel.id}
                    onClick={() => handleSelectChannel(channel.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {channelIcon()}
                      <span className="truncate">#{channel.name}</span>
                    </div>

                    {channel.unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono rounded-full">
                        {channel.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Direct Agent Roster (DMs) */}
            <div className="space-y-1">
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Roster Agents IA (DMs)</span>
                <span className="text-[10px] font-mono text-emerald-400">CrewAI + LangGraph</span>
              </div>

              {agents.map((agent) => {
                const isActive = activeDmHandle === agent.handle;
                
                const statusDot = {
                  ONLINE: 'bg-emerald-400',
                  ACTIVE: 'bg-emerald-400 animate-ping',
                  PROCESSING: 'bg-amber-400 animate-pulse',
                  STANDBY: 'bg-slate-500',
                }[agent.status];

                return (
                  <button
                    key={agent.id}
                    onClick={() => handleSelectDm(agent.handle)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-950 to-slate-900 text-white border border-emerald-700/60 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-200">
                          {agent.avatar}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-950 ${statusDot}`} />
                      </div>

                      <div className="text-left truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-200 text-xs truncate">{agent.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{agent.role.split(' ')[0]} • {agent.framework}</p>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                      {agent.accuracy}%
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Guardrails Actifs
                </span>
                <span className="font-mono text-emerald-400">98.4%</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Seuil de contrôle QC strict pour l'élimination des hallucinations et respect de la législation marocaine (Art. 447).
              </p>
            </div>

          </div>
        </div>

        {/* CENTER COLUMN: Live Incident Stream & Discussion */}
        <div className="lg:col-span-6 glass-panel rounded-2xl border border-slate-800/90 flex flex-col overflow-hidden bg-slate-950/80">
          
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                {activeDmHandle ? (
                  <>
                    <span className="font-bold text-white text-sm font-display">{currentAgent?.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                      {currentAgent?.handle}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-white text-sm font-display">{currentChannel?.displayName}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      (Canal de surveillance multi-agents)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {activeDmHandle ? currentAgent?.description : currentChannel?.topic}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrer avis, agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-36 sm:w-44"
                />
              </div>

              <button
                onClick={() => setIsRightDrawerOpen(!isRightDrawerOpen)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  isRightDrawerOpen
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Afficher/Masquer le panneau contextuel"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Incident Stream & Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px] min-h-[400px]">
            
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2">
                <Bot className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Aucun message correspondant dans ce canal.</p>
                <button
                  onClick={() => handleSendMessage('/help')}
                  className="text-xs text-emerald-400 hover:underline font-mono"
                >
                  Taper /help pour voir les commandes
                </button>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isUser = !msg.sender.isAgent;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                      msg.incidentCard ? 'bg-slate-900/40 border border-slate-800/80' : 'hover:bg-slate-900/30'
                    }`}
                  >
                    <div className="shrink-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                          isUser
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-900 border border-slate-700 text-emerald-300'
                        }`}
                      >
                        {msg.sender.avatar}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold ${isUser ? 'text-emerald-300' : 'text-slate-200'}`}>
                            {msg.sender.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 px-1 py-0.2 rounded bg-slate-950">
                            {msg.sender.handle}
                          </span>
                          {msg.sender.role && (
                            <span className="text-[10px] text-slate-400 hidden sm:inline">
                              • {msg.sender.role}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>

                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </div>

                      {/* Embedded Review Incident Card */}
                      {msg.incidentCard && (
                        <div
                          onClick={() => setSelectedIncident(msg.incidentCard!)}
                          className="mt-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3 cursor-pointer hover:border-emerald-500/50 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                                {msg.incidentCard.venueName}
                              </span>
                              <span className="text-[10px] text-slate-400">({msg.incidentCard.city})</span>
                              {renderPlatformBadge(msg.incidentCard.platform)}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-amber-400 font-bold text-xs">
                                {'★'.repeat(msg.incidentCard.rating)}
                                {'☆'.repeat(5 - msg.incidentCard.rating)}
                              </span>
                              {msg.incidentCard.isUrgent && (
                                <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold rounded animate-pulse">
                                  URGENT &lt; 2H
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                              <span>Client : <strong>{msg.incidentCard.author}</strong> ({msg.incidentCard.authorCountry})</span>
                              <span className="text-[10px] font-mono text-slate-500">{msg.incidentCard.date}</span>
                            </div>
                            <p className="text-slate-200 font-semibold text-xs">"{msg.incidentCard.title}"</p>
                            <p className="text-slate-300 text-[11px] italic leading-snug">
                              {msg.incidentCard.comment}
                            </p>
                          </div>

                          {msg.incidentCard.aiDraft && (
                            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5" /> Riposte IA Proposée ({msg.incidentCard.aiDraft.language})
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-900/60 text-emerald-300 rounded border border-emerald-700/50">
                                  Score QC : {msg.incidentCard.aiDraft.qcScore}%
                                </span>
                              </div>

                              {editingIncidentId === msg.incidentCard.id ? (
                                <div className="space-y-2 pt-1">
                                  <textarea
                                    value={customDraftText}
                                    onChange={(e) => setCustomDraftText(e.target.value)}
                                    rows={3}
                                    className="w-full p-2 bg-slate-900 border border-emerald-500/50 rounded-lg text-xs text-slate-100 focus:outline-none"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingIncidentId(null);
                                      }}
                                      className="px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                                    >
                                      Annuler
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveCustomDraft(msg.incidentCard!.id);
                                      }}
                                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                                    >
                                      Enregistrer retouches
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-slate-200 text-xs leading-relaxed">
                                  {msg.incidentCard.aiDraft.content}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-1 pt-1">
                                <span className="text-[10px] text-slate-400">SEO Injecté :</span>
                                {msg.incidentCard.aiDraft.seoKeywords.map((kw, i) => (
                                  <span key={i} className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-900 text-slate-300 rounded border border-slate-800">
                                    #{kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {msg.incidentCard.legalDefamation && (
                            <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs space-y-1">
                              <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                                <Scale className="w-3.5 h-3.5" /> Motif Juridique : {msg.incidentCard.legalDefamation.article}
                              </span>
                              <p className="text-[11px] text-slate-300">
                                {msg.incidentCard.legalDefamation.violationType}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {msg.incidentCard.status === 'PUBLISHED' ? (
                              <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Publié sur {msg.incidentCard.platform.toUpperCase()}
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveResponse(msg.incidentCard!.id);
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg text-xs font-bold shadow transition-all"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>✅ Valider &amp; Publier</span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestEdit(msg.incidentCard!);
                                  }}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all"
                                >
                                  <Edit3 className="w-3 h-3 text-amber-400" />
                                  <span>✍️ Retouche Darija/FR</span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTriggerDefamation(msg.incidentCard!);
                                  }}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-medium transition-all"
                                >
                                  <Scale className="w-3 h-3 text-rose-400" />
                                  <span>⚖️ Diffamation Art. 447</span>
                                </button>
                              </>
                            )}
                          </div>

                        </div>
                      )}

                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {msg.reactions.map((r, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleToggleReaction(msg.id, r.emoji)}
                              className={`px-2 py-0.5 rounded-full text-[11px] font-mono flex items-center gap-1 border transition-all ${
                                r.active
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <span>{r.emoji}</span>
                              <span>{r.count}</span>
                            </button>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex items-center gap-2 p-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>@{typingAgent} est en train d'écrire...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Chat Input & Slash Command Bar */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950 relative">
            
            {showSlashMenu && (
              <div className="absolute bottom-full left-3 right-3 mb-2 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl space-y-1 z-30 max-h-56 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 font-mono">
                  Commandes Slash Disponibles (War Room)
                </div>
                {SLASH_COMMANDS.map((cmd) => (
                  <button
                    key={cmd.command}
                    onClick={() => {
                      setInputText(cmd.example);
                      setShowSlashMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-emerald-400 font-mono">{cmd.syntax}</span>
                      <p className="text-[11px] text-slate-400">{cmd.description}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Ex: {cmd.example}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1.5 pb-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSendMessage('/audit "La Mamounia"')}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
              >
                🔍 /audit "La Mamounia"
              </button>
              <button
                onClick={() => handleSendMessage('/invoice generate "Riad Kasbah" Pro_Tier')}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
              >
                💼 /invoice generate
              </button>
              <button
                onClick={() => handleSendMessage('/simulate')}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
              >
                ⚡ /simulate
              </button>
              <button
                onClick={() => handleSendMessage('/help')}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
              >
                ❓ /help
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSlashMenu(!showSlashMenu)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-mono font-bold"
                title="Ouvrir menu commandes slash (/)"
              >
                /
              </button>

              <input
                type="text"
                placeholder={
                  activeDmHandle
                    ? `Envoyer une consigne à ${currentAgent?.name}... (ou taper /)`
                    : `Message dans #${currentChannel?.name}... (ou /audit, /invoice)`
                }
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (e.target.value === '/') {
                    setShowSlashMenu(true);
                  } else if (!e.target.value.startsWith('/')) {
                    setShowSlashMenu(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Venue Context & Quick Approval Drawer */}
        {isRightDrawerOpen && (
          <div className="lg:col-span-3 glass-panel rounded-2xl border border-slate-800/90 flex flex-col overflow-hidden bg-slate-950/70">
            
            <div className="p-3.5 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white font-display">Contexte Établissement</h3>
              </div>

              <button
                onClick={() => setIsRightDrawerOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">{activeVenueObj.name}</h4>
                    <p className="text-[10px] text-slate-400">{activeVenueObj.category} • {activeVenueObj.city}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    ★ {activeVenueObj.overallScore}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Avis Non Répondus</span>
                    <span className="font-bold text-rose-400 font-mono text-sm">{activeVenueObj.unrepliedReviews}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Perte Estimée/an</span>
                    <span className="font-bold text-amber-400 font-mono text-xs">{(activeVenueObj.annualLossMAD / 1000).toFixed(0)}k MAD</span>
                  </div>
                </div>
              </div>

              {/* Platform Health Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Santé 5-Plateformes
                </span>

                <div className="space-y-1.5">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-blue-400" /> Google Maps
                    </span>
                    <span className="font-mono text-white font-bold">{activeVenueObj.platforms.google.score}★</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Booking.com
                    </span>
                    <span className="font-mono text-white font-bold">{activeVenueObj.platforms.booking.score}★</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> TripAdvisor
                    </span>
                    <span className="font-mono text-white font-bold">{activeVenueObj.platforms.tripadvisor.score}★</span>
                  </div>
                </div>
              </div>

              {/* Delegation & Agency Credentials Box */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Mandat &amp; Facturation
                </span>

                <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                  <p>Compte Délégué : <strong className="text-slate-200">tiguidda76@gmail.com</strong></p>
                  <p>RIB BMCE : <strong className="text-emerald-400">007450001399370030009822</strong></p>
                  <p>ICE : <strong className="text-slate-200">{AGENCY_METADATA.ice}</strong></p>
                </div>
              </div>

              {/* Legal Shield Reference Box */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-400" /> Bouclier Légal Maroc
                </span>
                <p className="text-[10px] text-slate-300 leading-snug">
                  Article 447-1 &amp; 447-2 : Protection contre les avis frauduleux, chantages et campagnes de diffamation commerciale.
                </p>
              </div>

              {/* Quick Actions Triggers */}
              <div className="space-y-2 pt-2">
                {onOpenAudit && (
                  <button
                    onClick={() => onOpenAudit(activeVenueObj)}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Ouvrir Audit 5P Détaillé</span>
                  </button>
                )}

                {onSelectPlanForInvoice && (
                  <button
                    onClick={() =>
                      onSelectPlanForInvoice({
                        id: 'professional',
                        name: 'Pack Professional Riad',
                        tagline: 'Multi-plateformes & IA',
                        priceMADMonthly: 1500,
                        priceMADAnnual: 15000,
                        priceEUR: 140,
                        targetAudience: 'Riads & Restaurants',
                        features: ['Scraping 5P', 'Réponses Darija/FR', 'Garantie QC 98.4%'],
                        platformsIncluded: 'Google, Booking, TripAdvisor',
                        responseTimeSLA: '< 2h',
                        supportLevel: 'Prioritaire',
                      })
                    }
                    className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Éditer Devis Pro Forma BMCE</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
