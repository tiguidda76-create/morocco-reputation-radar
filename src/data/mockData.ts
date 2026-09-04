import { Venue, AgentInfo, AgentLog, PricingPlan, DefamationCase, ReviewItem } from '../types';

export const AGENCY_METADATA = {
  entity: 'AUTO-ENTREPRENEUR HASSAN TIGUIDDA',
  brandName: 'MOROCCO RADAR (Morocco Reputation Agency)',
  ice: '1161674000043',
  address: 'Les portes de Marrakech Zone 16 imm 118 app 03 Marrakech, Maroc',
  city: 'Marrakech',
  country: 'Maroc',
  phone: '0632155430',
  internationalPhone: '+212 632 155 430',
  email: 'tiguidda76@gmail.com',
  website: 'https://morocco-radar.agency',
  bankName: 'BMCE Bank / BANK OF AFRICA',
  bankBranch: 'Marrakech Guéliz',
  rib: '007450001399370030009822',
  swift: 'BCMAMAMC',
  taxExemptionClause: 'Montant en dirhams exonéré de la TVA (Art 91 - II - 1° du Code Général des Impôts)',
  rcNumber: 'MAR-2024-AE-48190',
  patentNumber: '45189033',
};

export { INITIAL_VENUES, REAL_VERIFIED_VENUES, generateFullMoroccoVenuesCatalog } from './moroccoVenuesCatalog';

export const FLEET_AGENTS: AgentInfo[] = [
  {
    id: 'agent-planner',
    name: 'Planner Agent',
    role: 'Lead Priority Indexer & Hierarchical Task Dispatcher',
    framework: 'CrewAI',
    icon: 'Brain',
    status: 'ACTIVE',
    tasksCompleted: 14820,
    currentTask: 'Surveillance des avis critiques des établissements réels',
    avgLatencyMs: 240,
    tokenCount: 482000,
    accuracy: 99.8,
    description: 'Calcul des pondérations d\'urgence selon la sévérité du sentiment et les délais SLA.'
  },
  {
    id: 'agent-auditor',
    name: 'Auditor Agent',
    role: '5-Platform Review Scraper & Sentiment Analyzer',
    framework: 'CrewAI',
    icon: 'Search',
    status: 'PROCESSING',
    tasksCompleted: 42190,
    currentTask: 'Audit en direct des avis sans réponse Google Maps, Booking & TripAdvisor',
    avgLatencyMs: 620,
    tokenCount: 1240000,
    accuracy: 99.4,
    description: 'Extraction multi-plateformes avec détection des pertes financières.'
  },
  {
    id: 'agent-pitcher',
    name: 'Outreach Pitcher',
    role: 'Multilingual Dynamic Sales Copy Generator',
    framework: 'CrewAI',
    icon: 'MessageSquare',
    status: 'ACTIVE',
    tasksCompleted: 8930,
    currentTask: 'Génération de propositions personnalisées WhatsApp & Email',
    avgLatencyMs: 380,
    tokenCount: 890000,
    accuracy: 98.9,
    description: 'Rédaction en Darija et Français avec calculs chiffrés réels.'
  },
  {
    id: 'agent-rescuer',
    name: 'Reply Rescue Agent',
    role: 'Hospitality-Calibrated Autonomous Copywriter',
    framework: 'CrewAI',
    icon: 'ShieldCheck',
    status: 'ACTIVE',
    tasksCompleted: 31200,
    currentTask: 'Sauvetage d\'avis négatifs sous SLA < 2h',
    avgLatencyMs: 450,
    tokenCount: 2100000,
    accuracy: 99.1,
    description: 'Rédaction empathique multi-langues avec mots-clés SEO d\'hospitalité marocaine.'
  },
  {
    id: 'agent-qc',
    name: 'QC Reviewer Agent',
    role: 'Multi-Dimensional Safety & Brand Voice Gatekeeper',
    framework: 'LangGraph',
    icon: 'Award',
    status: 'ACTIVE',
    tasksCompleted: 28400,
    currentTask: 'Validation de conformité juridique et de ton',
    avgLatencyMs: 190,
    tokenCount: 650000,
    accuracy: 99.9,
    description: 'Contrôle qualité strict (Empathie > 98%, Zéro engagement contractuel non autorisé).'
  },
  {
    id: 'agent-legal',
    name: 'Legal Takedown Agent',
    role: 'Moroccan Penal Code Art. 447 Defamation Investigator',
    framework: 'LangGraph',
    icon: 'Scale',
    status: 'IDLE',
    tasksCompleted: 1420,
    currentTask: 'Vérification de conformité Art. 447 et CNDP',
    avgLatencyMs: 820,
    tokenCount: 420000,
    accuracy: 100.0,
    description: 'Constitution de dossiers de mise en demeure et requêtes de suppression légale.'
  }
];

export const MOCK_AGENT_LOGS: AgentLog[] = [
  {
    id: 'log-1',
    timestamp: 'En direct',
    agentId: 'agent-planner',
    agentName: 'Planner Agent',
    state: 'DISPATCHING',
    message: 'Radar actif : surveillance des établissements réels du Maroc.',
    level: 'info'
  },
  {
    id: 'log-2',
    timestamp: 'En direct',
    agentId: 'agent-auditor',
    agentName: 'Auditor Agent',
    state: 'SCRAPING',
    message: 'Analyse des flux d\'avis sur Google Maps, Booking et TripAdvisor.',
    level: 'info'
  },
  {
    id: 'log-3',
    timestamp: 'En direct',
    agentId: 'agent-rescuer',
    agentName: 'Reply Rescue Agent',
    state: 'DRAFTING',
    message: 'Prêt pour la rédaction de sauvetage d\'avis réels en Darija et Français.',
    level: 'info'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Tier (Local & Snack)',
    tagline: 'Essentiel pour Snack Bars, Cafés, Salons de thé & Commerces de quartier',
    priceMADMonthly: 700,
    priceMADAnnual: 560,
    priceEUR: 65,
    targetAudience: 'Snacks, Cafés branchés, Glaciers & Petits Commerces',
    features: [
      'Surveillance Google Maps exclusive (24h/24)',
      'Réponses IA calibrées sous 24-48h (Français 🇫🇷 & Darija 🇲🇦)',
      'Alerte WhatsApp instantanée en cas d\'avis 1 étoile 🚨',
      'Rapport PDF mensuel d\'impact E-Réputation',
      'Mots-clés SEO local insérés automatiquement',
      'Support par WhatsApp & Email sous 24h'
    ],
    platformsIncluded: 'Google Business Profile uniquement',
    responseTimeSLA: '< 24-48 Heures',
    supportLevel: 'WhatsApp & Email Standard'
  },
  {
    id: 'professional',
    name: 'Professional Tier (Riads & Boutiques)',
    tagline: 'Le choix n°1 des Riads de la Médina, Hôtels Boutique, Spas & Camps Désert',
    priceMADMonthly: 2000,
    priceMADAnnual: 1600,
    priceEUR: 184,
    badge: 'LE PLUS POPULAIRE ★',
    isPopular: true,
    targetAudience: 'Riads de Charme, Hôtels 3-4 Étoiles, Camps Glamping, Spas de luxe',
    features: [
      'Surveillance Intégrale 5 Plateformes (Google, Booking, TripAdvisor, Airbnb, Yelp)',
      'Réponses IA Ultra-Rapides (< 24h) en 4 Langues (FR 🇫🇷, Darija 🇲🇦, EN 🇬🇧, ES 🇪🇸)',
      'Portail Client Dédié : Mode A (Validation 1-Clic) & Mode B (Auto-Pilote > 98.4%)',
      'Boost Référencement Local & Mots-Clés SEO Hospitalité Marocaine',
      'Rapports QC Hebdomadaires avec suivi du score de réputation',
      'Support Prioritaire VIP & Guide de Délégation Zero-Password',
      'Assistance Détection Diffamation (Art. 447 Code Pénal Marocain)'
    ],
    platformsIncluded: '5 Plateformes majeures (Google, Booking, TripAdvisor, Airbnb, Yelp)',
    responseTimeSLA: '< 24 Heures Garanti',
    supportLevel: 'Support Prioritaire Dédié 7j/7'
  },
  {
    id: 'vip',
    name: 'Enterprise VIP Tier (Palaces & 5★)',
    tagline: 'Gestion de flotte autonome sur-mesure pour Palaces, Resorts & Hôtels 5 Étoiles',
    priceMADMonthly: 4000,
    priceMADAnnual: 3200,
    priceEUR: 368,
    badge: 'PALACE & LUXE 👑',
    targetAudience: 'Palaces 5 Étoiles, Groupes Hôteliers, Châteaux & Resorts de Luxe',
    features: [
      'Flotte Multi-Agents Autonome Dédiée (CrewAI + LangGraph) avec SLA < 2h',
      'Personnalisation Totale du Ton de Luxe Palace (Harmonie avec la conciergerie)',
      'Alerte Crise VIP < 30 minutes avec escalade téléphonique directe',
      'Bouclier Juridique Complet & Dépôt Requêtes Diffamation CNDP / Art. 447',
      'Point Stratégique Bimensuel avec Hassan Tiguidda (Analyse Concurrentielle)',
      'Garantie QC Score > 99.2% avec contrôle humain permanent',
      'Certificat Officiel d\'Excellence E-Réputation pour la communication'
    ],
    platformsIncluded: 'Omnicanal Total + Surveillance Réseaux & Médias',
    responseTimeSLA: '< 2 Heures Garanti (Alerte Crise < 30min)',
    supportLevel: 'Ligne Directe Hassan Tiguidda & VIP Concierge'
  }
];

export const INITIAL_DEFAMATION_CASES: DefamationCase[] = [];

export const SAMPLE_SIMULATOR_REVIEWS: ReviewItem[] = [];
