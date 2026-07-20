// Prints the /resume route to static/resume.pdf using headless Chromium.
// Usage: pnpm build && pnpm preview (in another shell), then:
//   node scripts/build-resume-pdf.mjs [baseUrl]
// Default baseUrl: http://localhost:4173. Commit the regenerated PDF.
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://localhost:4173';
const out = new URL('../static/resume.pdf', import.meta.url).pathname;

const browser = await chromium.launch();
try {
	const page = await browser.newPage();
	await page.goto(`${base}/resume`, { waitUntil: 'networkidle' });
	await page.pdf({ path: out, format: 'Letter', printBackground: true });
	console.log(`wrote ${out}`);
} finally {
	await browser.close();
}
