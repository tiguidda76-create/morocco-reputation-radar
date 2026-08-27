import { Venue, PlatformType, ThreatLevel, MoroccanRegion, VenueCategory, OutreachStage } from './index';

export type JobStatus = 
  | 'QUEUED'
  | 'SCRAPING'
  | 'SENTIMENT_ANALYSIS'
  | 'RISK_SCORING'
  | 'ACTIONABLE_RECOMMENDATIONS'
  | 'PDF_GENERATION'
  | 'STORAGE_UPLOAD'
  | 'EMAIL_DISPATCH'
  | 'COMPLETED'
  | 'FAILED';

export interface JobStageLog {
  stage: JobStatus;
  timestamp: string;
  workerId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
  durationMs?: number;
  payloadSnippet?: Record<string, any>;
}

// 1. Deterministic Step 1: Data Extraction Schema
export interface ScrapedReviewData {
  id: string;
  platform: PlatformType;
  author: string;
  authorCountry: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  hasOwnerReply: boolean;
  replyText?: string;
}

export interface DataExtractionResult {
  venueId: string;
  venueName: string;
  category: VenueCategory;
  region: MoroccanRegion;
  city: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  scrapedAt: string;
  source: 'LIVE_SCRAPER_STREAM' | 'FALLBACK_CACHED_STORE' | 'SEARCH_ENGINE_SUMMARY';
  fallbackTriggered: boolean;
  platformsBreakdown: Record<PlatformType, {
    score: number;
    totalReviews: number;
    unrepliedCount: number;
    negativeCount: number;
    lastReviewDate: string;
  }>;
  reviewsSample: ScrapedReviewData[];
}

// 2. Deterministic Step 2: Sentiment Analysis Schema
export interface SentimentAnalysisResult {
  overallSentiment: 'Positive' | 'Neutral' | 'Mixed' | 'Severe_Negative';
  sentimentScoreNormalized: number; // 0 to 100
  languagesDetected: {
    french: number; // percentage e.g. 65
    darijaMoroccan: number; // e.g. 15
    english: number; // e.g. 15
    spanish: number; // e.g. 5
  };
  keyPainPoints: {
    category: 'Service & Attente' | 'Propreté & Hygiène' | 'Restauration & Saveurs' | 'Rapport Qualité/Prix' | 'Communication & Réservation';
    frequency: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    sampleQuote: string;
  }[];
  guestSatisfactionDrivers: string[];
  vulnerabilitySummary: string;
}

// 3. Deterministic Step 3: Risk Scoring Schema
export interface RiskScoringResult {
  threatLevel: ThreatLevel;
  leakageIndex: number; // 0 to 100
  unrepliedCountTotal: number;
  avgResponseLagHours: number;
  computedAnnualLossMAD: number;
  lossPerMonthMAD: number;
  directBookingLeakagePercent: number; // e.g. 23.4%
  competitorAdvantageIndex: number;
  legalLiabilityScore: number; // 0 to 100
  legalInfractionsDetected: string[];
  reputationHealthGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

// 4. Deterministic Step 4: Actionable Recommendations Schema
export interface ActionableRecommendationsResult {
  executiveSummary: string;
  recommendedSLA: string; // e.g. '< 2 heures'
  multilingualResponseDrafts: {
    language: 'FR' | 'DARIJA' | 'EN' | 'ES';
    platform: PlatformType;
    tone: string;
    generatedReply: string;
    seoKeywords: string[];
    qualityScore: number;
  }[];
  b2bEmailPitchCopy: {
    subject: string;
    bodyText: string;
    callToAction: string;
  };
  whatsAppPitchCopy: {
    darijaMessage: string;
    frenchMessage: string;
    waDirectLink: string;
  };
  recoveryRoadmap: {
    phase: 'Jour 1-7' | 'Jour 8-30' | 'Jour 31-90';
    action: string;
    expectedGainMAD: number;
  }[];
}

// Complete Consolidated Structured Audit
export interface StructuredAuditReport {
  auditId: string;
  generatedAt: string;
  venueId: string;
  venueName: string;
  extraction: DataExtractionResult;
  sentiment: SentimentAnalysisResult;
  risk: RiskScoringResult;
  recommendations: ActionableRecommendationsResult;
  storagePdfUrl?: string;
  emailDeliveryStatus?: {
    delivered: boolean;
    recipientEmail: string;
    messageId?: string;
    dispatchedAt?: string;
    mode: 'RESEND_API' | 'SMTP' | 'CLIENT_MAILTO_INTENT';
  };
}

// Asynchronous Queue Job Model
export interface AuditJob {
  jobId: string;
  venueId: string;
  venueName: string;
  createdAt: string;
  updatedAt: string;
  status: JobStatus;
  progressPercent: number;
  logs: JobStageLog[];
  report?: StructuredAuditReport;
  error?: string;
  options: {
    autoGeneratePdf: boolean;
    autoUploadStorage: boolean;
    autoDispatchEmail: boolean;
    language: 'FR' | 'DARIJA' | 'EN';
  };
}
