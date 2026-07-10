/**
 * shoot-awards.mjs — weekly screenshot of the Movie SZN "Season Awards" card.
 *
 * Captures the Season Awards section from the live Movie SZN site and writes it
 * to static/images/op-movie-szn.png (the image the portfolio's Other Projects
 * bento shows for Movie SZN). Designed to run on a schedule (e.g. a Coolify
 * scheduled task) so the portfolio always reflects the latest awards.
 *
 * Run:  node scripts/shoot-awards.mjs
 * First time on a fresh box:  npx playwright install chromium
 *
 * Config via env:
 *   AWARDS_URL       page to start from. Defaults to the /seasons index; the
 *                    script then auto-follows the newest /seasons/<year> page,
 *                    so it always captures the latest season with no yearly edit.
 *                    Point it straight at a /seasons/<year> page to pin one.
 *   AWARDS_SELECTOR  optional explicit CSS selector for the card to capture.
 *                    If unset, the script locates the card by its heading text.
 *   AWARDS_HEADING   heading text to search for (default "Season Awards")
 *   OUT              output path (default static/images/op-movie-szn.png)
 */
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const START_URL = process.env.AWARDS_URL ?? 'https://movie-szn.simmerman.tech/seasons';
const SELECTOR = process.env.AWARDS_SELECTOR ?? '';
const HEADING = process.env.AWARDS_HEADING ?? 'Season Awards';
const OUT = resolve(repoRoot, process.env.OUT ?? 'static/images/op-movie-szn.png');

function log(...a) {
	console.log('[shoot-awards]', ...a);
}

const browser = await chromium.launch();
try {
	const page = await browser.newPage({
		viewport: { width: 1440, height: 1200 },
		deviceScaleFactor: 2
	});
	log('navigating', START_URL);
	await page.goto(START_URL, { waitUntil: 'networkidle', timeout: 30_000 });

	// if we're on the /seasons index (no awards card here), follow the newest season
	const hasHeading = await page.getByText(HEADING, { exact: false }).count();
	if (!hasHeading) {
		const latest = await page.evaluate(() => {
			const years = [...document.querySelectorAll('a[href]')]
				.map((a) => a.getAttribute('href'))
				.map((h) => /\/seasons\/(\d{4})$/.exec(h || ''))
				.filter(Boolean)
				.map((m) => Number(m[1]));
			return years.length ? Math.max(...years) : null;
		});
		if (latest) {
			const seasonUrl = new URL(`/seasons/${latest}`, START_URL).href;
			log('following newest season', seasonUrl);
			await page.goto(seasonUrl, { waitUntil: 'networkidle', timeout: 30_000 });
		}
	}

	// nudge any lazy/scroll-triggered content into the DOM
	for (let y = 0; y < 8000; y += 600) {
		await page.evaluate((y) => window.scrollTo(0, y), y);
		await page.waitForTimeout(120);
	}
	await page.evaluate(() => window.scrollTo(0, 0));
	await page.waitForTimeout(500);

	let target;
	if (SELECTOR) {
		target = page.locator(SELECTOR).first();
		await target.waitFor({ state: 'visible', timeout: 10_000 });
	} else {
		// locate the heading, then climb to the nearest card-like container
		const heading = page.getByText(HEADING, { exact: false }).first();
		await heading.waitFor({ state: 'visible', timeout: 10_000 });
		const handle = await heading.evaluateHandle((el) => {
			let node = el;
			for (let i = 0; i < 8 && node.parentElement; i++) {
				const r = node.getBoundingClientRect();
				if (
					['SECTION', 'ARTICLE', 'DIV'].includes(node.tagName) &&
					r.width > 700 &&
					r.height > 320
				) {
					return node;
				}
				node = node.parentElement;
			}
			return node;
		});
		target = handle.asElement();
		if (!target) throw new Error('could not resolve the Season Awards container');
		await target.scrollIntoViewIfNeeded();
		await page.waitForTimeout(300);
	}

	mkdirSync(dirname(OUT), { recursive: true });
	await target.screenshot({ path: OUT });
	log('wrote', OUT);
} catch (err) {
	console.error('[shoot-awards] FAILED:', err.message);
	process.exitCode = 1;
} finally {
	await browser.close();
}
