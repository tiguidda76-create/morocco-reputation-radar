import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Edit3, 
  XCircle, 
  MessageSquare, 
  Send, 
  Star, 
  Globe2, 
  Volume2, 
  Copy, 
  Check, 
  Layers, 
  RefreshCw,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_SIMULATOR_REVIEWS } from '../../data/mockData';
import { ReviewItem } from '../../types';

interface TabReviewRescueProps {
  isAutoPilot: boolean;
  setIsAutoPilot: (val: boolean) => void;
}

export const TabReviewRescue: React.FC<TabReviewRescueProps> = ({
  isAutoPilot,
  setIsAutoPilot,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(SAMPLE_SIMULATOR_REVIEWS);
  const [selectedReviewId, setSelectedReviewId] = useState<string>(SAMPLE_SIMULATOR_REVIEWS[0].id);
  const [selectedTone, setSelectedTone] = useState<'Royal Palace' | 'Warm Riad' | 'Casual Hospitality' | 'Concierge'>('Warm Riad');
  const [selectedLang, setSelectedLang] = useState<'FR' | 'DARIJA' | 'EN' | 'ES'>('FR');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [editedDraft, setEditedDraft] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const currentReview = reviews.find((r) => r.id === selectedReviewId) || reviews[0];

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B', '#38BDF8'],
    });
  };

  // Simulate Live AI Regeneration with chosen Tone and Language
  const handleRegenerate = () => {
    setIsGenerating(true);
    setIsEditing(false);

    setTimeout(() => {
      let content = '';
      let keywords: string[] = [];

      if (selectedLang === 'DARIJA') {
        content = `Salam Si/Lalla ${currentReview.author}, Choukran bzzaf 3la had l-remarque. Smhlina bzzaf 3la had l-mochkil li w9a3 lik f "${currentReview.venueName}". 3ndna l-ghira 3la l-diyafa l-maghribia 🇲🇦 w drna l-lazem bach n-slhou had l-khata2 f l-blast. Marhba bik dima f l-médina dyalna, w tasslo bina direct bach n-diro lik l-khatir.`;
        keywords = ['hospitalité marocaine authentique', 'accueil chaleureux médina', 'thé à la menthe de bienvenue'];
      } else if (selectedLang === 'EN') {
        content = `Dear ${currentReview.author}, Thank you for taking the time to share your feedback. We sincerely apologize for the inconvenience experienced during your visit to ${currentReview.venueName}. Moroccan hospitality and guest delight remain our highest priorities. We have already addressed this with our operations team and would be delighted to welcome you back for a truly flawless experience. Warm regards from Marrakech.`;
        keywords = ['Moroccan palace hospitality', 'boutique riad experience', 'authentic Marrakech stay'];
      } else if (selectedLang === 'ES') {
        content = `Estimado/a ${currentReview.author}, Muchas gracias por compartir su experiencia en ${currentReview.venueName}. Lamentamos profundamente no haber cumplido con sus expectativas. La calidez y la legendaria hospitalidad marroquí son nuestro mayor compromiso. Hemos tomado medidas inmediatas con nuestro equipo para garantizar una estancia perfecta en su próxima visita. Saludos muy cordiales.`;
        keywords = ['hospitalidad marroquí', 'riad con encanto en la medina', 'estancia inolvidable Marrakech'];
      } else {
        // FR
        if (selectedTone === 'Royal Palace') {
          content = `Chère / Cher ${currentReview.author}, Nous vous exprimons nos regrets les plus sincères pour ce manquement indigne des standards d'excellence de ${currentReview.venueName}. La grandeur de l'hospitalité de palace exige une perfection absolue. Notre Direction Générale prend personnellement en charge votre dossier pour vous assurer une considération royale lors de votre prochaine escale. Très respectueusement.`;
        } else if (selectedTone === 'Warm Riad') {
          content = `Chère / Cher ${currentReview.author}, Du fond du cœur, nous vous remercions pour votre précieux retour et vous présentons nos plus sincères excuses. Dans la pure tradition de l'hospitalité marocaine et la chaleur de notre riad, votre bien-être est sacré. Nous avons corrigé ce point dès ce matin et nous nous réjouissons de vous servir à nouveau notre thé à la menthe fraîche en terrasse. Avec toute notre bienveillance.`;
        } else {
          content = `Bonjour ${currentReview.author}, Merci d'avoir pris le temps de nous écrire. Nous sommes navrés pour ce désagrément survenu chez ${currentReview.venueName}. Toute l'équipe s'est mobilisée immédiatement pour rectifier la situation. Au plaisir de vous régaler à nouveau très bientôt !`;
        }
        keywords = ['riad authentique médina', 'hospitalité marocaine d\'exception', 'thé à la menthe de bienvenue', 'service d\'excellence'];
      }

      setReviews((prev) =>
        prev.map((r) => {
          if (r.id === currentReview.id) {
            return {
              ...r,
              aiDraft: {
                language: selectedLang,
                tone: selectedTone,
                content,
                seoKeywords: keywords,
                qcScore: 99.4,
                empathyScore: 99,
                brandVoiceScore: 100,
                legalSafetyScore: 100,
                generatedAt: new Date().toLocaleTimeString(),
              },
            };
          }
          return r;
        })
      );

      setIsGenerating(false);
    }, 700);
  };

  const handleApproveAndPublish = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, status: 'RESCUED', clientApprovalStatus: 'APPROVED' }
          : r
      )
    );
    triggerConfetti();
    setActionNotice('✅ Réponse approuvée avec succès et publiée via API Google / Booking !');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleReject = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, status: 'REJECTED', clientApprovalStatus: 'EDIT_REQUESTED' }
          : r
      )
    );
    setActionNotice('✍️ Demande de révision transmise à l\'Agent Rédacteur.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeDraft = currentReview.aiDraft;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Dual Mode Explanation & Switcher */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-display">
              Live Review Rescue Studio &amp; Portail de Validation Client
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Générez des réponses ultra-calibrées avec intégration SEO locale et bienveillance marocaine, validées en 1-clic ou en auto-pilote total.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">MODE ACTIF :</span>
            <span className={`text-xs font-bold ${isAutoPilot ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isAutoPilot ? 'Mode B : Auto-Pilote (>98.4%)' : 'Mode A : Validation HITL'}
            </span>
          </div>

          <button
            onClick={() => setIsAutoPilot(!isAutoPilot)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isAutoPilot
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50'
            }`}
          >
            {isAutoPilot ? 'Passer en Mode A' : 'Activer Auto-Pilote'}
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Review Queue Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              File d'Attente Avis Clients ({reviews.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Surveillance Live</span>
          </div>

          <div className="space-y-2.5">
            {reviews.map((rev) => {
              const isSelected = rev.id === selectedReviewId;
              const isPending = rev.status === 'PENDING_APPROVAL';

              return (
                <div
                  key={rev.id}
                  onClick={() => {
                    setSelectedReviewId(rev.id);
                    setIsEditing(false);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white truncate max-w-[170px]">
                      {rev.venueName}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                    <span className="text-slate-400">{rev.author} ({rev.authorCountry})</span>
                    <span
                      className={`font-mono font-bold px-1.5 py-0.2 rounded ${
                        rev.status === 'RESCUED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isPending
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rev.status === 'RESCUED' ? '✓ PUBLIÉ' : 'EN ATTENTE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive AI Studio & Live Calibration (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Review Details Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {currentReview.platform[0]}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{currentReview.venueName}</h3>
                  <span className="text-[11px] text-slate-400">
                    Avis de <strong className="text-slate-200">{currentReview.author}</strong> ({currentReview.authorCountry}) • {currentReview.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-xs font-mono font-bold text-amber-400">
                  ★ {currentReview.rating} / 5
                </span>
                <span className="text-[10px] text-rose-400 font-semibold uppercase">
                  [{currentReview.sentiment}]
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed italic">
              <strong>Titre : « {currentReview.title} »</strong>
              <p className="mt-1">{currentReview.comment}</p>
            </div>
          </div>

          {/* Tone & Language Selector Controls */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Tone dropdown */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-400">Ton :</span>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Warm Riad">Chaleur Riad Traditionnel 🇲🇦</option>
                  <option value="Royal Palace">Palace Royal d'Exception 👑</option>
                  <option value="Casual Hospitality">Fast Casual &amp; Convivial ☕</option>
                  <option value="Concierge">Conciergerie Moderne 🛎️</option>
                </select>
              </div>

              {/* Language Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(['FR', 'DARIJA', 'EN', 'ES'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      selectedLang === lang
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'FR' && '🇫🇷 FR'}
                    {lang === 'DARIJA' && '🇲🇦 Darija'}
                    {lang === 'EN' && '🇬🇧 EN'}
                    {lang === 'ES' && '🇪🇸 ES'}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Régénérer</span>
              </button>
            </div>
          </div>

          {/* AI Response Output Card with QC Score */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-800/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Brouillon Réponse IA (Généré par Reply Rescue Agent)
                </span>
              </div>

              {activeDraft && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">QC Score :</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-full font-mono font-bold text-xs">
                    {activeDraft.qcScore}% ✓
                  </span>
                </div>
              )}
            </div>

            {/* Editable or View Draft */}
            {isEditing ? (
              <textarea
                value={editedDraft}
                onChange={(e) => setEditedDraft(e.target.value)}
                rows={5}
                className="w-full p-3.5 bg-slate-950 border border-emerald-500/50 rounded-xl text-xs text-slate-200 leading-relaxed font-sans focus:outline-none"
              />
            ) : (
              <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 text-xs text-slate-100 leading-relaxed relative group">
                <p>{activeDraft?.content || 'En attente de génération...'}</p>
                {activeDraft && (
                  <button
                    onClick={() => handleCopy(activeDraft.content)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    title="Copier la réponse"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            )}

            {/* Injected Local Moroccan SEO Keywords */}
            {activeDraft?.seoKeywords && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Mots-Clés SEO Hospitalité Marocaine Insérés :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDraft.seoKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded-md text-[10px] font-medium"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* QC Detailed Metric Pills */}
            {activeDraft && (
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-center">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Empathie</span>
                  <span className="font-bold text-emerald-400">{activeDraft.empathyScore}%</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Voix de Marque</span>
                  <span className="font-bold text-emerald-400">{activeDraft.brandVoiceScore}%</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Sécurité Légale</span>
                  <span className="font-bold text-emerald-400">{activeDraft.legalSafetyScore}%</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Délai Traitement</span>
                  <span className="font-bold text-amber-400">1.8 Min</span>
                </div>
              </div>
            )}

            {/* Actions for Mode A / Mode B */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button
                    onClick={() => {
                      if (activeDraft) {
                        activeDraft.content = editedDraft;
                      }
                      setIsEditing(false);
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Sauvegarder Modification
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditedDraft(activeDraft?.content || '');
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modifier le Texte</span>
                  </button>
                )}

                <button
                  onClick={() => handleReject(currentReview.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-lg text-xs font-medium"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Demander Révision</span>
                </button>
              </div>

              <button
                onClick={() => handleApproveAndPublish(currentReview.id)}
                className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-950/50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approuver &amp; Publier en 1-Clic</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
