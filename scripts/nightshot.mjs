import { chromium, devices } from '@playwright/test';

const out = process.argv[2] || '/tmp/shots';
const base = 'http://localhost:5182/';
const browser = await chromium.launch();

async function shoot(name, ctxOpts) {
	const ctx = await browser.newContext({ ...ctxOpts, reducedMotion: 'reduce' });
	const page = await ctx.newPage();
	await page.goto(base, { waitUntil: 'networkidle' });
	await page.evaluate(async () => {
		for (const el of document.querySelectorAll('img')) el.loading = 'eager';
		window.scrollTo(0, document.body.scrollHeight);
		await new Promise((r) => setTimeout(r, 900));
		window.scrollTo(0, 0);
	});
	await page.waitForTimeout(800);
	const els = await page.$$('body section');
	for (let i = 0; i < els.length; i++) {
		const id = (await els[i].getAttribute('id')) || `sec${i}`;
		try {
			await els[i].scrollIntoViewIfNeeded();
			await page.waitForTimeout(250);
			await els[i].screenshot({ path: `${out}/${name}-${String(i).padStart(2, '0')}-${id}.png` });
		} catch {}
	}
	await ctx.close();
}

await shoot('desktop', { viewport: { width: 1440, height: 900 } });
await shoot('mobile', { ...devices['iPhone 14'] });
await browser.close();
console.log('done');
