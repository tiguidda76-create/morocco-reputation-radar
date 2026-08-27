import React from 'react';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

interface ManagerRadarFloatingLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  venuesCount: number;
  criticalCount: number;
}

export const ManagerRadarFloatingLauncher: React.FC<ManagerRadarFloatingLauncherProps> = ({
  isOpen,
  onToggle,
  venuesCount,
  criticalCount,
}) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 animate-in zoom-in duration-200">
      <button
        onClick={onToggle}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/90 hover:to-emerald-900/90 text-white pl-3.5 pr-4 py-2.5 rounded-full border border-emerald-500/40 shadow-xl shadow-emerald-950/60 hover:shadow-emerald-500/20 hover:border-emerald-400 transition-all hover:scale-105"
        title="Ouvrir Manager Radar AI Copilot (Ctrl + K)"
      >
        {/* Glowing Radar beacon avatar */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/30 group-hover:rotate-12 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-950"></span>
          </span>
        </div>

        {/* Text and stats */}
        <div className="text-left">
          <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
            Manager Radar
            <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono">
              Ctrl+K
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{venuesCount} venues</span>
            {criticalCount > 0 && (
              <>
                <span>•</span>
                <span className="text-rose-400 font-medium">{criticalCount} alertes</span>
              </>
            )}
          </div>
        </div>

        <div className="pl-1 text-slate-400 group-hover:text-emerald-300 transition-colors">
          <MessageSquare className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
