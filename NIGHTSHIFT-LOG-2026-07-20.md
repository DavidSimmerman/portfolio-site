# Nightshift log — 2026-07-20

**Task:** Draft David's resume. Build a `/resume` page on the portfolio site where it can be
viewed, with a "Download PDF" button.

## Status

- [x] Log skeleton written (this file)
- [x] Recon: resume facts extracted from site content via Explore subagent (work history,
      skills, projects, education, contact — sourced from +page.svelte, verbatim)
- [x] Branch `feat/resume` (working tree has unrelated uncommitted edits — PoseyGallery,
      +page.svelte, layout.css, HobbyIcon — from another session; my file set is disjoint,
      so branched in place and commit ONLY my files. Did not touch those.)
- [x] Build `/resume` route: white paper sheet on dark canvas, Download PDF button,
      print CSS strips chrome so PDF = the sheet
- [x] Generate `static/resume.pdf` via Playwright print-to-PDF script — verified 1 page,
      Letter, tuned spacing to fit (sheet height ≤ 1056px at 816px width)
- [x] Point nav Resume links at `/resume` (+layout.svelte only — it was clean)
- [x] e2e: new `e2e/resume.e2e.ts` (3 tests: page renders, download event fires with
      `David-Simmerman-Resume.pdf`, `/resume.pdf` serves `%PDF-`, nav href) — all pass.
      `pnpm check` 0 errors. Screenshots at `/tmp/shots/resume/` (desktop, mobile, pdf-1).
      ⚠️ PRE-EXISTING failures (NOT from tonight): `home.e2e.ts` aurora + bento tests were
      already stale — commits 122733c/1be2a85 removed those features but never updated the
      tests. That area has in-flight uncommitted edits from another session, so I left the
      tests alone rather than collide. 10 passed / 2 pre-existing failures.
- [x] `codex review --base HEAD~1` (run in a clean detached worktree so the other
      session's dirty files stayed out of the diff) — verdict: "no clear functional
      regressions", zero findings. Bonus: it verified the PDF's link annotations
      (mailto / simmerman.tech / GitHub / LinkedIn) are real clickable links.
- [x] Committed on `feat/resume` — `7aca5a3`. Not pushed (task didn't ask).

## Done — what shipped

- **`/resume`** — the drafted resume rendered as a white Letter-size sheet on the site's
  dark canvas, with a `← simmerman.tech` back link and an accent **Download PDF** button.
- **`static/resume.pdf`** — real 1-page Letter PDF, generated from that same route via
  `scripts/build-resume-pdf.mjs` (headless Chromium print). Downloads as
  `David-Simmerman-Resume.pdf`. Links inside the PDF are clickable.
- **Nav fixed** — desktop + mobile "Resume" links pointed at `/resume` (they previously
  pointed at `/resume.pdf`, which didn't exist = 404). The old `/resume.pdf` CTA inside
  +page.svelte still works too, since the PDF now exists.
- **Content** — drafted only from facts already published on the site: Zoovu/XGen arc
  (4 roles, Nov 2020 → present), Wisely Optimize, top 3 projects, skills, MSU education
  line (left the medical detail off — standard convention). Worth a morning read-through:
  `src/routes/resume/+page.svelte` — edit there, re-run the script, commit both.

## Decisions

- **PDF strategy:** pre-generated static `resume.pdf` via headless Chromium print of the
  `/resume` route (`scripts/build-resume-pdf.mjs`). No runtime PDF lib. Button is
  `<a href="/resume.pdf" download>`. Re-run the script after content edits.
- **Resume content:** drafted solely from facts already published on the site (About/Work/
  Skills/Projects sections). Education listed as "Michigan State University — Computer
  Science coursework" (no medical detail — standard resume convention).
- **Dirty tree:** unrelated uncommitted changes exist on `feat/nightshift-flashy`. Left
  untouched; my changes avoid those files (incl. leaving the `/resume.pdf` CTA inside
  +page.svelte as-is — it stays valid since the PDF now exists).

## How to run / verify

- Dev: `pnpm dev` in `~/dev/portfolio-site`
- e2e: `pnpm test` (builds + previews on :4173 automatically)
- Regenerate PDF: `pnpm build && pnpm preview` then `node scripts/build-resume-pdf.mjs`

## Resume pointer (if resuming confused)

Read this file + `src/routes/resume/+page.svelte`. Task = resume page + PDF download.
Continue from first unchecked box above.
