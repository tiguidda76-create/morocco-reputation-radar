import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  Copy, 
  Check, 
  Printer, 
  AlertOctagon, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';
import { DefamationCase } from '../../types';
import { AGENCY_METADATA } from '../../data/mockData';

interface LegalNoticeModalProps {
  defCase: DefamationCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({ defCase, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !defCase) return null;

  const dateNow = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const legalNoticeTemplate = `MISE EN DEMEURE FORMELLE — DEMANDE DE RETRAIT IMMÉDIAT DE CONTENU DIFFAMATOIRE
(Application des Articles 447-1, 447-2 et 447-3 du Code Pénal Marocain & Loi n° 09-08 relative à la protection des données)

Date : ${dateNow}
Établissement Défendeur / Demandeur : ${defCase.venueName} (${defCase.city}, Royaume du Maroc)
Mandataire E-Réputation : ${AGENCY_METADATA.entity} (ICE : ${AGENCY_METADATA.ice})
À l'attention de : Service Juridique / Trust & Safety Platform (${defCase.platform.toUpperCase()}) & Auteur : "${defCase.author}"

OBJET : Notification formelle de propos diffamatoires, allégations mensongères et atteinte grave à la réputation commerciale et à l'honneur.

Madame, Monsieur,

Nous agissons en qualité de mandataire légal en charge de la protection de l'e-réputation pour le compte de l'établissement hôtelier "${defCase.venueName}", sis à ${defCase.city}, Maroc.

1. EXPOSÉ DES FAITS ILLICITES :
Le ${defCase.dateFlagged}, l'utilisateur sous le pseudonyme "${defCase.author}" a publié sur votre plateforme un avis contenant les propos suivants :
« ${defCase.reviewSnippet} »

2. QUALIFICATION JURIDIQUE EN DROIT MAROCAIN :
Ces déclarations ne relèvent aucunement de la liberté d'expression ou de la critique d'expérience client, mais constituent des infractions pénales expressément réprimées par le Droit Positif Marocain :
- Article 447-1 du Code Pénal : Punit d'un emprisonnement de 6 mois à 3 ans quiconque porte atteinte à la vie privée ou diffuse des allégations mensongères dans le but de nuire.
- Article 447-2 du Code Pénal : Punit d'un emprisonnement de 1 à 3 ans et d'une amende de 2 000 à 20 000 DH la diffamation publique et la propagation d'informations calomnieuses portant préjudice à une personne physique ou morale.
- Absence d'antériorité de réservation ou de fiche de police prouvant la qualité de client réel.

3. SOMMATION :
Par la présente, nous vous mettons formellement en demeure de procéder au RETRAIT SANS DÉLAI (sous 48 heures ouvrées) de la publication litigieuse ci-dessus référencée.

À défaut de suppression dans le délai imparti, une plainte avec constitution de partie civile sera immédiatement déposée auprès de Monsieur le Procureur du Roi près le Tribunal de Première Instance compétent, accompagnée d'une demande de réquisition d'adresse IP et de dommages-intérêts pour préjudice commercial estimé à ${defCase.estimatedDamageMAD.toLocaleString()} MAD.

Sous toutes réserves d'usage et de droit.

Pour "${defCase.venueName}" et pour valoir ce que de droit,
Hassan Tiguidda — Directeur Morocco Reputation Agency
ICE : ${AGENCY_METADATA.ice} | Marrakech, Maroc
Contact : ${AGENCY_METADATA.phone} | ${AGENCY_METADATA.email}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(legalNoticeTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-b border-rose-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Mise en Demeure Juridique (Code Pénal Marocain Art. 447)
              </h3>
              <p className="text-xs text-rose-300">
                Dossier : <strong className="text-white">{defCase.venueName}</strong> | Préjudice estimé : {defCase.estimatedDamageMAD.toLocaleString()} MAD
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-slate-300">
              Ce document constitue une sommation formelle précontentieuse rédigée conformément aux dispositions des <strong>Articles 447-1 et 447-2 du Code Pénal Marocain</strong> pour retrait immédiat sur {defCase.platform.toUpperCase()}.
            </p>
          </div>

          {/* Text editor view */}
          <div className="relative">
            <textarea
              readOnly
              value={legalNoticeTemplate}
              rows={16}
              className="w-full p-4 font-mono text-[11px] text-slate-200 bg-slate-950 border border-slate-800 rounded-xl leading-relaxed resize-none focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié !' : 'Copier l\'acte'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Signé électroniquement par <strong>{AGENCY_METADATA.entity}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer l'Acte Juridique
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Fermer & Transmettre au Dossier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
