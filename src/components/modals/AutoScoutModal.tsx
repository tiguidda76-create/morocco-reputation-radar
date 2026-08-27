import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  MapPin, 
  Building2, 
  RefreshCw, 
  CheckCircle2, 
  Zap, 
  ShieldAlert, 
  Search,
  Filter,
  Play,
  ArrowRight,
  TrendingDown,
  Globe2
} from 'lucide-react';
import { Venue, MoroccanRegion, VenueCategory } from '../../types';
import { runAutonomousLeadScout, ScoutScanParams } from '../../services/leadScoutService';

interface AutoScoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportVenues: (venues: Venue[]) => void;
  existingVenues?: Venue[];
  onImportAndPitchNewVenues?: (newVenues: Venue[]) => void;
}

export const AutoScoutModal: React.FC<AutoScoutModalProps> = ({
  isOpen,
  onClose,
  onImportVenues,
  existingVenues = [],
  onImportAndPitchNewVenues,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<MoroccanRegion | 'ALL'>('ALL');
  const [selectedCity, setSelectedCity] = useState('Toutes les villes & pôles touristiques');
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory | 'ALL'>('ALL');
  const [targetCount, setTargetCount] = useState<number>(50);
  const [maxScore, setMaxScore] = useState<number>(4.4);
  const [minUnreplied, setMinUnreplied] = useState<number>(8);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');
  const [discoveredVenues, setDiscoveredVenues] = useState<Venue[]>([]);

  if (!isOpen) return null;

  const cityOptionsByRegion: Record<MoroccanRegion, string[]> = {
    'Marrakech-Safi': ['Marrakech (Médina & Guéliz)', 'Essaouira (Médina)', 'Safi'],
    'Casablanca-Settat': ['Casablanca (Gauthier & Maarif)', 'Casablanca (Ain Diab & Corniche)', 'Mohammedia'],
    'Rabat-Salé-Kénitra': ['Rabat (Agdal & Hassan)', 'Rabat (Kasbah des Oudayas)', 'Kénitra'],
    'Tanger-Tétouan-Al Hoceïma': ['Tanger (Kasbah & Marshan)', 'Chefchaouen (Médina)', 'Tétouan'],
    'Souss-Massa': ['Agadir (Baie & Marina)', 'Taghazout Bay', 'Taroudant'],
    'Fès-Meknès': ['Fès (Médina Talaa Kebira)', 'Meknès (Médina)', 'Ifrane'],
    'Drâa-Tafilalet': ['Merzouga (Désert)', 'Ouarzazate', 'Vallée du Dadès'],
    'L\'Oriental': ['Oujda', 'Nador', 'Saïdia'],
    'Béni Mellal-Khénifra': ['Béni Mellal', 'Bin El Ouidane'],
    'Guelmim-Oued Noun': ['Mirleft', 'Sidi Ifni'],
    'Laâyoune-Sakia El Hamra': ['Laâyoune'],
    'Dakhla-Oued Ed-Dahab': ['Dakhla (Lagune Kite & Eco-Lodge)'],
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(5);
    setScanStatusText('Connexion aux flux multi-plateformes (Google Places, Booking, TripAdvisor)...');
    setDiscoveredVenues([]);

    try {
      const params: ScoutScanParams = {
        region: selectedRegion,
        city: selectedCity,
        category: selectedCategory,
        count: targetCount,
        maxScore: maxScore,
        minUnrepliedReviews: minUnreplied,
        existingVenues: existingVenues,
      };

      const results = await runAutonomousLeadScout(params, (prog, text) => {
        setScanProgress(prog);
        setScanStatusText(text);
      });

      setDiscoveredVenues(results);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmImport = () => {
    if (discoveredVenues.length > 0) {
      onImportVenues(discoveredVenues);
      onClose();
    }
  };

  const handleConfirmImportAndPitch = () => {
    if (discoveredVenues.length > 0) {
      if (onImportAndPitchNewVenues) {
        onImportAndPitchNewVenues(discoveredVenues);
      } else {
        onImportVenues(discoveredVenues);
      }
      onClose();
    }
  };

  const totalCalculatedLoss = discoveredVenues.reduce((acc, v) => acc + v.annualLossMAD, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Scout IA : Scan Automatique &amp; Mass Discovery
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  ROYAUME DU MAROC 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Extraction massive de prospects ciblés avec calcul automatique des pertes financières et coordonnées directes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isScanning}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Region & City Selector */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                1. Zone Géographique
              </span>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Région :</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      const reg = e.target.value as MoroccanRegion | 'ALL';
                      setSelectedRegion(reg);
                      if (reg === 'ALL') {
                        setSelectedCity('Toutes les villes & pôles touristiques');
                      } else {
                        setSelectedCity(cityOptionsByRegion[reg][0] || 'Centre');
                      }
                    }}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none font-medium"
                  >
                    <option value="ALL" className="bg-slate-900 font-bold text-emerald-400">
                      🇲🇦 Tout le Maroc (12 Régions Nationales)
                    </option>
                    {Object.keys(cityOptionsByRegion).map((reg) => (
                      <option key={reg} value={reg} className="bg-slate-900">
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Ville / Pôle Cible :</label>
                  {selectedRegion === 'ALL' ? (
                    <div className="w-full p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 text-xs flex items-center gap-1.5 font-mono">
                      <Globe2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">Scan National (Tous Pôles)</span>
                    </div>
                  ) : (
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
                    >
                      {(cityOptionsByRegion[selectedRegion] || []).map((c) => (
                        <option key={c} value={c} className="bg-slate-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Category & Quantity */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                2. Segment Établissement
              </span>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Catégorie :</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none font-medium"
                  >
                    <option value="ALL" className="bg-slate-900 font-bold text-amber-400">
                      🌟 Tous les Segments (Riads, Hôtels, Restos, Spas, Palaces)
                    </option>
                    <option value="Riad de Luxe">Riad de Luxe (Médina)</option>
                    <option value="Restaurant Gastronomique">Restaurant Gastronomique &amp; Rooftop</option>
                    <option value="Boutique Hotel">Boutique Hôtel de Charme</option>
                    <option value="Palace 5-Star">Palace 5-Étoiles</option>
                    <option value="Camp Désert Luxury">Camp Désert Luxury</option>
                    <option value="Spa & Wellness">Spa &amp; Hammam Traditionnel</option>
                    <option value="Snack & Café Traditionnel">Snack &amp; Café Traditionnel</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Volume de Leads à Extraire :</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[25, 50, 100, 200].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setTargetCount(cnt)}
                        className={`py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                          targetCount === cnt
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cnt} Leads
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Qualification Filters */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-sky-400" />
                3. Qualification &amp; Déclenchement
              </span>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Score Max :</span>
                    <span className="text-amber-400 font-bold">&le; {maxScore}★</span>
                  </div>
                  <input
                    type="range"
                    min="3.8"
                    max="4.8"
                    step="0.1"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                    Cible les lieux qui ont besoin d'aide pour remonter leur note.
                  </span>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleStartScan}
                    disabled={isScanning}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Scan Massif en cours...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Lancer le Scan Massif ({targetCount} Leads)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Scanning Progress Bar */}
          {isScanning && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1.5 truncate mr-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" /> {scanStatusText}
                </span>
                <span className="text-emerald-300 font-bold">{scanProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Results Preview */}
          {discoveredVenues.length > 0 && (
            <div className="space-y-3">
              
              {/* Summary Metrics */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {discoveredVenues.length} Établissements Qualifiés Extraits
                    </span>
                    <span className="text-xs text-slate-400">
                      Tous équipés de numéros WhatsApp marocains et prêts pour le Mass Outreach.
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Manque à gagner total combiné :</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {(totalCalculatedLoss / 1000000).toFixed(2)} M MAD / an
                  </span>
                </div>
              </div>

              {/* Table Preview */}
              <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Établissement</th>
                      <th className="py-2.5 px-3">Catégorie</th>
                      <th className="py-2.5 px-3">Ville / Région</th>
                      <th className="py-2.5 px-3">Note &amp; Avis Non Répondus</th>
                      <th className="py-2.5 px-3">WhatsApp / Gérant</th>
                      <th className="py-2.5 px-3 text-right">Perte Estimée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
                    {discoveredVenues.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-white font-sans">{v.name}</td>
                        <td className="py-2.5 px-3 text-amber-300 font-sans text-[10px]">{v.category}</td>
                        <td className="py-2.5 px-3 text-slate-400 font-sans">{v.city}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-amber-400 font-bold">★ {v.overallScore}</span>
                          <span className="text-rose-400 ml-2">({v.unrepliedReviews} avis)</span>
                        </td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">
                          {v.phone} <span className="text-[10px] text-slate-400 font-normal font-sans">({v.contactPerson.split(' ')[0]})</span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-amber-400 font-bold">
                          {(v.annualLossMAD / 1000).toFixed(0)}k MAD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
          >
            Fermer
          </button>

          {discoveredVenues.length > 0 && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleConfirmImport}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Importer ({discoveredVenues.length} Leads)</span>
              </button>

              <button
                onClick={handleConfirmImportAndPitch}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-amber-950/50 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>⚡ Importer &amp; Pitcher Exclusivement ces {discoveredVenues.length} Nouveaux Leads ➔</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
