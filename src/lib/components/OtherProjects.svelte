<script lang="ts">
	import { inView } from '$lib/inView';
	// Other projects as a swipeable gallery (Apple's "take a closer look" row). Each card's top is
	// a stage: the whole screenshot, uncropped, on a dark backdrop lit by a glow in the app's own
	// color. Bid War's stage is its playable 1v1 intro instead.
	import BidWarVersus from './BidWarVersus.svelte';
	import Icon from './Icon.svelte';

	type Shot = { src: string; w: number; h: number; alt: string };
	type Project = {
		name: string;
		year: string;
		platform: string;
		desc: string;
		github: string;
		live?: { label: string; href: string };
		/** the backdrop glow, in the app's own color */
		glow: string;
		/** phone screens sit full height; web shots fill the width */
		shot?: Shot & { phone: boolean };
		/** Movie SZN: its wordmark, stacked above the screenshot */
		logo?: Shot;
		/** Bid War: its 1v1 intro fills the stage */
		versus?: boolean;
	};

	const projects: Project[] = [
		{
			name: 'Bid War',
			year: '2026',
			platform: 'Game',
			desc: 'A party game for drafting with friends. Pick a list — NBA GOATs, fast food chains, Star Wars characters — everyone gets the same budget, and you bid against each other to build the best squad.',
			github: 'https://github.com/DavidSimmerman/bidwar',
			live: { label: 'bidwar.simmerman.tech', href: 'https://bidwar.simmerman.tech' },
			glow: '#5b8cff',
			versus: true
		},
		{
			name: 'Movie SZN',
			year: '2024',
			platform: 'Web',
			desc: 'A movie review site for me and my friends — track what I watch, argue about ratings, and queue up suggestions for what I should suffer through next.',
			github: 'https://github.com/DavidSimmerman/movie-szn',
			live: { label: 'movie-szn.simmerman.tech', href: 'https://movie-szn.simmerman.tech' },
			glow: '#b97a14',
			logo: { src: '/images/op-movie-szn-logo.png', w: 959, h: 385, alt: 'Movie SZN logo' },
			shot: {
				src: '/images/op-movie-szn.png',
				w: 2048,
				h: 1220,
				alt: 'Movie SZN Season Awards',
				phone: false
			}
		},
		{
			name: "CFB Pick'em",
			year: '2026',
			platform: 'Web',
			desc: "Weekly college football pick'em for me and my friends. Lines come from ESPN and freeze at kickoff, so a late line move never re-grades anyone's pick.",
			github: 'https://github.com/DavidSimmerman/college-pickem',
			live: { label: 'pickem.simmerman.tech', href: 'https://pickem.simmerman.tech' },
			glow: '#b8962e',
			shot: {
				src: '/images/op-pickem-board.png',
				w: 386,
				h: 703,
				alt: "CFB Pick'em weekly board",
				phone: true
			}
		},
		{
			name: 'Discovery',
			year: '2025',
			platform: 'Mobile',
			desc: "Spotify's shuffle plays the same songs until they become your top songs, which makes it play them more. Discovery breaks the loop.",
			github: 'https://github.com/DavidSimmerman/discovery',
			live: { label: 'discovery.simmerman.tech', href: 'https://discovery.simmerman.tech' },
			glow: '#8f7d1f',
			shot: {
				src: '/images/op-discovery.png',
				w: 1206,
				h: 1812,
				alt: 'Discovery player — rate the song that is playing',
				phone: true
			}
		},
		{
			name: 'Health dashboard',
			year: '2025',
			platform: 'Web',
			desc: 'Activity, food macros, sleep, heart data, weight, workouts — every health metric I generate, collected in one place, with an AI agent watching for bad trends and suggesting fixes.',
			github: 'https://github.com/DavidSimmerman/health-dashboard',
			glow: '#0a5fc0'
		},
		{
			name: 'Giddey',
			year: '2024',
			platform: 'Game',
			desc: 'An NBA take on the “Gridiron” football puzzle game, built in a weekend — my friend and I bet on who could ship the better version. This was my entry.',
			github: 'https://github.com/DavidSimmerman/giddey',
			live: { label: 'giddey.simmerman.tech', href: 'https://giddey.simmerman.tech' },
			glow: '#b5561c',
			shot: {
				src: '/images/op-giddey.png',
				w: 409,
				h: 885,
				alt: 'Giddey puzzle board',
				phone: true
			}
		}
	];

	let rail: HTMLElement | undefined = $state();
	let atStart = $state(true);
	let atEnd = $state(false);
	function onRailScroll() {
		if (!rail) return;
		atStart = rail.scrollLeft < 8;
		atEnd = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
	}
	// one card per press
	function slide(dir: number) {
		const card = rail?.querySelector('article');
		if (!rail || !card) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		rail.scrollBy({ left: dir * (card.offsetWidth + 18), behavior: reduce ? 'auto' : 'smooth' });
	}
	$effect(() => {
		if (rail) onRailScroll();
	});

	// the cards slide in from the right one after another, each screenshot rising into its
	// stage just behind; replays on every return. No JS / reduced motion: simply there.
	let armed = $state(false);
	let shown = $state(false);
	$effect(() => {
		if (!rail) return;
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;
		armed = true;
		return inView(
			rail,
			() => (shown = true),
			() => (shown = false),
			0.25
		);
	});

	// Bid War's intro plays when the gallery first comes into view, not on page load
	let versusOn = $state(false);
	// ...and again each time it comes back (the intro remounts, so it replays)
	function playOnView(node: HTMLElement) {
		return {
			destroy: inView(
				node,
				() => (versusOn = true),
				() => (versusOn = false),
				0.5
			)
		};
	}
</script>

<svelte:head>
	<!-- Bid War's wordmark font, subset to just its letters (a few KB) -->
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@1,900&text=BIDWAR&display=block"
	/>
</svelte:head>

<div class="gallery" class:anim-ready={armed} class:shown bind:this={rail} onscroll={onRailScroll}>
	{#each projects as p, i}
		<!-- the slot is what snaps; the card slides inside it, so snap points never move -->
		<div class="slot">
			<article class="card lit-card" style="--glow: {p.glow}; --i: {i}">
				<div class="stage" class:vs={p.versus}>
					{#if p.versus}
						<div class="vs-box" use:playOnView>
							{#if versusOn}<BidWarVersus />{/if}
						</div>
					{:else if p.shot}
						<div class="stack">
							{#if p.logo}
								<img
									class="logo"
									src={p.logo.src}
									alt={p.logo.alt}
									width={p.logo.w}
									height={p.logo.h}
									loading="lazy"
								/>
							{/if}
							<img
								class="shot"
								class:phone={p.shot.phone}
								src={p.shot.src}
								alt={p.shot.alt}
								width={p.shot.w}
								height={p.shot.h}
								loading="lazy"
							/>
						</div>
					{:else}
						<span class="icon-badge xl"><Icon name="pulse" size={44} /></span>
					{/if}
				</div>
				<div class="words">
					<p class="grad-text w-fit text-[13px] font-semibold">{p.platform} · {p.year}</p>
					<h3 class="silver mt-1.5 text-[22px] font-semibold tracking-[-0.02em]">{p.name}</h3>
					<p class="mt-2 text-[14px] leading-[1.55] text-[color:var(--text-3)]">{p.desc}</p>
					<div class="links">
						{#if p.live}
							<a href={p.live.href} target="_blank" rel="noopener" class="cta">Live ↗</a>
						{/if}
						<a href={p.github} target="_blank" rel="noopener" class="cta">GitHub</a>
					</div>
				</div>
			</article>
		</div>
	{/each}
</div>

<div class="arrows">
	<button type="button" aria-label="Previous project" disabled={atStart} onclick={() => slide(-1)}
		>‹</button
	>
	<button type="button" aria-label="Next project" disabled={atEnd} onclick={() => slide(1)}
		>›</button
	>
</div>

<style>
	/* bleeds to the section's edges; snapping keeps the same inset as the label above */
	.gallery {
		display: flex;
		gap: 18px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		margin-inline: -2rem;
		padding: 4px 2rem 20px;
		scroll-padding-inline: 2rem;
		scrollbar-width: none;
	}
	.gallery::-webkit-scrollbar {
		display: none;
	}
	@media (min-width: 768px) {
		.gallery {
			margin-inline: -4rem;
			padding-inline: 4rem;
			scroll-padding-inline: 4rem;
		}
	}
	.slot {
		flex: none;
		display: flex;
		scroll-snap-align: start;
	}
	.card {
		display: flex;
		flex-direction: column;
		flex: none;
		width: min(82vw, 300px);
		overflow: hidden;
		background: linear-gradient(180deg, #1b1b1e 0%, #141416 60%);
	}
	@media (min-width: 768px) {
		.card {
			width: 380px;
		}
	}

	/* entrance: opacity + translate only, so the lit card's hover lift (transform) still works */
	.card {
		transition:
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i) * 110ms),
			translate 0.9s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i) * 110ms),
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			border-color 0.35s,
			box-shadow 0.35s;
	}
	.anim-ready:not(.shown) .card {
		opacity: 0;
		translate: 90px 0;
	}
	.stack,
	.icon-badge.xl {
		transition:
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(0.25s + var(--i) * 110ms),
			translate 0.9s cubic-bezier(0.16, 1, 0.3, 1) calc(0.25s + var(--i) * 110ms);
	}
	.anim-ready:not(.shown) .stack,
	.anim-ready:not(.shown) .icon-badge.xl {
		opacity: 0;
		translate: 0 40px;
	}

	/* the stage: a glow in the app's color rising behind the screenshot */
	.stage {
		position: relative;
		display: grid;
		place-items: center;
		height: 300px;
		overflow: hidden;
		border-bottom: 1px solid #ffffff10;
		background:
			radial-gradient(
				70% 80% at 50% 60%,
				color-mix(in srgb, var(--glow) 62%, transparent),
				transparent 80%
			),
			#0b0b0d;
	}
	@media (min-width: 768px) {
		.stage {
			height: 340px;
		}
	}
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		width: 86%;
	}
	.shot,
	.logo {
		border: 1px solid #ffffff24;
		box-shadow: 0 24px 50px -16px #000000e0;
	}
	.shot {
		width: 100%;
		border-radius: 10px;
	}
	.shot.phone {
		width: auto;
		height: 252px;
		border-radius: 16px;
	}
	@media (min-width: 768px) {
		.shot.phone {
			height: 290px;
		}
	}
	.logo {
		width: 72%;
		border-radius: 8px;
	}
	.vs-box {
		position: absolute;
		inset: 0;
		background: #0b0b12;
	}
	.icon-badge.xl {
		width: 5.5rem;
		height: 5.5rem;
		border-radius: 20px;
	}

	.words {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 1.4rem 1.5rem 1.5rem;
	}
	.links {
		display: flex;
		gap: 1.25rem;
		margin-top: auto;
		padding-top: 1rem;
		font-size: 14px;
	}

	.arrows {
		display: none;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	@media (min-width: 768px) {
		.arrows {
			display: flex;
		}
	}
	.arrows button {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		padding-bottom: 3px;
		border-radius: 999px;
		font-size: 22px;
		line-height: 1;
		color: var(--text);
		background: #ffffff14;
		cursor: pointer;
		transition: background 0.2s;
	}
	.arrows button:hover:not(:disabled) {
		background: #ffffff24;
	}
	.arrows button:disabled {
		opacity: 0.35;
		cursor: default;
	}
</style>
