import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  AlertTriangle, 
  ArrowUpRight, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Building, 
  Award,
  Plus,
  Download,
  QrCode,
  Map,
  ListFilter
} from 'lucide-react';
import { Venue, MoroccanRegion, VenueCategory, ThreatLevel } from '../../types';

interface TabLeadEngineProps {
  venues: Venue[];
  onOpenAudit: (venue: Venue) => void;
  onDispatchPitch: (venue: Venue) => void;
  onLaunchAutoReviews: (venue: Venue) => void;
  onOpenCertificate: (venue: Venue) => void;
  onOpenAddVenue: () => void;
  onOpenQRStand: (venue: Venue) => void;
}

export const TabLeadEngine: React.FC<TabLeadEngineProps> = ({
  venues,
  onOpenAudit,
  onDispatchPitch,
  onLaunchAutoReviews,
  onOpenCertificate,
  onOpenAddVenue,
  onOpenQRStand,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedThreat, setSelectedThreat] = useState<string>('ALL');
  const [activeView, setActiveView] = useState<'TABLE' | 'HEATMAP'>('TABLE');

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
    'Palace 5-Star',
    'Riad de Luxe',
    'Boutique Hotel',
    'Restaurant Gastronomique',
    'Camp Désert Luxury',
    'Snack & Café Traditionnel',
    'Spa & Wellness'
  ];

  // Regional Heatmap Distribution
  const regionalStats = [
    { name: 'Marrakech-Safi', count: 18450, unreplied: 610, lossMAD: '1.42M', hub: 'Marrakech / Essaouira', color: 'border-emerald-500/50 bg-emerald-950/30' },
    { name: 'Casablanca-Settat', count: 12200, unreplied: 430, lossMAD: '980K', hub: 'Casablanca / El Jadida', color: 'border-sky-500/50 bg-sky-950/30' },
    { name: 'Tanger-Tétouan', count: 5120, unreplied: 145, lossMAD: '410K', hub: 'Tanger / Chefchaouen', color: 'border-amber-500/50 bg-amber-950/30' },
    { name: 'Fès-Meknès', count: 4230, unreplied: 130, lossMAD: '380K', hub: 'Fès Médina / Ifrane', color: 'border-emerald-500/50 bg-emerald-950/30' },
    { name: 'Souss-Massa', count: 3820, unreplied: 75, lossMAD: '310K', hub: 'Agadir / Taghazout', color: 'border-sky-500/50 bg-sky-950/30' },
    { name: 'Drâa-Tafilalet', count: 1390, unreplied: 30, lossMAD: '340K', hub: 'Merzouga / Ouarzazate', color: 'border-amber-500/50 bg-amber-950/30' },
  ];

  // Filtering
  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchRegion = selectedRegion === 'ALL' || v.region === selectedRegion;
      const matchCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
      const matchThreat = selectedThreat === 'ALL' || v.threatLevel === selectedThreat;

      return matchSearch && matchRegion && matchCategory && matchThreat;
    });
  }, [venues, searchTerm, selectedRegion, selectedCategory, selectedThreat]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Nom', 'Categorie', 'Region', 'Ville', 'Score', 'Avis_Total', 'Avis_Non_Repondus', 'Perte_Estimee_MAD', 'Telephone', 'Email', 'Contact'];
    const rows = filteredVenues.map((v) => [
      `"${v.name}"`,
      `"${v.category}"`,
      `"${v.region}"`,
      `"${v.city}"`,
      v.overallScore,
      v.totalReviews,
      v.unrepliedReviews,
      v.annualLossMAD,
      `"${v.phone}"`,
      `"${v.email}"`,
      `"${v.contactPerson}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `morocco-radar-leads-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Catalogue National Moniteur
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              45,210
            </span>
            <span className="text-xs text-emerald-400 font-medium">Établissements</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Couverture sur 12 régions du Maroc
          </p>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avis Critiques Non Répondus
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-display">
              1,420
            </span>
            <span className="text-xs text-rose-300 font-medium font-mono">1★ &amp; 2★ en attente</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Risque d'annulation direct estimé à 62%
          </p>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Délai Réponse Moyen Marché
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">
              72.4h
            </span>
            <span className="text-xs text-emerald-400 font-medium font-mono">➔ Cible : &lt; 2.0h</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            97.2% plus rapide via Flotte IA
          </p>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pipeline Retainer Mensuel
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              3.84M
            </span>
            <span className="text-xs text-amber-400 font-semibold">MAD / mois</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Opportunités qualifiées prêtes au dispatch
          </p>
        </div>
      </div>

      {/* Action Header & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('TABLE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeView === 'TABLE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Annuaire Détaillé &amp; Prospection</span>
          </button>
          <button
            onClick={() => setActiveView('HEATMAP')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeView === 'HEATMAP' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Radar &amp; Heatmap Régionale (12 Régions)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Exporter CSV ({filteredVenues.length})</span>
          </button>

          <button
            onClick={onOpenAddVenue}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-950/50"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter Établissement</span>
          </button>
        </div>
      </div>

      {/* Heatmap View (When selected) */}
      {activeView === 'HEATMAP' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                Cartographie Régionale de la Menace E-Réputation (Maroc)
              </h3>
              <p className="text-xs text-slate-400">
                Densité des établissements surveillés et fuite de réservations par pôle touristique
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">12 Régions Actives</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionalStats.map((stat, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${stat.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{stat.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">Pôle : {stat.hub}</span>
                </div>

                <div className="flex justify-between text-xs pt-1">
                  <span className="text-slate-400">Établissements :</span>
                  <span className="font-bold text-white font-mono">{stat.count.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Avis sans réponse :</span>
                  <span className="font-bold text-rose-400 font-mono">{stat.unreplied} critiques</span>
                </div>

                <div className="flex justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-amber-300 font-medium">Fuite CA Estimée :</span>
                  <span className="font-extrabold text-white font-mono">{stat.lossMAD} MAD / an</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      {activeView === 'TABLE' && (
        <>
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par établissement, ville (Marrakech, Casa...), ou contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Region filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-slate-900">Toutes les Régions (12)</option>
                    {regions.map((reg) => (
                      <option key={reg} value={reg} className="bg-slate-900">
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2">
                  <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-slate-900">Toutes Catégories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Threat filter */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <select
                    value={selectedThreat}
                    onChange={(e) => setSelectedThreat(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-slate-900">Tout Niveau de Menace</option>
                    <option value="CRITICAL" className="bg-slate-900">🔴 Menace Critique</option>
                    <option value="WARNING" className="bg-slate-900">🟡 En Alerte</option>
                    <option value="MODERATE" className="bg-slate-900">🔵 Modéré</option>
                    <option value="HEALTHY" className="bg-slate-900">🟢 Stable / Sain</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
              <span>
                Affichage de <strong className="text-slate-200">{filteredVenues.length}</strong> établissements ciblés
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Audit 5-Plateformes en temps réel actif
              </span>
            </div>
          </div>

          {/* Directory Table */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Établissement &amp; Type</th>
                    <th className="py-3.5 px-4">Ville / Région</th>
                    <th className="py-3.5 px-4 text-center">Score Global</th>
                    <th className="py-3.5 px-4 text-center">Avis Sans Réponse</th>
                    <th className="py-3.5 px-4">Fuite de CA Estimée</th>
                    <th className="py-3.5 px-4 text-right">Actions d'Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredVenues.map((venue) => {
                    const threatBadge = {
                      CRITICAL: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
                      WARNING: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
                      MODERATE: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
                      HEALTHY: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
                    }[venue.threatLevel];

                    return (
                      <tr
                        key={venue.id}
                        className="hover:bg-slate-900/60 transition-colors group"
                      >
                        {/* Venue */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                                {venue.name}
                              </span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${threatBadge}`}>
                                {venue.threatLevel}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Building className="w-3 h-3 text-amber-400" />
                              {venue.category} • {venue.contactPerson}
                            </span>
                          </div>
                        </td>

                        {/* Region */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-200">{venue.city}</span>
                            <span className="text-[10px] text-slate-500">{venue.region}</span>
                          </div>
                        </td>

                        {/* Score */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800">
                            <span className="text-amber-400 font-bold font-display text-sm">
                              ★ {venue.overallScore.toFixed(1)}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              ({venue.totalReviews.toLocaleString()})
                            </span>
                          </div>
                        </td>

                        {/* Unreplied */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span
                              className={`font-mono font-bold text-sm ${
                                venue.unrepliedReviews > 20
                                  ? 'text-rose-400'
                                  : venue.unrepliedReviews > 0
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {venue.unrepliedReviews} avis
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Retard: ~{venue.avgResponseTimeHours}h
                            </span>
                          </div>
                        </td>

                        {/* Loss */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-mono font-extrabold text-rose-400 text-xs">
                              -{venue.annualLossMAD.toLocaleString()} MAD/an
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Perte directe de réservations
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* 1. Deep Audit */}
                            <button
                              onClick={() => onOpenAudit(venue)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 hover:border-emerald-500/40"
                              title="Ouvrir l'audit complet 5-plateformes"
                            >
                              <span>Audit 5P</span>
                            </button>

                            {/* 2. Dispatch Pitch */}
                            <button
                              onClick={() => onDispatchPitch(venue)}
                              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1"
                              title="Générer pitch WhatsApp (Darija/FR/EN)"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              <span>Pitch 1-Clic</span>
                            </button>

                            {/* 3. Launch Auto Reviews */}
                            <button
                              onClick={() => onLaunchAutoReviews(venue)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-all shadow-md shadow-emerald-950/50 flex items-center gap-1"
                              title="Lancer l'auto-répondeur IA sur cet établissement"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>Auto-IA</span>
                            </button>

                            {/* 4. QR Stand Generator */}
                            <button
                              onClick={() => onOpenQRStand(venue)}
                              className="p-1.5 bg-slate-800 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 rounded-lg transition-colors border border-slate-700"
                              title="Générer Chevalet QR de Table 5 Étoiles"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>

                            {/* 5. Certificate */}
                            <button
                              onClick={() => onOpenCertificate(venue)}
                              className="p-1.5 bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 rounded-lg transition-colors border border-slate-700"
                              title="Générer le Certificat Officiel d'Excellence E-Réputation"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
