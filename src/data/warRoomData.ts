import { PlatformType, ThreatLevel } from '../types';

export interface WarRoomAgent {
  id: string;
  name: string;
  handle: string; // e.g. @Manager-Radar
  role: string;
  avatar: string; // icon or acronym
  color: string;
  framework: 'LangGraph' | 'CrewAI';
  status: 'ONLINE' | 'ACTIVE' | 'PROCESSING' | 'STANDBY';
  tasksCompleted: number;
  accuracy: number;
  avgLatencyMs: number;
  currentTask: string;
  description: string;
  specialty: string;
}

export interface IncidentCardData {
  id: string;
  venueId: string;
  venueName: string;
  city: string;
  category: string;
  platform: PlatformType;
  author: string;
  authorCountry: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  sentiment: 'Negative' | 'Neutral' | 'Positive';
  threatLevel: ThreatLevel;
  slaRemaining?: string; // e.g. "42m restant (<2h SLA)"
  isUrgent?: boolean;
  status: 'PENDING_APPROVAL' | 'PUBLISHED' | 'EDIT_REQUESTED' | 'TAKEDOWN_TRIGGERED';
  aiDraft?: {
    language: 'FR' | 'DARIJA' | 'EN';
    tone: string;
    content: string;
    seoKeywords: string[];
    qcScore: number;
    empathyScore: number;
    brandVoiceScore: number;
    legalSafetyScore: number;
    generatedAt: string;
  };
  legalDefamation?: {
    article: string;
    violationType: string;
    summary: string;
    recommendedAction: string;
  };
  billingContext?: {
    planTier: string;
    amountMAD: number;
    accountEmail: string;
    rib: string;
    status: string;
  };
}

export interface WarRoomMessage {
  id: string;
  channelId?: string;
  recipientHandle?: string; // for DMs e.g. '@Manager-Radar'
  sender: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    isAgent: boolean;
    role?: string;
    color?: string;
  };
  timestamp: string;
  content: string;
  incidentCard?: IncidentCardData;
  reactions?: { emoji: string; count: number; active?: boolean }[];
  threadCount?: number;
  badge?: string;
  isSystem?: boolean;
}

export interface WarRoomChannel {
  id: string;
  name: string; // e.g. all-venues-feed
  displayName: string;
  topic: string;
  unreadCount: number;
  category: 'CHANNELS' | 'DIRECT_MESSAGES';
  icon: string;
  isPrivate?: boolean;
}

export const WAR_ROOM_AGENTS: WarRoomAgent[] = [
  {
    id: 'agent-manager',
    name: 'Manager Radar',
    handle: '@Manager-Radar',
    role: 'Autonomous Fleet Orchestrator & Dispatcher',
    avatar: 'MR',
    color: 'emerald',
    framework: 'LangGraph',
    status: 'ACTIVE',
    tasksCompleted: 4820,
    accuracy: 99.8,
    avgLatencyMs: 120,
    currentTask: 'Orchestration active : 68 Riads & Palaces surveillés en temps réel',
    description: 'Chef d\'orchestre autonome du graphe d\'états. Dispatche les audits, coordonne la rédaction et valide les pipelines.',
    specialty: 'Orchestration déterministe & routage de crise',
  },
  {
    id: 'agent-auditor',
    name: 'Auditor Agent',
    handle: '@Auditor-Agent',
    role: 'Multi-Platform Stealth Scraper & Parser',
    avatar: 'AA',
    color: 'amber',
    framework: 'CrewAI',
    status: 'ACTIVE',
    tasksCompleted: 9410,
    accuracy: 99.4,
    avgLatencyMs: 410,
    currentTask: 'Scraping furtif Google Maps, TripAdvisor & Booking.com (Marrakech, Fès, Tanger)',
    description: 'Scrape furtivement les avis 5-étoiles à 1-étoile sans blocage antibot avec détection de sentiment bilingue.',
    specialty: 'Scraping furtif multi-plateformes & alertes temps réel',
  },
  {
    id: 'agent-reply',
    name: 'Reply Rescue',
    handle: '@Reply-Rescue',
    role: 'Moroccan Hospitality Copywriter & SEO Calibrator',
    avatar: 'RR',
    color: 'sky',
    framework: 'LangGraph',
    status: 'ACTIVE',
    tasksCompleted: 7150,
    accuracy: 99.1,
    avgLatencyMs: 280,
    currentTask: 'Rédaction calibrée : Chaleur d\'accueil marocaine + SEO géociblé',
    description: 'Rédige des réponses empathiques et professionnelles en Français, Darija et Anglais avec injection de mots-clés SEO locaux.',
    specialty: 'Copywriting hôtelier marocain, Darija & SEO local',
  },
  {
    id: 'agent-qc',
    name: 'QC Reviewer',
    handle: '@QC-Reviewer',
    role: 'Tone Safety & Brand Compliance Auditor',
    avatar: 'QC',
    color: 'emerald',
    framework: 'LangGraph',
    status: 'ONLINE',
    tasksCompleted: 6890,
    accuracy: 99.9,
    avgLatencyMs: 95,
    currentTask: 'Garde-fou actif : Validation stricte seuil QC > 98.4% (Zéro hallucination)',
    description: 'Vérifie chaque réponse générée avant publication. Évalue le ton de marque, l\'empathie, et la conformité légale.',
    specialty: 'Guardrails anti-hallucination & seuil 98.4%',
  },
  {
    id: 'agent-legal',
    name: 'Legal Shield',
    handle: '@Legal-Shield',
    role: 'Moroccan Defamation & Art. 447 Escalation Officer',
    avatar: 'LS',
    color: 'rose',
    framework: 'CrewAI',
    status: 'ACTIVE',
    tasksCompleted: 840,
    accuracy: 99.7,
    avgLatencyMs: 320,
    currentTask: 'Veille juridique Art. 447 du Code Pénal Marocain & constitution de preuves d\'atteinte à la réputation',
    description: 'Détecte les avis diffamatoires, concurrents malveillants ou faux clients pour déclencher des mises en demeure formelles.',
    specialty: 'Droit numérique marocain & suppression d\'avis frauduleux',
  },
  {
    id: 'agent-billing',
    name: 'Billing Officer',
    handle: '@Billing-Officer',
    role: 'Pro Forma & Delegation Manager (RIB & Retainers)',
    avatar: 'BO',
    color: 'indigo',
    framework: 'LangGraph',
    status: 'ONLINE',
    tasksCompleted: 1250,
    accuracy: 100,
    avgLatencyMs: 110,
    currentTask: 'Gestion des invitations déléguées (tiguidda76@gmail.com) & devis Pro Forma BMCE',
    description: 'Automatise le suivi des abonnements mensuels, devis conformes ICE 1161674000043 et coordonnées bancaires BMCE.',
    specialty: 'Facturation légale marocaine & délégation Google/OTA',
  },
];

export const WAR_ROOM_CHANNELS: WarRoomChannel[] = [
  {
    id: 'all-venues-feed',
    name: 'all-venues-feed',
    displayName: '# all-venues-feed',
    topic: 'Flux centralisé de surveillance temps réel pour l\'ensemble des Riads, Palaces et Restaurants suivis.',
    unreadCount: 3,
    category: 'CHANNELS',
    icon: 'Hash',
  },
  {
    id: 'critical-alerts-1star',
    name: 'critical-alerts-1star',
    displayName: '# critical-alerts-1star',
    topic: 'Alertes urgentes 1★ nécessitant une intervention immédiate (< 2h SLA) pour stopper l\'érosion de réputation.',
    unreadCount: 2,
    category: 'CHANNELS',
    icon: 'AlertTriangle',
  },
  {
    id: 'review-approvals-mode-a',
    name: 'review-approvals-mode-a',
    displayName: '# review-approvals-mode-a',
    topic: 'File de validation humaine (Mode A / HITL) avant injection API vers Google Business Profile, Booking et TripAdvisor.',
    unreadCount: 4,
    category: 'CHANNELS',
    icon: 'CheckSquare',
  },
  {
    id: 'legal-takedowns',
    name: 'legal-takedowns',
    displayName: '# legal-takedowns',
    topic: 'Cellule de crise juridique : Signalements d\'avis diffamatoires & procédures sous l\'Art. 447 du Code Pénal Marocain.',
    unreadCount: 1,
    category: 'CHANNELS',
    icon: 'Scale',
  },
  {
    id: 'billing-delegations',
    name: 'billing-delegations',
    displayName: '# billing-delegations',
    topic: 'Accès gestionnaires Google/Booking (tiguidda76@gmail.com), mandats et virements RIB 007450001399370030009822.',
    unreadCount: 0,
    category: 'CHANNELS',
    icon: 'CreditCard',
  },
];

export const INITIAL_WAR_ROOM_MESSAGES: WarRoomMessage[] = [
  // Channel: #all-venues-feed
  {
    id: 'msg-all-1',
    channelId: 'all-venues-feed',
    sender: {
      id: 'agent-manager',
      name: 'Manager Radar',
      handle: '@Manager-Radar',
      avatar: 'MR',
      isAgent: true,
      role: 'Fleet Orchestrator',
      color: 'emerald',
    },
    timestamp: '11:15',
    content: '⚡ **Cycle de scan automatique terminé (Lot #14 - Marrakech Médina & Guéliz)**. 14 établissements audités en 4.2s. 1 alerte critique détectée chez **Riad Kasbah & Spa** (TripAdvisor 2★) et 1 avis 1★ chez **La Mamounia** (Google Maps). @Auditor-Agent et @Reply-Rescue ont pris en charge les flux.',
    reactions: [{ emoji: '👀', count: 3, active: true }, { emoji: '⚡', count: 5 }],
  },
  {
    id: 'msg-all-2',
    channelId: 'all-venues-feed',
    sender: {
      id: 'agent-auditor',
      name: 'Auditor Agent',
      handle: '@Auditor-Agent',
      avatar: 'AA',
      isAgent: true,
      role: 'Scraper & Parser',
      color: 'amber',
    },
    timestamp: '11:21',
    content: '🔍 **Avis Google Maps intercepté pour La Mamounia Marrakech**. Problème de check-in suite de luxe. Gravité : Élevée. Score global de l\'établissement : 4.8/5. Score de perte estimé à 380 000 MAD/an sans réponse.',
    incidentCard: {
      id: 'inc-101',
      venueId: 'venue-1',
      venueName: 'La Mamounia Marrakech',
      city: 'Marrakech',
      category: 'Palace 5-Star',
      platform: 'google',
      author: 'Sir Edward Sterling',
      authorCountry: 'Royaume-Uni 🇬🇧',
      rating: 1,
      date: 'Aujourd\'hui à 11:20',
      title: 'Check-in delay at the Pavilion Suite',
      comment: 'We waited 45 minutes for our suite key upon arrival despite guaranteed 3 PM check-in. The concierge seemed overwhelmed and offered no tea while waiting. Expected royal treatment given the €1,200/night rate.',
      sentiment: 'Negative',
      threatLevel: 'MODERATE',
      slaRemaining: '1h 35m restant (< 2h SLA)',
      isUrgent: true,
      status: 'PENDING_APPROVAL',
      aiDraft: {
        language: 'EN',
        tone: 'Royal Palace Prestige',
        content: 'Dear Sir Edward, We offer our deepest and most sincere apologies for falling short of the legendary palace hospitality you rightfully expected at La Mamounia. Waiting 45 minutes for your suite is unacceptable by our standards. We have personally briefed our Head Concierge and General Management team. Kindly allow us to invite you for a signature tea ceremony in our Menzeh gardens on your next visit, or contact our VIP Relations Manager directly at gm-relations@mamounia.com. With highest regards, La Mamounia Guest Experience Directorate.',
        seoKeywords: ['palace hospitality Marrakech', 'La Mamounia gardens', 'VIP relations', 'luxury suite check-in'],
        qcScore: 99.4,
        empathyScore: 99,
        brandVoiceScore: 100,
        legalSafetyScore: 100,
        generatedAt: '2026-08-23 11:24',
      },
    },
    reactions: [{ emoji: '🛎️', count: 4 }],
  },
  {
    id: 'msg-all-3',
    channelId: 'all-venues-feed',
    sender: {
      id: 'agent-reply',
      name: 'Reply Rescue',
      handle: '@Reply-Rescue',
      avatar: 'RR',
      isAgent: true,
      role: 'Copywriter & SEO',
      color: 'sky',
    },
    timestamp: '11:25',
    content: '✍️ Brouillon rédigé en Anglais avec respect scrupuleux du protocole Palace 5-Étoiles. Les mots-clés SEO *"palace hospitality Marrakech"* et *"La Mamounia gardens"* ont été calibrés. @QC-Reviewer, peux-tu valider le score de conformité ?',
    reactions: [{ emoji: '👌', count: 2 }],
  },
  {
    id: 'msg-all-4',
    channelId: 'all-venues-feed',
    sender: {
      id: 'agent-qc',
      name: 'QC Reviewer',
      handle: '@QC-Reviewer',
      avatar: 'QC',
      isAgent: true,
      role: 'QC Auditor',
      color: 'emerald',
    },
    timestamp: '11:26',
    content: '✅ **Audit QC Validé : 99.4%** (Seuil requis > 98.4%). Tone Compliance: 100%, Brand Voice: 100%, Legal Safety: 100%, Empathie: 99%. Prêt pour approbation dans #review-approvals-mode-a.',
    reactions: [{ emoji: '🚀', count: 4, active: true }],
  },

  // Channel: #critical-alerts-1star
  {
    id: 'msg-crit-1',
    channelId: 'critical-alerts-1star',
    sender: {
      id: 'agent-manager',
      name: 'Manager Radar',
      handle: '@Manager-Radar',
      avatar: 'MR',
      isAgent: true,
      role: 'Fleet Orchestrator',
      color: 'emerald',
    },
    timestamp: '09:42',
    content: '🚨 **ALERTE ROUGE CRITIQUE (SLA < 2H)** : Avis 1★ publié sur Google Maps pour **Café Clock Fès**. Client local mécontent du temps d\'attente. Impact immédiat sur le référencement Local Pack.',
    incidentCard: {
      id: 'inc-104',
      venueId: 'venue-4',
      venueName: 'Café Clock Fès',
      city: 'Fès',
      category: 'Restaurant Gastronomique',
      platform: 'google',
      author: 'Hamza El Fassi',
      authorCountry: 'Maroc 🇲🇦',
      rating: 1,
      date: 'Aujourd\'hui à 09:30',
      title: 'Service trop lent et burger de chameau froid',
      comment: 'Khedma t3tlat bzzaf (plus de 50 minutes d\'attente). Le fameux camel burger est arrivé froid et les frites molles. Dommage pour un lieu historique réputé.',
      sentiment: 'Negative',
      threatLevel: 'CRITICAL',
      slaRemaining: '45m restant (< 2h SLA)',
      isUrgent: true,
      status: 'PENDING_APPROVAL',
      aiDraft: {
        language: 'DARIJA',
        tone: 'Hospitalité & Respect Marocain',
        content: 'Salam Si Hamza, Smhlina bzzaf 3la had tajriba li machi f lmostawa dyal Café Clock. 50 dqiqa dyal l\'attente w l-camel burger ibred machi ma9boula 3ndna. Drna réunion m3a l-chef cuisinier w l-equipe dyal service bach n-dbtou l-cadence. Marhba bik f ay wa9t n-3wdou lik had l-repas w n-diwk l-terrasse panoramic t-chouf l-médina dyal Fès 3la 7ssabna. Tassel bina direct. Choukran 3la saraha dyalk!',
        seoKeywords: ['camel burger Fès', 'Café Clock Médina Talaa Kebira', 'restaurant culturel Fès', 'hospitalité fassie'],
        qcScore: 98.9,
        empathyScore: 100,
        brandVoiceScore: 99,
        legalSafetyScore: 100,
        generatedAt: '2026-08-23 09:35',
      },
    },
    reactions: [{ emoji: '🔥', count: 5, active: true }, { emoji: '🇲🇦', count: 6 }],
  },
  {
    id: 'msg-crit-2',
    channelId: 'critical-alerts-1star',
    sender: {
      id: 'agent-reply',
      name: 'Reply Rescue',
      handle: '@Reply-Rescue',
      avatar: 'RR',
      isAgent: true,
      role: 'Copywriter & SEO',
      color: 'sky',
    },
    timestamp: '09:45',
    content: '🛡️ Réponse rédigée en **Darija soignée & respectueuse** (*Salam Si Hamza...*), avec invitation personnalisée sur la terrasse panoramique de Talaa Kebira pour désamorcer l\'insatisfaction en direct.',
    reactions: [{ emoji: '👍', count: 3 }],
  },

  // Channel: #review-approvals-mode-a
  {
    id: 'msg-appr-1',
    channelId: 'review-approvals-mode-a',
    sender: {
      id: 'agent-manager',
      name: 'Manager Radar',
      handle: '@Manager-Radar',
      avatar: 'MR',
      isAgent: true,
      role: 'Fleet Orchestrator',
      color: 'emerald',
    },
    timestamp: '10:05',
    content: '📋 **File d\'attente Mode A (Human-in-the-Loop)** : 2 réponses en attente de clic d\'approbation avant injection API directe vers TripAdvisor et Booking.com.',
  },
  {
    id: 'msg-appr-2',
    channelId: 'review-approvals-mode-a',
    sender: {
      id: 'agent-reply',
      name: 'Reply Rescue',
      handle: '@Reply-Rescue',
      avatar: 'RR',
      isAgent: true,
      role: 'Copywriter & SEO',
      color: 'sky',
    },
    timestamp: '10:08',
    content: 'Incident TripAdvisor pour **Riad Kasbah & Spa** (Marrakech Médina). Plainte sur le bruit de pompe à eau et le petit-déjeuner tiède.',
    incidentCard: {
      id: 'inc-102',
      venueId: 'venue-2',
      venueName: 'Riad Kasbah & Spa',
      city: 'Marrakech',
      category: 'Riad de Luxe',
      platform: 'tripadvisor',
      author: 'Julien & Céline Fontaine',
      authorCountry: 'France 🇫🇷',
      rating: 2,
      date: 'Hier à 19:45',
      title: 'Bruit de pompe à eau et petit déjeuner tiède',
      comment: 'Le patio est magnifique avec les orangers, mais notre chambre au rez-de-chaussée subissait le bruit incessant de la pompe de piscine toute la nuit. Le petit déjeuner servi à 9h était froid. Déçus pour un séjour romantique.',
      sentiment: 'Negative',
      threatLevel: 'CRITICAL',
      slaRemaining: '1h 10m restant',
      isUrgent: false,
      status: 'PENDING_APPROVAL',
      aiDraft: {
        language: 'FR',
        tone: 'Chaleur Riad Traditionnel & Empathie',
        content: 'Chers Julien et Céline, Merci du fond du cœur pour votre franchise. Nous sommes sincèrement désolés que la tranquillité de votre escapade en amoureux ait été perturbée par ce souci technique sur la filtration du patio. Notre technicien est intervenu immédiatement ce matin pour insonoriser le caisson. Quant à notre petit-déjeuner fassi traditionnel (msemen chauds, jus d\'orange pressé minute et thé à la menthe frais), nous avons recadré l\'équipe cuisine pour que la chaleur de l\'accueil soit irréprochable. Nous serions honorés de vous offrir un surclassement en suite terrasse lors de votre prochain passage à Marrakech. Chaleureusement, Si Mohamed & l\'équipe du Riad Kasbah.',
        seoKeywords: ['riad authentique médina Marrakech', 'séjour romantique Marrakech', 'petit déjeuner marocain traditionnel', 'suite terrasse'],
        qcScore: 98.8,
        empathyScore: 99,
        brandVoiceScore: 98,
        legalSafetyScore: 100,
        generatedAt: '2026-08-23 08:30',
      },
    },
    reactions: [{ emoji: '🍊', count: 3 }],
  },

  // Channel: #legal-takedowns
  {
    id: 'msg-leg-1',
    channelId: 'legal-takedowns',
    sender: {
      id: 'agent-legal',
      name: 'Legal Shield',
      handle: '@Legal-Shield',
      avatar: 'LS',
      isAgent: true,
      role: 'Legal Escalation Officer',
      color: 'rose',
    },
    timestamp: '08:15',
    content: '⚖️ **Dossier de Diffamation Ouvert : Article 447-1 & 447-2 du Code Pénal Marocain**. Faux avis diffamatoire identifié sur **Snack Oasis Casablanca**. Compte anonyme suspecté d\'être un concurrent direct du boulevard Zerktouni.',
    incidentCard: {
      id: 'inc-def-1',
      venueId: 'venue-5',
      venueName: 'Snack Oasis Casablanca',
      city: 'Casablanca',
      category: 'Snack & Café Traditionnel',
      platform: 'google',
      author: 'Anonyme_Casa_2026',
      authorCountry: 'Maroc 🇲🇦',
      rating: 1,
      date: 'Hier à 22:10',
      title: 'INTOXICATION ALIMENTAIRE MENSONGÈRE',
      comment: 'Viande avariée et cafards dans la cuisine ! Toute ma famille a fini à l\'hôpital Ibn Rochd. Fuyez cet endroit illégal !',
      sentiment: 'Negative',
      threatLevel: 'CRITICAL',
      status: 'PENDING_APPROVAL',
      legalDefamation: {
        article: 'Article 447-1 & 447-2 du Code Pénal Marocain (Loi 103-13)',
        violationType: 'Diffamation commerciale, allégation mensongère sans certificat médical ni preuve d\'achat',
        summary: 'Atteinte délibérée à l\'honneur et à la réputation commerciale d\'une personne morale / auto-entrepreneur.',
        recommendedAction: 'Génération de mise en demeure formelle et signalement Google Business Profile sous le motif "Contenu diffamatoire / fausse expérience".',
      },
    },
    reactions: [{ emoji: '⚖️', count: 7, active: true }, { emoji: '🛡️', count: 4 }],
  },
  {
    id: 'msg-leg-2',
    channelId: 'legal-takedowns',
    sender: {
      id: 'agent-manager',
      name: 'Manager Radar',
      handle: '@Manager-Radar',
      avatar: 'MR',
      isAgent: true,
      role: 'Fleet Orchestrator',
      color: 'emerald',
    },
    timestamp: '08:20',
    content: 'Dossier prêt. La mise en demeure juridique peut être prévisualisée et exportée au format PDF officiel avec entête légale de l\'Agence Morocco Radar.',
    reactions: [{ emoji: '📄', count: 2 }],
  },

  // Channel: #billing-delegations
  {
    id: 'msg-bill-1',
    channelId: 'billing-delegations',
    sender: {
      id: 'agent-billing',
      name: 'Billing Officer',
      handle: '@Billing-Officer',
      avatar: 'BO',
      isAgent: true,
      role: 'Delegation & Retainer Manager',
      color: 'indigo',
    },
    timestamp: '09:00',
    content: '💼 **État des Délégations & Mandats de Gestion (Google Business Profile & OTA)** :\n- Compte délégué certifié : `tiguidda76@gmail.com`\n- Établissements avec accès gestionnaire complet : **18/24**\n- Facturation mensuelle en cours : Rétribution via virement BMCE Bank (RIB `007450001399370030009822`).\n- Clause fiscale active : *Montant en dirhams exonéré de la TVA (Art 91 - II - 1° du CGI)*.',
    incidentCard: {
      id: 'inc-bill-1',
      venueId: 'venue-1',
      venueName: 'La Mamounia Marrakech',
      city: 'Marrakech',
      category: 'Palace 5-Star',
      platform: 'google',
      author: 'Direction Financière',
      authorCountry: 'Maroc 🇲🇦',
      rating: 5,
      date: 'Août 2026',
      title: 'Contrat Retainer VIP - Renouvellement Annuel',
      comment: 'Mandat de gestion e-réputation et flotte multi-agents IA. Délégation GBP et Booking accordée à tiguidda76@gmail.com.',
      sentiment: 'Positive',
      threatLevel: 'HEALTHY',
      status: 'PUBLISHED',
      billingContext: {
        planTier: 'Pack Palace VIP & Crise (4 500 MAD / mois)',
        amountMAD: 4500,
        accountEmail: 'tiguidda76@gmail.com',
        rib: '007450001399370030009822 (BMCE Guéliz)',
        status: 'Contrat Actif • Retainer Payé',
      },
    },
    reactions: [{ emoji: '💼', count: 3, active: true }, { emoji: '🇲🇦', count: 4 }],
  },
];

export const INITIAL_DM_MESSAGES: Record<string, WarRoomMessage[]> = {
  '@Manager-Radar': [
    {
      id: 'dm-mr-1',
      recipientHandle: '@Manager-Radar',
      sender: {
        id: 'agent-manager',
        name: 'Manager Radar',
        handle: '@Manager-Radar',
        avatar: 'MR',
        isAgent: true,
        role: 'Fleet Orchestrator',
        color: 'emerald',
      },
      timestamp: '10:00',
      content: 'Salam Hassan ! Je suis **@Manager-Radar**, ton orchestrateur de flotte IA. Je supervise les agents Auditor, Reply Rescue, QC Reviewer, Legal Shield et Billing Officer. Tu peux me donner des instructions directes ou exécuter des commandes slash comme `/simulate`, `/status` ou `/audit "Nom Établissement"`. En quoi puis-je t\'assister ?',
      reactions: [{ emoji: '👋', count: 1 }],
    },
  ],
  '@Auditor-Agent': [
    {
      id: 'dm-aa-1',
      recipientHandle: '@Auditor-Agent',
      sender: {
        id: 'agent-auditor',
        name: 'Auditor Agent',
        handle: '@Auditor-Agent',
        avatar: 'AA',
        isAgent: true,
        role: 'Scraper & Parser',
        color: 'amber',
      },
      timestamp: '10:02',
      content: '🔍 Prêt pour toute mission d\'extraction de données. J\'interroge Google Maps, TripAdvisor, Booking.com et Airbnb avec rotation d\'IPs marocaines et zéro risque de blocage. Lance `/audit "Nom Riad"` pour déclencher un crawl complet.',
    },
  ],
  '@Reply-Rescue': [
    {
      id: 'dm-rr-1',
      recipientHandle: '@Reply-Rescue',
      sender: {
        id: 'agent-reply',
        name: 'Reply Rescue',
        handle: '@Reply-Rescue',
        avatar: 'RR',
        isAgent: true,
        role: 'Hospitality Copywriter',
        color: 'sky',
      },
      timestamp: '10:04',
      content: '✍️ Marhaban ! Je rédige les réponses les plus diplomates et chaleureuses du secteur hôtelier marocain, en Français raffiné, Darija chaleureuse ou Anglais international. Envoie-moi n\'importe quel avis négatif et je te prépare un brouillon calibré.',
    },
  ],
  '@QC-Reviewer': [
    {
      id: 'dm-qc-1',
      recipientHandle: '@QC-Reviewer',
      sender: {
        id: 'agent-qc',
        name: 'QC Reviewer',
        handle: '@QC-Reviewer',
        avatar: 'QC',
        isAgent: true,
        role: 'QC Auditor',
        color: 'emerald',
      },
      timestamp: '10:06',
      content: '🛡️ Audit guardrails actif. Seuil de tolérance : **98.4% minimum**. Je passe au crible chaque réponse pour éliminer toute hallucination, promesse non tenue ou incohérence de ton.',
    },
  ],
  '@Legal-Shield': [
    {
      id: 'dm-ls-1',
      recipientHandle: '@Legal-Shield',
      sender: {
        id: 'agent-legal',
        name: 'Legal Shield',
        handle: '@Legal-Shield',
        avatar: 'LS',
        isAgent: true,
        role: 'Legal Escalation Officer',
        color: 'rose',
      },
      timestamp: '10:08',
      content: '⚖️ Cellule juridique prête. En cas de diffamation, de chantage à l\'avis négatif ou de faux avis concurrentiel, j\'active l\'Article 447 du Code Pénal Marocain pour exiger le retrait immédiat sous peine de poursuites.',
    },
  ],
  '@Billing-Officer': [
    {
      id: 'dm-bo-1',
      recipientHandle: '@Billing-Officer',
      sender: {
        id: 'agent-billing',
        name: 'Billing Officer',
        handle: '@Billing-Officer',
        avatar: 'BO',
        isAgent: true,
        role: 'Billing & Retainers',
        color: 'indigo',
      },
      timestamp: '10:10',
      content: '💼 Gestionnaire de mandats et facturation. Compte de délégation : `tiguidda76@gmail.com`. RIB BMCE : `007450001399370030009822`. Tape `/invoice generate "Riad Kasbah" Pro_Tier` pour éditer un devis instantanément.',
    },
  ],
};

export interface SlashCommandDef {
  command: string;
  syntax: string;
  description: string;
  example: string;
}

export const SLASH_COMMANDS: SlashCommandDef[] = [
  {
    command: '/audit',
    syntax: '/audit "<Nom Établissement>"',
    description: 'Déclenche un audit furtif 5-plateformes via @Auditor-Agent',
    example: '/audit "La Mamounia"',
  },
  {
    command: '/invoice',
    syntax: '/invoice generate "<Nom Établissement>" <starter|pro|vip>',
    description: 'Génère un devis Pro Forma BMCE via @Billing-Officer',
    example: '/invoice generate "Riad Kasbah" Pro_Tier',
  },
  {
    command: '/simulate',
    syntax: '/simulate',
    description: 'Simule l\'exécution en direct du pipeline multi-agents LangGraph',
    example: '/simulate',
  },
  {
    command: '/takedown',
    syntax: '/takedown "<Nom Établissement>"',
    description: 'Active l\'escalade juridique Art. 447 via @Legal-Shield',
    example: '/takedown "Snack Oasis Casablanca"',
  },
  {
    command: '/qc',
    syntax: '/qc check',
    description: 'Audite la conformité globale de la file de réponses via @QC-Reviewer',
    example: '/qc check',
  },
  {
    command: '/clear',
    syntax: '/clear',
    description: 'Réinitialise les messages du canal actif',
    example: '/clear',
  },
  {
    command: '/help',
    syntax: '/help',
    description: 'Affiche la liste des commandes et raccourcis de la War Room',
    example: '/help',
  },
];
