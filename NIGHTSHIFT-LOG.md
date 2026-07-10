# Nightshift log — 2026-07-10

**Task:** Review portfolio site, make it flashier/better for desktop + mobile. Commit current
version first. No AI slop. Site = job-hunting front door.

## Status

- [x] Commit current uncommitted work on `main` (preserve everything) — `de5e4d9`
- [x] Branch `feat/nightshift-flashy`
- [x] Baseline screenshots (desktop + mobile) — `/tmp/shots/base`, script `scripts/nightshot.mjs`
- [x] Review pass. Findings: hero is flat (plain black + text); mobile nav has NO section
      links; contact closer is thin; no OG/social meta (recruiters share links); copy is
      good/human already; Switzer loads fine via Fontshare; work/skills/projects sections
      already strong.
- [x] 1. Hero signature — aurora glow field (Apple systemBlue/Indigo/Cyan), pointer
     parallax, scroll cue; faint reprise in contact closer (bookends) — `c7096d1`
- [x] 2. Nav — active-section highlight, scroll-progress hairline, mobile overlay menu
- [x] 3. Contact finale — full-height closer, giant email CTA w/ gradient underline
- [x] 4. Micro-polish — sliding underline CTAs, focus-visible rings, bento hover border
- [x] 5. OG/social meta + generated og image (canonical URL assumed
     `https://simmerman.tech` — from the email domain; fix the two `og:` URLs in
     +layout.svelte if the real domain differs)
- [x] Verify: e2e 7/7 green (incl. new menu/aurora/contact tests); fresh section
      screenshots desktop + mobile reviewed (`/tmp/shots/final`); `pnpm check` and
      `pnpm lint` clean. Bonus fix found by the new e2e: lazy images had no intrinsic
      dimensions → layout shift broke anchor scrolling from the menu; added width/height
      everywhere (also fixes CLS).
- [x] `codex review --base main` — verdict: "main site changes appear sound." One P3
      (screenshot helper swallowed ENOENT) — fixed in `5328f71`. It also implicitly
      caught that new code wasn't prettier-formatted — fixed in `575eb70`.
      (First attempt at xhigh effort was OOM/timeout-killed; medium effort completed.)
- [x] Final e2e re-run after all fixes: 7/7 green.
- [x] Final commit + wake-up message

## Done — summary of what changed

1. **Hero** — ambient aurora glow (Apple systemBlue/Indigo/Cyan radial blobs, slow drift),
   pointer parallax on fine pointers, pulsing scroll cue that fades on scroll.
2. **Nav** — active-section accent dot (IntersectionObserver), scroll-progress hairline
   (pure CSS scroll timeline), real mobile menu: burger → frosted overlay w/ staggered links.
3. **Contact** — full-height finale, giant email CTA with gradient underline sweep, aurora
   reprise bookending the page.
4. **Micro-polish** — CTA underlines slide in, keyboard focus rings, bento hover border.
5. **Link previews** — OG/Twitter meta + generated 1200×630 og.png.
6. **Fixes found along the way** — mobile menu anchor nav was swallowed by the scroll lock
   (sync unlock); lazy images had no intrinsic size → layout shift broke anchor jumps and
   hurt CLS (added width/height everywhere).

All motion respects prefers-reduced-motion; scroll-driven bits degrade gracefully off Chromium.

## Decisions

- Skipping the mockup-choice gate: human is asleep, nobody to pick a variant. Iterating
  directly on a branch with screenshot evidence instead. (nightshift autonomy > mockup flow)
- Using a plain branch, not a worktree: after committing current state the tree is clean and
  no parallel work competes for it.

## How to run / verify

- Dev: `pnpm dev` (bind 0.0.0.0; `expose portfolio <port>` if needed)
- Tests: `pnpm test:e2e`
- Repo: `~/dev/portfolio-site`, branch `feat/nightshift-flashy` (main holds pre-nightshift state)

## Resume pointer

If context was lost: read this file + `git log main..HEAD`, continue from the first unchecked
box above.
