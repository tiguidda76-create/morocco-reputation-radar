import React, { useState } from 'react';
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

import { INITIAL_VENUES, INITIAL_DEFAMATION_CASES, AGENCY_METADATA } from './data/mockData';
import { Venue, DefamationCase, PricingPlan } from './types';
import { ShieldCheck, Heart, Sparkles, Building, PhoneCall } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('leads');
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);
  const [venues, setVenues] = useState<Venue[]>(INITIAL_VENUES);

  // Modals state
  const [auditVenue, setAuditVenue] = useState<Venue | null>(null);
  const [pitchVenue, setPitchVenue] = useState<Venue | null>(null);
  const [legalCase, setLegalCase] = useState<DefamationCase | null>(null);
  const [certificateVenue, setCertificateVenue] = useState<Venue | null>(null);
  const [planForInvoice, setPlanForInvoice] = useState<PricingPlan | null>(null);

  const handleOpenAudit = (venue: Venue) => {
    setAuditVenue(venue);
  };

  const handleDispatchPitch = (venue: Venue) => {
    setPitchVenue(venue);
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

  const handleSelectPlanForInvoice = (plan: PricingPlan) => {
    setPlanForInvoice(plan);
    setActiveTab('billing');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200 radial-bg moroccan-pattern">
      
      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAutoPilot={isAutoPilot}
        setIsAutoPilot={setIsAutoPilot}
        onOpenNewInvoice={() => setActiveTab('billing')}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'leads' && (
          <TabLeadEngine
            venues={venues}
            onOpenAudit={handleOpenAudit}
            onDispatchPitch={handleDispatchPitch}
            onLaunchAutoReviews={handleLaunchAutoReviews}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {activeTab === 'fleet' && <TabAgentFleet />}

        {activeTab === 'rescue' && (
          <TabReviewRescue
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
