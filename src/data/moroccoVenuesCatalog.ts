import { Venue, MoroccanRegion, VenueCategory, ThreatLevel, OutreachStage } from '../types';

// Les 12 premiers établissements historiques détaillés avec audits & drafts IA
const SEED_TOP_VENUES: Venue[] = [
  {
    id: 'venue-1',
    name: 'La Mamounia Palace Marrakech',
    category: 'Palace 5-Star',
    region: 'Marrakech-Safi',
    city: 'Marrakech (Bab Jdid)',
    address: 'Avenue Bab Jdid, 40040 Marrakech',
    phone: '0661284920',
    email: 'direction@mamounia.com',
    contactPerson: 'Directeur Général E-Commerce',
    overallScore: 4.8,
    totalReviews: 8420,
    unrepliedReviews: 18,
    avgResponseTimeHours: 14.5,
    threatLevel: 'MODERATE',
    annualLossMAD: 380000,
    platforms: {
      google: { platform: 'google', score: 4.8, totalReviews: 4800, unrepliedCount: 8, negativeUnreplied: 2, lastReviewDate: 'Aujourd\'hui' },
      booking: { platform: 'booking', score: 4.9, totalReviews: 2100, unrepliedCount: 3, negativeUnreplied: 0, lastReviewDate: 'Hier' },
      tripadvisor: { platform: 'tripadvisor', score: 4.7, totalReviews: 1200, unrepliedCount: 5, negativeUnreplied: 1, lastReviewDate: 'Il y a 1j' },
      airbnb: { platform: 'airbnb', score: 4.9, totalReviews: 120, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: 'Il y a 4j' },
      yelp: { platform: 'yelp', score: 4.5, totalReviews: 200, unrepliedCount: 2, negativeUnreplied: 1, lastReviewDate: 'Il y a 2j' },
    },
    competitorIds: ['venue-3', 'venue-6'],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Palace 5 étoiles emblématique. 18 avis sans réponse à traiter, prêt pour audit & pitch direct.',
    lastContactDate: 'Jamais contacté',
    recentReviews: [
      {
        id: 'rev-101',
        venueId: 'venue-1',
        venueName: 'La Mamounia Palace Marrakech',
        platform: 'google',
        author: 'Sir Edward Sterling',
        authorCountry: 'Royaume-Uni 🇬🇧',
        date: 'Aujourd\'hui à 11:20',
        rating: 1,
        title: 'Check-in delay at the Pavilion',
        comment: 'We waited 45 minutes for our suite key upon arrival despite guaranteed 3 PM check-in. The concierge seemed overwhelmed and offered no tea while waiting. Expected royal treatment given the rate.',
        sentiment: 'Negative',
        status: 'PENDING_APPROVAL',
        clientApprovalStatus: 'PENDING',
        aiDraft: {
          language: 'EN',
          tone: 'Royal Palace',
          content: 'Dear Sir Edward, We offer our deepest and most sincere apologies for falling short of the legendary palace hospitality you rightfully expected at La Mamounia. Waiting 45 minutes for your suite is unacceptable by our standards. We have personally briefed our Head Concierge and General Management team. Kindly allow us to invite you for a signature tea ceremony in our Menzeh gardens on your next visit. With highest regards, La Mamounia Guest Experience Directorate.',
          seoKeywords: ['palace hospitality Marrakech', 'La Mamounia gardens', 'VIP relations', 'luxury suite check-in'],
          qcScore: 99.4,
          empathyScore: 99,
          brandVoiceScore: 100,
          legalSafetyScore: 100,
          generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        }
      }
    ]
  },
  {
    id: 'venue-2',
    name: 'Riad Kniza Marrakech Médina',
    category: 'Riad de Luxe',
    region: 'Marrakech-Safi',
    city: 'Marrakech (Bab Doukkala)',
    address: '34 Derb l\'Hôtel, Bab Doukkala, Médina, Marrakech',
    phone: '0661348912',
    email: 'contact@riadkniza.com',
    contactPerson: 'Si Mohamed Bouskri (Propriétaire)',
    overallScore: 4.9,
    totalReviews: 1480,
    unrepliedReviews: 12,
    avgResponseTimeHours: 24.0,
    threatLevel: 'WARNING',
    annualLossMAD: 240000,
    platforms: {
      google: { platform: 'google', score: 4.9, totalReviews: 820, unrepliedCount: 6, negativeUnreplied: 1, lastReviewDate: 'Il y a 4h' },
      booking: { platform: 'booking', score: 4.9, totalReviews: 430, unrepliedCount: 4, negativeUnreplied: 1, lastReviewDate: 'Hier' },
      tripadvisor: { platform: 'tripadvisor', score: 4.8, totalReviews: 210, unrepliedCount: 2, negativeUnreplied: 0, lastReviewDate: 'Il y a 2j' },
      airbnb: { platform: 'airbnb', score: 5.0, totalReviews: 20, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: 'Il y a 1sem' },
      yelp: { platform: 'yelp', score: 4.5, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
    },
    competitorIds: ['venue-7'],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Riad historique d\'exception. 12 avis sans réponse à traiter par WhatsApp.',
    lastContactDate: 'Jamais contacté',
    recentReviews: [
      {
        id: 'rev-102',
        venueId: 'venue-2',
        venueName: 'Riad Kniza Marrakech Médina',
        platform: 'tripadvisor',
        author: 'Julien & Céline Fontaine',
        authorCountry: 'France 🇫🇷',
        date: 'Hier à 19:45',
        rating: 2,
        title: 'Bruit de pompe à eau et attente petit déjeuner',
        comment: 'Le patio avec les orangers est magnifique, mais notre chambre au rez-de-chaussée subissait le bruit incessant de la pompe de piscine. Le petit déjeuner servi à 9h a mis plus de 30 minutes à arriver.',
        sentiment: 'Negative',
        status: 'PENDING_APPROVAL',
        clientApprovalStatus: 'PENDING',
        aiDraft: {
          language: 'FR',
          tone: 'Hospitalité & Empathie Marocaine',
          content: 'Chers Julien et Céline, Merci du fond du cœur pour votre franchise. Nous sommes sincèrement désolés pour ce désagrément technique sur la filtration du patio. Notre artisan est intervenu immédiatement pour insonoriser le caisson. Quant à notre petit-déjeuner fassi traditionnel (msemen chauds, jus d\'orange pressé minute et thé à la menthe), nous avons recadré l\'équipe pour que le service soit rapide et irréprochable. Nous serions honorés de vous surclasser en suite terrasse lors de votre prochain séjour. Chaleureusement, Si Mohamed & l\'équipe du Riad Kniza.',
          seoKeywords: ['riad authentique médina Marrakech', 'séjour romantique Marrakech', 'petit déjeuner marocain traditionnel', 'suite terrasse Bab Doukkala'],
          qcScore: 98.8,
          empathyScore: 99,
          brandVoiceScore: 98,
          legalSafetyScore: 100,
          generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        }
      }
    ]
  },
  {
    id: 'venue-3',
    name: 'Restaurant Le Comptoir Darna',
    category: 'Restaurant Gastronomique',
    region: 'Marrakech-Safi',
    city: 'Marrakech (Hivernage)',
    address: 'Avenue Echouhada, Hivernage, Marrakech',
    phone: '0661485901',
    email: 'contact@comptoirmarrakech.com',
    contactPerson: 'Directeur de Salle & Restauration',
    overallScore: 4.4,
    totalReviews: 4950,
    unrepliedReviews: 38,
    avgResponseTimeHours: 72.0,
    threatLevel: 'CRITICAL',
    annualLossMAD: 580000,
    platforms: {
      google: { platform: 'google', score: 4.4, totalReviews: 3200, unrepliedCount: 24, negativeUnreplied: 8, lastReviewDate: 'Il y a 2h' },
      booking: { platform: 'booking', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      tripadvisor: { platform: 'tripadvisor', score: 4.3, totalReviews: 1650, unrepliedCount: 12, negativeUnreplied: 4, lastReviewDate: 'Hier' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 4.0, totalReviews: 100, unrepliedCount: 2, negativeUnreplied: 1, lastReviewDate: 'Il y a 3j' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: '38 avis sans réponse avec un manque à gagner estimé à 580 000 MAD/an. Pitch WhatsApp prêt.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  },
  {
    id: 'venue-4',
    name: 'Riad Fès Relais & Châteaux',
    category: 'Riad de Luxe',
    region: 'Fès-Meknès',
    city: 'Fès (Médina Batha)',
    address: '5 Derb Ben Slimane, Batha, Fès',
    phone: '0661198422',
    email: 'contact@riadfes.com',
    contactPerson: 'Si Youssef Benjelloun (Gérant)',
    overallScore: 4.8,
    totalReviews: 2100,
    unrepliedReviews: 16,
    avgResponseTimeHours: 36.0,
    threatLevel: 'WARNING',
    annualLossMAD: 310000,
    platforms: {
      google: { platform: 'google', score: 4.8, totalReviews: 1200, unrepliedCount: 9, negativeUnreplied: 2, lastReviewDate: 'Il y a 6h' },
      booking: { platform: 'booking', score: 4.9, totalReviews: 650, unrepliedCount: 5, negativeUnreplied: 1, lastReviewDate: 'Hier' },
      tripadvisor: { platform: 'tripadvisor', score: 4.7, totalReviews: 250, unrepliedCount: 2, negativeUnreplied: 0, lastReviewDate: 'Il y a 2j' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Perle de Fès. 16 avis en attente. Pitch Darija / FR prêt pour Si Youssef.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  },
  {
    id: 'venue-5',
    name: 'Restaurant Le Cabestan Ocean View',
    category: 'Restaurant Gastronomique',
    region: 'Casablanca-Settat',
    city: 'Casablanca (Corniche)',
    address: '90 Boulevard de la Corniche, Phare d\'El Hank, Casablanca',
    phone: '0661389012',
    email: 'contact@le-cabestan.com',
    contactPerson: 'Direction Générale Restauration',
    overallScore: 4.3,
    totalReviews: 3800,
    unrepliedReviews: 42,
    avgResponseTimeHours: 96.0,
    threatLevel: 'CRITICAL',
    annualLossMAD: 640000,
    platforms: {
      google: { platform: 'google', score: 4.3, totalReviews: 2600, unrepliedCount: 28, negativeUnreplied: 11, lastReviewDate: 'Il y a 1h' },
      booking: { platform: 'booking', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      tripadvisor: { platform: 'tripadvisor', score: 4.2, totalReviews: 1100, unrepliedCount: 12, negativeUnreplied: 3, lastReviewDate: 'Hier' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 4.0, totalReviews: 100, unrepliedCount: 2, negativeUnreplied: 1, lastReviewDate: 'Il y a 4j' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Vue emblématique sur l\'océan. 42 avis sans réponse. Forte valeur ajoutée pour audit.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  },
  {
    id: 'venue-6',
    name: 'Hôtel & Riad Nord-Pinus Tanger',
    category: 'Boutique Hotel',
    region: 'Tanger-Tétouan-Al Hoceïma',
    city: 'Tanger (Kasbah)',
    address: '11 Rue Riad Sultan, Kasbah, Tanger',
    phone: '0661273981',
    email: 'tanger@nord-pinus.com',
    contactPerson: 'Lalla Fatima Tazi (Gérante)',
    overallScore: 4.7,
    totalReviews: 950,
    unrepliedReviews: 14,
    avgResponseTimeHours: 42.0,
    threatLevel: 'WARNING',
    annualLossMAD: 220000,
    platforms: {
      google: { platform: 'google', score: 4.7, totalReviews: 520, unrepliedCount: 7, negativeUnreplied: 2, lastReviewDate: 'Hier' },
      booking: { platform: 'booking', score: 4.8, totalReviews: 310, unrepliedCount: 5, negativeUnreplied: 1, lastReviewDate: 'Il y a 2j' },
      tripadvisor: { platform: 'tripadvisor', score: 4.6, totalReviews: 120, unrepliedCount: 2, negativeUnreplied: 0, lastReviewDate: 'Il y a 3j' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Emplacement d\'exception sur le détroit. Pitch prêt.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  },
  {
    id: 'venue-7',
    name: 'Villa Diyafa Boutique Hôtel & Spa Rabat',
    category: 'Palace 5-Star',
    region: 'Rabat-Salé-Kénitra',
    city: 'Rabat (Souissi)',
    address: 'Avenue Mehdi Ben Barka, Souissi, Rabat',
    phone: '0661849102',
    email: 'contact@villadiyafa.com',
    contactPerson: 'Si Mehdi Chraïbi (Directeur Hébergement)',
    overallScore: 4.8,
    totalReviews: 1120,
    unrepliedReviews: 8,
    avgResponseTimeHours: 18.0,
    threatLevel: 'HEALTHY',
    annualLossMAD: 160000,
    platforms: {
      google: { platform: 'google', score: 4.8, totalReviews: 680, unrepliedCount: 4, negativeUnreplied: 0, lastReviewDate: 'Il y a 12h' },
      booking: { platform: 'booking', score: 4.9, totalReviews: 320, unrepliedCount: 3, negativeUnreplied: 0, lastReviewDate: 'Hier' },
      tripadvisor: { platform: 'tripadvisor', score: 4.7, totalReviews: 120, unrepliedCount: 1, negativeUnreplied: 0, lastReviewDate: 'Il y a 3j' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Établissement diplomatique de prestige à Rabat.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  },
  {
    id: 'venue-8',
    name: 'Heure Bleue Palais Relais & Châteaux',
    category: 'Palace 5-Star',
    region: 'Marrakech-Safi',
    city: 'Essaouira (Médina)',
    address: '2 Rue Ibn Battouta, Médina, 44000 Essaouira',
    phone: '0661492019',
    email: 'reception@heure-bleue.com',
    contactPerson: 'Directeur Général Heure Bleue',
    overallScore: 4.7,
    totalReviews: 1680,
    unrepliedReviews: 15,
    avgResponseTimeHours: 32.0,
    threatLevel: 'WARNING',
    annualLossMAD: 280000,
    platforms: {
      google: { platform: 'google', score: 4.7, totalReviews: 920, unrepliedCount: 8, negativeUnreplied: 2, lastReviewDate: 'Hier' },
      booking: { platform: 'booking', score: 4.8, totalReviews: 540, unrepliedCount: 5, negativeUnreplied: 1, lastReviewDate: 'Il y a 2j' },
      tripadvisor: { platform: 'tripadvisor', score: 4.6, totalReviews: 220, unrepliedCount: 2, negativeUnreplied: 0, lastReviewDate: 'Il y a 3j' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Palais historique d\'Essaouira avec piscine chauffée sur le toit. Prêt pour pitch.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  },
  {
    id: 'venue-9',
    name: 'Paradis Plage Surf Yoga & Spa Resort',
    category: 'Boutique Hotel',
    region: 'Souss-Massa',
    city: 'Agadir / Taghazout Bay',
    address: 'Km 26 Route d\'Essaouira, Taghazout Bay, 80007 Agadir',
    phone: '0661398201',
    email: 'contact@paradisplage.com',
    contactPerson: 'Si Rachid Alami (Directeur Resort)',
    overallScore: 4.6,
    totalReviews: 2450,
    unrepliedReviews: 22,
    avgResponseTimeHours: 48.0,
    threatLevel: 'WARNING',
    annualLossMAD: 390000,
    platforms: {
      google: { platform: 'google', score: 4.6, totalReviews: 1400, unrepliedCount: 12, negativeUnreplied: 3, lastReviewDate: 'Il y a 4h' },
      booking: { platform: 'booking', score: 4.7, totalReviews: 750, unrepliedCount: 7, negativeUnreplied: 2, lastReviewDate: 'Hier' },
      tripadvisor: { platform: 'tripadvisor', score: 4.5, totalReviews: 300, unrepliedCount: 3, negativeUnreplied: 1, lastReviewDate: 'Il y a 2j' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Premier éco-resort de surf & yoga au Maroc. 22 avis en attente.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  },
  {
    id: 'venue-10',
    name: 'Desert Luxury Camp Erg Chebbi',
    category: 'Camp Désert Luxury',
    region: 'Drâa-Tafilalet',
    city: 'Merzouga (Désert)',
    address: 'Dunes de l\'Erg Chebbi, 52202 Merzouga',
    phone: '0661892014',
    email: 'info@desertluxurycamp.com',
    contactPerson: 'Si Youssef Ait Benhaddou (Gérant)',
    overallScore: 4.7,
    totalReviews: 1350,
    unrepliedReviews: 14,
    avgResponseTimeHours: 36.0,
    threatLevel: 'WARNING',
    annualLossMAD: 290000,
    platforms: {
      google: { platform: 'google', score: 4.8, totalReviews: 750, unrepliedCount: 7, negativeUnreplied: 1, lastReviewDate: 'Hier' },
      booking: { platform: 'booking', score: 4.7, totalReviews: 420, unrepliedCount: 5, negativeUnreplied: 1, lastReviewDate: 'Il y a 2j' },
      tripadvisor: { platform: 'tripadvisor', score: 4.6, totalReviews: 180, unrepliedCount: 2, negativeUnreplied: 0, lastReviewDate: 'Il y a 3j' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Bivouac de grand luxe dans les dunes de Merzouga.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  },
  {
    id: 'venue-11',
    name: 'Dakhla Attitude Lagoon Eco-Camp',
    category: 'Camp Désert Luxury',
    region: 'Dakhla-Oued Ed-Dahab',
    city: 'Dakhla (Lagune PK 25)',
    address: 'Point de la Baie, PK 25, Dakhla',
    phone: '0661782910',
    email: 'booking@dakhla-attitude.ma',
    contactPerson: 'Directeur du Site Nautique',
    overallScore: 4.5,
    totalReviews: 1820,
    unrepliedReviews: 26,
    avgResponseTimeHours: 64.0,
    threatLevel: 'WARNING',
    annualLossMAD: 370000,
    platforms: {
      google: { platform: 'google', score: 4.5, totalReviews: 1100, unrepliedCount: 16, negativeUnreplied: 4, lastReviewDate: 'Il y a 8h' },
      booking: { platform: 'booking', score: 4.6, totalReviews: 540, unrepliedCount: 8, negativeUnreplied: 2, lastReviewDate: 'Hier' },
      tripadvisor: { platform: 'tripadvisor', score: 4.4, totalReviews: 180, unrepliedCount: 2, negativeUnreplied: 1, lastReviewDate: 'Il y a 2j' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Spot mondial de kitesurf & éco-resort. 26 avis en attente.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  },
  {
    id: 'venue-12',
    name: 'Restaurant Al Fassia Guéliz',
    category: 'Restaurant Gastronomique',
    region: 'Marrakech-Safi',
    city: 'Marrakech (Guéliz)',
    address: '55 Boulevard Zerktouni, Guéliz, Marrakech',
    phone: '0661298411',
    email: 'alfassia@menara.ma',
    contactPerson: 'Lalla Meriem & Lalla Fatima (Direction)',
    overallScore: 4.6,
    totalReviews: 3200,
    unrepliedReviews: 19,
    avgResponseTimeHours: 40.0,
    threatLevel: 'WARNING',
    annualLossMAD: 340000,
    platforms: {
      google: { platform: 'google', score: 4.6, totalReviews: 2100, unrepliedCount: 12, negativeUnreplied: 3, lastReviewDate: 'Il y a 3h' },
      booking: { platform: 'booking', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      tripadvisor: { platform: 'tripadvisor', score: 4.5, totalReviews: 1050, unrepliedCount: 6, negativeUnreplied: 1, lastReviewDate: 'Hier' },
      airbnb: { platform: 'airbnb', score: 0, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
      yelp: { platform: 'yelp', score: 4.0, totalReviews: 50, unrepliedCount: 1, negativeUnreplied: 0, lastReviewDate: 'Il y a 1sem' },
    },
    competitorIds: [],
    outreachStage: 'A_PROSPECTER',
    outreachNotes: 'Institution féminine de la gastronomie traditionnelle marocaine.',
    lastContactDate: 'Jamais contacté',
    recentReviews: []
  }
];

// Pool de données géographiques réelles par région marocaine
interface RegionData {
  region: MoroccanRegion;
  cities: { city: string; quarters: string[]; streetNames: string[] }[];
  establishmentNames: {
    palaces: string[];
    riads: string[];
    boutiques: string[];
    restaurants: string[];
    camps: string[];
    spas: string[];
    snacks: string[];
  };
  phonePrefixes: string[];
}

const REGION_POOLS: RegionData[] = [
  {
    region: 'Marrakech-Safi',
    cities: [
      { city: 'Marrakech', quarters: ['Médina Kasbah', 'Hivernage', 'Guéliz', 'Palmeraie', 'Bab Doukkala', 'Mellah', 'Majorelle'], streetNames: ['Derb Dabachi', 'Rue Riad Zitoun', 'Avenue Mohammed VI', 'Rue de la Liberté', 'Route de Fès', 'Avenue Bab Jdid', 'Derb Sidi Bouamar'] },
      { city: 'Essaouira', quarters: ['Médina', 'Place Moulay Hassan', 'Plage Sidi Kaouki', 'Borj El Baroud'], streetNames: ['Rue de la Kasbah', 'Avenue Mohamed V', 'Rue Chbanat', 'Rue Zayan'] },
      { city: 'Safi', quarters: ['Quartier des Potiers', 'Corniche Sidi Bouzid'], streetNames: ['Rue des Potiers', 'Boulevard Moulay Youssef'] }
    ],
    establishmentNames: {
      palaces: ['Royal Mansour Marrakech', 'Amanjena Luxury Resort', 'Mandarin Oriental Marrakech', 'Palais Namaskar Palmeraie', 'The Oberoi Marrakech', 'Selman Marrakech Palace', 'Fairmont Royal Palm', 'Palais Ronsard Relais & Châteaux'],
      riads: ['Riad Dar Anika', 'Riad Palais Sebban', 'Riad Noir d\'Ivoire', 'Riad Jardin Secret', 'Riad Joya Médina', 'Riad Farnatchi', 'Riad Kheirredine', 'Riad Kaiss by Anika', 'Riad Al Rimal', 'Riad Dar Kawa', 'Riad Be Marrakech', 'Riad Yasmine', 'Riad Les Yeux Bleus', 'Riad Star', 'Riad Cinnamon', 'Riad Hikaya', 'Riad Idra', 'Riad Goloboy', 'Riad Dar Rhizlane', 'Riad Chbanate Essaouira', 'Riad Mimouna Essaouira', 'Villa Maroc Essaouira'],
      boutiques: ['La Maison Arabe Marrakech', 'Les Deux Tours Palmeraie', 'Tigmi Nomade Boutique Hotel', 'Ksar Char-Bagh', 'Salut Maroc Essaouira', 'Dar Les Cigognes'],
      restaurants: ['Nomad Marrakech Rooftop', 'Café des Épices Rahba Kedima', 'Dar Moha Gastronomie', 'Palais Jad Mahal', 'Bô & Zin Palmeraie', 'Kabana Rooftop Medina', 'Grand Café de la Poste Guéliz', 'Limoni Marrakech', 'Plus61 Guéliz', 'La Table du Palais', 'La Table Madada Essaouira', 'Taros Café Rooftop Essaouira', 'Caravane Café Médina'],
      camps: ['Inara Camp Désert Agafay', 'Scarabeo Camp Agafay', 'Terre des Étoiles Desert Eco-Lodge', 'The White Camel Lodge Agafay', 'Oxygen Lodge Agafay', 'Be Agafay Desert Camp'],
      spas: ['Les Bains de Marrakech', 'Hammam de la Rose Médina', 'Heritage Spa Marrakech', 'Spa Palais Rhoul Palmeraie', 'Mythic Oriental Spa Guéliz'],
      snacks: ['Snack Grand Socco', 'Pâtisserie Amandine Guéliz', 'Café Clock Marrakech', 'Pâtisserie Al Jawda Guéliz', 'Snack Chez Lamine Mechoui']
    },
    phonePrefixes: ['0661', '0662', '0663', '0668', '0670', '0672', '0524']
  },
  {
    region: 'Casablanca-Settat',
    cities: [
      { city: 'Casablanca', quarters: ['Gauthier', 'Maarif', 'Ain Diab Corniche', 'Racine', 'Bourgogne', 'Habous', 'Centre Anfa'], streetNames: ['Boulevard de la Corniche', 'Rue Taha Hussein', 'Boulevard d\'Anfa', 'Rue Allal Ben Abdellah', 'Boulevard Massira Khadra', 'Boulevard Zerktouni', 'Rue Jean Jaurès'] },
      { city: 'Mohammedia', quarters: ['Plage Monica', 'Centre Ville'], streetNames: ['Boulevard Mohammed VI', 'Corniche de Mohammedia'] },
      { city: 'El Jadida', quarters: ['Cité Portugaise', 'Mazagan Resort'], streetNames: ['Rue de la Cité Portugaise', 'Route de Casablanca'] }
    ],
    establishmentNames: {
      palaces: ['Four Seasons Hotel Casablanca', 'Hôtel & Spa Kenzi Tower', 'Hyatt Regency Casablanca', 'Radisson Blu Hotel Casablanca', 'Mazagan Beach & Golf Resort'],
      riads: ['Dar Dada Médina Casablanca', 'Riad Salam Casablanca', 'La Sultana Mazagan El Jadida'],
      boutiques: ['Boutique Hôtel Le Doge Relais & Châteaux', 'Maison Blanche Casablanca', 'Hôtel Onomo City Center', 'L\'Hôtel Casablanca Anfa'],
      restaurants: ['Rick\'s Café Casablanca', 'La Sqala Café Maure', 'Restaurant Iloli Gastronomie Japonaise', 'Le Basmane Casablanca', 'Bistrot Chic Gauthier', 'Brasserie La Bavaroise Maarif', 'Nkoa Restaurant Fusion', 'Le Rive Gauche Gauthier', 'Le Relais de Paris Ain Diab', 'A ma Bretagne Corniche', 'Restaurant Sens Gauthier', 'Dar El Kaid Casablanca', 'Taverne du Dauphin Port'],
      camps: ['Eco-Lodge Oualidia Lagoon', 'Camp Mazagan Dunes'],
      spas: ['Maison d\'Asa Spa Casablanca', 'Les Bains de Casablanca', 'Cinq Mondes Kenzi Tower Spa', 'Spa Le Doge Gauthier'],
      snacks: ['Pâtisserie Bennis Habous', 'Snack Amine Maarif', 'Café Maure Sqala', 'Oliveri Glacier Ain Diab', 'Glacier Venezia Ice Corniche']
    },
    phonePrefixes: ['0661', '0664', '0666', '0671', '0674', '0522', '0523']
  },
  {
    region: 'Rabat-Salé-Kénitra',
    cities: [
      { city: 'Rabat', quarters: ['Souissi', 'Agdal', 'Hassan', 'Kasbah des Oudayas', 'Médina'], streetNames: ['Avenue Mehdi Ben Barka', 'Avenue Fal Ould Oumeir', 'Boulevard Hassan II', 'Rue Michlifen', 'Rue Sidi Fateh'] },
      { city: 'Salé', quarters: ['Médina de Salé', 'Marina Bouregreg'], streetNames: ['Quai de la Marina', 'Avenue de la Plage'] },
      { city: 'Kénitra', quarters: ['Mehdia Plage', 'Centre'], streetNames: ['Avenue Mohammed V', 'Boulevard des Chênes'] }
    ],
    establishmentNames: {
      palaces: ['La Tour Hassan Palace Rabat', 'The View Hotel Rabat', 'Fairmont La Marina Rabat-Salé', 'Ritz-Carlton Rabat Dar Es Salam', 'L\'Amphitrite Palace Skhirat'],
      riads: ['Dar El Kébira Médina Rabat', 'Euphoriad Spa & Riad', 'Riad Dar Courbages', 'Riad Meftaha Hassan', 'Riad Kalaa Médina', 'Riad Zyo Médina'],
      boutiques: ['Story Rabat Boutique Hotel', 'Hôtel Helnan Chellah', 'Le Diwan Rabat MGallery'],
      restaurants: ['Restaurant Le Dinarjat Médina', 'Cosmopolitan Restaurant Agdal', 'Le Ziryab Gastronomie Marocaine', 'Il Gambero Seafood Agdal', 'Ty Potes Rabat Hassan', 'La Verda Agdal', 'Dar Naji Hassan', 'La Guinguette de Salé Marina'],
      camps: ['Camp Forestier Maâmora Eco-Lodge'],
      spas: ['Spa La Tour Hassan', 'Euphoriad Hammam & Bien-être', 'Institut Dior Rabat'],
      snacks: ['Café La Scène Renaissance', 'Pâtisserie Majestic Agdal', 'Snack Oudayas Café Maure', 'Café Terminus Hassan']
    },
    phonePrefixes: ['0661', '0663', '0667', '0670', '0537']
  },
  {
    region: 'Tanger-Tétouan-Al Hoceïma',
    cities: [
      { city: 'Tanger', quarters: ['Kasbah', 'Marshan', 'Vieille Montagne', 'Malabata', 'Médina'], streetNames: ['Rue Riad Sultan', 'Route de la Vieille Montagne', 'Boulevard Pasteur', 'Place du Grand Socco', 'Cap Spartel'] },
      { city: 'Chefchaouen', quarters: ['Médina Bleue', 'Outa El Hammam', 'Ras El Ma'], streetNames: ['Place Outa El Hammam', 'Rue Granada', 'Avenue Hassan II'] },
      { city: 'Tétouan', quarters: ['Médina Unesco', 'Martil Plage', 'Cabo Negro'], streetNames: ['Rue Mechouar', 'Avenue Mohammed V'] },
      { city: 'Al Hoceïma', quarters: ['Plage Quemado', 'Cala Bonita'], streetNames: ['Boulevard Mohammed V', 'Corniche Quemado'] }
    ],
    establishmentNames: {
      palaces: ['Banyan Tree Tamouda Bay', 'The View Hotel Bouregreg Tanger', 'Sofitel Tamuda Bay Beach and Spa', 'Fairmont Tazi Palace Tangier', 'Royal Tulip City Center Tanger'],
      riads: ['Riad Mokhtar Tanger', 'Palais Zahia Médina', 'La Tangerina Kasbah', 'Dar Chams Tanja', 'Dar Bensouda Chefchaouen', 'Riad Lina & Spa Chefchaouen', 'Dar Echchaouen Maison d\'Hôtes', 'Riad El Reducto Tétouan'],
      boutiques: ['Villa Josephine Vieille Montagne', 'Hôtel Continental Tanger', 'Marina Bay Tanger', 'Dar Jasmine Chefchaouen'],
      restaurants: ['El Morocco Club Kasbah', 'Salon Bleu Place de la Kasbah', 'Café Hafa Marshan', 'Restaurant Saveur de Poisson Tanger', 'Restaurant Le Mirage Cap Spartel', 'Chez Abdou Plage Sidi Kacem', 'Restaurant Populaire Bab Kasbah', 'Restaurant Lala Mesouda Chefchaouen', 'Restaurant Sofia Chefchaouen', 'El Reducto Gastronomie Tétouan'],
      camps: ['Eco-Camp Talassemtane Akchour', 'Camp Glamping Cabo Negro'],
      spas: ['Banyan Tree Spa Tamouda', 'Spa Nord-Pinus Tanger', 'Hammam Lina Chefchaouen'],
      snacks: ['Café Central Petit Socco', 'Pâtisserie Porte de Tanger', 'Café Clock Chefchaouen', 'Glacier Gelato Marshan']
    },
    phonePrefixes: ['0661', '0665', '0672', '0678', '0539']
  },
  {
    region: 'Souss-Massa',
    cities: [
      { city: 'Agadir', quarters: ['Baie d\'Agadir', 'Marina', 'Secteur Touristique', 'Talborjt', 'Sonaba'], streetNames: ['Boulevard du 20 Août', 'Avenue Mohammed V', 'Marina d\'Agadir', 'Boulevard Hassan II'] },
      { city: 'Taghazout', quarters: ['Taghazout Bay', 'Tamraght Village', 'Anchor Point'], streetNames: ['Station Balnéaire Taghazout Bay', 'Route d\'Essaouira'] },
      { city: 'Taroudant', quarters: ['Médina Remparts', 'Palmeraie'], streetNames: ['Avenue Moulay Rachid', 'Place Assarag'] }
    ],
    establishmentNames: {
      palaces: ['Hyatt Regency Taghazout Bay', 'Fairmont Taghazout Bay Resort', 'Sofitel Agadir Royal Bay Resort', 'Tikida Golf Palace Agadir', 'Palais Salam Taroudant'],
      riads: ['Riad Villa Blanche Agadir', 'Riad Dar Haven Tamraght', 'Riad Dar Maktoub Golf', 'Dar Al Hossoun Eco-Garden Taroudant', 'Riad Jnane Ines Taroudant'],
      boutiques: ['Sol House Taghazout Bay Surf', 'Radisson Blu Resort Taghazout Bay', 'Amouage by Surf Maroc', 'Villa Mandala Tamraght'],
      restaurants: ['Restaurant Pure Passion Marina', 'Le Jardin d\'Eau Agadir', 'Café Del Mar Marina Agadir', 'Restaurant Les Blancs Baie d\'Agadir', 'Restaurant La Scala Agadir', 'World of Waves Taghazout', 'L\'Ardoise Agadir Sonaba', 'Restaurant Chez Pascal Taroudant'],
      camps: ['Taghazout Surf & Yoga Glamping', 'Tifnit Eco-Dunes Camp'],
      spas: ['Spa Villa Blanche Agadir', 'Thalassa Sea & Spa Agadir', 'Spa Hyatt Regency Taghazout'],
      snacks: ['Café La Fontaine Agadir', 'Pâtisserie Tafarnout Talborjt', 'Sunset Café Anchor Point']
    },
    phonePrefixes: ['0661', '0667', '0673', '0679', '0528']
  },
  {
    region: 'Fès-Meknès',
    cities: [
      { city: 'Fès', quarters: ['Médina Talaa Kebira', 'Batha', 'Bab Guissa', 'Ville Nouvelle Atlas', 'Ziat'], streetNames: ['Talaa Kebira', 'Talaa Seghira', 'Derb Ben Slimane', 'Place Batha', 'Avenue Hassan II'] },
      { city: 'Meknès', quarters: ['Médina El Hedim', 'Hamria', 'Volubilis Moulay Idriss'], streetNames: ['Place El Hedim', 'Rue Dar Smen', 'Avenue des FAR'] },
      { city: 'Ifrane', quarters: ['Centre Parc', 'Station Michlifen'], streetNames: ['Avenue de la Poste', 'Route de Mischlifen'] }
    ],
    establishmentNames: {
      palaces: ['Palais Faraj Suites & Spa Fès', 'Palais Amani Médina Fès', 'Michlifen Resort & Golf Ifrane', 'Hôtel Sahrai Fès', 'Palais Ommeyad Fès'],
      riads: ['Riad Maison Bleue & Spa', 'Riad Dar Bensouda', 'Riad Karawan Riad', 'Dar Roumana Batha', 'Riad Idrissy', 'Riad Al Bartal', 'Riad Laaroussa & Spa', 'Riad Myra Fès', 'Riad Batchisarai', 'Riad Yacout Meknès', 'Riad D\'Or Meknès'],
      boutiques: ['Hôtel Volubilis Moulay Idriss', 'Château Roslane Boutique Hôtel Meknès', 'Hôtel Chamonix Ifrane'],
      restaurants: ['The Ruined Garden Fès', 'Café Clock Talaa Kebira', 'Dar Hatim Médina Fès', 'Restaurant L\'Ambre Palais Faraj', 'Eden at Palais Amani', 'Restaurant Dar Roumana', 'Restaurant Pavillon de France Meknès', 'L\'Empreinte Restaurant Ifrane'],
      camps: ['Camp Cèdres du Moyen Atlas Azrou', 'Eco-Lodge Ifrane National Park'],
      spas: ['Spa Givenchy Hôtel Sahrai', 'Hammam Laaroussa Fès', 'Michlifen Alpine Spa Ifrane'],
      snacks: ['Café Clock Fès', 'Pâtisserie Al Manar Fès', 'Snack Bouanania Talaa', 'Café La Paix Meknès']
    },
    phonePrefixes: ['0661', '0663', '0670', '0675', '0535']
  },
  {
    region: 'Drâa-Tafilalet',
    cities: [
      { city: 'Merzouga', quarters: ['Dunes Erg Chebbi', 'Hassi Labied', 'Khamlia Village'], streetNames: ['Dunes de l\'Erg Chebbi', 'Route du Désert'] },
      { city: 'Ouarzazate', quarters: ['Kasbah Taourirt', 'Palmeraie Skoura', 'Aït Benhaddou'], streetNames: ['Avenue Mohammed V', 'Route de Skoura'] },
      { city: 'Vallée du Dadès / Todra', quarters: ['Gorges du Dadès', 'Gorges du Todra', 'Boumalne'], streetNames: ['Route des Mille Kasbahs'] }
    ],
    establishmentNames: {
      palaces: ['Ksar Char-Bagh Desert Lodge', 'Le Palais Masrah Ouarzazate', 'Ksar Ighnda Aït Benhaddou'],
      riads: ['Riad Madu Dunes Merzouga', 'Kasbah Hotel Tombouctou Merzouga', 'Ksar Bicha Merzouga', 'Dar Ahlam Skoura Relais & Châteaux', 'Kasbah Ellouze Aït Benhaddou', 'Kasbah Bab Ourika', 'Dar Blues Todra'],
      boutiques: ['Chez Pierre Gorges du Dadès', 'Auberge Tombouctou Dunes', 'Kasbah Hotel Xaluca Arfoud', 'Berbère Palace Ouarzazate'],
      restaurants: ['Ali & Sara\'s Desert Palace', 'Restaurant Kasbah Taourirt', 'Restaurant Chez Dimitri Ouarzazate', 'Restaurant Rimal Merzouga', 'Panorama Dadès Restaurant'],
      camps: ['Merzouga Luxury Bivouac', 'Camel Desert Luxury Camp', 'Nomad Bivouac Erg Chebbi', 'Ali Desert Dream Camp', 'Golden Camp Erg Chebbi', 'Magic Luxury Camp Merzouga'],
      spas: ['Hammam des Dunes Merzouga', 'Spa Kasbah Xaluca Arfoud'],
      snacks: ['Café Chez Les Nomades Khamlia', 'Snack Oasis Tinghir', 'Café Étoile du Sud Ouarzazate']
    },
    phonePrefixes: ['0661', '0668', '0671', '0677', '0535', '0524']
  },
  {
    region: 'Dakhla-Oued Ed-Dahab',
    cities: [
      { city: 'Dakhla', quarters: ['Lagune PK 25', 'Plage Lassarga', 'Point de l\'Oued', 'Centre Baie'], streetNames: ['Baie de Dakhla, PK 25', 'Plage Lassarga', 'Boulevard Mohammed V', 'Point de la Tour'] }
    ],
    establishmentNames: {
      palaces: ['Dakhla Club Hotel & Spa Resort', 'La Tour d\'Eole Eco-Luxury Dakhla', 'PK25 Dakhla Kite Resort'],
      riads: ['Dar Dakhla Maison d\'Hôtes', 'Riad Villa Dakhla Lagoon'],
      boutiques: ['Ocean Vagabond Lassarga Eco-Lodge', 'Westpoint Dakhla Eco-Resort', 'Heliophora Eco Lodge Dakhla', 'Camp Spirit Dakhla'],
      restaurants: ['Restaurant de la Lagune Dakhla', 'Restaurant Villa Dakhla', 'Oyster Farm Dakhla (Parc à Huîtres)', 'Restaurant Casa Nostra Dakhla'],
      camps: ['Dakhla Kitesurf Eco-Camp', 'Lagoon Dream Camp Dakhla', 'Desert Camp Dakhla Dunes'],
      spas: ['Spa La Tour d\'Eole', 'Thalasso Spa Dakhla Club'],
      snacks: ['Café de la Baie Dakhla', 'Snack Samarkand Dakhla']
    },
    phonePrefixes: ['0661', '0665', '0673', '0678', '0528']
  },
  {
    region: 'L\'Oriental',
    cities: [
      { city: 'Oujda', quarters: ['Médina', 'Centre Ville'], streetNames: ['Boulevard Mohammed V', 'Rue de Marrakech'] },
      { city: 'Saïdia', quarters: ['Marina Saïdia', 'Station Balnéaire'], streetNames: ['Boulevard de la Plage', 'Quai Marina Saïdia'] },
      { city: 'Nador', quarters: ['Lagune Marchica', 'Corniche'], streetNames: ['Boulevard Zerktouni', 'Avenue Hassan II'] }
    ],
    establishmentNames: {
      palaces: ['Marchica Lagoon Resort Nador', 'Radisson Blu Resort Saïdia Beach', 'Iberostar Saidia Resort'],
      riads: ['Riad Oujda Médina', 'Dar Al Fassia Oujda'],
      boutiques: ['Hôtel Terminus Oujda', 'Mercure Saïdia', 'Hôtel Beautiful Nador'],
      restaurants: ['Restaurant Le Relais de Saïdia', 'Restaurant Bella Marina Marchica', 'Restaurant Méditerranée Oujda', 'Restaurant Le Poissonnier Nador'],
      camps: ['Eco-Camp Marchica Dunes', 'Bivouac Monts des Beni Snassen'],
      spas: ['Spa Marchica Lagoon Nador', 'Thalasso Saïdia Resort'],
      snacks: ['Café La Renaissance Oujda', 'Pâtisserie Al Andalous Nador', 'Glacier Marina Saïdia']
    },
    phonePrefixes: ['0661', '0666', '0674', '0676', '0536']
  },
  {
    region: 'Béni Mellal-Khénifra',
    cities: [
      { city: 'Béni Mellal', quarters: ['Source Aïn Asserdoun', 'Centre'], streetNames: ['Avenue Mohammed V', 'Route de Marrakech'] },
      { city: 'Bin El Ouidane', quarters: ['Lac Bin El Ouidane', 'Ouzoud'], streetNames: ['Route du Lac', 'Site des Cascades d\'Ouzoud'] }
    ],
    establishmentNames: {
      palaces: ['Widiane Suites & Spa Lac Bin El Ouidane', 'Hôtel Chems Le Tazarkount Afourer'],
      riads: ['Riad Cascades d\'Ouzoud', 'Riad Dar El Kenz Béni Mellal'],
      boutiques: ['Hôtel Ouzoud Cascades', 'Hôtel Al Bassatine Béni Mellal'],
      restaurants: ['Restaurant Le Lac Widiane', 'Restaurant Cascades d\'Ouzoud', 'Restaurant Aïn Asserdoun Béni Mellal'],
      camps: ['Widiane Watersports Eco-Camp', 'Camp Nature Ouzoud'],
      spas: ['Spa Widiane Luxury Lake', 'Hammam Tazarkount'],
      snacks: ['Café Aïn Asserdoun', 'Snack Panoramique Ouzoud']
    },
    phonePrefixes: ['0661', '0663', '0670', '0675', '0523']
  },
  {
    region: 'Guelmim-Oued Noun',
    cities: [
      { city: 'Mirleft', quarters: ['Plage Imi n\'Turga', 'Aftas'], streetNames: ['Route de Sidi Ifni', 'Corniche de Mirleft'] },
      { city: 'Sidi Ifni', quarters: ['Plage Legzira', 'Centre Art Déco'], streetNames: ['Avenue Moulay Youssef', 'Falaise Legzira'] }
    ],
    establishmentNames: {
      palaces: ['Kasbah Table d\'Hôtes Mirleft', 'Legzira Beach Resort Luxury'],
      riads: ['Les 3 Chameaux Mirleft', 'Riad Maison de la Plage Sidi Ifni', 'Dar Najmat Mirleft'],
      boutiques: ['Hôtel Safa Mirleft', 'Auberge Nomad Legzira'],
      restaurants: ['Restaurant Les Arches de Legzira', 'Restaurant Le Phare Sidi Ifni', 'Restaurant Chez Jean-Louis Mirleft'],
      camps: ['Legzira Eco Glamping Camp', 'Plage Sauvage Surf Bivouac'],
      spas: ['Hammam Traditionnel Mirleft', 'Spa Berbère Legzira'],
      snacks: ['Café de la Falaise Legzira', 'Snack Poisson Frais Sidi Ifni']
    },
    phonePrefixes: ['0661', '0664', '0672', '0678', '0528']
  },
  {
    region: 'Laâyoune-Sakia El Hamra',
    cities: [
      { city: 'Laâyoune', quarters: ['Place du Méchouar', 'Foum El Oued Plage'], streetNames: ['Avenue de l\'Islam', 'Boulevard de La Mecque', 'Route de la Plage'] },
      { city: 'Tarfaya', quarters: ['Cap Juby', 'Centre'], streetNames: ['Avenue Saint-Exupéry'] }
    ],
    establishmentNames: {
      palaces: ['Hôtel Al Massira Laâyoune', 'Nagjir Hotel Laâyoune Suites'],
      riads: ['Dar Sahara Laâyoune', 'Riad Laâyoune Plage'],
      boutiques: ['Hôtel Parador Laâyoune', 'Hôtel Sahara Line'],
      restaurants: ['Restaurant Le Méchouar', 'Restaurant Oum Saâd Laâyoune', 'Restaurant Poisson Foum El Oued', 'Café Saint-Exupéry Tarfaya'],
      camps: ['Bivouac Dunes de Laâyoune', 'Tarfaya Wind Surf Camp'],
      spas: ['Spa Al Massira', 'Hammam Sahara Bien-être'],
      snacks: ['Café Méchouar Laâyoune', 'Snack Al Waha']
    },
    phonePrefixes: ['0661', '0662', '0671', '0677', '0528']
  }
];

const MANAGER_FIRST_NAMES = [
  'Si Mohamed', 'Si Youssef', 'Si Rachid', 'Si Mehdi', 'Si Amine', 'Lalla Fatima', 'Lalla Meriem',
  'Lalla Salma', 'Si Karim', 'Si Omar', 'Si Adil', 'Lalla Zineb', 'Si Hicham', 'Si Hamza',
  'Lalla Imane', 'Si Driss', 'Si Taha', 'Lalla Kenza', 'Si Aziz', 'Si Mustapha', 'Lalla Ghita',
  'Si Khalid', 'Si Abdelhak', 'Lalla Nouhaila', 'Si Othmane', 'Si Reda', 'Lalla Soukaina'
];

const MANAGER_LAST_NAMES = [
  'El Amrani', 'Berrada', 'Benjelloun', 'Alami', 'Tazi', 'Chraïbi', 'El Fassi', 'Kabbaj',
  'Guessous', 'Bennis', 'Slaoui', 'Naciri', 'Lahlou', 'Idrissi', 'Filali', 'El Mokri',
  'Bouskri', 'Taarji', 'Benkirane', 'Tahiri', 'Benmoussa', 'El Oufir', 'Mansouri', 'Kettani',
  'Sebbar', 'Bensaid', 'Cherkaoui', 'Belhaj', 'Hassani', 'Zouiten', 'Daoudi', 'Bouabid'
];

const OUTREACH_STAGES_LIST: OutreachStage[] = [
  'A_PROSPECTER',
  'A_PROSPECTER',
  'A_PROSPECTER',
  'A_PROSPECTER',
  'PITCH_ENVOYE',
  'PITCH_ENVOYE',
  'EN_DISCUSSION',
  'ACCES_DELEGUE',
  'CLIENT_ACTIF'
];

/**
 * Générateur déterministe de la base nationale marocaine complète (412 établissements)
 */
export function generateFullMoroccoVenuesCatalog(): Venue[] {
  const catalog: Venue[] = [...SEED_TOP_VENUES];
  const targetTotal = 412;
  const remainingNeeded = targetTotal - catalog.length; // 400

  // Distribution pondérée par région pour refléter l'écosystème touristique réel du Maroc
  const distributionWeights: { region: MoroccanRegion; count: number }[] = [
    { region: 'Marrakech-Safi', count: 120 },
    { region: 'Casablanca-Settat', count: 75 },
    { region: 'Tanger-Tétouan-Al Hoceïma', count: 48 },
    { region: 'Fès-Meknès', count: 45 },
    { region: 'Souss-Massa', count: 40 },
    { region: 'Rabat-Salé-Kénitra', count: 32 },
    { region: 'Drâa-Tafilalet', count: 20 },
    { region: 'Dakhla-Oued Ed-Dahab', count: 10 },
    { region: 'L\'Oriental', count: 4 },
    { region: 'Béni Mellal-Khénifra', count: 3 },
    { region: 'Guelmim-Oued Noun', count: 2 },
    { region: 'Laâyoune-Sakia El Hamra', count: 1 }
  ];

  let generatedIndex = catalog.length + 1;

  for (const dist of distributionWeights) {
    const pool = REGION_POOLS.find(p => p.region === dist.region) || REGION_POOLS[0];
    const regionCities = pool.cities;

    for (let i = 0; i < dist.count; i++) {
      if (catalog.length >= targetTotal) break;

      const cityObj = regionCities[i % regionCities.length];
      const quarter = cityObj.quarters[i % cityObj.quarters.length];
      const streetName = cityObj.streetNames[i % cityObj.streetNames.length];
      const phonePrefix = pool.phonePrefixes[i % pool.phonePrefixes.length];
      const phoneNum = `${phonePrefix}${Math.floor(100000 + ((i * 7919 + generatedIndex * 31) % 899999))}`;

      // Pick category and name from authentic pools
      const catSelector = (i + generatedIndex) % 7;
      let category: VenueCategory = 'Riad de Luxe';
      let namePool: string[] = pool.establishmentNames.riads;

      if (catSelector === 0) {
        category = 'Palace 5-Star';
        namePool = pool.establishmentNames.palaces;
      } else if (catSelector === 1) {
        category = 'Riad de Luxe';
        namePool = pool.establishmentNames.riads;
      } else if (catSelector === 2) {
        category = 'Restaurant Gastronomique';
        namePool = pool.establishmentNames.restaurants;
      } else if (catSelector === 3) {
        category = 'Boutique Hotel';
        namePool = pool.establishmentNames.boutiques;
      } else if (catSelector === 4) {
        category = 'Camp Désert Luxury';
        namePool = pool.establishmentNames.camps;
      } else if (catSelector === 5) {
        category = 'Spa & Wellness';
        namePool = pool.establishmentNames.spas;
      } else {
        category = 'Snack & Café Traditionnel';
        namePool = pool.establishmentNames.snacks;
      }

      const baseName = namePool[i % namePool.length];
      const existingCount = catalog.filter(v => v.name.startsWith(baseName)).length;
      const venueName = existingCount === 0 ? baseName : `${baseName} (${quarter})`;

      const scoreSeed = 3.6 + ((i * 17 + generatedIndex * 13) % 13) * 0.1;
      const overallScore = Number(Math.min(4.9, Math.max(3.6, scoreSeed)).toFixed(1));

      const unrepliedReviews = Math.floor(4 + ((i * 23 + generatedIndex * 7) % 36));
      const totalReviews = Math.floor(unrepliedReviews * 25 + 120 + ((i * 97) % 800));
      const avgResponseTimeHours = Math.floor(12 + unrepliedReviews * 2.8 + ((i * 11) % 40));

      const annualLossMAD = Math.round(unrepliedReviews * 16000 + (5 - overallScore) * 40000 + ((i * 10000) % 60000));

      const threatLevel: ThreatLevel =
        unrepliedReviews >= 22 || overallScore <= 4.1
          ? 'CRITICAL'
          : unrepliedReviews >= 10
          ? 'WARNING'
          : overallScore >= 4.7 && unrepliedReviews <= 6
          ? 'HEALTHY'
          : 'MODERATE';

      const outreachStage: OutreachStage = 'A_PROSPECTER';
      const managerName = `${MANAGER_FIRST_NAMES[(i * 3 + generatedIndex) % MANAGER_FIRST_NAMES.length]} ${MANAGER_LAST_NAMES[(i * 5 + generatedIndex) % MANAGER_LAST_NAMES.length]}`;
      const slug = venueName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
      const email = `contact@${slug.slice(0, 18) || 'etablissement'}.ma`;

      const googleReviews = Math.floor(totalReviews * 0.62);
      const bookingReviews = Math.floor(totalReviews * 0.25);
      const tripadvisorReviews = Math.floor(totalReviews * 0.10);
      const airbnbReviews = Math.floor(totalReviews * 0.02);
      const yelpReviews = Math.floor(totalReviews * 0.01);

      const unrepliedGoogle = Math.ceil(unrepliedReviews * 0.6);
      const unrepliedBooking = Math.floor(unrepliedReviews * 0.25);
      const unrepliedTrip = Math.max(0, unrepliedReviews - unrepliedGoogle - unrepliedBooking);

      const newVenue: Venue = {
        id: `venue-${generatedIndex}`,
        name: venueName,
        category,
        region: dist.region,
        city: `${cityObj.city} (${quarter})`,
        address: `${streetName}, ${quarter}, ${cityObj.city}`,
        phone: phoneNum,
        email,
        contactPerson: `${managerName} (Direction)`,
        overallScore,
        totalReviews,
        unrepliedReviews,
        avgResponseTimeHours,
        threatLevel,
        annualLossMAD,
        platforms: {
          google: {
            platform: 'google',
            score: overallScore,
            totalReviews: googleReviews,
            unrepliedCount: unrepliedGoogle,
            negativeUnreplied: Math.min(unrepliedGoogle, Math.floor(unrepliedGoogle * 0.35)),
            lastReviewDate: 'Aujourd\'hui'
          },
          booking: {
            platform: 'booking',
            score: Number(Math.min(5.0, overallScore + 0.1).toFixed(1)),
            totalReviews: bookingReviews,
            unrepliedCount: unrepliedBooking,
            negativeUnreplied: Math.min(unrepliedBooking, Math.floor(unrepliedBooking * 0.25)),
            lastReviewDate: 'Hier'
          },
          tripadvisor: {
            platform: 'tripadvisor',
            score: Number(Math.max(3.5, overallScore - 0.1).toFixed(1)),
            totalReviews: tripadvisorReviews,
            unrepliedCount: unrepliedTrip,
            negativeUnreplied: Math.min(unrepliedTrip, Math.floor(unrepliedTrip * 0.3)),
            lastReviewDate: 'Il y a 2j'
          },
          airbnb: {
            platform: 'airbnb',
            score: Number(Math.min(5.0, overallScore + 0.2).toFixed(1)),
            totalReviews: airbnbReviews,
            unrepliedCount: 0,
            negativeUnreplied: 0,
            lastReviewDate: 'Il y a 4j'
          },
          yelp: {
            platform: 'yelp',
            score: Number(Math.max(3.5, overallScore - 0.2).toFixed(1)),
            totalReviews: yelpReviews,
            unrepliedCount: 0,
            negativeUnreplied: 0,
            lastReviewDate: 'Il y a 1sem'
          }
        },
        competitorIds: [],
        outreachStage: 'A_PROSPECTER',
        outreachNotes: `${unrepliedReviews} avis sans réponse détectés sur Google/Booking. Perte annuelle estimée à ${(annualLossMAD / 1000).toFixed(0)}K MAD. Prêt pour pitch WhatsApp direct.`,
        lastContactDate: 'Jamais contacté',
        recentReviews: []
      };

      catalog.push(newVenue);
      generatedIndex++;
    }
  }

  // Si jamais il manque quelques items pour atteindre exactement 412, combler avec la région de Marrakech-Safi
  while (catalog.length < targetTotal) {
    const extraIndex = catalog.length + 1;
    catalog.push({
      id: `venue-${extraIndex}`,
      name: `Riad & Spa Oasis Atlas (Pôle ${extraIndex})`,
      category: 'Riad de Luxe',
      region: 'Marrakech-Safi',
      city: 'Marrakech (Médina)',
      address: `Derb El Cadi, Médina, Marrakech`,
      phone: `0661${Math.floor(200000 + extraIndex * 111)}`,
      email: `contact@riad-oasis-${extraIndex}.ma`,
      contactPerson: 'Si Hassan Berrada (Gérant)',
      overallScore: 4.6,
      totalReviews: 820,
      unrepliedReviews: 12,
      avgResponseTimeHours: 32,
      threatLevel: 'WARNING',
      annualLossMAD: 240000,
      platforms: {
        google: { platform: 'google', score: 4.6, totalReviews: 500, unrepliedCount: 7, negativeUnreplied: 2, lastReviewDate: 'Hier' },
        booking: { platform: 'booking', score: 4.7, totalReviews: 220, unrepliedCount: 3, negativeUnreplied: 1, lastReviewDate: 'Il y a 2j' },
        tripadvisor: { platform: 'tripadvisor', score: 4.5, totalReviews: 100, unrepliedCount: 2, negativeUnreplied: 0, lastReviewDate: 'Il y a 3j' },
        airbnb: { platform: 'airbnb', score: 4.8, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' },
        yelp: { platform: 'yelp', score: 4.2, totalReviews: 0, unrepliedCount: 0, negativeUnreplied: 0, lastReviewDate: '-' }
      },
      competitorIds: [],
      outreachStage: 'A_PROSPECTER',
      outreachNotes: 'Établissement médina identifié par le Radar IA.',
      lastContactDate: 'Jamais contacté',
      recentReviews: []
    });
  }

  return catalog;
}

export const INITIAL_VENUES: Venue[] = generateFullMoroccoVenuesCatalog();
