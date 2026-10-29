<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Single source of truth for the resume: this page renders it on screen AND is
	// printed on request to /resume.pdf (src/routes/resume.pdf). Content is tuned to fit ONE
	// Letter page; e2e/resume.e2e.ts fails if it spills onto a second.
	// icon + handle, not a bare URL: on paper nothing is clickable, so the mark says what each
	// line is, and the blue says it's a link. The href still carries the full address into the PDF.
	const contact = [
		{
			icon: 'mail',
			label: 'david@simmerman.tech',
			href: 'mailto:david@simmerman.tech',
			name: 'Email'
		},
		{ icon: 'globe', label: 'simmerman.tech', href: 'https://simmerman.tech', name: 'Portfolio' },
		{
			icon: 'github',
			label: 'DavidSimmerman',
			href: 'https://github.com/DavidSimmerman',
			name: 'GitHub'
		},
		{
			icon: 'linkedin',
			label: 'david-simmerman',
			href: 'https://www.linkedin.com/in/david-simmerman',
			name: 'LinkedIn'
		}
	] as const;
	// brand marks as paths (no icon library on the site): GitHub octicon 16×16, LinkedIn 24×24
	const GITHUB =
		'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z';
	const LINKEDIN =
		'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

	const summary =
		'Software engineer with six years shipping enterprise AI for some of the world’s biggest brands. Went from developer to director in five years, and now builds computer-vision analytics for Division 1 basketball programs.';

	const jobs = [
		{
			company: 'Zoovu',
			sub: 'formerly XGen AI',
			blurb:
				'Composable AI for enterprise e-commerce, in production for Gucci, Sonos, Valentino, Armani & Coach',
			dates: 'Nov 2020 – Present',
			roles: [
				{
					title: 'Senior Software Engineer',
					dates: 'May 2026 – Present',
					bullets: [
						'Carrying the composable AI platform and its enterprise clients through the 2026 Zoovu acquisition.'
					]
				},
				{
					title: 'Director of Frontend Development',
					dates: 'Feb 2023 – May 2026',
					bullets: [
						'Led the four-person team building the composable AI platform, which lets non-engineers configure, train, and deploy AI models.',
						'Shipped API sandboxes, in-app element code editors, and a full analytics suite. Cut AWS costs 30%.'
					]
				},
				{
					title: 'VP of Integrations',
					dates: '2022 – Feb 2023',
					bullets: [
						'Ran a team of eight integration developers; owned prioritization and delivery across every enterprise client.',
						'Built an email image service that generates personalized product recommendations live, each time an email is opened.'
					]
				},
				{
					title: 'Integrations Developer',
					dates: 'Nov 2020 – 2022',
					bullets: [
						'Built the JavaScript SDK and DOM event-listener library used in every client integration.',
						'Built a product sync that brings any client catalog into the platform, whatever the file format or transfer method.'
					]
				}
			]
		},
		{
			company: 'Wisely Optimize',
			sub: null,
			blurb:
				'Basketball intelligence for Division 1 programs, including Houston, Baylor, Ole Miss, Oklahoma & Oklahoma State',
			dates: 'Mar 2026 – Present',
			roles: [
				{
					title: 'Basketball Engineer (part-time)',
					dates: 'Mar 2026 – Present',
					bullets: [
						'Built NBA-style player tracking from broadcast game film, using pose models, jersey-number reads, and team colors to identify each player in each frame. Rebuilt the pipeline to run 9× faster, so a full D1 season can be tracked in the cloud.',
						'Applied NBA front-office process and predictive analytics to college rosters: roster-construction targeting for coaches and GMs, and season-long strengths-and-weaknesses analysis for coaching staffs.',
						'Led a ground-up redesign of the frontend, rebuilding every screen on the platform in SvelteKit.'
					]
				}
			]
		}
	];

	// live from +page.server.ts; the fallbacks are the last numbers seen (Oct 2026)
	const madUsers = $derived(data.madUsers ?? 228);
	const madStars = $derived(data.madStars ?? 4.8);
	// whole hundreds and a +, so the line never overstates: 228 → 200+
	const runners = $derived(
		madUsers >= 100 ? `${Math.floor(madUsers / 100) * 100}+` : `${madUsers}`
	);

	const projects = $derived([
		{
			name: 'Mile A Day',
			link: { label: 'mileaday.run', href: 'https://mileaday.run' },
			desc: `iOS running app, built with a friend, for daily-mile streaks, medals, and friend competition. Swift/SwiftUI on iPhone, Watch, and widgets; Express + Postgres API. App Store: ${runners} runners, ${madStars.toFixed(1)} stars.`
		},
		{
			name: 'CBB Composite Rankings',
			link: { label: 'cbbcomposite.com', href: 'https://cbbcomposite.com' },
			desc: 'Combines KenPom, EvanMiya, BartTorvik, and NET into team profiles, March projections, and a bracket builder that flags picks against history. 150+ people used it for their brackets last March.'
		},
		{
			name: 'Animatronic Singing Fish',
			link: { label: 'github', href: 'https://github.com/DavidSimmerman/singing-fish' },
			desc: 'Reprogrammed a Big Mouth Billy Bass to sing any song from a YouTube link. Rewired its three motors to a Raspberry Pi and built a web timeline editor to choreograph each one by hand. Wiring diagrams and a full build guide on GitHub.'
		}
	]);

	const skills = [
		{
			group: 'AI & vision',
			items: 'LLM agents & RAG · Claude & OpenAI APIs · MCP · Claude Code · YOLO & OpenCV'
		},
		{
			group: 'Frontend & mobile',
			items:
				'React & Next.js · Svelte & SvelteKit · TypeScript · Tailwind · Swift & SwiftUI (iPhone, Watch)'
		},
		{
			group: 'Backend & data',
			items: 'Node.js · Python & Django · Postgres & SQLite · predictive & sports analytics · AWS'
		},
		{
			group: 'Testing & quality',
			items: 'Playwright · Vitest · type checking · Drizzle schemas · verification pipelines'
		},
		{
			group: 'Hardware',
			items: 'Raspberry Pi · circuits & wiring · Bluetooth devices · custom PCs · self-hosting'
		}
	];

	// The sheet keeps a fixed paper layout (816px = 8.5in @ 96dpi) and is scaled down
	// as one unit on narrow viewports — like viewing a PDF page, never reflowed.
	// transform: scale() rather than CSS zoom: zoom re-lays-out text with scaled font
	// metrics, which shifts line breaks in WebKit (verified — the contacts line spills
	// out of the sheet on iOS-width screens), while a transform scales the finished
	// 816px rendering pixel-faithfully in every engine. Transforms don't affect
	// layout, so the wrapper below reserves the scaled height from the measured one.
	// Measured, not computed from innerWidth: clientWidth excludes scrollbars and the
	// sheet's own offsetWidth tracks its 51rem layout width at any root font size.
	let scalerWidth = $state(0);
	let sheetWidth = $state(0);
	let sheetHeight = $state(0);
	const scale = $derived(scalerWidth && sheetWidth ? Math.min(1, scalerWidth / sheetWidth) : 1);
</script>

<svelte:head>
	<title>Resume | David Simmerman</title>
	<meta name="description" content="Resume of David Simmerman, software engineer." />
</svelte:head>

<div class="canvas">
	<div class="toolbar">
		<a href="/" class="back">← simmerman.tech</a>
		<a href="/resume.pdf" download="David-Simmerman-Resume.pdf" class="dl">Download PDF</a>
	</div>

	<div
		class="scaler"
		bind:clientWidth={scalerWidth}
		style:height={scale < 1 && sheetHeight ? `${sheetHeight * scale}px` : undefined}
	>
		<article
			class="sheet"
			aria-label="Resume"
			bind:offsetWidth={sheetWidth}
			bind:offsetHeight={sheetHeight}
			style:transform={scale < 1 ? `scale(${scale})` : undefined}
		>
			<header class="head">
				<div>
					<h1>David Simmerman</h1>
					<p class="role">Senior Software Engineer</p>
				</div>
				<ul class="contacts" aria-label="Contact">
					{#each contact as c}
						<li>
							{#if c.icon === 'mail'}
								<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">
									<rect width="20" height="16" x="2" y="4" rx="2" />
									<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
								</svg>
							{:else if c.icon === 'globe'}
								<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">
									<circle cx="12" cy="12" r="10" />
									<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
								</svg>
							{:else if c.icon === 'github'}
								<svg class="ic fill" viewBox="0 0 16 16" aria-hidden="true"><path d={GITHUB} /></svg
								>
							{:else}
								<svg class="ic fill" viewBox="0 0 24 24" aria-hidden="true"
									><path d={LINKEDIN} /></svg
								>
							{/if}
							<a href={c.href} aria-label="{c.name}: {c.label}">{c.label}</a>
						</li>
					{/each}
				</ul>
			</header>

			<p class="summary">{summary}</p>

			<section>
				<h2>Experience</h2>
				{#each jobs as job}
					<div class="job">
						<p class="job-head">
							<span class="company"
								>{job.company}{#if job.sub}<span class="sub"> · {job.sub}</span>{/if}</span
							>
							<span class="dates">{job.dates}</span>
						</p>
						<p class="blurb">{job.blurb}</p>
						{#each job.roles as role}
							<div class="entry">
								<p class="entry-head">
									<span class="title">{role.title}</span>
									<span class="dates">{role.dates}</span>
								</p>
								<ul class="bullets">
									{#each role.bullets as b}
										<li>{b}</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>
				{/each}
			</section>

			<section>
				<h2>Projects</h2>
				{#each projects as p}
					<p class="proj">
						<span class="title">{p.name}</span>
						<a class="plink" href={p.link.href}>{p.link.label}</a>
						<span class="sep">·</span>
						{p.desc}
					</p>
				{/each}
				<p class="more">
					More projects, with screenshots and demos, at
					<a href="https://simmerman.tech/#projects">simmerman.tech</a>.
				</p>
			</section>

			<section>
				<h2>Skills</h2>
				<div class="grid">
					{#each skills as s}
						<span class="title">{s.group}</span>
						<span>{s.items}</span>
					{/each}
				</div>
			</section>

			{#if scale < 1}
				<!-- when the sheet is scaled down, tapping it opens the real PDF — the native
			     viewer brings pinch zoom. Never rendered at print/desktop widths. -->
				<a class="zoom-link" href="/resume.pdf" aria-label="Open resume PDF"></a>
			{/if}
		</article>
	</div>
</div>

<style>
	.canvas {
		min-height: 100vh;
		padding: 6.5rem 1rem 4rem;
	}
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 51rem;
		margin: 0 auto 1rem;
	}
	.back {
		color: rgba(255, 255, 255, 0.55);
		font-size: 0.9rem;
		text-decoration: none;
	}
	.back:hover {
		color: #fff;
	}
	.dl {
		background: var(--accent);
		color: #fff;
		font-weight: 600;
		font-size: 0.9rem;
		padding: 0.55rem 1.1rem;
		border-radius: 999px;
		text-decoration: none;
	}
	.dl:hover {
		filter: brightness(1.12);
	}
	.dl:focus-visible,
	.back:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	/* ——— the paper ——— */
	.sheet {
		box-sizing: border-box;
		/* fixed paper width — narrow viewports scale the whole sheet as one unit (see
		   <script>) instead of reflowing the text like a responsive page would */
		width: 51rem; /* 8.5in @ 96dpi = 816px */
		min-height: 66rem; /* 11in = 1056px, so the sheet is Letter-shaped whatever the content */
		position: relative;
		transform-origin: top left;
		margin: 0 auto;
		background: #fff;
		color: #1c1c1e;
		padding: 0.34in 0.52in;
		border-radius: 6px;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
		font-size: 13px;
		line-height: 1.42;
	}
	.sheet a {
		color: inherit;
		text-decoration: none;
	}

	/* header: name + title left, contacts stacked right */
	.head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1.5rem;
		padding-bottom: 9px;
		border-bottom: 2px solid var(--accent);
	}
	.head h1 {
		font-size: 27px;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.05;
	}
	.role {
		color: var(--accent);
		font-weight: 600;
		font-size: 14px;
		margin-top: 3px;
	}
	.contacts {
		display: grid;
		grid-template-columns: auto auto;
		column-gap: 18px;
		row-gap: 3px;
		justify-content: end;
		font-size: 12.5px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.contacts li {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #8e8e93;
	}
	.sheet .contacts a {
		color: var(--accent);
		font-weight: 500;
	}
	.ic {
		width: 12px;
		height: 12px;
		flex: none;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.ic.fill {
		fill: currentColor;
		stroke: none;
	}
	.summary {
		margin-top: 10px;
		color: #3a3a3c;
	}
	h2 {
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
		border-bottom: 1px solid #e5e5ea;
		padding-bottom: 3px;
		margin: 13px 0 6px;
	}

	/* experience */
	.job + .job {
		margin-top: 9px;
	}
	.job-head,
	.entry-head {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: baseline;
	}
	.company {
		font-weight: 700;
		font-size: 14px;
	}
	.sub {
		font-weight: 500;
		color: #636366;
		font-size: 12.5px;
	}
	.blurb {
		color: #636366;
		font-size: 12.5px;
		margin-top: -1px;
	}
	.entry {
		margin-top: 5px;
	}
	.title {
		font-weight: 600;
	}
	.dates {
		color: #636366;
		font-size: 12px;
		white-space: nowrap;
		font-weight: 400;
		font-variant-numeric: tabular-nums;
	}
	.bullets {
		margin: 1px 0 0;
		padding-left: 1.05em;
		list-style: disc;
	}
	.bullets li {
		margin-top: 1px;
		padding-left: 0.1em;
	}
	.bullets li::marker {
		color: var(--accent);
	}

	/* projects */
	.proj + .proj {
		margin-top: 6px;
	}
	.plink {
		color: #636366 !important;
		font-size: 12px;
		margin-left: 2px;
	}
	.sep {
		color: #aeaeb2;
	}
	.more {
		margin-top: 6px;
		color: #636366;
		font-size: 12.5px;
	}
	.more a {
		color: var(--accent) !important;
		font-weight: 600;
	}

	/* skills: label column, then the line */
	.grid {
		display: grid;
		grid-template-columns: 9rem 1fr;
		column-gap: 12px;
		row-gap: 4px;
	}
	.zoom-link {
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}

	/* ——— print = the PDF ——— */
	@page {
		size: letter;
		margin: 0;
	}
	@media print {
		:global(nav),
		:global(.grain) {
			display: none !important;
		}
		.toolbar {
			display: none;
		}
		.canvas {
			padding: 0;
			background: #fff;
		}
		.sheet {
			width: auto;
			min-height: 0; /* the page itself is the paper; a full 11in box could tip onto page 2 */
			transform: none !important; /* beats the inline scale if printing from a phone */
			border-radius: 0;
			box-shadow: none;
			margin: 0;
		}
		.scaler {
			height: auto !important;
		}
		.zoom-link {
			display: none !important; /* never bake a link annotation into the PDF */
		}
	}
</style>
