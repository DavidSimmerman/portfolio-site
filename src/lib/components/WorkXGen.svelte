<script lang="ts">
	const roles = [
		{
			title: 'Integrations Developer',
			dates: 'Nov 2020 – 2022',
			blurb: 'Where it started — building the integration layer every enterprise client ran on.',
			points: [
				'Built the JavaScript SDK and DOM event-listener library used in every client integration',
				'Built a universal product sync — any file type, format, or transfer method (HTTPS/FTP/API)',
				'Data-mutation tooling that normalizes any client catalog into the platform'
			],
			stat: { v: 'SDK', l: 'in every client build' }
		},
		{
			title: 'VP of Integrations',
			dates: '2022 – Feb 2023',
			blurb: 'From writing the integrations to running the team that did.',
			points: [
				'Ran a team of eight integration developers',
				'Owned prioritization and delivery across every enterprise client',
				'Built an email image-generation service — personalized recs render at open time, zero upfront compute'
			],
			stat: { v: '8', l: 'devs led' }
		},
		{
			title: 'Director of Frontend Development',
			dates: 'Feb 2023 – May 2026',
			blurb: 'Led the team building the composable AI platform itself.',
			points: [
				'Led the four-person team building the composable AI platform — non-technical users configure, build, train, and deploy models',
				'Shipped API sandboxes, element code editors, and a full analytics suite',
				'Cut AWS costs 30%'
			],
			stat: { v: '−30%', l: 'AWS spend' }
		},
		{
			title: 'Senior Software Engineer · Zoovu',
			dates: 'May 2026 – present',
			blurb: 'Acquired by Zoovu. Same platform, bigger stage.',
			points: [
				'Composable AI for enterprise e-commerce, now under the Zoovu umbrella',
				'Carrying the platform and its enterprise clients through the merge',
				'Recommendations and search for some of the world’s biggest brands'
			],
			stat: { v: '2026', l: 'acquisition' }
		}
	];

	const brands = [
		{ name: 'GUCCI', cls: 'font-serif tracking-[0.3em]' },
		{ name: 'SONOS', cls: 'font-sans font-bold tracking-[0.25em]' },
		{ name: 'VALENTINO', cls: 'font-serif font-light tracking-[0.35em]' },
		{ name: 'ARMANI', cls: 'font-sans font-light tracking-[0.4em]' },
		{ name: 'COACH', cls: 'font-serif font-medium tracking-[0.3em]' }
	];

	let wrapEl: HTMLElement | undefined = $state();
	let progress = $state(0);
	// scroll-tied letter draw over the approach: starts as the letter peeks in,
	// hits 1 exactly when the wrap top reaches the viewport top (pin lock-in)
	let drawP = $state(0);
	function onScroll() {
		if (!wrapEl) return;
		const total = wrapEl.offsetHeight - window.innerHeight;
		const r = wrapEl.getBoundingClientRect();
		progress = Math.min(1, Math.max(0, -r.top / total));
		drawP = Math.min(1, Math.max(0, 1 - r.top / (window.innerHeight * 0.7)));
	}
	$effect(() => {
		if (wrapEl) onScroll();
	});
	const active = $derived(Math.min(roles.length - 1, Math.floor(progress * roles.length)));

	function jumpTo(i: number) {
		if (!wrapEl) return;
		const total = wrapEl.offsetHeight - window.innerHeight;
		window.scrollTo({
			top: wrapEl.offsetTop + (i / roles.length) * total + 10,
			behavior: 'smooth'
		});
	}
</script>

<svelte:window onscroll={onScroll} />

{#snippet brandStrip()}
	<div class="text-[11px] font-medium tracking-[0.12em] uppercase text-[color:var(--text-4)]">
		In production for
	</div>
	<div class="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1.5 md:gap-x-8 md:gap-y-2">
		{#each brands as b}
			<span class="{b.cls} text-[13px] text-[color:var(--text-3)] md:text-[15px]">{b.name}</span>
		{/each}
	</div>
{/snippet}

<!-- pin wrap: the panel sticks for ~3 screen-heights while scroll scrubs the roles -->
<div bind:this={wrapEl} class="wrap">
	<div class="pin sticky top-0 flex h-svh items-center">
		<!-- ghost X pins along with the panel -->
		<svg class="ghost" viewBox="0 0 100 110" fill="none" aria-hidden="true">
			<path
				class="draw"
				pathLength="1"
				style="stroke-dashoffset: {1 - drawP}"
				d="M8 104 L38 55 L8 6 L31 6 L50 33 L69 6 L92 6 L62 55 L92 104 L69 104 L50 77 L31 104 Z"
			/>
		</svg>

		<div class="panel dock-left relative w-full p-6 md:p-12">
			<div class="grid gap-5 md:grid-cols-[1.1fr_1.6fr] md:gap-10">
				<!-- left: company + role rail -->
				<div>
					<h3
						class="text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.1] font-semibold tracking-[-0.025em]"
					>
						XGen AI <span style="color: var(--accent)">→</span> Zoovu
					</h3>
					<p class="mt-3 text-[14px] leading-[1.5] text-[color:var(--text-3)]">
						Composable AI for e-commerce. Acquired by Zoovu in May 2026.
					</p>
					<!-- mobile: the rail collapses to tappable dots + the same progress line -->
					<div class="dots mt-3 md:hidden">
						{#each roles as r, i}
							<button
								class="dot-btn"
								class:active={i === active}
								class:passed={i < active}
								aria-label="{r.title} ({i + 1} of {roles.length})"
								aria-current={i === active}
								onclick={() => jumpTo(i)}
							>
								<span class="dot"></span>
							</button>
						{/each}
						<div class="dots-line" style="--p: {progress}" aria-hidden="true"></div>
					</div>
					<div class="rail mt-8">
						{#each roles as r, i}
							<button
								class="rail-row"
								class:active={i === active}
								class:passed={i < active}
								onclick={() => jumpTo(i)}
							>
								<span class="dot"></span>
								<span class="rail-title">{r.title}</span>
								<span class="rail-dates">{r.dates}</span>
							</button>
						{/each}
						<div class="rail-line" style="--p: {progress}"></div>
					</div>
				</div>

				<!-- right: active role slide (fixed height — no layout shift between roles) -->
				<div>
					<!-- all slides share one grid cell — the tallest sets the height, so
					     nothing overlaps and there's no layout shift between roles -->
					<div class="slide relative">
						{#each roles as r, i}
							<div class="slide-card" class:active={i === active}>
								<div class="flex items-baseline justify-between gap-4">
									<h4 class="text-[clamp(1.2rem,2.4vw,1.8rem)] font-semibold tracking-[-0.02em]">
										{r.title}
									</h4>
									<span class="text-[12px] whitespace-nowrap text-[color:var(--text-4)]">
										{i + 1} / {roles.length}
									</span>
								</div>
								<p class="mt-2 text-[15px] text-[color:var(--text-3)]">{r.blurb}</p>
								<div class="mt-4 flex flex-col gap-2.5 md:mt-6 md:gap-3">
									{#each r.points as p, j}
										<div class="point" style="--d: {j * 70}ms">{p}</div>
									{/each}
								</div>
								<div class="stat">
									<span class="stat-v">{r.stat.v}</span>
									<span class="stat-l">{r.stat.l}</span>
								</div>
							</div>
						{/each}
					</div>
					<!-- desktop: brands inside the card; mobile renders them after the pin instead -->
					<div class="mt-6 hidden border-t pt-5 md:block" style="border-color: var(--line-soft)">
						{@render brandStrip()}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- mobile: the brands strip lives outside the pin, so the pinned card stays well under a screen tall -->
<div class="brands-flow md:hidden">
	{@render brandStrip()}
</div>

<style>
	.wrap {
		/* ~25vh of scrub per role — quick swipes between slides */
		height: 200vh;
	}

	.panel {
		background: var(--bg);
		margin-right: max(2rem, 9vw);
		border-radius: 0 28px 28px 0;
		box-shadow: inset 4px 0 0 var(--accent);
		animation: from-left 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-timeline: view();
		/* entry-based only — cover ranges freeze while the panel is pinned */
		animation-range: entry 20% entry 95%;
	}
	@keyframes from-left {
		from {
			opacity: 0;
			transform: translateX(-140px) scale(0.96);
			filter: blur(6px);
		}
		to {
			opacity: 1;
			transform: none;
			filter: blur(0);
		}
	}

	/* ---- ghost X ---- */
	.ghost {
		position: absolute;
		top: 50%;
		right: -2.5rem;
		width: clamp(14rem, 28vw, 24rem);
		transform: translateY(-50%);
		pointer-events: none;
		user-select: none;
	}
	/* dash offset driven by approach scroll (inline style) — fully drawn at lock-in */
	.draw {
		stroke: #ffffff1a;
		stroke-width: 0.55;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
	}

	/* ---- role rail ---- */
	.rail {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-left: 2px;
	}
	.rail-row {
		display: grid;
		grid-template-columns: 14px 1fr;
		grid-template-areas: 'dot title' '. dates';
		align-items: baseline;
		column-gap: 12px;
		padding: 8px 0;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
		color: inherit;
	}
	.dot {
		grid-area: dot;
		width: 9px;
		height: 9px;
		border-radius: 999px;
		background: var(--line);
		align-self: center;
		transition:
			background 0.3s,
			box-shadow 0.3s;
		z-index: 1;
	}
	.rail-row.active .dot,
	.dot-btn.active .dot {
		background: var(--accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent);
	}
	.rail-row.passed .dot,
	.dot-btn.passed .dot {
		background: color-mix(in srgb, var(--accent) 55%, var(--line));
	}
	.rail-title {
		grid-area: title;
		font-size: 14px;
		font-weight: 500;
		color: var(--text-3);
		transition: color 0.3s;
	}
	.rail-row.active .rail-title {
		color: var(--text);
	}
	.rail-dates {
		grid-area: dates;
		font-size: 11.5px;
		color: var(--text-4);
	}
	.rail-line {
		position: absolute;
		left: 6px;
		top: 14px;
		bottom: 14px;
		width: 1.5px;
		background: var(--line);
		z-index: 0;
	}
	.rail-line::after {
		content: '';
		position: absolute;
		inset: 0;
		transform-origin: top;
		transform: scaleY(var(--p, 0));
		background: var(--accent);
	}

	/* ---- slide ---- */
	.slide {
		/* all cards stacked in one grid cell — tallest sets the height */
		display: grid;
	}
	.slide-card {
		grid-area: 1 / 1;
		display: flex;
		flex-direction: column;
		opacity: 0;
		visibility: hidden;
		transform: translateY(14px);
		pointer-events: none;
		transition:
			opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
			visibility 0.45s;
	}
	.slide-card.active {
		opacity: 1;
		visibility: visible;
		transform: none;
		pointer-events: auto;
	}
	.slide-card .stat {
		/* anchored to the card bottom — same spot on every slide, the slack sits
		   between points and stat instead of stretching below the card */
		margin-top: auto;
		padding-top: 1.25rem;
	}
	.point {
		display: flex;
		align-items: center;
		min-height: 62px;
		padding: 10px 14px;
		border: 1px solid var(--line);
		border-radius: 12px;
		font-size: 14px;
		line-height: 1.45;
		color: var(--text-2);
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.slide-card.active .point {
		opacity: 1;
		transform: none;
		transition-delay: var(--d, 0ms);
	}

	/* ---- mobile dots (the rail, collapsed) ---- */
	.dots {
		position: relative;
		display: flex;
		max-width: 15rem;
	}
	@media (min-width: 768px) {
		.dots {
			/* component display:flex would beat the md:hidden utility */
			display: none;
		}
	}
	.dot-btn {
		position: relative;
		z-index: 1;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 44px; /* touch target */
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
	}
	.dots-line {
		/* ponytail: 4 dots → first/last centers at 12.5% / 87.5%; recompute if count changes */
		position: absolute;
		left: 12.5%;
		right: 12.5%;
		top: 50%;
		height: 1.5px;
		margin-top: -0.75px;
		background: var(--line);
	}
	.dots-line::after {
		content: '';
		position: absolute;
		inset: 0;
		transform-origin: left;
		transform: scaleX(var(--p, 0));
		background: var(--accent);
	}

	@media (max-width: 767px) {
		/* fit the pinned panel inside a phone viewport: rail → dots, tighter panel,
		   pin content clears the sticky nav. The pin always allows internal scroll —
		   invisible when the card fits, and larger accessibility text sizes can never
		   clip content. view() entrance is off (the pin becomes the scroll root). */
		.rail {
			display: none;
		}
		.pin {
			padding-top: 3rem;
			align-items: safe center;
			overflow: hidden auto;
		}
		.panel {
			animation: none;
			margin-right: 1rem;
			padding: 1.2rem 1.3rem;
		}
		.point {
			min-height: 0;
			padding: 9px 12px;
		}
		.stat-v {
			font-size: 26px;
		}
	}
	/* short md+ viewports (landscape phones): same internal-scroll safety net */
	@media (min-width: 768px) and (max-height: 620px) {
		.pin {
			align-items: safe center;
			overflow: hidden auto;
		}
		.panel {
			animation: none;
			padding: 1.25rem 1.5rem;
		}
	}

	/* mobile continuation strip — echoes the docked card it came out of */
	.brands-flow {
		margin-right: 1rem;
		padding: 1.1rem 1.3rem;
		background: var(--bg);
		border-radius: 0 16px 16px 0;
		box-shadow: inset 4px 0 0 var(--accent);
	}

	.stat {
		display: flex;
		align-items: baseline;
		gap: 10px;
	}
	.stat-v {
		font-size: 30px;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--accent);
	}
	.stat-l {
		font-size: 13px;
		color: var(--text-3);
	}

	@media (prefers-reduced-motion: reduce) {
		.panel {
			animation: none;
		}
		.slide-card,
		.point {
			transition: none;
		}
		.draw {
			/* beats the inline scroll-driven offset */
			stroke-dashoffset: 0 !important;
		}
	}
</style>
