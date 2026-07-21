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

test('mobile menu opens, navigates, and closes', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const burger = page.getByRole('button', { name: 'Open menu' });
	await expect(burger).toBeVisible();
	await burger.click();

	const overlay = page.locator('.m-overlay');
	await expect(overlay).toBeVisible();
	for (const label of ['Work', 'Skills', 'Projects', 'About', 'Contact', 'Resume']) {
		await expect(overlay.getByRole('link', { name: label })).toBeVisible();
	}

	await overlay.getByRole('link', { name: 'Contact' }).click();
	await expect(overlay).toBeHidden();
	await expect(page.locator('#contact')).toBeInViewport();
});

test('work section mobile: pinned scrub, dots indicator, no overlap', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const wrap = page.locator('#work .wrap').first();
	await wrap.scrollIntoViewIfNeeded();

	// rail collapses to the dots indicator on mobile
	await expect(wrap.locator('.dots')).toBeVisible();
	await expect(wrap.locator('.rail')).toBeHidden();

	const scrollToProgress = (frac: number) =>
		page.evaluate((f) => {
			const w = document.querySelector('#work .wrap') as HTMLElement;
			const total = w.offsetHeight - window.innerHeight;
			window.scrollTo(0, w.offsetTop + f * total + 10);
		}, frac);

	// scrubbing the pin advances the slides and the dots
	await scrollToProgress(0);
	await expect(wrap.locator('.slide-card').first()).toHaveClass(/active/);
	await scrollToProgress(0.9);
	await expect(wrap.locator('.slide-card').nth(3)).toHaveClass(/active/);
	await expect(wrap.locator('.dot-btn').nth(3)).toHaveClass(/active/);

	// tapping a dot jumps back to that slide
	await wrap.locator('.dot-btn').first().click();
	await expect(wrap.locator('.slide-card').first()).toHaveClass(/active/);

	// while pinned, the card sits fully on screen — clear of the nav, with breathing
	// room at the bottom (brands render after the pin on mobile, not inside it)
	await scrollToProgress(0.5);
	const fit = await wrap.evaluate((w) => {
		const p = w.querySelector('.panel')!.getBoundingClientRect();
		return { top: p.top, bottom: p.bottom, vh: window.innerHeight };
	});
	expect(fit.top).toBeGreaterThan(40);
	expect(fit.bottom).toBeLessThan(fit.vh);
	await expect(page.locator('#work .brands-flow').first()).toBeVisible();

	// nothing overflows sideways
	expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(
		0
	);
});

test('work section desktop keeps the role rail', async ({ page }) => {
	await page.goto('/');
	const wrap = page.locator('#work .wrap').first();
	await wrap.scrollIntoViewIfNeeded();
	await expect(wrap.locator('.rail')).toBeVisible();
	await expect(wrap.locator('.dots')).toBeHidden();
	// brands stay inside the card on desktop — the mobile strip is gone
	await expect(page.locator('#work .brands-flow').first()).toBeHidden();
	await expect(wrap.locator('.border-t')).toBeVisible();
});

test('hero aurora and contact email CTA render', async ({ page }) => {
	await page.goto('/');

	// aurora blobs exist and are purely decorative
	expect(await page.locator('.aurora .blob').count()).toBeGreaterThanOrEqual(3);
	await expect(page.locator('.aurora').first()).toHaveAttribute('aria-hidden', 'true');

	// giant mail CTA points at the real address
	await expect(page.locator('.mega-mail')).toHaveAttribute('href', 'mailto:david@simmerman.tech');
});
