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

export { INITIAL_VENUES, generateFullMoroccoVenuesCatalog } from './moroccoVenuesCatalog';


export const FLEET_AGENTS: AgentInfo[] = [
  {
    id: 'agent-planner',
    name: 'Planner Agent',
    role: 'Lead Priority Indexer & Hierarchical Task Dispatcher',
    framework: 'CrewAI',
    icon: 'Brain',
    status: 'ACTIVE',
    tasksCompleted: 14820,
    currentTask: 'Prioritizing critical negative reviews in Marrakech-Médina cluster',
    avgLatencyMs: 240,
    tokenCount: 482000,
    accuracy: 99.8,
    description: 'Calculates urgency weights based on star rating, reviewer follower weight, sentiment severity, and client SLA triggers.'
  },
  {
    id: 'agent-auditor',
    name: 'Auditor Agent',
    role: '5-Platform Review Scraper & Sentiment Analyzer',
    framework: 'CrewAI',
    icon: 'Search',
    status: 'PROCESSING',
    tasksCompleted: 42190,
    currentTask: 'Scraping unreplied Booking.com & TripAdvisor reviews for 32 Riads in Fès',
    avgLatencyMs: 620,
    tokenCount: 1240000,
    accuracy: 99.4,
    description: 'Multi-threaded extraction across Google Maps, Booking.com, TripAdvisor, Airbnb, and Yelp with stealth anti-blocking.'
  },
  {
    id: 'agent-pitcher',
    name: 'Outreach Pitcher',
    role: 'Multilingual Dynamic Sales Copy Generator',
    framework: 'CrewAI',
    icon: 'MessageSquare',
    status: 'ONLINE',
    tasksCompleted: 8940,
    currentTask: 'Generating personalized WhatsApp ROI pitches in Moroccan Darija and French',
    avgLatencyMs: 380,
    tokenCount: 890000,
    accuracy: 98.9,
    description: 'Synthesizes scraped unreplied review losses into high-converting 1-click pitches with calculated annual revenue leakage.'
  },
  {
    id: 'agent-responder',
    name: 'Reply Rescue Agent',
    role: 'SEO-Rich Tone-Calibrated Review Responder',
    framework: 'LangGraph',
    icon: 'ShieldCheck',
    status: 'ACTIVE',
    tasksCompleted: 28450,
    currentTask: 'Drafting 5-star & 1-star calibrated responses with local Moroccan SEO keywords',
    avgLatencyMs: 410,
    tokenCount: 2450000,
    accuracy: 99.6,
    description: 'Constructs empathetic, culturally accurate, SEO-injected answers incorporating Moroccan warmth and direct manager escalation.'
  },
  {
    id: 'agent-qc',
    name: 'QC Reviewer Agent',
    role: 'Tone Compliance, Brand Voice & Safety Auditor',
    framework: 'LangGraph',
    icon: 'CheckCircle2',
    status: 'ACTIVE',
    tasksCompleted: 28450,
    currentTask: 'Evaluating empathy scores and safety guardrails (Threshold > 98.4%)',
    avgLatencyMs: 190,
    tokenCount: 710000,
    accuracy: 99.9,
    description: 'Enforces strict brand guidelines, legal disclaimer safety under Moroccan Law, and filters out hallucinations.'
  },
  {
    id: 'agent-dispatcher',
    name: 'Mass Regional Dispatcher',
    role: 'Bulk Regional Campaign & Publishing Orchestrator',
    framework: 'CrewAI',
    icon: 'Megaphone',
    status: 'ACTIVE',
    tasksCompleted: 6120,
    currentTask: 'Actif • Monitoring des webhooks WhatsApp & quotas API (Tanger & Casablanca)',
    avgLatencyMs: 310,
    tokenCount: 380000,
    accuracy: 99.7,
    description: 'Schedules and throttles mass outreach and published replies respecting rate limits of APIs and WhatsApp webhooks.'
  },
  {
    id: 'agent-closer',
    name: 'Inbound Negotiator & Billing',
    role: 'Deal Closer, Stripe/RIB Invoicing & Delegation Router',
    framework: 'LangGraph',
    icon: 'Handshake',
    status: 'ONLINE',
    tasksCompleted: 3410,
    currentTask: 'Generating BMCE Bank Pro Forma Invoices and manager delegation guides',
    avgLatencyMs: 280,
    tokenCount: 490000,
    accuracy: 100.0,
    description: 'Handles onboarding delegation verification (Google/Booking/TripAdvisor) and issues official Moroccan tax-compliant invoices.'
  }
];

export const INITIAL_LOGS: AgentLog[] = [
  {
    id: 'log-1',
    timestamp: 'En direct',
    agentId: 'agent-planner',
    agentName: 'Planner Agent',
    state: 'PLANNING',
    message: 'Triggered audit cycle for Moroccan hospitality cluster. Scanned unreplied 1-star reviews on Google Maps & Booking.',
    level: 'info'
  },
  {
    id: 'log-2',
    timestamp: 'En direct',
    agentId: 'agent-auditor',
    agentName: 'Auditor Agent',
    state: 'SCRAPING',
    message: 'Extracted Google Maps reviews for "Riad Kniza Marrakech" & "Restaurant Le Comptoir Darna".',
    level: 'warning'
  },
  {
    id: 'log-3',
    timestamp: 'En direct',
    agentId: 'agent-responder',
    agentName: 'Reply Rescue Agent',
    state: 'DRAFTING',
    message: 'Generated Palace Luxury response draft (FR/Darija). Injected SEO keywords: ["hospitalité marocaine", "riad authentique", "médina"].',
    level: 'info'
  },
  {
    id: 'log-4',
    timestamp: 'En direct',
    agentId: 'agent-qc',
    agentName: 'QC Reviewer Agent',
    state: 'QC_CHECK',
    message: 'QC Validation passed with Score: 99.4% (Empathy: 99%, Brand Voice: 100%, Legal Safety: 100%). Routed to Mode A Client Gate.',
    level: 'success'
  },
  {
    id: 'log-5',
    timestamp: 'En direct',
    agentId: 'agent-pitcher',
    agentName: 'Outreach Pitcher',
    state: 'DRAFTING',
    message: 'Formulated 1-Click WhatsApp Pitch in Darija showing calculated annual revenue leakage.',
    level: 'info'
  },
  {
    id: 'log-6',
    timestamp: 'En direct',
    agentId: 'agent-closer',
    agentName: 'Inbound Negotiator & Billing',
    state: 'EXECUTED',
    message: 'Prepared official BMCE Bank Pro Forma Invoices with ICE 1161674000043 and RIB 007450001399370030009822.',
    level: 'success'
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

export const INITIAL_DEFAMATION_CASES: DefamationCase[] = [
  {
    id: 'def-01',
    venueName: 'Riad Kniza Marrakech Médina',
    city: 'Marrakech',
    platform: 'google',
    author: 'Compte Anonyme "TouristHunter99"',
    dateFlagged: 'Aujourd\'hui',
    rating: 1,
    commentSnippet: 'Arnaqueurs professionnels ! Ils nous ont volé notre caution en liquide et la direction refuse de répondre. Évitez à tout prix cet endroit illégal.',
    legalGrounds: 'Article 447-2 du Code Pénal Marocain (Diffamation & Allégation calomnieuse publique sans preuve).',
    status: 'IN_PROGRESS',
    resolutionAction: 'Signalement Prioritaire Google Legal Takedown + Mise en demeure avocat envoyée.',
    riskMAD: 120000,
  },
  {
    id: 'def-02',
    venueName: 'Restaurant Le Comptoir Darna',
    city: 'Marrakech',
    platform: 'tripadvisor',
    author: 'Profil Faux Concurrent "RestoMarrakechExcellence"',
    dateFlagged: 'Hier',
    rating: 1,
    commentSnippet: 'Intoxication alimentaire grave suite au tajine agneau ! Tout le personnel est incompétent et sans hygiène.',
    legalGrounds: 'Atteinte à l\'image commerciale, dénigrement déloyal concurrentiel et diffusion de fausses allégations préjudiciables.',
    status: 'ESCALATED_CNDP',
    resolutionAction: 'Saisine Tripadvisor Trust & Safety avec certificat sanitaire de conformité de l\'établissement.',
    riskMAD: 250000,
  }
];

export const SAMPLE_SIMULATOR_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-sim-1',
    venueId: 'venue-2',
    venueName: 'Riad Kniza Marrakech Médina',
    platform: 'google',
    author: 'Céline & Julien Fontaine',
    authorCountry: 'France 🇫🇷',
    date: 'Aujourd\'hui à 10:15',
    rating: 2,
    title: 'Bruit de pompe à eau et attente petit déjeuner',
    comment: 'Le patio avec les orangers est magnifique, mais notre chambre au rez-de-chaussée subissait le bruit incessant de la filtration de piscine toute la nuit. Le petit déjeuner servi à 9h a mis plus de 35 minutes.',
    sentiment: 'Negative',
    status: 'PENDING_APPROVAL',
    clientApprovalStatus: 'PENDING',
    aiDraft: {
      language: 'FR',
      tone: 'Hospitalité & Empathie Marocaine',
      content: 'Chers Julien et Céline, Merci pour votre franchise. Nous sommes sincèrement navrés pour cette gêne technique sur la filtration du patio. Notre artisan est intervenu ce matin pour insonoriser le caisson. Quant à notre petit-déjeuner fassi traditionnel (msemen chauds, jus d\'orange pressé minute et thé à la menthe), nous avons recadré l\'équipe pour que le service soit irréprochable. Nous serions honorés de vous surclasser en suite terrasse lors de votre prochain passage. Bien chaleureusement, Si Mohamed & l\'équipe du Riad Kniza.',
      seoKeywords: ['riad de charme médina Marrakech', 'séjour romantique Marrakech', 'petit déjeuner marocain traditionnel', 'suite terrasse Bab Doukkala'],
      qcScore: 99.1,
      empathyScore: 99,
      brandVoiceScore: 99,
      legalSafetyScore: 100,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    }
  },
  {
    id: 'rev-sim-2',
    venueId: 'venue-1',
    venueName: 'La Mamounia Palace Marrakech',
    platform: 'booking',
    author: 'Sir Edward Sterling',
    authorCountry: 'Royaume-Uni 🇬🇧',
    date: 'Aujourd\'hui à 09:30',
    rating: 1,
    title: 'Check-in delay at the Pavilion',
    comment: 'We waited 45 minutes for our suite key upon arrival despite guaranteed 3 PM check-in. The concierge seemed overwhelmed and offered no tea while waiting. Expected royal treatment given the rate.',
    sentiment: 'Negative',
    status: 'PENDING_APPROVAL',
    clientApprovalStatus: 'PENDING',
    aiDraft: {
      language: 'EN',
      tone: 'Royal Palace',
      content: 'Dear Sir Edward, We offer our deepest and most sincere apologies for falling short of the legendary palace hospitality you rightfully expected at La Mamounia. Waiting 45 minutes for your suite is unacceptable by our standards. We have personally briefed our Head Concierge and General Management team. Kindly allow us to invite you for a signature tea ceremony in our Menzeh gardens on your next visit. With highest regards, La Mamounia Guest Experience Directorate.',
      seoKeywords: ['palace hospitality Marrakech', 'La Mamounia gardens', 'VIP relations', 'luxury suite check-in'],
      qcScore: 99.4,
      empathyScore: 99,
      brandVoiceScore: 100,
      legalSafetyScore: 100,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    }
  },
  {
    id: 'rev-sim-3',
    venueId: 'venue-3',
    venueName: 'Restaurant Le Comptoir Darna',
    platform: 'tripadvisor',
    author: 'Hamza El Fassi',
    authorCountry: 'Maroc 🇲🇦',
    date: 'Hier à 22:40',
    rating: 2,
    title: 'Service lourd et table mal placée',
    comment: 'Khedma t3tlat bzzaf f la commande dyal l-dîner w t-plassina 7da l-passage dyal l-cuisine. Cadre zwin walakin le service khassou re-cadrage.',
    sentiment: 'Negative',
    status: 'PENDING_APPROVAL',
    clientApprovalStatus: 'PENDING',
    aiDraft: {
      language: 'DARIJA',
      tone: 'Hospitalité & Empathie Marocaine',
      content: 'Salam Si Hamza, Smhlina bzzaf 3la had tajriba li machi f lmostawa dyal Comptoir Darna. L-retard f le service w l-emplacement dyal la table machi ma9bouline 3ndna. Drna réunion m3a l-chef de salle bach n-dbtou l-accueil. Marhba bik f ay wa9t n-3wdou lik une table VIP f l-premier rang 3la 7ssabna. Tassel bina direct. Choukran 3la saraha dyalk!',
      seoKeywords: ['Comptoir Darna Hivernage', 'restaurant spectacle Marrakech', 'dîner festif Marrakech', 'gastronomie marocaine'],
      qcScore: 98.9,
      empathyScore: 100,
      brandVoiceScore: 99,
      legalSafetyScore: 100,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    }
  }
];
