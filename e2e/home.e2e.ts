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
	for (const id of ['work', 'skills', 'projects', 'about', 'contact']) {
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

test('other-projects bento features one project and switches on click', async ({ page }) => {
	await page.goto('/');

	// every project is always present as a card heading (the bento shows them all)
	for (const name of ['Discovery', 'Movie SZN', 'Health dashboard', 'Coupon clipper', 'Giddey']) {
		await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
	}

	// only the featured card exposes its links — Discovery is featured by default
	await expect(page.getByRole('link', { name: /discovery\.simmerman\.tech/ })).toBeVisible();
	await expect(page.getByRole('link', { name: /giddey\.simmerman\.tech/ })).toHaveCount(0);

	// feature Giddey → its links appear, Discovery's go away
	await page.getByRole('button', { name: 'Feature Giddey' }).click();
	await expect(page.getByRole('link', { name: /giddey\.simmerman\.tech/ })).toBeVisible();
	await expect(page.getByRole('link', { name: /discovery\.simmerman\.tech/ })).toHaveCount(0);
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

test('skills section lists all four groups below work', async ({ page }) => {
	await page.goto('/');

	const skills = page.locator('#skills');
	for (const group of ['AI & LLMs', 'Frontend', 'Backend & data', 'Beyond the code']) {
		await expect(skills).toContainText(group);
	}

	// sits directly after the work band
	const order = await page.evaluate(() => {
		const work = document.getElementById('work');
		const skills = document.getElementById('skills');
		return !!(
			work &&
			skills &&
			work.compareDocumentPosition(skills) & Node.DOCUMENT_POSITION_FOLLOWING
		);
	});
	expect(order).toBe(true);
});

test('accent token is applied from layout.css', async ({ page }) => {
	await page.goto('/');
	const accent = await page.evaluate(() =>
		getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
	);
	expect(accent).toBe('#0a84ff');
});
