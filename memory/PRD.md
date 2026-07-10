# CiPD — Centre for Intelligent Product Development (IIIT Delhi) — PRD

## Original Problem Statement
Build a premium modern website for the Center for Intelligent Product Development (CiPD), IIIT Delhi. Apple/Stripe/Linear-grade quality. NOT a generic AI research-lab template. Editorial typography, generous spacing, storytelling scroll, large visual sections, smooth scrolling, big interactive 3D logo. Goal: make a student visiting think "These people build interesting things and I want to work with them."

## Stack / Architecture
- Frontend only (per user choice). No backend submissions persisted.
- React 19 + CRA + craco
- Tailwind CSS, shadcn UI primitives (where useful)
- Plus Jakarta Sans (headings) + Inter (body) from Google Fonts
- Three.js (vanilla, not R3F) for hero blob to bypass visual-edits babel plugin
- framer-motion for scroll-triggered transforms (Story parallax, Projects horizontal scroll)
- lucide-react for icons
- YouTube short embedded in vertical 9:16 frame

## User Personas
- Primary: IIIT Delhi students, researchers, faculty looking to join/contribute
- Secondary: Sponsors, industry collaborators evaluating the centre

## Implemented Sections (single-page, anchor nav)
1. Sticky glass Nav with logo + 4 anchor links + Apply CTA
2. Hero: massive editorial type "Ideas. Products. Impact." + cursor-reactive 3D blob (teal/pink/purple) + marquee
3. Story: 4 phases (Idea→Research→Development→Impact) with parallaxed phase images
4. Featured Video: editorial section with YouTube short embedded vertically
5. Projects: horizontal-scroll Apple-style showcase (4 projects, one visible at a time)
6. Events: premium vertical timeline with colored nodes, NOT cards
7. Student Experience: asymmetric bento gallery
8. Share Ideas: signature CTA section with frontend form
9. Connect/Footer: dark, gradient heading, contact info, map iframe, socials

## Design tokens
- Background: #FFFFFF / #F9FAFB / #F3F4F6
- Ink: #0A0A0B / #4B5563 / #9CA3AF
- Accents (sparingly): teal #0FB5A8, pink #EC1E79, purple #6E2DBE

## Implementation notes
- Lenis was attempted but disabled (interferes with programmatic scrollTo + screenshot tooling; native CSS smooth-scroll is sufficient)
- BlobScene uses vanilla three.js (R3F + visual-edits adds `x-line-number` attribute which R3F rejects on intrinsic JSX elements)
- GENERATE_SOURCEMAP=false added to .env (R3F transitive dep maps missing)
- Custom craco rule excludes source-map-loader from node_modules
- overflow:clip on main (not overflow-hidden) so sticky horizontal-scroll Projects works

## Phase 1 — DONE (Feb 2026)
- [x] All 9 sections built per design guidelines
- [x] 3D interactive cursor-reactive blob
- [x] Horizontal-scroll Projects section
- [x] Timeline-style Events
- [x] Form submission UX (frontend-only, simulated success state)
- [x] Map iframe (Google Maps embed)

## Backlog (P1 — deferred)
- [ ] Persist Share Idea submissions to MongoDB (backend route + sponsor dashboard)
- [ ] Real Blender-exported 3D CiPD logo (currently procedural)
- [ ] Self-hosted hero video (replacing YouTube short later)
- [ ] Real project & event content from CiPD team
- [ ] Newsletter subscription
- [ ] Dark mode toggle
- [ ] Locale support (Hindi)
