// ponytail: throwaway diagnostic — screenshots the pinned work panels at each
// slide across viewports and dumps overflow/fit metrics. `node scripts/shoot-work.mjs [outdir]`
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const OUT = process.argv[2] ?? '.claude/screenshots';
mkdirSync(OUT, { recursive: true });

const viewports = [
	{ name: 'iphone-se', width: 320, height: 568 },
	{ name: 'iphone-13', width: 390, height: 844 },
	{ name: 'iphone-13-zoom130', width: 390, height: 844, zoom: '1.3' }, // ~iOS larger text
	{ name: 'pixel-7', width: 412, height: 915 },
	{ name: 'landscape', width: 844, height: 390 },
	{ name: 'ipad', width: 768, height: 1024 },
	{ name: 'desktop', width: 1440, height: 900 }
];

const browser = await chromium.launch();
for (const vp of viewports) {
	const page = await browser.newPage({
		viewport: { width: vp.width, height: vp.height },
		isMobile: vp.width < 500,
		hasTouch: vp.width < 900
	});
	await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
	if (vp.zoom) await page.evaluate((z) => (document.body.style.zoom = z), vp.zoom);

	// metrics: horizontal overflow + panel fit per wrap (rects, so zoom stays honest)
	const info = await page.evaluate(() => {
		const wraps = [...document.querySelectorAll('#work .wrap')].map((w) => {
			const r = w.querySelector('.panel').getBoundingClientRect();
			return { panelW: Math.round(r.width), panelH: Math.round(r.height) };
		});
		return {
			hOverflow: document.documentElement.scrollWidth - window.innerWidth,
			innerH: window.innerHeight,
			wraps
		};
	});
	console.log(vp.name, JSON.stringify(info));

	// screenshot each scrub step of each wrap (mobile has a 5th brands step)
	const steps = vp.width < 768 ? 5 : 4;
	const positions = await page.evaluate((n) => {
		return [...document.querySelectorAll('#work .wrap')].map((w) => {
			const r = w.getBoundingClientRect();
			const total = r.height - window.innerHeight;
			const top = r.top + window.scrollY;
			return Array.from({ length: n }, (_, i) => top + (i / n) * total + 10);
		});
	}, steps);
	for (let wi = 0; wi < positions.length; wi++) {
		for (let si = 0; si < steps; si++) {
			await page.evaluate((y) => window.scrollTo(0, y), positions[wi][si]);
			await page.waitForTimeout(700); // let transitions settle
			await page.screenshot({ path: `${OUT}/${vp.name}-w${wi}-s${si}.png` });
		}
	}
	await page.close();
}
await browser.close();
console.log('done ->', OUT);
