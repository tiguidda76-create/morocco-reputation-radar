# Morocco Reputation Radar — Engineering & Dashboard Standards (AGENTS.md)

This document establishes the mandatory architectural, design, and state management rules for developing and extending the **Morocco Reputation Radar** platform.

---

## 1. Component Architecture & Atomic Patterns
- **Atomic Dashboard Hierarchy:**
  - Build UI using modular, atomic components: `<DashboardGrid>`, `<MetricCard>`, `<ChartWrapper>`, `<FilterBar>`, `<ActionPill>`, and `<IncidentDrawer>`.
  - Avoid monolithic page components. Keep sub-modules (e.g. modals, drawer views, filters) separated in dedicated files under `src/components/`.
- **Typing & Domain Grounding:**
  - All components must reference strict TypeScript definitions in `src/types/index.ts`.
  - Never invent or hallucinate field names (e.g., use `annualLossMAD`, `overallScore`, `unrepliedReviews`, `threatLevel`, `platforms.google`, `platforms.booking`, `platforms.tripadvisor`).

---

## 2. Design System & Aesthetics (Moroccan Luxury Dark Mode)
- **Palette Tokens:**
  - Deep luxury background: `bg-slate-950`, `bg-[#020617]`, `border-slate-800/80`.
  - Brand accents: `emerald-500` / `emerald-400` (Safety, Growth, High ROI) and `amber-500` / `amber-400` (Prestige, Moroccan Craftsmanship, Heritage).
  - Risk & Crisis accents: `rose-500` / `rose-400` (Urgent & Critical Threats) and `indigo-500` (Billing & Legal Shield).
- **Glassmorphism & Micro-Animations:**
  - Use `backdrop-blur-xl`, `radial-bg`, subtle border highlights (`border-emerald-500/30`), and pulsing beacon indicators for live agent telemetry.
- **Responsive Grid Standards:**
  - Use responsive CSS Grid conventions: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`.
  - All tables and data grids must be scrollable horizontally on mobile with `overflow-x-auto no-scrollbar`.

---

## 3. Data Fetching, State Strategy & Defensive UI
- **Local Persistence & Hydration:**
  - Synchronize critical catalogs with `localStorage` (key: `mrr_venues_data_v4_clean`) with deduplication.
- **Defensive UI States (Mandatory 3-State Rule):**
  - Every widget, chart, table, or list component must explicitly implement:
    1. **Loading State:** Shimmering skeleton placeholders (`animate-pulse bg-slate-900/80 rounded-xl`).
    2. **Empty State:** Clean, helpful empty view with icon, clear description, and actionable reset button.
    3. **Error State:** Non-blocking fallback UI with retry capability.

---

## 4. Multi-Agent & Manager Radar Integration
- **Context Awareness:**
  - Any agent interaction or copilot response must be grounded in the live 412+ Moroccan venues dataset and actual business metrics (MAD revenue losses, platform breakdowns).
- **Legal Compliance:**
  - Always enforce Moroccan commercial law citations: **Article 447 du Code Pénal Marocain (Loi 103-13)** for defamation takedown requests.
  - Standard agency metadata: ICE `1161674000043`, BMCE Bank Guéliz Marrakech RIB `007450001399370030009822`, Exonération TVA *Art. 91 - II - 1° du CGI*.

---

## 5. Testing & Quality Assurance
- Run `npm run typecheck` (`tsc --noEmit`) and verify zero type errors before submitting any changes.
- Ensure build bundles cleanly with `npm run build`.
