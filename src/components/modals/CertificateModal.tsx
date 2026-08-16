import React from 'react';
import { 
  X, 
  Award, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { Venue } from '../../types';
import { AGENCY_METADATA } from '../../data/mockData';

interface CertificateModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ venue, isOpen, onClose }) => {
  if (!isOpen || !venue) return null;

  const dateNow = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[95vh] flex flex-col">
        
        {/* Modal Controls */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            Certificat Officiel de Performance & E-Réputation Hospitalité Maroc
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer / Télécharger le Diplôme (PDF)
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-8 bg-slate-950 overflow-y-auto flex-1 flex justify-center">
          <div className="w-full max-w-3xl bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#020617] border-4 border-amber-500/40 rounded-3xl p-8 sm:p-12 relative shadow-2xl print-container text-center space-y-6">
            
            {/* Moroccan Ornamental Corner Borders */}
            <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-400/80 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-400/80 rounded-tr-xl pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-400/80 rounded-bl-xl pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-400/80 rounded-br-xl pointer-events-none"></div>

            {/* Seal & Logo Header */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-emerald-500 to-amber-300 p-1 shadow-xl">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Award className="w-10 h-10 text-amber-400" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-400 tracking-[0.25em] uppercase">
                MOROCCO REPUTATION AGENCY • ROYAUME DU MAROC
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 font-luxury tracking-wide">
                CERTIFICAT DE PERFORMANCE & E-RÉPUTATION
              </h2>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
            </div>

            {/* Presentation Text */}
            <div className="space-y-2 text-slate-300 text-xs sm:text-sm">
              <p className="text-slate-400 italic">Le présent certificat d'excellence est décerné avec les félicitations du jury à :</p>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-emerald-300 font-display tracking-tight py-1">
                {venue.name}
              </h1>
              <p className="text-xs text-amber-300 font-medium">
                {venue.category} • {venue.city}, {venue.region}
              </p>
            </div>

            {/* Certified Performance Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <Clock className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-[10px] text-slate-400 block">Délai de Réponse</span>
                <span className="text-base font-bold text-white font-mono">1.8 Heure</span>
                <span className="text-[9px] text-emerald-400 block">ex-72h (-97.5%)</span>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <Star className="w-4 h-4 text-amber-400 mx-auto" />
                <span className="text-[10px] text-slate-400 block">Score Global</span>
                <span className="text-base font-bold text-amber-400 font-mono">{venue.overallScore} / 5.0</span>
                <span className="text-[9px] text-amber-300 block">5 Plateformes</span>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <ShieldCheck className="w-4 h-4 text-sky-400 mx-auto" />
                <span className="text-[10px] text-slate-400 block">Indice Qualité QC</span>
                <span className="text-base font-bold text-sky-300 font-mono">99.4%</span>
                <span className="text-[9px] text-sky-400 block">Zéro Faux Pas</span>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-[10px] text-slate-400 block">CA Sécurisé (MAD)</span>
                <span className="text-base font-bold text-emerald-400 font-mono">+{(venue.annualLossMAD * 0.85).toLocaleString()}</span>
                <span className="text-[9px] text-emerald-300 block">MAD Sauvegardés</span>
              </div>
            </div>

            {/* Legal and Compliance Attestation */}
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl mx-auto pt-2">
              Atteste que l'établissement bénéficie d'une surveillance continue 24h/24, d'un traitement bilingue respectueux des codes de l'hospitalité marocaine et d'une protection juridique active contre la diffamation en ligne selon les lois en vigueur dans le Royaume.
            </p>

            {/* Signatures & Stamps */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 gap-8 text-left text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 block">Émis à Marrakech le :</span>
                <span className="text-slate-300 font-mono font-semibold">{dateNow}</span>
                <span className="text-[10px] text-slate-500 block">Certificat ID : <span className="text-emerald-400 font-mono">MRA-CERT-2026-{(venue.id || '01').toUpperCase()}</span></span>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] text-slate-500 block">Pour le Conseil d'Évaluation :</span>
                <span className="text-sm font-bold text-white font-luxury block">Hassan Tiguidda</span>
                <span className="text-[10px] text-emerald-400 font-mono block">Directeur Général • ICE {AGENCY_METADATA.ice}</span>
                <div className="inline-block px-2 py-0.5 mt-1 border border-amber-400/40 rounded text-[9px] font-mono text-amber-300">
                  ★ CACHET NUMÉRIQUE AUTHENTIFIÉ ★
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
