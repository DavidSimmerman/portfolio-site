import { expect, test } from '@playwright/test';

test('home page renders hero, sections, and working links', async ({ page }) => {
	await page.goto('/');

	// hero
	await expect(page.locator('h1')).toContainText('David');
	await expect(page.locator('h1')).toContainText('Simmerman');

	// nav
	const nav = page.locator('nav');
	await expect(nav.getByText('Resume')).toBeVisible();

	// section anchors exist
	for (const id of ['work', 'projects', 'about', 'contact']) {
		await expect(page.locator(`#${id}`)).toHaveCount(1);
	}

	// key external links
	await expect(page.getByRole('link', { name: /wiselyoptimize\.com/ })).toHaveAttribute(
		'href',
		'https://wiselyoptimize.com'
	);
	await expect(page.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
		'href',
		'https://github.com/DavidSimmerman'
	);

	// real screenshots load (no broken images)
	const cbbShot = page.locator('img[src="/images/shot-cbb.png"]');
	await cbbShot.scrollIntoViewIfNeeded();
	await expect(cbbShot).toBeVisible();
	const naturalWidth = await cbbShot.evaluate((el: HTMLImageElement) => el.naturalWidth);
	expect(naturalWidth).toBeGreaterThan(0);
});

test('accent token is applied from layout.css', async ({ page }) => {
	await page.goto('/');
	const accent = await page.evaluate(() =>
		getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
	);
	expect(accent).toBe('#30d158');
});
