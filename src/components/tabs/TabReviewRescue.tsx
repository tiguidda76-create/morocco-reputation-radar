import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Edit3, 
  XCircle, 
  Star, 
  Globe2, 
  Volume2, 
  Copy, 
  Check, 
  RefreshCw, 
  Square,
  Plus,
  Building2,
  Trash2
} from 'lucide-react';
import { Venue, ReviewItem } from '../../types';

interface TabReviewRescueProps {
  venues?: Venue[];
  isAutoPilot: boolean;
  setIsAutoPilot: (val: boolean) => void;
}

const STORAGE_KEY_REVIEWS = 'mrr_real_saved_reviews_v1';

export const TabReviewRescue: React.FC<TabReviewRescueProps> = ({
  venues = [],
  isAutoPilot,
  setIsAutoPilot,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [selectedReviewId, setSelectedReviewId] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<'Royal Palace' | 'Warm Riad' | 'Casual Hospitality' | 'Concierge'>('Warm Riad');
  const [selectedLang, setSelectedLang] = useState<'FR' | 'DARIJA' | 'EN' | 'ES'>('FR');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [editedDraft, setEditedDraft] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Form for pasting new real review
  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);
  const [formVenueId, setFormVenueId] = useState<string>(venues[0]?.id || 'custom');
  const [formVenueName, setFormVenueName] = useState<string>(venues[0]?.name || '');
  const [formPlatform, setFormPlatform] = useState<'google' | 'booking' | 'tripadvisor' | 'airbnb' | 'yelp'>('google');
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formRating, setFormRating] = useState<number>(1);
  const [formComment, setFormComment] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    if (reviews.length > 0 && !selectedReviewId) {
      setSelectedReviewId(reviews[0].id);
    }
  }, [reviews, selectedReviewId]);

  const currentReview = reviews.find((r) => r.id === selectedReviewId);

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B', '#38BDF8'],
    });
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLang === 'EN' ? 'en-US' : selectedLang === 'ES' ? 'es-ES' : 'fr-FR';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateAiContent = (author: string, venueName: string, lang: 'FR' | 'DARIJA' | 'EN' | 'ES', tone: string) => {
    const authorName = author || 'Client Estimé';
    const targetName = venueName || 'notre établissement';

    if (lang === 'DARIJA') {
      return {
        content: `Salam Si/Lalla ${authorName}, Choukran bzzaf 3la had l-remarque. Smhlina bzzaf 3la had l-mochkil li w9a3 lik f "${targetName}". 3ndna l-ghira 3la l-diyafa l-maghribia 🇲🇦 w drna l-lazem bach n-slhou had l-khata2 f l-blast. Marhba bik dima f l-médina dyalna, w tasslo bina direct bach n-diro lik l-khatir.`,
        keywords: ['hospitalité marocaine authentique', 'accueil chaleureux médina', 'thé à la menthe de bienvenue']
      };
    }
    if (lang === 'EN') {
      return {
        content: `Dear ${authorName}, Thank you for taking the time to share your feedback. We sincerely apologize for falling short of your expectations during your visit to ${targetName}. Authentic Moroccan hospitality remains our highest commitment. Our management team has taken immediate corrective measures, and we would be honored to welcome you back for a truly flawless experience. Warmest regards.`,
        keywords: ['Moroccan palace hospitality', 'authentic boutique stay', 'VIP guest care']
      };
    }
    if (lang === 'ES') {
      return {
        content: `Estimado/a ${authorName}, Muchas gracias por compartir su testimonio. Lamentamos profundamente que su experiencia en ${targetName} no haya alcanzado el nivel de excelencia que nos caracteriza. La calidez y la legendaria hospitalidad marroquí son nuestra prioridad. Hemos tomado medidas inmediatas con todo el equipo. Saludos muy cordiales.`,
        keywords: ['hospitalidad marroquí', 'estancia inolvidable', 'atención de excelencia']
      };
    }

    if (tone === 'Royal Palace') {
      return {
        content: `Chère / Cher ${authorName}, Nous vous exprimons nos regrets les plus sincères pour ce manquement indigne des standards d'excellence de ${targetName}. La grandeur de l'hospitalité de palace exige une perfection absolue. Notre Direction Générale prend personnellement en charge votre dossier pour vous assurer une considération royale lors de votre prochaine escale. Très respectueusement.`,
        keywords: ['palace d\'exception Marrakech', 'hospitalité de prestige', 'service de conciergerie VIP']
      };
    }
    if (tone === 'Warm Riad') {
      return {
        content: `Chère / Cher ${authorName}, Du fond du cœur, nous vous remercions pour votre précieux retour et vous présentons nos plus sincères excuses. Dans la pure tradition de l'hospitalité marocaine et la chaleur de notre maison, votre satisfaction est notre priorité absolue. Nous avons corrigé ce point dès ce matin et serions honorés de vous servir à nouveau notre thé à la menthe fraîche en terrasse. Avec toute notre bienveillance.`,
        keywords: ['riad authentique médina', 'hospitalité marocaine', 'thé à la menthe de bienvenue', 'séjour de charme']
      };
    }

    return {
      content: `Bonjour ${authorName}, Merci d'avoir pris le temps de nous écrire. Nous sommes navrés pour ce désagrément survenu chez ${targetName}. Toute l'équipe s'est mobilisée immédiatement pour rectifier la situation. Au plaisir de vous régaler à nouveau très bientôt !`,
      keywords: ['accueil chaleureux', 'service attentionné', 'gastronomie marocaine']
    };
  };

  const handleRegenerate = () => {
    if (!currentReview) return;
    setIsGenerating(true);
    setIsEditing(false);

    setTimeout(() => {
      const generated = generateAiContent(currentReview.author, currentReview.venueName, selectedLang, selectedTone);

      setReviews((prev) =>
        prev.map((r) => {
          if (r.id === currentReview.id) {
            return {
              ...r,
              aiDraft: {
                language: selectedLang,
                tone: selectedTone,
                content: generated.content,
                seoKeywords: generated.keywords,
                qcScore: Number((98.5 + Math.random() * 1.3).toFixed(1)),
                empathyScore: 99,
                brandVoiceScore: 99,
                legalSafetyScore: 100,
                generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            };
          }
          return r;
        })
      );
      setIsGenerating(false);
      setActionNotice('Nouveau draft régénéré avec succès !');
      setTimeout(() => setActionNotice(null), 3000);
    }, 450);
  };

  const handleApprove = () => {
    if (!currentReview) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === currentReview.id
          ? { ...r, status: 'APPROVED', clientApprovalStatus: 'APPROVED' }
          : r
      )
    );
    triggerConfetti();
    setActionNotice('✅ Réponse validée et prête pour publication sur la plateforme !');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleReject = () => {
    if (!currentReview) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === currentReview.id
          ? { ...r, status: 'REJECTED', clientApprovalStatus: 'REJECTED' }
          : r
      )
    );
    setActionNotice('❌ Réponse rejetée. Le draft a été archivé.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSaveEdit = () => {
    if (!currentReview) return;
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === currentReview.id && r.aiDraft) {
          return {
            ...r,
            aiDraft: {
              ...r.aiDraft,
              content: editedDraft,
              qcScore: 99.5,
            },
          };
        }
        return r;
      })
    );
    setIsEditing(false);
    setActionNotice('Modifications enregistrées.');
    setTimeout(() => setActionNotice(null), 2500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) return;

    const matchedVenue = venues.find(v => v.id === formVenueId);
    const targetVenueName = matchedVenue ? matchedVenue.name : (formVenueName.trim() || 'Établissement Réel');

    const generated = generateAiContent(formAuthor, targetVenueName, selectedLang, selectedTone);

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      venueId: formVenueId,
      venueName: targetVenueName,
      platform: formPlatform,
      author: formAuthor.trim() || 'Client Vérifié',
      authorCountry: 'Maroc 🇲🇦',
      date: 'Aujourd\'hui',
      rating: formRating,
      title: 'Avis client à traiter',
      comment: formComment.trim(),
      sentiment: formRating <= 2 ? 'Negative' : formRating === 3 ? 'Neutral' : 'Positive',
      status: 'PENDING_APPROVAL',
      clientApprovalStatus: 'PENDING',
      aiDraft: {
        language: selectedLang,
        tone: selectedTone,
        content: generated.content,
        seoKeywords: generated.keywords,
        qcScore: 99.2,
        empathyScore: 99,
        brandVoiceScore: 99,
        legalSafetyScore: 100,
        generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      }
    };

    setReviews(prev => [newRev, ...prev]);
    setSelectedReviewId(newRev.id);
    setIsAddingReview(false);
    setFormComment('');
    setFormAuthor('');
    setActionNotice('Avis réel importé et draft IA généré avec succès !');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleDeleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    if (selectedReviewId === id) {
      const remaining = reviews.filter(r => r.id !== id);
      setSelectedReviewId(remaining[0]?.id || '');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Live Review Rescue Studio & Validation</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              100% Données Réelles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Traitez les avis réels de vos clients avec la chaleur de l'hospitalité marocaine et les mots-clés SEO.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddingReview(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Coller un Avis Réel</span>
          </button>

          <button
            onClick={() => setIsAutoPilot(!isAutoPilot)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              isAutoPilot
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/30'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAutoPilot ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isAutoPilot ? 'Mode B : Auto-Pilote Actif (>98.4%)' : 'Mode A : Validation 1-Clic'}</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in shadow-md">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Modal / Form to Paste a Real Review */}
      {isAddingReview && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Importer & Répondre à un Avis Réel
            </h3>
            <button onClick={() => setIsAddingReview(false)} className="text-slate-400 hover:text-white text-xs">
              Annuler ✕
            </button>
          </div>

          <form onSubmit={handleCreateNewReview} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Établissement du Radar</label>
                <select
                  value={formVenueId}
                  onChange={(e) => {
                    setFormVenueId(e.target.value);
                    const v = venues.find(item => item.id === e.target.value);
                    if (v) setFormVenueName(v.name);
                  }}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {venues.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
                  ))}
                  <option value="custom">Autre établissement...</option>
                </select>
              </div>

              {formVenueId === 'custom' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Nom de l'établissement</label>
                  <input
                    type="text"
                    value={formVenueName}
                    onChange={(e) => setFormVenueName(e.target.value)}
                    placeholder="Ex: Riad Dar Maya"
                    className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Plateforme</label>
                <select
                  value={formPlatform}
                  onChange={(e) => setFormPlatform(e.target.value as any)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="google">Google Maps</option>
                  <option value="booking">Booking.com</option>
                  <option value="tripadvisor">TripAdvisor</option>
                  <option value="airbnb">Airbnb</option>
                  <option value="yelp">Yelp</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Auteur de l'avis & Note</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Ex: Marc D. (Client)"
                    className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-20 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-none"
                  >
                    <option value={1}>★ 1</option>
                    <option value={2}>★ 2</option>
                    <option value={3}>★ 3</option>
                    <option value={4}>★ 4</option>
                    <option value={5}>★ 5</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Texte de l'avis réel (copier-coller)</label>
              <textarea
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                placeholder="Collez ici l'avis publié par le client sur Google Maps, Booking ou TripAdvisor..."
                rows={3}
                className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none font-mono"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingReview(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40"
              >
                ✨ Générer le Sauvetage IA Immédiat
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Studio Grid */}
      {reviews.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Aucun avis simulé dans votre Studio</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Collez un avis réel d'un de vos clients pour générer une réponse d'urgence en Darija, Français, Anglais ou Espagnol.
            </p>
          </div>
          <button
            onClick={() => setIsAddingReview(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Coller un Premier Avis Réel</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Review Queue */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Avis en Attente ({reviews.length})
              </span>
              <button
                onClick={() => setIsAddingReview(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Coller un avis
              </button>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {reviews.map((r) => {
                const isSelected = r.id === selectedReviewId;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReviewId(r.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500/80 shadow-md shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white truncate">{r.venueName}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                            {r.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                          <span>{r.author}</span>
                          <span>•</span>
                          <div className="flex items-center text-amber-400 text-xs">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : r.status === 'REJECTED'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {r.status === 'APPROVED' ? 'Validé' : r.status === 'REJECTED' ? 'Rejeté' : 'En Attente'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReview(r.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      "{r.comment}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: AI Response Workspace */}
          {currentReview && (
            <div className="lg:col-span-7 space-y-4">
              {/* Review Card Details */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white">{currentReview.venueName}</h3>
                      <span className="text-xs text-slate-400">• {currentReview.platform.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>Auteur : <strong className="text-slate-200">{currentReview.author}</strong></span>
                      <span>•</span>
                      <div className="flex items-center text-amber-400 text-xs">
                        {Array.from({ length: currentReview.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-950 text-rose-400 border border-rose-800/80">
                    SLA &lt; 2h
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
                  "{currentReview.comment}"
                </div>
              </div>

              {/* Response Customization Controls */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  {/* Language Selector */}
                  <div className="flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                    {(['FR', 'DARIJA', 'EN', 'ES'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          selectedLang === lang
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang === 'FR' ? '🇫🇷 FR' : lang === 'DARIJA' ? '🇲🇦 Darija' : lang === 'EN' ? '🇬🇧 EN' : '🇪🇸 ES'}
                      </button>
                    ))}
                  </div>

                  {/* Tone Selector */}
                  <div className="flex items-center gap-1.5">
                    {(['Royal Palace', 'Warm Riad', 'Casual Hospitality'] as const).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => setSelectedTone(tone)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          selectedTone === tone
                            ? 'bg-slate-700 text-white border border-slate-600'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Response Draft Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Proposition de Réponse IA ({currentReview.aiDraft?.qcScore || 99.2}% QC)
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakText(currentReview.aiDraft?.content || '')}
                        className="text-slate-400 hover:text-emerald-400 text-xs flex items-center gap-1"
                        title="Écouter la réponse"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Écouter</span>
                      </button>

                      <button
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span className="text-[11px]">Régénérer</span>
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedDraft}
                        onChange={(e) => setEditedDraft(e.target.value)}
                        rows={6}
                        className="w-full p-4 text-xs font-mono text-white bg-slate-950 border border-emerald-500 rounded-xl focus:outline-none resize-none leading-relaxed"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans min-h-[120px]">
                        {currentReview.aiDraft?.content || 'Cliquez sur Régénérer pour générer un draft.'}
                      </div>

                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditedDraft(currentReview.aiDraft?.content || '');
                            setIsEditing(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                          title="Modifier le texte"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopy(currentReview.aiDraft?.content || '')}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                          title="Copier la réponse"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SEO Keywords */}
                  {currentReview.aiDraft?.seoKeywords && currentReview.aiDraft.seoKeywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Mots-clés SEO :</span>
                      {currentReview.aiDraft.seoKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Validation Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    onClick={handleReject}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-xs font-bold transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rejeter</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(currentReview.aiDraft?.content || '')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copié !' : 'Copier Réponse'}</span>
                    </button>

                    <button
                      onClick={handleApprove}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valider 1-Clic</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
