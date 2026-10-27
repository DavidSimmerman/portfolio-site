import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// The PDF is printed from the live /resume page, so its numbers (Mile A Day runners, App Store
// stars) always match the site. One print per hour, shared by every request; a failed print
// serves the last good one rather than a broken download.
const TTL = 60 * 60 * 1000;
let cached: { at: number; pdf: Promise<Buffer> } | null = null;
let lastGood: Buffer | null = null;

async function print(origin: string): Promise<Buffer> {
	const { chromium } = await import('playwright');
	const browser = await chromium.launch();
	try {
		const page = await browser.newPage();
		await page.goto(`${origin}/resume`, { waitUntil: 'networkidle' });
		// networkidle only means the font files arrived; without this the PDF can print
		// before Switzer is decoded and silently fall back to a system font
		await page.evaluate(() => document.fonts.ready);
		return await page.pdf({ format: 'Letter', printBackground: true });
	} finally {
		await browser.close();
	}
}

export const GET: RequestHandler = async ({ url }) => {
	// print from this same server, not the public hostname: that one sits behind Cloudflare Access
	const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
	const origin = local ? url.origin : `http://127.0.0.1:${process.env.PORT ?? 4001}`;

	if (!cached || Date.now() - cached.at > TTL) {
		const pdf = print(origin);
		cached = { at: Date.now(), pdf };
		pdf.then((b) => (lastGood = b)).catch(() => (cached = null));
	}

	let body: Buffer;
	try {
		body = await cached!.pdf;
	} catch (e) {
		console.error('resume.pdf: print failed', e);
		if (!lastGood) error(503, 'Resume PDF is unavailable right now');
		body = lastGood;
	}
	return new Response(new Uint8Array(body), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline; filename="David-Simmerman-Resume.pdf"',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
