# Nightshift log — 2026-07-21

**Task:** 8-item portfolio feedback batch (mobile polish + copy + resume page).
Dev server: `npx vite dev --port 5199` (already running, exposed at https://portfolio.simmerman.cc).
Branch: `feat/resume` (continuing; working tree has pre-existing uncommitted edits to
+page.svelte / PoseyGallery.svelte / layout.css / HobbyIcon.svelte from an earlier
interactive session — those are LIVE-reviewed state, so building on top and committing
per-item, entangled where unavoidable).

## Status

- [x] 1. Wisely logo wall: Oklahoma (OU) tile last, bottom tile same width as others (inline, me)
- [x] 2. Mobile: Skills title ↔ "AI & LLMs" spacing (agent: skills)
- [x] 3. Reviews: fit content w/o jumpy cycling + 5-star filter (agent: page)
- [x] 4. Fish section: media beside text like others (mobile order) + banner image shorter on mobile so more width shows (agent: page)
- [x] 5. "Off the clock"/"part of the site where I'm a person" → "About me" + calmer sub-line; de-corn Posey SpecLine (agent: page)
- [x] 6. Posey gallery: remove summit-crew + snow; order steak/"The goodest girl", chief-morale/"Cool cat", day one, chair/"Her favorite chair", fetch/"Upside down naps" (agent: posey)
- [x] 7. Contact section full-screen centered at page bottom; Resume CTA → /resume (agent: page)
- [x] 8. Resume page: mobile shows exact fixed-width sheet scaled like a PDF page (no reflow), tap/pinch zoom path, sticky header consistent with home (agent: resume)
- [x] e2e updates — gallery scoped to .stage, stale bento/aurora tests realigned to the accordion design, resume mobile assertions; FULL SUITE 13/13 GREEN
- [x] codex review (1 P2 on resume scaling — fixed with measured clientWidth/offsetWidth) + 6 commits (7bcebd2..87fd3af) + screenshots in .claude/screenshots/night2/

## Decisions

- Item 1: "Oklahoma's at the bottom" = OU Sooners tile moves last; bottom-row tile is
  centered at the same width as grid tiles (not full-width).
- Item 4 "the image vertically shrunken" = the about-band hike banner (user's screenshot
  shows it): reduce mobile height + starting zoom so more horizontal field is visible.
- Item 5 sub-line: pick something plain/factual, flag as revisitable in wake-up notes.
- Item 8: keep the HTML sheet (PDF is generated from it) but render it at fixed 816px
  paper width scaled to fit on mobile = pixel-identical to the PDF; tap opens /resume.pdf
  (native pinch-zoom viewer). No pdf.js dependency.
- Previous log archived as NIGHTSHIFT-LOG-2026-07-20.md.

## How to run / verify

- Dev: port 5199 already running (`/tmp/portfolio-dev.log`). DO NOT restart or rebind.
- Tests: `npx playwright test` (builds + previews on 4173). Work-section tests must stay green.
- Screenshots: `node scripts/shoot-work.mjs .claude/screenshots/<dir>` for work section;
  agents drop ad-hoc shots under `.claude/screenshots/night2/`.
- Pre-existing failing e2e (aurora, bento) fail without my changes too — not in scope.

## Resume pointer

If context is lost: re-read this file + `git log --oneline -8`. Items checked above are
committed; continue with the first unchecked item. Agent briefs are re-derivable from the
Status list; each agent owns only the file(s) named there.

## Final status (morning read)

All 8 items done, committed on feat/resume, suite 13/13 green, lint clean, dev server
restarted on 5199 (tunnel live). Revisitable copy decisions:
- About-band sub-line: "Hobbies, sports, and one golden retriever."
- Posey SpecLine: label "Posey", detail "the golden retriever".
Screenshots: .claude/screenshots/night2/ (wisely-wall-ou, skills-mobile, posey,
about-banner-mobile, fish-mobile, contact-*-bottom, reviews-*, resume-mobile*).
