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

<!-- pin wrap: the panel sticks for ~3 screen-heights while scroll scrubs the roles -->
<div bind:this={wrapEl} class="wrap">
	<div class="sticky top-0 flex h-screen items-center">
		<!-- ghost X pins along with the panel -->
		<svg class="ghost" viewBox="0 0 100 110" fill="none" aria-hidden="true">
			<path
				class="draw"
				pathLength="1"
				style="stroke-dashoffset: {1 - drawP}"
				d="M8 104 L38 55 L8 6 L31 6 L50 33 L69 6 L92 6 L62 55 L92 104 L69 104 L50 77 L31 104 Z"
			/>
		</svg>

		<div class="panel dock-left relative w-full p-8 md:p-12">
			<div class="grid gap-10 md:grid-cols-[1.1fr_1.6fr]">
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
					<div class="slide relative">
						{#key active}
							<div class="swap-in">
								<div class="flex items-baseline justify-between gap-4">
									<h4 class="text-[clamp(1.3rem,2.4vw,1.8rem)] font-semibold tracking-[-0.02em]">
										{roles[active].title}
									</h4>
									<span class="text-[12px] whitespace-nowrap text-[color:var(--text-4)]">
										{active + 1} / {roles.length}
									</span>
								</div>
								<p class="mt-2 text-[15px] text-[color:var(--text-3)]">{roles[active].blurb}</p>
								<div class="mt-6 flex flex-col gap-3">
									{#each roles[active].points as p, i}
										<div class="point" style="--d: {i * 70}ms">{p}</div>
									{/each}
								</div>
								<div class="stat mt-6">
									<span class="stat-v">{roles[active].stat.v}</span>
									<span class="stat-l">{roles[active].stat.l}</span>
								</div>
							</div>
						{/key}
					</div>
					<div class="mt-6 border-t pt-5" style="border-color: var(--line-soft)">
						<div
							class="text-[11px] font-medium tracking-[0.12em] uppercase text-[color:var(--text-4)]"
						>
							In production for
						</div>
						<div class="mt-3 flex flex-wrap items-baseline gap-x-8 gap-y-2">
							{#each brands as b}
								<span class="{b.cls} text-[15px] text-[color:var(--text-3)]">{b.name}</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.wrap {
		/* ~30vh of scrub per role — quick swipes between slides */
		height: 220vh;
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
	.rail-row.active .dot {
		background: var(--accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent);
	}
	.rail-row.passed .dot {
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
		/* tallest slide sets this — locked so the panel never changes height */
		height: 380px;
	}
	@media (max-width: 767px) {
		.slide {
			height: 420px;
		}
	}
	.swap-in {
		animation: swap 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	@keyframes swap {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: none;
		}
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
		animation: swap 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: var(--d, 0ms);
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
		.panel,
		.swap-in,
		.point {
			animation: none;
		}
		.draw {
			/* beats the inline scroll-driven offset */
			stroke-dashoffset: 0 !important;
		}
	}
</style>
