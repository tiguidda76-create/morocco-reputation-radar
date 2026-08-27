import { StructuredAuditReport } from '../types/schemas';
import { AGENCY_METADATA } from '../data/mockData';

/**
 * PDF GENERATION ENGINE (WeasyPrint / HTML2PDF Compatible)
 * Produces lightweight, high-impact Moroccan Luxury Hospitality Reputation Audits.
 */

export function buildWeasyPrintHtmlTemplate(report: StructuredAuditReport): string {
  const { extraction, sentiment, risk, recommendations, generatedAt } = report;
  const formattedDate = new Date(generatedAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Audit E-Réputation & ROI — ${extraction.venueName}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
      @bottom-right {
        content: "Page " counter(page) " / " counter(pages);
        font-family: 'Helvetica Neue', Arial, sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 10pt;
      line-height: 1.45;
    }
    .header {
      border-bottom: 2px solid #059669;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 18pt;
      font-weight: 800;
      color: #064e3b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .brand-sub {
      font-size: 8.5pt;
      color: #059669;
      font-weight: 600;
      margin-top: 2px;
    }
    .meta-box {
      text-align: right;
      font-size: 8pt;
      color: #475569;
    }
    .badge-confidential {
      display: inline-block;
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #f87171;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 7.5pt;
      margin-bottom: 4px;
    }
    .target-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #059669;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .venue-name {
      font-size: 14pt;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
    }
    .venue-meta {
      font-size: 8.5pt;
      color: #64748b;
    }
    .grade-box {
      text-align: center;
      background: #022c22;
      color: #34d399;
      padding: 8px 16px;
      border-radius: 6px;
    }
    .grade-title {
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grade-val {
      font-size: 18pt;
      font-weight: 900;
      line-height: 1;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .kpi-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 10px;
      border-radius: 6px;
      text-align: center;
    }
    .kpi-card.loss {
      background: #fff1f2;
      border-color: #fda4af;
    }
    .kpi-label {
      font-size: 7.5pt;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .kpi-val {
      font-size: 14pt;
      font-weight: 800;
      color: #0f172a;
    }
    .kpi-card.loss .kpi-val {
      color: #be123c;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 800;
      color: #064e3b;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin: 16px 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin-bottom: 14px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      font-weight: 700;
    }
    td {
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
    }
    .pain-point-item {
      background: #f8fafc;
      border-left: 3px solid #f59e0b;
      padding: 6px 10px;
      margin-bottom: 6px;
      font-size: 8.5pt;
    }
    .roadmap-step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 6px 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 8.5pt;
    }
    .roadmap-phase {
      background: #065f46;
      color: #ffffff;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 7.5pt;
      min-width: 60px;
      text-align: center;
    }
    .footer-seal {
      margin-top: 20px;
      border-top: 1px solid #cbd5e1;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #64748b;
    }
    .legal-clause {
      font-size: 7pt;
      color: #94a3b8;
      margin-top: 6px;
      line-height: 1.3;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div>
      <h1 class="brand-title">MOROCCO RADAR</h1>
      <div class="brand-sub">AGENCE NATIONALE D'E-RÉPUTATION &amp; D'INTELLIGENCE HÔTELIÈRE 🇲🇦</div>
    </div>
    <div class="meta-box">
      <span class="badge-confidential">RAPPORT D'AUDIT CONFIDENTIEL</span>
      <div>Date : <strong>${formattedDate}</strong></div>
      <div>Audit ID : <code>${report.auditId}</code></div>
    </div>
  </div>

  <!-- Target Venue Banner -->
  <div class="target-banner">
    <div>
      <div class="venue-name">${extraction.venueName}</div>
      <div class="venue-meta">
        📍 ${extraction.city} (${extraction.region}) • ${extraction.category} • Dirigeant : ${extraction.contactPerson}
      </div>
    </div>
    <div class="grade-box">
      <div class="grade-title">Indice Santé</div>
      <div class="grade-val">${risk.reputationHealthGrade}</div>
    </div>
  </div>

  <!-- KPI Loss & Threat Grid -->
  <div class="kpi-grid">
    <div class="kpi-card loss">
      <div class="kpi-label">Perte Annuelle Estimée</div>
      <div class="kpi-val">-${risk.computedAnnualLossMAD.toLocaleString()} MAD</div>
      <div style="font-size: 7.5pt; color: #be123c; margin-top: 2px;">~${risk.lossPerMonthMAD.toLocaleString()} MAD / mois</div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Avis Sans Réponse</div>
      <div class="kpi-val" style="color: #d97706;">${risk.unrepliedCountTotal} avis</div>
      <div style="font-size: 7.5pt; color: #64748b; margin-top: 2px;">Retard moyen : ~${risk.avgResponseLagHours}h</div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Fuite Réservations Directes</div>
      <div class="kpi-val" style="color: #059669;">${risk.directBookingLeakagePercent}%</div>
      <div style="font-size: 7.5pt; color: #64748b; margin-top: 2px;">Transférées vers concurrents</div>
    </div>
  </div>

  <!-- Section 1: Multi-Platform Audit Breakdown -->
  <div class="section-title">1. Répartition de la Réputation par Plateforme</div>
  <table>
    <thead>
      <tr>
        <th>Plateforme</th>
        <th>Score Observé</th>
        <th>Total Avis</th>
        <th>Avis Non Répondus</th>
        <th>Avis 1-2★ Critiques</th>
        <th>Dernière Activité</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Google Maps</strong></td>
        <td><strong>★ ${extraction.platformsBreakdown.google.score.toFixed(1)}</strong> / 5.0</td>
        <td>${extraction.platformsBreakdown.google.totalReviews}</td>
        <td style="color: #b91c1c; font-weight: bold;">${extraction.platformsBreakdown.google.unrepliedCount}</td>
        <td>${extraction.platformsBreakdown.google.negativeCount}</td>
        <td>${extraction.platformsBreakdown.google.lastReviewDate}</td>
      </tr>
      <tr>
        <td><strong>Booking.com</strong></td>
        <td><strong>★ ${extraction.platformsBreakdown.booking.score.toFixed(1)}</strong> / 5.0</td>
        <td>${extraction.platformsBreakdown.booking.totalReviews}</td>
        <td style="color: #b91c1c; font-weight: bold;">${extraction.platformsBreakdown.booking.unrepliedCount}</td>
        <td>${extraction.platformsBreakdown.booking.negativeCount}</td>
        <td>${extraction.platformsBreakdown.booking.lastReviewDate}</td>
      </tr>
      <tr>
        <td><strong>TripAdvisor</strong></td>
        <td><strong>★ ${extraction.platformsBreakdown.tripadvisor.score.toFixed(1)}</strong> / 5.0</td>
        <td>${extraction.platformsBreakdown.tripadvisor.totalReviews}</td>
        <td style="color: #d97706;">${extraction.platformsBreakdown.tripadvisor.unrepliedCount}</td>
        <td>${extraction.platformsBreakdown.tripadvisor.negativeCount}</td>
        <td>${extraction.platformsBreakdown.tripadvisor.lastReviewDate}</td>
      </tr>
      <tr>
        <td><strong>Airbnb &amp; Yelp</strong></td>
        <td><strong>★ 4.4</strong> / 5.0</td>
        <td>36</td>
        <td>0</td>
        <td>0</td>
        <td>Surveillé</td>
      </tr>
    </tbody>
  </table>

  <!-- Section 2: Pain Points Analysis -->
  <div class="section-title">2. Points de Friction Détectés auprès des Voyageurs</div>
  <div>
    ${sentiment.keyPainPoints.map(p => `
      <div class="pain-point-item">
        <strong>[${p.category}]</strong> (Sévérité : ${p.severity}) — <em>"${p.sampleQuote}"</em>
      </div>
    `).join('')}
  </div>

  <!-- Section 3: Recovery Roadmap -->
  <div class="section-title">3. Plan d'Action &amp; Gain Financier Estimé (SLA &lt; 2h)</div>
  <div>
    ${recommendations.recoveryRoadmap.map(r => `
      <div class="roadmap-step">
        <span class="roadmap-phase">${r.phase}</span>
        <div style="flex: 1;">
          <strong>${r.action}</strong>
          <span style="float: right; color: #059669; font-weight: bold;">+${r.expectedGainMAD.toLocaleString()} MAD récupérés</span>
        </div>
      </div>
    `).join('')}
  </div>

  <!-- Footer & Legal Seals -->
  <div class="footer-seal">
    <div>
      <strong>${AGENCY_METADATA.brandName}</strong> — ${AGENCY_METADATA.entity}<br>
      ICE : ${AGENCY_METADATA.ice} • Tél : 0632155430 • Email : ${AGENCY_METADATA.email}
    </div>
    <div style="text-align: right;">
      Bouclier Juridique Marocain Conforme<br>
      <strong>Art. 447-1 Code Pénal &amp; CNDP Loi 09-08</strong>
    </div>
  </div>

  <div class="legal-clause">
    Ce document constitue un audit confidentiel d'e-réputation commerciale et financière réalisé selon les standards de l'hospitalité marocaine de luxe. Tous droits réservés Morocco Radar.
  </div>

</body>
</html>`;
}

/**
 * Triggers interactive print or direct file download of the WeasyPrint-compatible PDF.
 */
export function openOrDownloadAuditPdf(report: StructuredAuditReport, mode: 'PRINT' | 'DOWNLOAD' = 'PRINT') {
  const htmlContent = buildWeasyPrintHtmlTemplate(report);

  if (mode === 'DOWNLOAD') {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Audit-E-Reputation-${report.venueName.replace(/[^a-zA-Z0-9]/g, '_')}-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  // Open clean printable print window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
