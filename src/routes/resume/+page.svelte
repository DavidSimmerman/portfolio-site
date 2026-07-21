<script lang="ts">
	// Single source of truth for the resume: this page renders it on screen AND is
	// printed to static/resume.pdf by scripts/build-resume-pdf.mjs. Edit here, re-run
	// the script, commit both.
	const contact = [
		{ label: 'david@simmerman.tech', href: 'mailto:david@simmerman.tech' },
		{ label: 'simmerman.tech', href: 'https://simmerman.tech' },
		{ label: 'github.com/DavidSimmerman', href: 'https://github.com/DavidSimmerman' },
		{
			label: 'linkedin.com/in/david-simmerman',
			href: 'https://www.linkedin.com/in/david-simmerman'
		}
	];

	const jobs = [
		{
			company: 'Zoovu (formerly XGen AI)',
			blurb:
				'Composable AI for enterprise e-commerce — in production for Gucci, Sonos, Valentino, Armani & Coach',
			roles: [
				{
					title: 'Senior Software Engineer',
					dates: 'May 2026 – Present',
					bullets: [
						'Carrying the composable AI platform and its enterprise clients through the 2026 Zoovu acquisition — recommendations and search for some of the world’s biggest brands.'
					]
				},
				{
					title: 'Director of Frontend Development',
					dates: 'Feb 2023 – May 2026',
					bullets: [
						'Led the four-person team building the composable AI platform — non-technical users configure, build, train, and deploy AI models.',
						'Shipped API sandboxes, in-app element code editors, and a full analytics suite.',
						'Cut AWS costs 30%.'
					]
				},
				{
					title: 'VP of Integrations',
					dates: '2022 – Feb 2023',
					bullets: [
						'Ran a team of eight integration developers; owned prioritization and delivery across every enterprise client.',
						'Built an email image-generation service — personalized recommendations render at open time, zero upfront compute.'
					]
				},
				{
					title: 'Integrations Developer',
					dates: 'Nov 2020 – 2022',
					bullets: [
						'Built the JavaScript SDK and DOM event-listener library used in every client integration.',
						'Built a universal product sync — any file type, format, or transfer method (HTTPS/FTP/API) — with data-mutation tooling that normalizes any client catalog into the platform.'
					]
				}
			]
		},
		{
			company: 'Wisely Optimize',
			blurb:
				'Basketball intelligence for Division 1 programs — Houston, Baylor, Ole Miss, Oklahoma & Oklahoma State',
			roles: [
				{
					title: 'Basketball Engineer (part-time)',
					dates: 'Mar 2026 – Present',
					bullets: [
						'NBA front-office process and predictive analytics applied to college rosters — roster-construction targeting and season-long strengths/weaknesses analysis for coaches and GMs.',
						'Built the platform’s AI agent for natural-language navigation and led a ground-up redesign of the entire frontend.'
					]
				}
			]
		}
	];

	const projects = [
		{
			name: 'CBB Composite Rankings',
			link: 'cbbcomposite.com',
			desc: 'College basketball rankings compositing KenPom, EvanMiya, BartTorvik, and NET — team profiles, bracket builder, and simulator. 150+ users perfected their brackets last March.'
		},
		{
			name: 'Mile A Day',
			link: 'mileaday.run',
			desc: 'iOS running app built with a friend — daily-mile streaks, milestone medals, and head-to-head friend competition. Live on the App Store.'
		},
		{
			name: 'Discovery',
			link: null,
			desc: 'Music app that breaks Spotify’s shuffle feedback loop — rate songs, control the shuffle algorithm, surface new music by taste instead of listening patterns.'
		}
	];

	const skills = [
		{
			group: 'AI & LLMs',
			items:
				'LLM agents & RAG in production · Claude & OpenAI APIs (tool use, streaming, evals) · prompt & eval pipelines · MCP integrations'
		},
		{
			group: 'Frontend',
			items: 'React & Next.js · Svelte & SvelteKit · TypeScript · Tailwind'
		},
		{
			group: 'Backend & data',
			items: 'Node.js · Python · Postgres (Drizzle) · predictive analytics'
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
	<title>Resume — David Simmerman</title>
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
				<h1>David Simmerman</h1>
				<p class="role">Software Engineer</p>
				<p class="contacts">
					{#each contact as c, i}
						{#if i > 0}<span aria-hidden="true"> · </span>{/if}<a href={c.href}>{c.label}</a>
					{/each}
				</p>
			</header>

			<p class="summary">
				Software engineer who makes complicated things feel simple — six years shipping enterprise
				AI for the world’s biggest brands, integrations developer to director in five years.
			</p>

			<section>
				<h2>Experience</h2>
				{#each jobs as job}
					<div class="job">
						<p class="company">{job.company} <span class="blurb">— {job.blurb}</span></p>
						{#each job.roles as role}
							<div class="entry">
								<p class="entry-head">
									<span class="title">{role.title}</span>
									<span class="dates">{role.dates}</span>
								</p>
								<ul>
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
						<span class="title">{p.name}</span>{#if p.link}
							<span class="dates"> · {p.link}</span>{/if} — {p.desc}
					</p>
				{/each}
			</section>

			<section>
				<h2>Skills</h2>
				{#each skills as s}
					<p class="proj"><span class="title">{s.group}</span> — {s.items}</p>
				{/each}
			</section>

			<section>
				<h2>Education</h2>
				<p class="proj">
					<span class="title">Michigan State University</span> — Computer Science coursework, followed
					by continued online CS study.
				</p>
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
		position: relative;
		transform-origin: top left;
		margin: 0 auto;
		background: #fff;
		color: #1c1c1e;
		padding: 0.38in 0.55in;
		border-radius: 6px;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
		font-size: 12.5px;
		line-height: 1.4;
	}
	.sheet a {
		color: inherit;
		text-decoration: none;
	}
	.head h1 {
		font-size: 25px;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}
	.role {
		color: var(--accent);
		font-weight: 600;
		font-size: 13.5px;
		margin-top: 2px;
	}
	.contacts {
		margin-top: 4px;
		color: #48484a;
		font-size: 12px;
	}
	.summary {
		margin-top: 8px;
		color: #3a3a3c;
	}
	h2 {
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--accent);
		border-bottom: 1px solid #e5e5ea;
		padding-bottom: 3px;
		margin: 11px 0 6px;
	}
	.job + .job {
		margin-top: 7px;
	}
	.company {
		font-weight: 700;
		font-size: 13.5px;
	}
	.blurb {
		font-weight: 400;
		color: #636366;
		font-size: 12.5px;
	}
	.entry {
		margin-top: 4px;
	}
	.entry-head {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: baseline;
	}
	.title {
		font-weight: 600;
	}
	.dates {
		color: #636366;
		font-size: 12px;
		white-space: nowrap;
		font-weight: 400;
	}
	ul {
		margin: 2px 0 0;
		padding-left: 1.1em;
		list-style: disc;
	}
	li {
		margin-top: 1px;
	}
	li::marker {
		color: #aeaeb2;
	}
	.proj + .proj {
		margin-top: 5px;
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
