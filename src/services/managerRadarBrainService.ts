import { Venue, DefamationCase, PricingPlan, MoroccanRegion, ThreatLevel } from '../types';
import { AGENCY_METADATA } from '../data/mockData';
import { formatMoroccanPhoneE164 } from './whatsappService';

export interface ManagerRadarAction {
  id: string;
  label: string;
  actionType: 'AUDIT' | 'PITCH' | 'LEGAL' | 'AUTONOMOUS' | 'INVOICE' | 'CERTIFICATE' | 'SWITCH_TAB' | 'RUN_QUERY';
  targetVenueId?: string;
  targetTab?: string;
  variant?: 'emerald' | 'amber' | 'indigo' | 'rose' | 'slate';
  payload?: any;
}

export interface ManagerRadarKPI {
  label: string;
  value: string;
  subtext?: string;
  color?: 'emerald' | 'amber' | 'rose' | 'indigo' | 'cyan';
}

export interface ManagerRadarResponse {
  text: string;
  venueCards?: Venue[];
  kpis?: ManagerRadarKPI[];
  actions?: ManagerRadarAction[];
  quickFollowUps?: string[];
  timestamp: string;
  source: 'LLM_LIVE' | 'LOCAL_BRAIN';
}

/**
 * Normalise un texte pour faciliter la recherche sans accent ni casse
 */
function normalizeStr(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Calcul des statistiques globales de la flotte
 */
export function computeFleetStats(venues: Venue[]) {
  const totalVenues = venues.length;
  const totalAnnualLossMAD = venues.reduce((sum, v) => sum + (v.annualLossMAD || 0), 0);
  const totalUnrepliedReviews = venues.reduce((sum, v) => sum + (v.unrepliedReviews || 0), 0);
  const avgRating = totalVenues > 0 
    ? (venues.reduce((sum, v) => sum + v.overallScore, 0) / totalVenues).toFixed(2)
    : '4.2';
  
  const criticalThreats = venues.filter((v) => v.threatLevel === 'CRITICAL');
  const warningThreats = venues.filter((v) => v.threatLevel === 'WARNING');
  
  // Par ville
  const cityDistribution: Record<string, number> = {};
  venues.forEach((v) => {
    cityDistribution[v.city] = (cityDistribution[v.city] || 0) + 1;
  });

  // Par plateforme d'avis non répondus
  let googleUnreplied = 0;
  let bookingUnreplied = 0;
  let tripAdvisorUnreplied = 0;
  let airbnbUnreplied = 0;

  venues.forEach((v) => {
    googleUnreplied += v.platforms.google?.unrepliedCount || 0;
    bookingUnreplied += v.platforms.booking?.unrepliedCount || 0;
    tripAdvisorUnreplied += v.platforms.tripadvisor?.unrepliedCount || 0;
    airbnbUnreplied += v.platforms.airbnb?.unrepliedCount || 0;
  });

  return {
    totalVenues,
    totalAnnualLossMAD,
    totalUnrepliedReviews,
    avgRating,
    criticalCount: criticalThreats.length,
    warningCount: warningThreats.length,
    criticalVenues: criticalThreats,
    cityDistribution,
    platforms: {
      google: googleUnreplied,
      booking: bookingUnreplied,
      tripadvisor: tripAdvisorUnreplied,
      airbnb: airbnbUnreplied,
    }
  };
}

/**
 * Recherche avancée d'établissements par mot-clé, nom, ville, catégorie ou niveau de menace
 */
export function searchVenuesContext(venues: Venue[], query: string): Venue[] {
  const norm = normalizeStr(query);
  if (!norm) return venues.slice(0, 5);

  const exact = venues.filter((v) => normalizeStr(v.name).includes(norm));
  if (exact.length > 0) return exact;

  const byCity = venues.filter((v) => normalizeStr(v.city).includes(norm));
  if (byCity.length > 0) return byCity;

  const byCategory = venues.filter((v) => normalizeStr(v.category).includes(norm));
  if (byCategory.length > 0) return byCategory;

  const byRegion = venues.filter((v) => normalizeStr(v.region).includes(norm));
  if (byRegion.length > 0) return byRegion;

  // Mots-clés libres
  const tokens = norm.split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length > 0) {
    const scored = venues
      .map((v) => {
        let score = 0;
        const target = `${normalizeStr(v.name)} ${normalizeStr(v.city)} ${normalizeStr(v.category)} ${normalizeStr(v.region)}`;
        tokens.forEach((t) => {
          if (target.includes(t)) score += 1;
        });
        return { venue: v, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      return scored.map((s) => s.venue);
    }
  }

  return [];
}

/**
 * Appel optionnel aux APIs LLM si clés présentes
 */
async function callLiveLLMForManagerRadar(
  userMessage: string,
  fleetStats: ReturnType<typeof computeFleetStats>,
  relevantVenues: Venue[],
  currentTab?: string
): Promise<string | null> {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

  const systemContext = `
Tu es "Manager Radar", l'IA directrice suprême et cheffe d'orchestre de la plateforme marocaine "Morocco Reputation Radar" gérée par Hassan Tiguidda (ICE: ${AGENCY_METADATA.ice}, BMCE Bank Guéliz).
Ton rôle est d'analyser, auditer et piloter la réputation en ligne de ${fleetStats.totalVenues} établissements marocains (Palaces, Riads, Hôtels, Restaurants, Bivouacs) répartis entre Marrakech, Casablanca, Agadir, Tanger, Fès, Rabat, Merzouga, etc.

Statistiques en direct de la flotte :
- Total établissements synchronisés : ${fleetStats.totalVenues}
- Manque à gagner annuel total : ${fleetStats.totalAnnualLossMAD.toLocaleString()} MAD/an
- Total avis sans réponse : ${fleetStats.totalUnrepliedReviews}
- Note moyenne flotte : ${fleetStats.avgRating}/5
- Établissements en risque critique (ThreatLevel CRITICAL) : ${fleetStats.criticalCount}
- Répartition avis sans réponse : Google (${fleetStats.platforms.google}), Booking (${fleetStats.platforms.booking}), TripAdvisor (${fleetStats.platforms.tripadvisor}), Airbnb (${fleetStats.platforms.airbnb})
- Contexte légal marocain : Loi 103-13, Article 447 du Code Pénal Marocain (protection contre la diffamation commerciale).

Onglet actif de l'utilisateur : "${currentTab || 'général'}".
Établissements pertinents trouvés pour la question : ${relevantVenues.slice(0, 3).map((v) => `${v.name} (${v.city}, ${v.overallScore}★, perte: ${v.annualLossMAD} MAD)`).join(' | ')}.

Directives de réponse :
1. Réponds toujours avec précision, autorité bienveillante et orientée action opérationnelle marocaine (mentionne les MAD, les plateformes, les villes, les chiffres exacts).
2. Utilise le format Markdown avec listes à puces, gras et séparateurs clairs.
3. Sois concis et direct, en proposant des étapes concrètes (Audit, Pitch WhatsApp, Requête légale, Devis).
`;

  // 1. Google Gemini
  if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemContext}\n\nQuestion de l'utilisateur : ${userMessage}` }]
              }
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
          })
        }
      );
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 30) {
          return text.trim();
        }
      }
    } catch (e) {
      console.warn('Manager Radar Gemini error:', e);
    }
  }

  // 2. OpenAI
  if (openAiKey && openAiKey !== 'your_openai_api_key_here') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemContext },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
        })
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && text.trim().length > 30) {
          return text.trim();
        }
      }
    } catch (e) {
      console.warn('Manager Radar OpenAI error:', e);
    }
  }

  return null;
}

/**
 * Moteur d'analyse local ultra-puissant et déterministe (zéro latence)
 */
export async function askManagerRadar(
  userQuery: string,
  venues: Venue[],
  currentTab: string = 'leads',
  selectedVenue?: Venue | null
): Promise<ManagerRadarResponse> {
  const normQuery = normalizeStr(userQuery);
  const fleetStats = computeFleetStats(venues);
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Tenter l'appel Live LLM si activé
  const matchedVenues = searchVenuesContext(venues, userQuery);
  const liveLLMText = await callLiveLLMForManagerRadar(userQuery, fleetStats, matchedVenues, currentTab);

  // 2. ANALYSE DES INTENTIONS CLÉS

  // CAS A: "Check everything" / "Bilan global" / "Status" / "KPIs" / "Auditer la flotte"
  if (
    normQuery.includes('check everything') ||
    normQuery.includes('tout verifier') ||
    normQuery.includes('bilan') ||
    normQuery.includes('overview') ||
    normQuery.includes('status') ||
    normQuery.includes('statut') ||
    normQuery.includes('rapport global') ||
    normQuery.includes('kpi') ||
    normQuery.includes('flotte') ||
    normQuery === 'check' ||
    normQuery === 'audit' ||
    normQuery === 'start' ||
    normQuery === 'aide'
  ) {
    const topUrgent = [...venues]
      .sort((a, b) => b.unrepliedReviews - a.unrepliedReviews || b.annualLossMAD - a.annualLossMAD)
      .slice(0, 3);

    const kpis: ManagerRadarKPI[] = [
      { label: 'Flotte Synchronisée', value: `${fleetStats.totalVenues} Venues`, subtext: 'Maroc 12 Régions', color: 'emerald' },
      { label: 'Manque à Gagner Total', value: `${(fleetStats.totalAnnualLossMAD / 1000000).toFixed(1)}M MAD/an`, subtext: 'Perte de chiffre d\'affaires', color: 'rose' },
      { label: 'Avis Sans Réponse', value: `${fleetStats.totalUnrepliedReviews}`, subtext: `Google: ${fleetStats.platforms.google} • Booking: ${fleetStats.platforms.booking}`, color: 'amber' },
      { label: 'Alertes Critiques', value: `${fleetStats.criticalCount}`, subtext: 'Nécessite action urgente', color: 'rose' },
    ];

    const actions: ManagerRadarAction[] = [
      { id: 'act-pitch-all', label: '🚀 Lancer Mass Pitch WhatsApp', actionType: 'SWITCH_TAB', targetTab: 'leads', variant: 'emerald' },
      { id: 'act-auton-pipeline', label: '⚡ Exécuter Pipeline Multi-Agents', actionType: 'AUTONOMOUS', targetVenueId: topUrgent[0]?.id, variant: 'indigo' },
      { id: 'act-crisis-kanban', label: '⚖️ Inspecter Crises & Diffamation', actionType: 'SWITCH_TAB', targetTab: 'crisis', variant: 'amber' },
    ];

    const text = liveLLMText || `📊 **SYNTHÈSE EXÉCUTIVE MOROCCO RADAR — AUDIT FLOTTE EN DIRECT**

J'ai analysé l'intégralité de notre base de données (**${fleetStats.totalVenues} établissements actifs** au Maroc).

### 🔍 Diagnostic Clé :
- **Perte financière modélisée :** **${fleetStats.totalAnnualLossMAD.toLocaleString()} MAD / an** directement causée par le déficit de réputation et les avis négatifs sans réponse.
- **Volume d'avis en souffrance :** **${fleetStats.totalUnrepliedReviews} avis sans réponse** (dont **${fleetStats.platforms.google}** sur Google Maps et **${fleetStats.platforms.booking}** sur Booking.com).
- **Établissements en statut critique :** **${fleetStats.criticalCount} établissements** subissent une fuite de réservations majeure avec un score inférieur à 4.2★.
- **Note moyenne nationale :** **${fleetStats.avgRating} / 5★**.

### 🚨 Top 3 Établissements Prioritaires (Action Immédiate Recommandée) :
1. **${topUrgent[0]?.name}** (${topUrgent[0]?.city}) — **${topUrgent[0]?.unrepliedReviews} avis sans réponse** | Perte: **-${topUrgent[0]?.annualLossMAD.toLocaleString()} MAD/an**.
2. **${topUrgent[1]?.name}** (${topUrgent[1]?.city}) — **${topUrgent[1]?.unrepliedReviews} avis sans réponse** | Perte: **-${topUrgent[1]?.annualLossMAD.toLocaleString()} MAD/an**.
3. **${topUrgent[2]?.name}** (${topUrgent[2]?.city}) — **${topUrgent[2]?.unrepliedReviews} avis sans réponse** | Perte: **-${topUrgent[2]?.annualLossMAD.toLocaleString()} MAD/an**.

Clique sur les cartes interactives ci-dessous pour déclencher un audit furtif, pitcher via WhatsApp ou lancer l'intervention multi-agents autonome.`;

    return {
      text,
      kpis,
      venueCards: topUrgent,
      actions,
      quickFollowUps: [
        '🚨 Quels sont les 5 établissements les plus critiques ?',
        '🏨 Analyser tous les Riads de Marrakech',
        '⚖️ Vérifier les avis diffamatoires sous l\'Article 447',
        '💰 Calculer le potentiel de revenus avec les formules VIP'
      ],
      timestamp: timeNow,
      source: liveLLMText ? 'LLM_LIVE' : 'LOCAL_BRAIN',
    };
  }

  // CAS B: Recherche d'un établissement spécifique
  if (matchedVenues.length > 0 && (normQuery.length > 3 || selectedVenue)) {
    const targetVenue = matchedVenues[0];
    const cleanPhone = formatMoroccanPhoneE164(targetVenue.phone);

    const kpis: ManagerRadarKPI[] = [
      { label: 'Score Global', value: `${targetVenue.overallScore}★`, subtext: `${targetVenue.totalReviews} avis au total`, color: targetVenue.overallScore >= 4.5 ? 'emerald' : 'amber' },
      { label: 'Avis Sans Réponse', value: `${targetVenue.unrepliedReviews}`, subtext: 'Toutes plateformes', color: targetVenue.unrepliedReviews > 5 ? 'rose' : 'emerald' },
      { label: 'Manque à Gagner', value: `-${(targetVenue.annualLossMAD / 1000).toFixed(0)}k MAD`, subtext: 'Perte annuelle estimée', color: 'rose' },
      { label: 'Niveau d\'Urgence', value: targetVenue.threatLevel, subtext: targetVenue.threatLevel === 'CRITICAL' ? 'Intervention immédiate' : 'Sous surveillance', color: targetVenue.threatLevel === 'CRITICAL' ? 'rose' : 'amber' },
    ];

    const actions: ManagerRadarAction[] = [
      { id: `act-audit-${targetVenue.id}`, label: '📊 Lancer Audit Express 5P', actionType: 'AUDIT', targetVenueId: targetVenue.id, variant: 'emerald' },
      { id: `act-pitch-${targetVenue.id}`, label: '💬 Pitcher WhatsApp Direct', actionType: 'PITCH', targetVenueId: targetVenue.id, variant: 'amber' },
      { id: `act-auto-${targetVenue.id}`, label: '⚡ Pipeline Multi-Agents', actionType: 'AUTONOMOUS', targetVenueId: targetVenue.id, variant: 'indigo' },
      { id: `act-legal-${targetVenue.id}`, label: '⚖️ Dossier Diffamation Art. 447', actionType: 'LEGAL', targetVenueId: targetVenue.id, variant: 'rose' },
    ];

    const text = liveLLMText || `🏨 **DOSSIER D'AUDIT DÉTAILLÉ : ${targetVenue.name.toUpperCase()}**

Voici la fiche de renseignement réputationnelle complète pour **${targetVenue.name}** à **${targetVenue.city}** (${targetVenue.region}) :

### 📌 Synthèse & Performances Plateformes :
- **Catégorie :** ${targetVenue.category}
- **Contact Direction :** **${targetVenue.contactPerson}**
- **Téléphone Direct :** \`${cleanPhone || targetVenue.phone}\`
- **Email :** \`${targetVenue.email}\`
- **Google Maps :** **${targetVenue.platforms.google.score}★** (${targetVenue.platforms.google.totalReviews} avis • **${targetVenue.platforms.google.unrepliedCount} non répondus**)
- **Booking.com :** **${targetVenue.platforms.booking.score}★** (${targetVenue.platforms.booking.totalReviews} avis • **${targetVenue.platforms.booking.unrepliedCount} non répondus**)
- **TripAdvisor :** **${targetVenue.platforms.tripadvisor.score}★** (${targetVenue.platforms.tripadvisor.totalReviews} avis • **${targetVenue.platforms.tripadvisor.unrepliedCount} non répondus**)

### 💰 Impact Économique :
- **Manque à gagner annuel calculé :** **-${targetVenue.annualLossMAD.toLocaleString()} MAD/an**
- **Formule recommandée :** **Pack Signature Prestige (2 500 MAD/mois)** — Amorti dès la récupération de 2 réservations directes évitant la commission OTA (18%).

Tu peux lancer l'audit visuel, générer le pitch WhatsApp personnalisé ou déployer notre chaîne multi-agents en un clic ci-dessous.`;

    return {
      text,
      kpis,
      venueCards: [targetVenue],
      actions,
      quickFollowUps: [
        `💬 Pitcher ${targetVenue.name} via WhatsApp`,
        `📊 Exécuter un audit 5-plateformes sur ${targetVenue.name}`,
        `⚡ Lancer la rédaction de réponse Mode A`,
        `💰 Générer un devis pro forma BMCE pour ${targetVenue.name}`
      ],
      timestamp: timeNow,
      source: liveLLMText ? 'LLM_LIVE' : 'LOCAL_BRAIN',
    };
  }

  // CAS C: Analyse Régionale / Par Ville (Marrakech, Casablanca, Agadir, Tanger, etc.)
  const cities = ['marrakech', 'casablanca', 'agadir', 'tanger', 'fes', 'rabat', 'merzouga', 'essaouira', 'ouarzazate', 'chefchaouen'];
  const matchedCity = cities.find((c) => normQuery.includes(c));

  if (matchedCity) {
    const cityVenues = venues.filter((v) => normalizeStr(v.city).includes(matchedCity));
    const cityName = cityVenues[0]?.city || matchedCity.toUpperCase();
    const cityLoss = cityVenues.reduce((s, v) => s + v.annualLossMAD, 0);
    const cityUnreplied = cityVenues.reduce((s, v) => s + v.unrepliedReviews, 0);
    const cityAvg = cityVenues.length > 0 
      ? (cityVenues.reduce((s, v) => s + v.overallScore, 0) / cityVenues.length).toFixed(2)
      : '4.3';

    const cityUrgent = [...cityVenues]
      .sort((a, b) => b.unrepliedReviews - a.unrepliedReviews)
      .slice(0, 3);

    const kpis: ManagerRadarKPI[] = [
      { label: `Établissements ${cityName}`, value: `${cityVenues.length}`, subtext: 'Base active', color: 'emerald' },
      { label: 'Manque à Gagner Zone', value: `${(cityLoss / 1000000).toFixed(1)}M MAD`, subtext: 'Perte annuelle cumulée', color: 'rose' },
      { label: 'Avis Sans Réponse', value: `${cityUnreplied}`, subtext: 'À traiter d\'urgence', color: 'amber' },
      { label: 'Note Moyenne Zone', value: `${cityAvg}★`, subtext: 'Benchmark régional', color: 'cyan' },
    ];

    const actions: ManagerRadarAction[] = [
      { id: `act-city-pitch-${matchedCity}`, label: `🚀 Pitcher les ${cityVenues.length} leads de ${cityName}`, actionType: 'SWITCH_TAB', targetTab: 'leads', variant: 'emerald' },
      { id: `act-city-auto-${matchedCity}`, label: '⚡ Pipeline Multi-Agents sur le lead #1', actionType: 'AUTONOMOUS', targetVenueId: cityUrgent[0]?.id, variant: 'indigo' },
    ];

    const text = liveLLMText || `📍 **RAPPORT DE ZONE GÉOGRAPHIQUE : ${cityName.toUpperCase()}**

J'ai filtré la base de données sur la zone de **${cityName}** :

- **Total établissements référencés :** **${cityVenues.length} adresses** (Palaces, Riads de charme, Tables gastronomiques).
- **Manque à gagner régional :** **${cityLoss.toLocaleString()} MAD/an**.
- **Volume d'avis non traités :** **${cityUnreplied} avis sans réponse**.
- **Note moyenne de la zone :** **${cityAvg}★**.

### 🏆 Établissements nécessitant un audit prioritaire à ${cityName} :
${cityUrgent.map((v, i) => `${i + 1}. **${v.name}** — ${v.category} | **${v.unrepliedReviews} avis non répondus** | -${v.annualLossMAD.toLocaleString()} MAD/an`).join('\n')}

Les cartes des principaux établissements de ${cityName} sont prêtes ci-dessous pour déclenchement opérationnel.`;

    return {
      text,
      kpis,
      venueCards: cityUrgent,
      actions,
      quickFollowUps: [
        `🚨 Qui a la plus forte perte financière à ${cityName} ?`,
        `💬 Pitcher les leads de ${cityName} par WhatsApp`,
        `🏨 Comparer ${cityName} avec Casablanca`
      ],
      timestamp: timeNow,
      source: liveLLMText ? 'LLM_LIVE' : 'LOCAL_BRAIN',
    };
  }

  // CAS D: Analyse Juridique & Crises Diffamation (Article 447, Loi 103-13, Fake Reviews)
  if (
    normQuery.includes('diffamation') ||
    normQuery.includes('447') ||
    normQuery.includes('loi') ||
    normQuery.includes('legal') ||
    normQuery.includes('légal') ||
    normQuery.includes('avocat') ||
    normQuery.includes('crise') ||
    normQuery.includes('takedown') ||
    normQuery.includes('plainte')
  ) {
    const criticalVenues = venues.filter((v) => v.threatLevel === 'CRITICAL' || v.unrepliedReviews > 12).slice(0, 3);

    const kpis: ManagerRadarKPI[] = [
      { label: 'Cadre Juridique', value: 'Art. 447 C.P.', subtext: 'Loi marocaine 103-13', color: 'rose' },
      { label: 'Dossiers à Risque', value: `${fleetStats.criticalCount} Établissements`, subtext: 'Diffamation commerciale', color: 'amber' },
      { label: 'Taux de Retrait Estimé', value: '88.4%', subtext: 'Mise en demeure formelle', color: 'emerald' },
      { label: 'Délai d\'Astreinte', value: '48h', subtext: 'Notification modération', color: 'indigo' },
    ];

    const actions: ManagerRadarAction[] = [
      { id: 'act-open-crisis-tab', label: '⚖️ Ouvrir le Kanban Crise & Diffamation', actionType: 'SWITCH_TAB', targetTab: 'crisis', variant: 'rose' },
      { id: 'act-sample-notice', label: '🛡️ Générer Mise en Demeure Art. 447', actionType: 'LEGAL', targetVenueId: criticalVenues[0]?.id, variant: 'amber' },
    ];

    const text = liveLLMText || `⚖️ **CELLULE JURIDIQUE & ESCALADE DIFFAMATION (CODE PÉNAL MAROCAIN)**

En vertu de l'**Article 447 du Code Pénal Marocain (renforcé par la Loi 103-13)**, toute diffusion publique d'allégations mensongères ou diffamatoires portant atteinte à la réputation commerciale d'un établissement est passible de sanctions pénales et d'astreintes civiles.

### 🛡️ Protocole d'intervention activé par @Legal-Shield :
1. **Capture probatoire horodatée :** Empreinte numérique de l'avis litigieux (Google, Booking, TripAdvisor) certifiant le préjudice commercial.
2. **Rédaction de Mise en Demeure d'Avocat :** Notification formelle avec sommation de retrait sous 48 heures aux services juridiques de la plateforme.
3. **Réponse d'attente certifiée :** Publication d'une réponse de rétablissement de marque désamorçant le dommage d'image en moins de 2 heures.

### 🚨 Établissements actuellement prioritaires pour escalade légale :
${criticalVenues.map((v) => `• **${v.name}** (${v.city}) — Risque critique identifié (Perte estimée: ${v.annualLossMAD.toLocaleString()} MAD)`).join('\n')}

Accède directement au tableau Kanban des litiges ci-dessous :`;

    return {
      text,
      kpis,
      venueCards: criticalVenues,
      actions,
      quickFollowUps: [
        '⚖️ Générer une mise en demeure formelle',
        '🚨 Voir tous les dossiers du Kanban Crise',
        '✍️ Rédiger une réponse de rétablissement d\'urgence'
      ],
      timestamp: timeNow,
      source: liveLLMText ? 'LLM_LIVE' : 'LOCAL_BRAIN',
    };
  }

  // CAS E: Devis, Facturation, Données Bancaires BMCE & Tarifs
  if (
    normQuery.includes('facture') ||
    normQuery.includes('devis') ||
    normQuery.includes('pro forma') ||
    normQuery.includes('bmce') ||
    normQuery.includes('rib') ||
    normQuery.includes('ice') ||
    normQuery.includes('prix') ||
    normQuery.includes('tarif') ||
    normQuery.includes('pack')
  ) {
    const kpis: ManagerRadarKPI[] = [
      { label: 'ICE Agence', value: AGENCY_METADATA.ice, subtext: AGENCY_METADATA.entity, color: 'emerald' },
      { label: 'Banque Partenaire', value: 'BMCE Bank Guéliz', subtext: 'Marrakech', color: 'indigo' },
      { label: 'Exonération TVA', value: 'Art. 91-II-1°', subtext: 'Code Général des Impôts', color: 'amber' },
      { label: 'Pack d\'Entrée', value: '700 MAD/mois', subtext: 'Essential Booster', color: 'cyan' },
    ];

    const actions: ManagerRadarAction[] = [
      { id: 'act-goto-billing', label: '💼 Accéder au Studio Facturation & Devis', actionType: 'SWITCH_TAB', targetTab: 'billing', variant: 'emerald' },
      { id: 'act-goto-pricing', label: '🏷️ Voir la Grille Tarifaire & Rétributions', actionType: 'SWITCH_TAB', targetTab: 'pricing', variant: 'indigo' },
    ];

    const text = liveLLMText || `💼 **DONNÉES COMMERCIALES & FACTURATION OFFICIELLE**

Voici la structure contractuelle et fiscale de notre agence :

### 🏛️ Identifiants Légaux & Bancaires :
- **Raison Sociale :** **${AGENCY_METADATA.entity}** (${AGENCY_METADATA.brandName})
- **Identifiant Commun de l'Entreprise (ICE) :** \`${AGENCY_METADATA.ice}\`
- **Numéro d'Identifiant Fiscal :** \`${AGENCY_METADATA.identifiantFiscal}\`
- **Banque :** **${AGENCY_METADATA.bankName}** (${AGENCY_METADATA.bankCity})
- **RIB Officiel (24 chiffres) :** \`${AGENCY_METADATA.rib}\`
- **Régime Fiscal :** Exonération de TVA selon l'**Article 91 - II - 1° du Code Général des Impôts (CGI Marocain)**.

### 🏷️ Grille des Formules d'Abonnement (Retainers Mensuels) :
1. **Pack Essential (700 MAD / mois)** : Surveillance 24/7, jusqu'à 30 réponses certifiées, QR Stand offert.
2. **Pack Professional (1 500 MAD / mois)** : Multi-plateformes 5P, réponses trilingues FR/DARIJA/EN, scoring QC > 98.5%, rapport mensuel PDF.
3. **Pack Signature Prestige (2 500 MAD / mois)** : Gestion intégrale VIP, désamorçage de crise < 2h, assistance juridique Art. 447, consultation directrice mensuelle.

Tu peux éditer un devis Pro Forma officiel dans l'onglet Facturation :`;

    return {
      text,
      kpis,
      actions,
      quickFollowUps: [
        '💼 Générer un devis Pro Forma Pack Professional',
        '💰 Calculer le chiffre d\'affaires mensuel potentiel',
        '📄 Voir les mentions légales de la facture'
      ],
      timestamp: timeNow,
      source: liveLLMText ? 'LLM_LIVE' : 'LOCAL_BRAIN',
    };
  }

  // CAS PAR DÉFAUT: Réponse d'orchestration intelligente
  const topLeads = venues.slice(0, 2);
  const actions: ManagerRadarAction[] = [
    { id: 'act-check-fleet', label: '📊 Exécuter un Check Global de la Flotte', actionType: 'RUN_QUERY', payload: 'check everything', variant: 'emerald' },
    { id: 'act-goto-leads', label: '🚀 Ouvrir le Lead Engine & Radar', actionType: 'SWITCH_TAB', targetTab: 'leads', variant: 'indigo' },
  ];

  const text = liveLLMText || `🤖 **MANAGER RADAR OPÉRATIONNEL (FLOTTE SYNCHRONISÉE)**

Bien reçu Si Hassan. Tous les sous-systèmes de la flotte multi-agents sont connectés et opérationnels :

- **${fleetStats.totalVenues} établissements marocains** sous surveillance continue.
- **${fleetStats.totalUnrepliedReviews} avis sans réponse** en attente de traitement.
- Pipeline d'ingestion et QC calibré sur un score de conformité de **98.4%**.

### 💡 Que souhaites-tu vérifier ou exécuter ?
- Tape **"check everything"** pour le rapport exécutif complet de la flotte.
- Écris le **nom d'un établissement** (ex: *"La Mamounia"*, *"Riad Yasmine"*) pour son audit détaillé.
- Demande une **ville** (ex: *"Marrakech"*, *"Casablanca"*, *"Agadir"*) pour le benchmark territorial.
- Indique **"diffamation"** pour inspecter les dossiers juridiques sous l'Article 447.
- Renseigne **"devis"** ou **"tarifs"** pour préparer une proposition commerciale BMCE.`;

  return {
    text,
    venueCards: topLeads,
    actions,
    quickFollowUps: [
      '📊 Check everything (Bilan global 412 venues)',
      '🚨 Top 5 établissements en risque critique',
      '🏨 Riads à Marrakech avec avis non répondus',
      '⚖️ Dossiers diffamation sous l\'Article 447'
    ],
    timestamp: timeNow,
    source: liveLLMText ? 'LLM_LIVE' : 'LOCAL_BRAIN',
  };
}
