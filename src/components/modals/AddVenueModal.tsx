import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Plus
} from 'lucide-react';
import { Venue, MoroccanRegion, VenueCategory, ThreatLevel } from '../../types';

interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVenue: (venue: Venue) => void;
}

export const AddVenueModal: React.FC<AddVenueModalProps> = ({ isOpen, onClose, onAddVenue }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VenueCategory>('Riad de Luxe');
  const [region, setRegion] = useState<MoroccanRegion>('Marrakech-Safi');
  const [city, setCity] = useState('Marrakech (Médina)');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('06');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [overallScore, setOverallScore] = useState<number>(4.2);
  const [unrepliedReviews, setUnrepliedReviews] = useState<number>(14);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const estimatedLoss = Math.round(unrepliedReviews * 18000 + (5 - overallScore) * 45000);
    const threat: ThreatLevel =
      unrepliedReviews > 20 || overallScore < 4.0
        ? 'CRITICAL'
        : unrepliedReviews > 8
        ? 'WARNING'
        : 'HEALTHY';

    const newVenue: Venue = {
      id: 'venue-custom-' + Date.now(),
      name: name || 'Nouveau Riad / Établissement',
      category,
      region,
      city,
      address: address || 'Médina, ' + city,
      phone: phone || '0632155430',
      email: email || 'contact@etablissement.ma',
      contactPerson: contactPerson || 'Directeur / Gérant',
      overallScore,
      totalReviews: Math.round(unrepliedReviews * 24 + 180),
      unrepliedReviews,
      avgResponseTimeHours: Math.round(unrepliedReviews * 4.5 + 24),
      threatLevel: threat,
      annualLossMAD: estimatedLoss,
      platforms: {
        google: {
          platform: 'google',
          score: overallScore,
          totalReviews: Math.round(unrepliedReviews * 16 + 100),
          unrepliedCount: Math.round(unrepliedReviews * 0.6),
          negativeUnreplied: Math.round(unrepliedReviews * 0.25),
          lastReviewDate: 'Aujourd\'hui',
        },
        booking: {
          platform: 'booking',
          score: overallScore + 0.1,
          totalReviews: Math.round(unrepliedReviews * 8 + 60),
          unrepliedCount: Math.round(unrepliedReviews * 0.4),
          negativeUnreplied: Math.round(unrepliedReviews * 0.15),
          lastReviewDate: 'Hier',
        },
        tripadvisor: {
          platform: 'tripadvisor',
          score: overallScore - 0.1,
          totalReviews: Math.round(unrepliedReviews * 4 + 20),
          unrepliedCount: Math.round(unrepliedReviews * 0.2),
          negativeUnreplied: 1,
          lastReviewDate: 'Il y a 2j',
        },
        airbnb: { platform: 'airbnb', score: 4.8, totalReviews: 12, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: 'Il y a 1sem' },
        yelp: { platform: 'yelp', score: 3.9, totalReviews: 5, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      },
      competitorIds: [],
      recentReviews: [],
    };

    onAddVenue(newVenue);
    onClose();
  };

  const regions: MoroccanRegion[] = [
    'Marrakech-Safi',
    'Casablanca-Settat',
    'Rabat-Salé-Kénitra',
    'Tanger-Tétouan-Al Hoceïma',
    'Souss-Massa',
    'Fès-Meknès',
    'Drâa-Tafilalet',
    'L\'Oriental',
    'Béni Mellal-Khénifra',
    'Guelmim-Oued Noun',
    'Laâyoune-Sakia El Hamra',
    'Dakhla-Oued Ed-Dahab',
  ];

  const categories: VenueCategory[] = [
    'Riad de Luxe',
    'Palace 5-Star',
    'Boutique Hotel',
    'Restaurant Gastronomique',
    'Camp Désert Luxury',
    'Snack & Café Traditionnel',
    'Spa & Wellness'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Ajouter un Établissement au Radar National
              </h3>
              <p className="text-xs text-slate-400">
                Génération automatique de l'audit 5-plateformes & calcul du préjudice de réputation
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Nom de l'établissement *</label>
              <input
                type="text"
                required
                placeholder="Ex: Riad Dar Anika, Restaurant Le Jardin..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Région du Maroc *</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
              >
                {regions.map((r) => (
                  <option key={r} value={r} className="bg-slate-900">{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Ville / Quartier *</label>
              <input
                type="text"
                required
                placeholder="Ex: Marrakech (Guéliz), Tanger (Kasbah)..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Contact / Gérant</label>
              <input
                type="text"
                placeholder="Ex: Si Yassine El Fassi"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Téléphone / WhatsApp *</label>
              <input
                type="text"
                required
                placeholder="0632155430"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Email Professionnel</label>
              <input
                type="email"
                placeholder="contact@riad.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-slate-300 font-medium">Note Actuelle (Google/OTA)</label>
                <span className="font-mono font-bold text-amber-400">{overallScore.toFixed(1)} ★</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="5.0"
                step="0.1"
                value={overallScore}
                onChange={(e) => setOverallScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-slate-300 font-medium">Avis Sans Réponse Détectés</label>
                <span className="font-mono font-bold text-rose-400">{unrepliedReviews} avis</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={unrepliedReviews}
                onChange={(e) => setUnrepliedReviews(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Intégrer &amp; Auditer Immédiatement</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
