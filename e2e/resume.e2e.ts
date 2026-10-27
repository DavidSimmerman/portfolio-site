import { expect, test } from '@playwright/test';

test('resume page renders with a working Download PDF button', async ({ page }) => {
	await page.goto('/resume');

	// the sheet
	await expect(page.getByRole('heading', { name: 'David Simmerman' })).toBeVisible();
	for (const section of ['Experience', 'Projects', 'Skills']) {
		await expect(page.getByRole('heading', { name: section })).toBeVisible();
	}

	// download really downloads a PDF
	const dl = page.getByRole('link', { name: 'Download PDF' });
	await expect(dl).toBeVisible();
	const [download] = await Promise.all([page.waitForEvent('download'), dl.click()]);
	expect(download.suggestedFilename()).toBe('David-Simmerman-Resume.pdf');
});

test('resume.pdf is served as a real PDF', async ({ request }) => {
	const res = await request.get('/resume.pdf');
	expect(res.status()).toBe(200);
	expect(res.headers()['content-type']).toContain('pdf');
	const pdf = await res.body();
	expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
	// printed from the live page, so an edit that spills onto a second page shows up here
	expect(pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)).toHaveLength(1);
});

test.describe('mobile', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('sheet keeps its paper layout scaled to fit, and taps through to the PDF', async ({
		page
	}) => {
		await page.goto('/resume');

		// the whole sheet is a tap target for the real PDF (native viewer = pinch zoom);
		// the overlay only exists once the sheet is scaled, so this also awaits hydration
		await expect(page.getByRole('link', { name: 'Open resume PDF' })).toHaveAttribute(
			'href',
			'/resume.pdf'
		);

		// fixed 816px paper layout, scaled down as one unit — never reflowed
		const sheet = page.getByRole('article', { name: 'Resume' });
		await expect(sheet).toHaveCSS('width', '816px');
		const box = await sheet.boundingBox();
		expect(box!.width).toBeLessThanOrEqual(390);

		// no horizontal overflow — wider-than-viewport content is what let the sticky
		// header scroll away on iOS Safari
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
			390
		);
	});
});

test('nav links point at the resume page', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('nav').getByRole('link', { name: 'Resume' })).toHaveAttribute(
		'href',
		'/resume'
	);
});
