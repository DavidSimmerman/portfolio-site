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
- [ ] Verify: e2e green, fresh screenshots desktop + mobile
- [ ] `codex review --uncommitted` + address findings
- [ ] Final commit + wake-up message

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
