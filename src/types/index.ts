export type PlatformType = 'google' | 'booking' | 'tripadvisor' | 'airbnb' | 'yelp';

export type MoroccanRegion = 
  | 'Marrakech-Safi'
  | 'Casablanca-Settat'
  | 'Rabat-Salé-Kénitra'
  | 'Tanger-Tétouan-Al Hoceïma'
  | 'Souss-Massa'
  | 'Fès-Meknès'
  | 'Drâa-Tafilalet'
  | 'L\'Oriental'
  | 'Béni Mellal-Khénifra'
  | 'Guelmim-Oued Noun'
  | 'Laâyoune-Sakia El Hamra'
  | 'Dakhla-Oued Ed-Dahab';

export type VenueCategory = 
  | 'Palace 5-Star'
  | 'Riad de Luxe'
  | 'Boutique Hotel'
  | 'Restaurant Gastronomique'
  | 'Camp Désert Luxury'
  | 'Snack & Café Traditionnel'
  | 'Spa & Wellness';

export type ThreatLevel = 'CRITICAL' | 'WARNING' | 'MODERATE' | 'HEALTHY';

export interface PlatformScore {
  platform: PlatformType;
  score: number; // e.g. 4.1
  totalReviews: number;
  unrepliedCount: number;
  negativeUnreplied: number;
  lastReviewDate: string;
  url?: string;
}

export type OutreachStage = 
  | 'A_PROSPECTER' 
  | 'PITCH_ENVOYE' 
  | 'EN_DISCUSSION' 
  | 'ACCES_DELEGUE' 
  | 'CLIENT_ACTIF';

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  region: MoroccanRegion;
  city: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  overallScore: number;
  totalReviews: number;
  unrepliedReviews: number;
  avgResponseTimeHours: number;
  threatLevel: ThreatLevel;
  annualLossMAD: number; // Estimated revenue lost per year due to bad unreplied reviews
  platforms: Record<PlatformType, PlatformScore>;
  recentReviews: ReviewItem[];
  competitorIds: string[];
  outreachStage?: OutreachStage;
  outreachNotes?: string;
  lastContactDate?: string;
}

export interface ReviewItem {
  id: string;
  venueId: string;
  venueName: string;
  platform: PlatformType;
  author: string;
  authorCountry: string;
  date: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  sentiment: 'Negative' | 'Neutral' | 'Positive';
  status: 'PENDING_APPROVAL' | 'AUTO_PUBLISHED' | 'RESCUED' | 'REJECTED' | 'FLAGGED_LEGAL';
  clientApprovalStatus?: 'PENDING' | 'APPROVED' | 'EDIT_REQUESTED';
  aiDraft?: {
    language: 'FR' | 'DARIJA' | 'EN' | 'ES';
    tone: 'Royal Palace' | 'Warm Riad' | 'Casual Hospitality' | 'Concierge';
    content: string;
    seoKeywords: string[];
    qcScore: number; // e.g. 99.1%
    empathyScore: number;
    brandVoiceScore: number;
    legalSafetyScore: number;
    generatedAt: string;
  };
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  framework: 'CrewAI' | 'LangGraph';
  icon: string;
  status: 'ONLINE' | 'ACTIVE' | 'PROCESSING' | 'STANDBY';
  tasksCompleted: number;
  currentTask: string;
  avgLatencyMs: number;
  tokenCount: number;
  accuracy: number;
  description: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  state: 'INPUT_RECEIVED' | 'PLANNING' | 'SCRAPING' | 'DRAFTING' | 'QC_CHECK' | 'HUMAN_GATE' | 'EXECUTED';
  message: string;
  details?: Record<string, any>;
  level: 'info' | 'success' | 'warning' | 'error';
}

export interface PricingPlan {
  id: 'starter' | 'professional' | 'vip';
  name: string;
  tagline: string;
  priceMADMonthly: number;
  priceMADAnnual: number;
  priceEUR: number;
  badge?: string;
  isPopular?: boolean;
  targetAudience: string;
  features: string[];
  platformsIncluded: string;
  responseTimeSLA: string;
  supportLevel: string;
}

export interface DefamationCase {
  id: string;
  venueName: string;
  city: string;
  platform: PlatformType;
  author: string;
  dateFlagged: string;
  rating: number;
  reviewSnippet: string;
  stage: 'DETECTED' | 'LEGAL_NOTICE_DRAFTED' | 'ESCALATED_PLATFORM' | 'REMOVED_SUCCESS';
  moroccanLawArticle: string;
  violationReason: string;
  evidenceNotes: string;
  estimatedDamageMAD: number;
  daysActive: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  type: 'PRO_FORMA' | 'INVOICE';
  clientName: string;
  clientICE?: string;
  clientAddress: string;
  clientCity: string;
  clientEmail: string;
  clientPhone: string;
  planId: 'starter' | 'professional' | 'vip';
  planName: string;
  billingPeriod: 'Monthly' | 'Annual';
  subtotalMAD: number;
  discountMAD: number;
  totalMAD: number;
  totalEUR: number;
  selectedAddons: {
    name: string;
    priceMAD: number;
  }[];
}
