import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  ShieldCheck, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  Building2, 
  Clock, 
  Zap, 
  Globe2, 
  FileText, 
  LogOut,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { AGENCY_METADATA } from '../data/mockData';
import { getActiveDeliveryStatus } from '../services/n8nOutreachService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAutoPilot: boolean;
  setIsAutoPilot: (val: boolean) => void;
  onOpenNewInvoice?: () => void;
  onOpenCopilot?: () => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAutoPilot,
  setIsAutoPilot,
  onOpenNewInvoice,
  onOpenCopilot,
  onOpenSettings,
  onLogout
}) => {
  const [deliveryStatus, setDeliveryStatus] = useState(() => getActiveDeliveryStatus());

  useEffect(() => {
    const checkStatus = () => {
      setDeliveryStatus(getActiveDeliveryStatus());
    };
    window.addEventListener('storage', checkStatus);
    const interval = setInterval(checkStatus, 3000);
    return () => {
      window.removeEventListener('storage', checkStatus);
      clearInterval(interval);
    };
  }, []);

  const tabs = [
    { id: 'leads', label: '1. Lead Engine & Radar', icon: Globe2, badge: '45.2K' },
    { id: 'fleet', label: '2. War Room Multi-Agents', icon: Bot, badge: '6 Agents' },
    { id: 'rescue', label: '3. Review Rescue Studio', icon: ShieldCheck, badge: 'Mode ' + (isAutoPilot ? 'B (Auto)' : 'A (HITL)') },
    { id: 'pricing', label: '4. Tiers & Délégation', icon: Building2, badge: 'Dès 700 DH' },
    { id: 'crisis', label: '5. Crise & Diffamation', icon: Zap, badge: 'Art. 447' },
    { id: 'billing', label: '6. Facturation & Légal', icon: FileText, badge: 'H. Tiguidda' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Top Banner / Ticker */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/80 border-b border-emerald-900/30 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              MOROCCO RADAR LIVE V2.4
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Marrakech Time: <strong className="text-slate-200 font-mono">13:45 GMT+1</strong>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              ICE Agence: <span className="font-mono text-emerald-300 font-semibold">{AGENCY_METADATA.ice}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Real Outreach Channel Status & Settings Trigger */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all border ${
                  deliveryStatus.isRealDeliveryAvailable
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/80'
                    : 'bg-amber-950/80 text-amber-300 border-amber-700/60 hover:bg-amber-900/80'
                }`}
                title="Configurer vos canaux d'envoi réels (n8n, Resend, WhatsApp Meta)"
              >
                {deliveryStatus.isRealDeliveryAvailable ? (
                  <>
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>{deliveryStatus.hasN8n ? 'n8n Connecté' : 'API Connectée'}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    <span>Canaux: Simulation (Relier n8n)</span>
                  </>
                )}
                <Sliders className="w-3 h-3 ml-0.5 opacity-70" />
              </button>
            )}

            {/* Auto-Pilot Toggle Mode A vs Mode B */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 py-0.5 rounded-full">
              <span className="text-[11px] font-medium text-slate-300">
                {isAutoPilot ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Mode B : Auto (QC &gt; 98.4%)
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Mode A : HITL
                  </span>
                )}
              </span>
              <button
                onClick={() => setIsAutoPilot(!isAutoPilot)}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                  isAutoPilot ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
                title="Basculer entre Mode A (Validation manuelle) et Mode B (Autonome)"
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    isAutoPilot ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Quick action: Create Invoice */}
            {onOpenNewInvoice && (
              <button
                onClick={onOpenNewInvoice}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[11px] font-medium transition-colors"
              >
                <FileText className="w-3 h-3" />
                Nouveau Devis Pro Forma
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('leads')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-600 p-0.5 shadow-lg shadow-emerald-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Radar className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  MOROCCO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">RADAR</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded">
                  MA-AGENCY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Système d'E-Réputation, Audit & Flotte IA Hospitalité Maroc
              </p>
            </div>
          </div>

          {/* User / Agent Owner Profile & Copilot Trigger */}
          <div className="flex items-center gap-3">
            {/* Quick Copilot AI Launcher */}
            {onOpenCopilot && (
              <button
                onClick={onOpenCopilot}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 hover:from-emerald-900 hover:to-teal-900 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 hover:border-emerald-400 transition-all hover:scale-105"
                title="Discuter avec Manager Radar (Ctrl + K)"
              >
                <div className="relative">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                </div>
                <span className="hidden sm:inline">Manager Radar</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono">
                  Ctrl+K
                </span>
              </button>
            )}

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">{AGENCY_METADATA.entity}</span>
              <span className="text-[10px] text-emerald-400 font-mono">Directeur E-Réputation & IA</span>
            </div>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 via-amber-500 to-emerald-400 p-[1.5px]">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  HT
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Verrouiller / Se déconnecter"
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/30 hover:border-red-800/50 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-900/60 to-slate-800 text-emerald-300 border border-emerald-700/50 shadow-md shadow-emerald-950/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
