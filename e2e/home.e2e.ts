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
	await expect(page.locator('#contact').getByRole('link', { name: /GitHub/ })).toHaveAttribute(
		'href',
		'https://github.com/DavidSimmerman'
	);

	// real screenshots load (no broken images)
	const cbbShot = page.locator('img[src="/images/shot-cbb.png"]');
	await cbbShot.scrollIntoViewIfNeeded();
	await expect(cbbShot).toBeVisible();
	await expect
		.poll(() => cbbShot.evaluate((el: HTMLImageElement) => el.naturalWidth))
		.toBeGreaterThan(0);
});

test('other-projects switcher shows one project at a time', async ({ page }) => {
	await page.goto('/');
	const tabs = page.getByRole('tab');
	await expect(tabs).toHaveCount(5);

	// Discovery selected by default
	await expect(page.getByRole('heading', { name: 'Discovery' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Giddey' })).toHaveCount(0);

	// switch to Giddey
	await tabs.filter({ hasText: 'Giddey' }).click();
	await expect(page.getByRole('heading', { name: 'Giddey' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Discovery' })).toHaveCount(0);
	await expect(page.getByRole('link', { name: /giddey\.simmerman\.tech/ })).toBeVisible();
});

test('about section has posey gallery and resume-style work entries', async ({ page }) => {
	await page.goto('/');

	// both employers, no personal projects in work band
	const work = page.locator('#work');
	await expect(work).toContainText('Wisely Optimize');
	await expect(work).toContainText('XGen AI');
	await expect(work).not.toContainText('CBB Composite');

	// posey gallery photos
	const gallery = page.locator('figure');
	expect(await gallery.count()).toBeGreaterThanOrEqual(6);
});

test('accent token is applied from layout.css', async ({ page }) => {
	await page.goto('/');
	const accent = await page.evaluate(() =>
		getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
	);
	expect(accent).toBe('#0a84ff');
});
