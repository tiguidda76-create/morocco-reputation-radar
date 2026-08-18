import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Radar, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Globe
} from 'lucide-react';
import { AGENCY_METADATA } from '../../data/mockData';

interface AuthLockScreenProps {
  onSuccess: (remember: boolean) => void;
}

export const AuthLockScreen: React.FC<AuthLockScreenProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Read configured password from environment variable or fallback to default
  const configuredPassword = (import.meta.env.VITE_APP_PASSWORD || 'atlas2025').trim();
  const isOnline = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Veuillez saisir votre mot de passe.');
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError(null);

    // Small delay for smooth verification feel
    setTimeout(() => {
      if (password.trim() === configuredPassword) {
        setIsLoading(false);
        onSuccess(rememberMe);
      } else {
        setIsLoading(false);
        setError('Mot de passe incorrect. Veuillez réessayer.');
        triggerShake();
      }
    }, 350);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30 selection:text-emerald-200 radial-bg moroccan-pattern relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Lock Card */}
      <div className={`w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 relative z-10 transition-all ${isShaking ? 'animate-shake' : ''}`}>
        
        {/* Top Moroccan Badge */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Accès Restreint
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-400 font-mono">
            <Globe className="w-3 h-3 text-amber-400" />
            {isOnline ? 'Online / Production' : 'Localhost Dev'}
          </div>
        </div>

        {/* Agency Logo & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 p-0.5 shadow-xl shadow-emerald-950/60 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Radar className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            MOROCCO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">RADAR</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Plateforme E-Réputation & IA Hospitalité Maroc
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" /> Mot de Passe d'Accès
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Session Sécurisée</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Entrez votre mot de passe..."
                autoFocus
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Remember me & Options */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500/30 w-3.5 h-3.5 cursor-pointer accent-emerald-500"
              />
              <span>Mémoriser sur cet appareil</span>
            </label>
          </div>

          {/* Unlock Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Déverrouiller le Radar</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Security Info Card */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Protection Active
            </span>
            <span className="font-mono text-emerald-400">ICE : {AGENCY_METADATA.ice}</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Ce dashboard contient des données confidentielles d'établissements hôteliers et de facturation légale marocaine.
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-500 font-mono">
        {AGENCY_METADATA.entity} • {AGENCY_METADATA.brandName}
      </div>

    </div>
  );
};
