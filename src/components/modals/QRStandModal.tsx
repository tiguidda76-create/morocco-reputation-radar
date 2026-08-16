import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Printer, 
  Sparkles, 
  Star, 
  Smartphone, 
  Download, 
  Copy, 
  Check,
  Building
} from 'lucide-react';
import { Venue } from '../../types';
import { AGENCY_METADATA } from '../../data/mockData';

interface QRStandModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRStandModal: React.FC<QRStandModalProps> = ({ venue, isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'GOOGLE' | 'TRIPADVISOR'>('GOOGLE');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !venue) return null;

  const reviewLink =
    platform === 'GOOGLE'
      ? `https://g.page/r/${encodeURIComponent(venue.name.replace(/\s+/g, '-').toLowerCase())}/review`
      : `https://www.tripadvisor.com/UserReviewEdit-${encodeURIComponent(venue.name.replace(/\s+/g, '-'))}.html`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reviewLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Générateur de Chevalet QR &amp; Plaque NFC 5 Étoiles
              </h3>
              <p className="text-xs text-slate-400">
                Support de table et réception de luxe pour booster les avis positifs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Selector Controls */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-xs no-print">
          <span className="text-slate-300 font-medium">Plateforme Cible :</span>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPlatform('GOOGLE')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                platform === 'GOOGLE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Google Maps (Avis Rapide)
            </button>
            <button
              onClick={() => setPlatform('TRIPADVISOR')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                platform === 'TRIPADVISOR' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              TripAdvisor International
            </button>
          </div>
        </div>

        {/* Printable Stand Canvas */}
        <div className="p-6 sm:p-8 bg-slate-950 overflow-y-auto flex-1 flex justify-center">
          <div className="w-full max-w-md bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#020617] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 relative shadow-2xl text-center space-y-5 print-container">
            
            {/* Moroccan Gold Borders */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-amber-400/80 rounded-tl-lg pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-amber-400/80 rounded-tr-lg pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b border-l border-amber-400/80 rounded-bl-lg pointer-events-none"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b border-r border-amber-400/80 rounded-br-lg pointer-events-none"></div>

            <div>
              <span className="text-[9px] font-bold text-amber-400 tracking-[0.2em] uppercase block">
                HOSPITALITÉ DU ROYAUME DU MAROC
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-luxury tracking-wide mt-1">
                {venue.name}
              </h2>
              <p className="text-[11px] text-slate-400">{venue.city}</p>
            </div>

            {/* Stars icon row */}
            <div className="flex justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current text-amber-400" />
              ))}
            </div>

            <p className="text-xs text-slate-300 italic font-serif">
              « Votre séjour a-t-il été mémorable ? Partagez votre expérience pour soutenir notre équipe. »
            </p>

            {/* Simulated Vector QR Code */}
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-2xl shadow-xl inline-block">
                <svg viewBox="0 0 100 100" className="w-36 h-36">
                  {/* Outer Frame */}
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="26" height="26" fill="#020617" rx="3" />
                  <rect x="14" y="14" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="18" y="18" width="10" height="10" fill="#047857" rx="1" />

                  <rect x="64" y="10" width="26" height="26" fill="#020617" rx="3" />
                  <rect x="68" y="14" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="72" y="18" width="10" height="10" fill="#047857" rx="1" />

                  <rect x="10" y="64" width="26" height="26" fill="#020617" rx="3" />
                  <rect x="14" y="68" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="18" y="72" width="10" height="10" fill="#047857" rx="1" />

                  {/* QR Pattern Dots */}
                  <rect x="42" y="14" width="6" height="6" fill="#020617" />
                  <rect x="52" y="14" width="6" height="6" fill="#D97706" />
                  <rect x="42" y="24" width="6" height="6" fill="#020617" />
                  <rect x="48" y="32" width="8" height="8" fill="#047857" />
                  
                  <rect x="42" y="44" width="16" height="16" fill="#020617" rx="2" />
                  <circle cx="50" cy="52" r="4" fill="#F59E0B" />

                  <rect x="64" y="44" width="8" height="8" fill="#020617" />
                  <rect x="76" y="44" width="10" height="6" fill="#047857" />
                  <rect x="68" y="56" width="6" height="6" fill="#020617" />
                  <rect x="80" y="56" width="8" height="8" fill="#D97706" />

                  <rect x="42" y="64" width="8" height="8" fill="#047857" />
                  <rect x="54" y="64" width="6" height="6" fill="#020617" />
                  <rect x="46" y="76" width="10" height="6" fill="#D97706" />
                  <rect x="64" y="72" width="22" height="14" fill="#020617" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
                <Smartphone className="w-4 h-4" />
                Scannez ou Approchez votre Smartphone (NFC)
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                {platform === 'GOOGLE' ? 'Google Business Profile' : 'TripAdvisor Certificate of Excellence'}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[9px] text-slate-500 font-mono">
              Protection &amp; E-Réputation assurée par {AGENCY_METADATA.brandName}
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 no-print">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Lien copié !' : 'Copier le lien direct'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer le Chevalet (Format Table / Réception)
          </button>
        </div>

      </div>
    </div>
  );
};
