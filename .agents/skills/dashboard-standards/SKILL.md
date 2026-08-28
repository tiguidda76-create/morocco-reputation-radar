---
name: dashboard-standards
description: Enforces atomic component architecture, defensive UI (loading skeletons, empty/error states), Moroccan luxury design system, and type-safe data integration for Morocco Reputation Radar.
---

# Dashboard Standards Skill

Use this skill when designing, refactoring, or adding new dashboard widgets, metrics cards, tables, charts, or modals to the Morocco Reputation Radar platform.

## Key Rules
1. **Atomic Components**: Separate layout `<DashboardGrid>`, `<MetricCard>`, `<ChartWrapper>`, and `<FilterBar>`.
2. **Defensive States**: Never render raw unhandled states. Always provide `<SkeletonCard>` when loading and `<EmptyState>` when zero items match.
3. **Moroccan Luxury Styling**: Use `bg-slate-950`, `border-slate-800`, `text-emerald-400`, `text-amber-400`, and `glass-panel` classes.
4. **Strict TypeScript Types**: Always use `Venue`, `PlatformType`, `ThreatLevel`, `DefamationCase`, and `PricingPlan` from `src/types/index.ts`.
5. **Actionable Cards**: Every venue card must provide 1-click action triggers: `[Audit Express]`, `[Pitch WhatsApp]`, `[Pipeline Auto]`.
