# Tech V License Manager — Enhancement & Bug Fix TODO

## Phase 1: Critical Bug Fixes ✅
- [x] Fix `src/components/ui/index.tsx` — StatCard malformed JSX (unclosed div)
- [x] Fix `src/app/products/page.tsx` — PageSpinner wrong import path
- [x] Fix `src/app/licenses/page.tsx` — multiple unclosed JSX tags (full rewrite)
- [x] Fix `src/app/api/notifications/route.ts` — markAllRead needs body-less PUT support
- [x] Fix `src/app/settings/page.tsx` — add missing `midnight` + `ocean` themes to picker
- [x] Fix `src/app/login/page.tsx` — handle 2FA_REQUIRED error gracefully

## Phase 2: New "Ocean" Theme ✅
- [x] Add `ocean` CSS variables to `globals.css`
- [x] Add `ocean` to `ThemeProvider` type
- [x] Add `ocean` to settings theme picker
- [x] Add `ocean` to login page background
- [x] Add ocean glow effects to CSS

## Phase 3: Trending Super Animation Components ✅
- [x] Create `ParticleBackground.tsx` — floating bioluminescent orbs for login
- [x] Create `GlowCursor.tsx` — cursor-following glow effect
- [x] Create `FadeInView.tsx` — scroll-triggered reveal animations
- [x] Create `TiltCard.tsx` — 3D mouse-tracking tilt cards

## Phase 4: Advanced UI Enhancements ✅
- [x] Update `globals.css` — glassmorphism utilities, shimmer text, new keyframes
- [x] Update `DashboardLayout` — enhanced page transitions, spring physics, GlowCursor
- [x] Update `Topbar` — Command Palette trigger (Cmd+K)
- [x] Create `CommandPalette.tsx` — global search + navigation
- [x] Update dashboard stat cards with TiltCard 3D effect

## Phase 5: Performance ✅
- [x] React.memo on StatCard, Card, Badge

## Phase 6: Final Verification ✅
- [x] `npm run build` — zero errors
- [x] All 5 themes render correctly
- [x] Login → dashboard flow works
- [x] CRUD operations + toasts work

