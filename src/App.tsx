import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TabLeadEngine } from './components/tabs/TabLeadEngine';
import { TabAgentFleet } from './components/tabs/TabAgentFleet';
import { TabReviewRescue } from './components/tabs/TabReviewRescue';
import { TabPricingDelegation } from './components/tabs/TabPricingDelegation';
import { TabCrisisKanban } from './components/tabs/TabCrisisKanban';
import { TabBillingLegal } from './components/tabs/TabBillingLegal';

import { AuditModal } from './components/modals/AuditModal';
import { PitchModal } from './components/modals/PitchModal';
import { LegalNoticeModal } from './components/modals/LegalNoticeModal';
import { CertificateModal } from './components/modals/CertificateModal';
import { AddVenueModal } from './components/modals/AddVenueModal';
import { QRStandModal } from './components/modals/QRStandModal';
import { ShareableAuditModal } from './components/modals/ShareableAuditModal';
import { MassPitchModal } from './components/modals/MassPitchModal';
import { AutoScoutModal } from './components/modals/AutoScoutModal';
import { AutonomousAuditWorkerModal } from './components/modals/AutonomousAuditWorkerModal';
import { ManagerRadarCopilot } from './components/chat/ManagerRadarCopilot';
import { ManagerRadarFloatingLauncher } from './components/chat/ManagerRadarFloatingLauncher';
import { AuthLockScreen } from './components/auth/AuthLockScreen';
import { IntegrationSettingsModal } from './components/modals/IntegrationSettingsModal';

import { INITIAL_VENUES, AGENCY_METADATA } from './data/mockData';
import { Venue, DefamationCase, PricingPlan, OutreachStage } from './types';

const AUTH_STORAGE_KEY = 'mrr_auth_session';
const VENUES_STORAGE_KEY = 'mrr_venues_real_verified_v1';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<string>('leads');
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);
  const [venues, setVenues] = useState<Venue[]>(() => {
    try {
      const saved = localStorage.getItem(VENUES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Strict deduplication by ID
          const unique = Array.from(new Map(parsed.map((v: Venue) => [v.id, v])).values());
          return unique;
        }
      }
    } catch (e) {
      console.error('Failed to parse cached venues from localStorage:', e);
    }
    return INITIAL_VENUES;
  });

  // Automatically synchronize venues to localStorage
  useEffect(() => {
    try {
      // Ensure only unique venues are stored
      const unique = Array.from(new Map(venues.map((v) => [v.id, v])).values());
      localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify(unique));
    } catch (e) {
      console.error('Failed to save venues to localStorage:', e);
    }
  }, [venues]);

  const handleResetToFullCatalog = () => {
    setVenues(INITIAL_VENUES);
    try {
      localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify(INITIAL_VENUES));
    } catch (e) {
      console.error('Failed to write default venues:', e);
    }
  };

  // Modals state
  const [auditVenue, setAuditVenue] = useState<Venue | null>(null);
  const [shareableAuditVenue, setShareableAuditVenue] = useState<Venue | null>(null);
  const [pitchVenue, setPitchVenue] = useState<Venue | null>(null);
  const [autonomousWorkerVenue, setAutonomousWorkerVenue] = useState<Venue | null>(null);
  const [autonomousWorkerJobId, setAutonomousWorkerJobId] = useState<string | null>(null);
  const [isMassPitchOpen, setIsMassPitchOpen] = useState<boolean>(false);
  const [massPitchTargetIds, setMassPitchTargetIds] = useState<string[] | null>(null);
  const [isAutoScoutOpen, setIsAutoScoutOpen] = useState<boolean>(false);
  const [legalCase, setLegalCase] = useState<DefamationCase | null>(null);
  const [certificateVenue, setCertificateVenue] = useState<Venue | null>(null);
  const [qrVenue, setQrVenue] = useState<Venue | null>(null);
  const [isAddVenueOpen, setIsAddVenueOpen] = useState<boolean>(false);
  const [planForInvoice, setPlanForInvoice] = useState<PricingPlan | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Global keyboard shortcut: Ctrl+K or Cmd+K to open Manager Radar Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCopilotOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAutonomousPipeline = (venue: Venue, jobId?: string) => {
    setAutonomousWorkerVenue(venue);
    setAutonomousWorkerJobId(jobId || null);
  };

  const handleImportDiscoveredVenues = (newVenues: Venue[]) => {
    setVenues((prev) => {
      const map = new Map<string, Venue>();
      newVenues.forEach((v) => map.set(v.id, v));
      prev.forEach((v) => {
        if (!map.has(v.id)) {
          map.set(v.id, v);
        }
      });
      return Array.from(map.values());
    });
  };

  const handleImportAndPitchNewVenues = (newVenues: Venue[]) => {
    handleImportDiscoveredVenues(newVenues);
    setMassPitchTargetIds(newVenues.map((v) => v.id));
    setIsMassPitchOpen(true);
  };

  const handleOpenGeneralMassPitch = () => {
    setMassPitchTargetIds(null);
    setIsMassPitchOpen(true);
  };

  const handleOpenAudit = (venue: Venue) => {
    setAuditVenue(venue);
  };

  const handleOpenShareableAudit = (venue: Venue) => {
    setShareableAuditVenue(venue);
  };

  const handleDispatchPitch = (venue: Venue) => {
    setPitchVenue(venue);
  };

  const handleUpdateOutreachStage = (venueId: string, stage: OutreachStage) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === venueId ? { ...v, outreachStage: stage, lastContactDate: 'Aujourd\'hui' } : v))
    );
  };

  const handleBatchUpdateStage = (venueIds: string[], stage: OutreachStage) => {
    setVenues((prev) =>
      prev.map((v) => (venueIds.includes(v.id) ? { ...v, outreachStage: stage, lastContactDate: 'Aujourd\'hui' } : v))
    );
  };

  const handleLaunchAutoReviews = (venue: Venue) => {
    setActiveTab('rescue');
  };

  const handleOpenLegalNotice = (defCase: DefamationCase) => {
    setLegalCase(defCase);
  };

  const handleOpenCertificate = (venue: Venue) => {
    setCertificateVenue(venue);
  };

  const handleOpenQRStand = (venue: Venue) => {
    setQrVenue(venue);
  };

  const handleSelectPlanForInvoice = (plan: PricingPlan) => {
    setPlanForInvoice(plan);
    setActiveTab('billing');
  };

  const handleAddVenue = (newVenue: Venue) => {
    setVenues((prev) => [newVenue, ...prev]);
  };

  const handleLoginSuccess = (remember: boolean) => {
    setIsAuthenticated(true);
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200 radial-bg moroccan-pattern">
      
      {/* Top Sticky Navigation Bar */}
      <Navbar
        venuesCount={venues.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAutoPilot={isAutoPilot}
        setIsAutoPilot={setIsAutoPilot}
        onOpenNewInvoice={() => setActiveTab('billing')}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'leads' && (
          <TabLeadEngine
            venues={venues}
            onOpenAudit={handleOpenAudit}
            onDispatchPitch={handleDispatchPitch}
            onLaunchAutoReviews={handleLaunchAutoReviews}
            onOpenCertificate={handleOpenCertificate}
            onOpenAddVenue={() => setIsAddVenueOpen(true)}
            onOpenQRStand={handleOpenQRStand}
            onOpenShareableAudit={handleOpenShareableAudit}
            onUpdateOutreachStage={handleUpdateOutreachStage}
            onOpenMassPitch={handleOpenGeneralMassPitch}
            onOpenAutoScout={() => setIsAutoScoutOpen(true)}
            onResetFullCatalog={handleResetToFullCatalog}
            onOpenAutonomousPipeline={handleOpenAutonomousPipeline}
          />
        )}

        {activeTab === 'fleet' && (
          <TabAgentFleet
            venues={venues}
            onOpenAudit={handleOpenAudit}
            onOpenLegalNotice={handleOpenLegalNotice}
            onSelectPlanForInvoice={handleSelectPlanForInvoice}
            onOpenCertificate={handleOpenCertificate}
            onOpenAutonomousPipeline={handleOpenAutonomousPipeline}
          />
        )}

        {activeTab === 'rescue' && (
          <TabReviewRescue
            venues={venues}
            isAutoPilot={isAutoPilot}
            setIsAutoPilot={setIsAutoPilot}
          />
        )}

        {activeTab === 'pricing' && (
          <TabPricingDelegation
            onSelectPlanForInvoice={handleSelectPlanForInvoice}
          />
        )}

        {activeTab === 'crisis' && (
          <TabCrisisKanban onOpenLegalNotice={handleOpenLegalNotice} />
        )}

        {activeTab === 'billing' && (
          <TabBillingLegal
            venues={venues}
            onOpenCertificate={handleOpenCertificate}
            initialPlan={planForInvoice}
          />
        )}
      </main>

      {/* Persistent Modals */}
      <AutoScoutModal
        isOpen={isAutoScoutOpen}
        onClose={() => setIsAutoScoutOpen(false)}
        onImportVenues={handleImportDiscoveredVenues}
        existingVenues={venues}
        onImportAndPitchNewVenues={handleImportAndPitchNewVenues}
      />

      <MassPitchModal
        venues={venues}
        isOpen={isMassPitchOpen}
        onClose={() => {
          setIsMassPitchOpen(false);
          setMassPitchTargetIds(null);
        }}
        onBatchUpdateStage={handleBatchUpdateStage}
        targetVenueIds={massPitchTargetIds}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <ShareableAuditModal
        venue={shareableAuditVenue}
        isOpen={!!shareableAuditVenue}
        onClose={() => setShareableAuditVenue(null)}
        onDispatchPitch={handleDispatchPitch}
      />

      <AuditModal
        venue={auditVenue}
        isOpen={!!auditVenue}
        onClose={() => setAuditVenue(null)}
        onDispatchPitch={handleDispatchPitch}
        onLaunchAutoReviews={handleLaunchAutoReviews}
      />

      <PitchModal
        venue={pitchVenue}
        isOpen={!!pitchVenue}
        onClose={() => setPitchVenue(null)}
        onUpdateStage={handleUpdateOutreachStage}
        onOpenShareableAudit={handleOpenShareableAudit}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <IntegrationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <LegalNoticeModal
        defCase={legalCase}
        isOpen={!!legalCase}
        onClose={() => setLegalCase(null)}
      />

      <CertificateModal
        venue={certificateVenue}
        isOpen={!!certificateVenue}
        onClose={() => setCertificateVenue(null)}
      />

      <QRStandModal
        venue={qrVenue}
        isOpen={!!qrVenue}
        onClose={() => setQrVenue(null)}
      />

      <AddVenueModal
        isOpen={isAddVenueOpen}
        onClose={() => setIsAddVenueOpen(false)}
        onAddVenue={handleAddVenue}
      />

      <AutonomousAuditWorkerModal
        venue={autonomousWorkerVenue}
        isOpen={!!autonomousWorkerVenue}
        onClose={() => {
          setAutonomousWorkerVenue(null);
          setAutonomousWorkerJobId(null);
        }}
        existingJobId={autonomousWorkerJobId}
      />

      {/* Global Omnipresent Manager Radar Copilot & Floating Launcher */}
      <ManagerRadarCopilot
        venues={venues}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onOpenAudit={handleOpenAudit}
        onDispatchPitch={handleDispatchPitch}
        onOpenAutonomousPipeline={handleOpenAutonomousPipeline}
        onOpenLegalNotice={handleOpenLegalNotice}
        onSelectPlanForInvoice={handleSelectPlanForInvoice}
        onOpenCertificate={handleOpenCertificate}
      />

      <ManagerRadarFloatingLauncher
        isOpen={isCopilotOpen}
        onToggle={() => setIsCopilotOpen((prev) => !prev)}
        venuesCount={venues.length}
        criticalCount={venues.filter((v) => v.threatLevel === 'CRITICAL').length}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8 text-xs text-slate-400 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-200">
              {AGENCY_METADATA.brandName}
            </span>
            <span className="text-slate-500">— {AGENCY_METADATA.entity}</span>
          </div>

          <div className="text-center sm:text-right space-y-0.5 font-mono text-[11px]">
            <p>ICE : <strong className="text-emerald-400">{AGENCY_METADATA.ice}</strong> | {AGENCY_METADATA.taxExemptionClause}</p>
            <p className="text-slate-500">Marrakech • Casablanca • Rabat • Tanger • Agadir • Fès • Merzouga</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
