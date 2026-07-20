// ponytail: throwaway diagnostic — screenshots the pinned work panels at each
// slide across viewports and dumps overflow/fit metrics. `node scripts/shoot-work.mjs [outdir]`
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const OUT = process.argv[2] ?? '.claude/screenshots';
mkdirSync(OUT, { recursive: true });

const viewports = [
	{ name: 'iphone-se', width: 320, height: 568 },
	{ name: 'iphone-13', width: 390, height: 844 },
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
	page.on('console', (m) => m.type() === 'error' && console.log(`[console:${vp.name}]`, m.text()));
	await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });

	// metrics: horizontal overflow + panel fit per wrap
	const info = await page.evaluate(() => {
		const wraps = [...document.querySelectorAll('#work .wrap')].map((w) => {
			const panel = w.querySelector('.panel');
			const r = panel.getBoundingClientRect();
			return {
				wrapH: w.offsetHeight,
				panelW: Math.round(r.width),
				panelH: Math.round(r.height),
				sticky: w.firstElementChild.offsetHeight
			};
		});
		return {
			hOverflow: document.documentElement.scrollWidth - window.innerWidth,
			innerH: window.innerHeight,
			wraps
		};
	});
	console.log(vp.name, JSON.stringify(info));

	// screenshot each slide of each wrap (4 slides per wrap, 2 wraps)
	const positions = await page.evaluate(() => {
		return [...document.querySelectorAll('#work .wrap')].map((w) => {
			const total = w.offsetHeight - window.innerHeight;
			const top = w.getBoundingClientRect().top + window.scrollY;
			return [0, 1, 2, 3].map((i) => top + (i / 4) * total + 10);
		});
	});
	for (let wi = 0; wi < positions.length; wi++) {
		for (let si = 0; si < 4; si++) {
			await page.evaluate((y) => window.scrollTo(0, y), positions[wi][si]);
			await page.waitForTimeout(700); // let swap-in animation settle
			await page.screenshot({ path: `${OUT}/${vp.name}-w${wi}-s${si}.png` });
		}
	}
	await page.close();
}
await browser.close();
console.log('done ->', OUT);
