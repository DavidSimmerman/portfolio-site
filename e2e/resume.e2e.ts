import { expect, test } from '@playwright/test';

test('resume page renders with a working Download PDF button', async ({ page }) => {
	await page.goto('/resume');

	// the sheet
	await expect(page.getByRole('heading', { name: 'David Simmerman' })).toBeVisible();
	for (const section of ['Experience', 'Projects', 'Skills', 'Education']) {
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
	expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-');
});

test('nav links point at the resume page', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('nav').getByRole('link', { name: 'Resume' })).toHaveAttribute(
		'href',
		'/resume'
	);
});
