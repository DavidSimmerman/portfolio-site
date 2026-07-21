<script lang="ts">
	const sections = [
		{
			title: 'Roster construction',
			tag: 'the flagship',
			blurb: 'NBA front-office process, applied to college rosters.',
			points: [
				'NBA front-office process and predictive analytics, applied to college rosters',
				'Coaches and GMs target the right players for the roster they’re actually building',
				'The tool the programs below run their rosters through'
			],
			stat: { v: 'NBA', l: 'process, college rosters' }
		},
		{
			title: 'Strengths & weaknesses',
			tag: 'team intelligence',
			blurb: 'A season of stats, turned into a to-do list.',
			points: [
				'Analyzes a full season of team stats',
				'Calls out the strengths to lean on and the weaknesses to fix',
				'Built for coaching staffs — answers, not dashboards'
			],
			stat: { v: '+/−', l: 'what to lean on, what to fix' }
		},
		{
			title: 'Platform AI agent',
			tag: 'ask the platform',
			blurb: 'The whole platform, one question away.',
			points: [
				'AI agent for fast, natural-language navigation',
				'Ask in plain English, land on the right view',
				'Same enterprise-AI muscle as the day job'
			],
			stat: { v: 'AI', l: 'navigation in plain English' }
		},
		{
			title: 'Frontend redesign',
			tag: 'the new face',
			blurb: 'Rebuilt the entire UI from the ground up.',
			points: [
				'Ground-up redesign of the entire frontend',
				'Modern, polished aesthetic to match the analytics underneath',
				'Every screen on the platform, rebuilt'
			],
			stat: { v: '100%', l: 'of the UI, rebuilt' }
		}
	];

	const programs = [
		{ src: '/logos/houston.svg', alt: 'Houston Cougars' },
		{ src: '/logos/olemiss.svg', alt: 'Ole Miss Rebels' },
		{ src: '/logos/baylor.svg', alt: 'Baylor Bears' },
		{ src: '/logos/oklahoma.svg', alt: 'Oklahoma Sooners' },
		{ src: '/logos/okstate.svg', alt: 'Oklahoma State Cowboys' }
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
	const active = $derived(Math.min(sections.length - 1, Math.floor(progress * sections.length)));

	function jumpTo(i: number) {
		if (!wrapEl) return;
		const total = wrapEl.offsetHeight - window.innerHeight;
		window.scrollTo({
			top: wrapEl.offsetTop + (i / sections.length) * total + 10,
			behavior: 'smooth'
		});
	}
</script>

<svelte:window onscroll={onScroll} />

{#snippet programStrip()}
	<div class="text-[11px] font-medium tracking-[0.12em] uppercase text-[color:var(--text-4)]">
		Some of the programs on it
	</div>
	<div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2.5 md:mt-4 md:gap-x-7 md:gap-y-3">
		{#each programs as p}
			<img src={p.src} alt={p.alt} class="logo h-8 w-auto md:h-9" loading="lazy" />
		{/each}
	</div>
{/snippet}

<!-- pin wrap: panel sticks while scroll scrubs through what got built -->
<div bind:this={wrapEl} class="wrap">
	<div class="pin sticky top-0 flex h-svh items-center">
		<!-- ghost W pins along with the panel -->
		<svg class="ghost" viewBox="0 0 100 110" fill="none" aria-hidden="true">
			<path
				class="draw"
				pathLength="1"
				style="stroke-dashoffset: {1 - drawP}"
				d="M6 6 L24 6 L34 61 L43 22 L57 22 L66 61 L76 6 L94 6 L77 104 L60 104 L50 69 L40 104 L23 104 Z"
			/>
		</svg>

		<div class="panel dock-right relative w-full p-6 md:p-12">
			<div class="grid gap-5 md:grid-cols-[1.1fr_1.6fr] md:gap-10">
				<!-- left: company + section rail -->
				<div>
					<h3
						class="text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.1] font-semibold tracking-[-0.025em]"
					>
						Wisely Optimize
					</h3>
					<p class="mt-3 text-[14px] leading-[1.5] text-[color:var(--text-3)]">
						Basketball intelligence for Division 1 programs. Part-time alongside Zoovu — year-round,
						deep in the sport.
					</p>
					<div class="mt-4 flex items-baseline gap-3">
						<span class="dot-solo"></span>
						<span class="text-[14px] font-medium">Basketball Engineer · part-time</span>
						<span class="ml-auto text-[12px] whitespace-nowrap text-[color:var(--text-4)]">
							Mar 2026 – present
						</span>
					</div>
					<!-- mobile: the rail collapses to tappable dots + the same progress line -->
					<div class="dots mt-3 md:hidden">
						{#each sections as s, i}
							<button
								class="dot-btn"
								class:active={i === active}
								class:passed={i < active}
								aria-label="{s.title} ({i + 1} of {sections.length})"
								aria-current={i === active}
								onclick={() => jumpTo(i)}
							>
								<span class="dot"></span>
							</button>
						{/each}
						<div class="dots-line" style="--p: {progress}" aria-hidden="true"></div>
					</div>
					<div class="rail mt-8">
						{#each sections as s, i}
							<button
								class="rail-row"
								class:active={i === active}
								class:passed={i < active}
								onclick={() => jumpTo(i)}
							>
								<span class="dot"></span>
								<span class="rail-title">{s.title}</span>
								<span class="rail-dates">{s.tag}</span>
							</button>
						{/each}
						<div class="rail-line" style="--p: {progress}"></div>
					</div>
					<p class="mt-6">
						<a
							href="https://wiselyoptimize.com"
							target="_blank"
							rel="noopener"
							class="cta text-[14px]"
						>
							wiselyoptimize.com ›
						</a>
					</p>
				</div>

				<!-- right: active section slide (fixed height — no layout shift) -->
				<div>
					<!-- all slides share one grid cell — the tallest sets the height, so
					     nothing overlaps and there's no layout shift between sections -->
					<div class="slide relative">
						{#each sections as s, i}
							<div class="slide-card" class:active={i === active}>
								<div class="flex items-baseline justify-between gap-4">
									<h4 class="text-[clamp(1.2rem,2.4vw,1.8rem)] font-semibold tracking-[-0.02em]">
										{s.title}
									</h4>
									<span class="text-[12px] whitespace-nowrap text-[color:var(--text-4)]">
										{i + 1} / {sections.length}
									</span>
								</div>
								<p class="mt-2 text-[15px] text-[color:var(--text-3)]">{s.blurb}</p>
								<div class="mt-4 flex flex-col gap-2.5 md:mt-6 md:gap-3">
									{#each s.points as p, j}
										<div class="point" style="--d: {j * 70}ms">{p}</div>
									{/each}
								</div>
								<div class="stat">
									<span class="stat-v">{s.stat.v}</span>
									<span class="stat-l">{s.stat.l}</span>
								</div>
							</div>
						{/each}
					</div>
					<!-- desktop: programs inside the card; mobile renders them after the pin instead -->
					<div class="mt-6 hidden border-t pt-5 md:block" style="border-color: var(--line-soft)">
						{@render programStrip()}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- mobile: the programs strip lives outside the pin, so the pinned card stays well under a screen tall -->
<div class="brands-flow md:hidden">
	{@render programStrip()}
</div>

<style>
	.wrap {
		/* ~25vh of scrub per section — matches the XGen pace */
		height: 200vh;
	}

	.panel {
		background: var(--bg);
		margin-left: max(2rem, 9vw);
		border-radius: 28px 0 0 28px;
		box-shadow: inset -4px 0 0 var(--accent);
		animation: from-right 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-timeline: view();
		/* entry-based only — cover ranges freeze while the panel is pinned */
		animation-range: entry 20% entry 95%;
	}
	@keyframes from-right {
		from {
			opacity: 0;
			transform: translateX(140px) scale(0.96);
			filter: blur(6px);
		}
		to {
			opacity: 1;
			transform: none;
			filter: blur(0);
		}
	}

	/* ---- ghost W ---- */
	.ghost {
		position: absolute;
		top: 50%;
		left: -2.5rem;
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

	/* ---- section rail ---- */
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
			margin-left: 1rem;
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
		margin-left: 1rem;
		padding: 1.1rem 1.3rem;
		background: var(--bg);
		border-radius: 16px 0 0 16px;
		box-shadow: inset -4px 0 0 var(--accent);
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

	.logo {
		/* dark crimson/green marks need a nudge against the near-black panel */
		filter: brightness(1.15);
	}
	.dot-solo {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: var(--accent);
		align-self: center;
		flex-shrink: 0;
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
