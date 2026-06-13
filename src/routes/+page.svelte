<script lang="ts">
	import { onMount } from 'svelte';
	import SpecLine from '$lib/components/SpecLine.svelte';
	import WorkXGen from '$lib/components/WorkXGen.svelte';
	import WorkWisely from '$lib/components/WorkWisely.svelte';
	import OtherProjects from '$lib/components/OtherProjects.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import PoseyGallery from '$lib/components/PoseyGallery.svelte';

	// Mile A Day live stats — rendered only if the fetches succeed
	let madStreak = $state<number | null>(null);
	let madUsers = $state<number | null>(null);
	let madRating = $state<{ stars: number; reviews: number } | null>(null);
	let madReviews = $state<{ rating: number; title: string; author: string; content: string }[]>([]);

	// Mile A Day phone shots — one card, crossfades on a timer
	const madPhones = [
		{
			src: '/images/mad-phone-streak.png',
			alt: 'Mile A Day streak screen — current streak and daily progress'
		},
		{
			src: '/images/mad-phone-compete.png',
			alt: 'Mile A Day compete screen — clashes and weekly streaks with friends'
		},
		{
			src: '/images/mad-phone-medals.png',
			alt: 'Mile A Day medals screen — milestones and personal records'
		}
	];
	let madPhoneIdx = $state(0);

	onMount(() => {
		fetch('https://mad.mindgoblin.tech/public/streak/dave')
			.then((r) => (r.ok ? r.json() : null))
			.then((d) => {
				if (d?.current_streak) madStreak = d.current_streak;
			})
			.catch(() => {});
		fetch('https://mad.mindgoblin.tech/public/users')
			.then((r) => (r.ok ? r.json() : null))
			.then((d) => {
				if (d?.count) madUsers = d.count;
			})
			.catch(() => {});
		fetch('/api/mad-rating')
			.then((r) => (r.ok ? r.json() : null))
			.then((d) => {
				if (d?.stars) madRating = { stars: d.stars, reviews: d.ratingCount ?? 0 };
				if (Array.isArray(d?.reviews)) madReviews = d.reviews;
			})
			.catch(() => {});

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const cycle = setInterval(() => {
			madPhoneIdx = (madPhoneIdx + 1) % madPhones.length;
		}, 4000);
		return () => clearInterval(cycle);
	});

	const cbbFeatures = [
		'KenPom, EvanMiya, BartTorvik, and NET compiled into a single composite ranking',
		'Team profile pages with advanced stats and history',
		'Team “March” profiles to see how similar teams performed in past March Madness runs',
		'Bracket Builder that evaluates your bracket and flags picks made against historic trends',
		'Bracket Simulator that uses historical data to chase the first perfect bracket',
		'Game predictions, previews, and recaps'
	];

	// CBB section staggered scroll-in (replays on re-entry, like Skills)
	let cbbEl: HTMLElement | undefined = $state();
	let cbbShown = $state(false);
	// only hide-before-animate once JS is running; no-JS/hydration-fail stays visible
	let cbbArmed = $state(false);
	$effect(() => {
		if (!cbbEl) return;
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			cbbShown = true;
			return;
		}
		cbbArmed = true;
		const io = new IntersectionObserver((entries) => (cbbShown = entries[0].isIntersecting), {
			// fire once the section is meaningfully on screen, not at first pixel
			threshold: 0.1,
			rootMargin: '0px 0px -25% 0px'
		});
		io.observe(cbbEl);
		return () => io.disconnect();
	});

	// Mile A Day section staggered scroll-in (same pattern as CBB)
	let madEl: HTMLElement | undefined = $state();
	let madShown = $state(false);
	let madArmed = $state(false);
	$effect(() => {
		if (!madEl) return;
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			madShown = true;
			return;
		}
		madArmed = true;
		const io = new IntersectionObserver((entries) => (madShown = entries[0].isIntersecting), {
			threshold: 0.1,
			rootMargin: '0px 0px -25% 0px'
		});
		io.observe(madEl);
		return () => io.disconnect();
	});

	// Singing fish section staggered scroll-in + click-to-play video facade
	let fishEl: HTMLElement | undefined = $state();
	let fishShown = $state(false);
	let fishArmed = $state(false);
	$effect(() => {
		if (!fishEl) return;
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			fishShown = true;
			return;
		}
		fishArmed = true;
		const io = new IntersectionObserver((entries) => (fishShown = entries[0].isIntersecting), {
			threshold: 0.1,
			rootMargin: '0px 0px -25% 0px'
		});
		io.observe(fishEl);
		return () => io.disconnect();
	});

	const hobbies = [
		{ name: 'College sports', note: 'massive fan — basketball especially' },
		{ name: 'Running & lifting', note: 'yes, I use my own running app' },
		{ name: 'Movies', note: 'Memento is the answer' },
		{ name: 'Smoking meats', note: 'brisket is the long game' },
		{ name: 'Smart home', note: 'automations nobody asked for' },
		{ name: 'Hardware', note: 'building PCs and rewiring fish' }
	];
</script>

<!-- ============================================================
     BAND 1 — BLACK: hero
============================================================ -->
<section class="flex min-h-svh flex-col justify-center px-8 py-20 md:px-16">
	<h1
		class="max-w-5xl text-[clamp(3.4rem,9vw,7.5rem)] leading-[0.98] font-semibold tracking-[-0.035em]"
	>
		<span class="rise block" style="--d: 0">David</span>
		<span class="rise block" style="--d: 1">Simmerman</span>
	</h1>
	<p
		class="rise mt-8 max-w-3xl text-[clamp(1.3rem,2.6vw,1.9rem)] leading-[1.25] font-medium text-[color:var(--text-3)]"
		style="--d: 2"
	>
		Software engineer. I make complicated things feel
		<span style="color: var(--accent)">simple</span>, automate the tedious, and build tools for
		everyday life — AI platforms, basketball analytics, and ecommerce.
	</p>
	<div class="rise mt-10 flex items-center gap-7 text-[15px]" style="--d: 3">
		<a href="/#work" class="cta">See the work ›</a>
		<a href="/#contact" class="cta">Get in touch ›</a>
	</div>
</section>

<!-- ============================================================
     BAND 1.5 — BLACK: the short version (bio)
============================================================ -->
<section class="px-8 py-24 md:px-16">
	<SpecLine label="My story" />
	<p
		class="reveal mx-auto mt-10 max-w-3xl text-center text-[clamp(1.4rem,3vw,2.1rem)] leading-[1.35] font-medium text-[color:var(--text-3)]"
	>
		<span class="text-[color:var(--text)]">Started programming at 12</span> to build a Minecraft
		server with friends. Began a computer science degree at Michigan State, but left due to medical
		issues — took online courses instead and
		<span class="text-[color:var(--text)]">joined XGen AI at 19</span>. Integrations developer to
		director in five years, building AI for some of the world's biggest brands.
		<span class="text-[color:var(--text)]">Zoovu acquired XGen in 2026.</span> These days I split my
		time between enterprise AI and
		<span class="text-[color:var(--text)]">Division 1 basketball analytics</span> at Wisely Optimize.
	</p>
</section>

<!-- ============================================================
     BAND 2 — GRAY (full width): work, resume-style
============================================================ -->
<section id="work" class="w-full overflow-x-clip py-20" style="background: var(--bg-elev)">
	<div class="px-8 md:px-16">
		<SpecLine label="Work" detail="the professional record" />
	</div>
	<div class="mt-12 flex flex-col gap-20">
		<WorkXGen />
		<WorkWisely />
	</div>
</section>

<!-- ============================================================
     BAND 3 — BLACK: personal projects (top 3)
============================================================ -->
<section id="projects" class="overflow-hidden pt-20">
	<div class="px-8 md:px-16">
		<SpecLine label="Personal projects" detail="built after hours" />
	</div>

	<!-- CBB Composite -->
	<div class="grid items-center gap-10 px-8 py-16 md:grid-cols-[1fr_1.3fr] md:px-16">
		<div class="reveal">
			<h2 class="text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
				Every ranking system. One number.
			</h2>
			<p class="mt-6 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]">
				KenPom, EvanMiya, BartTorvik and the rest, consolidated into a single composite — plus
				bracket building, prediction, and analysis tools that 150 people a day sweat over every
				March.
			</p>
			<div class="mt-6 flex items-center gap-6 text-[15px]">
				<a href="https://cbbcomposite.com" target="_blank" rel="noopener" class="cta">
					cbbcomposite.com ›
				</a>
				<a
					href="https://github.com/DavidSimmerman/cbb-composite-rankings"
					target="_blank"
					rel="noopener"
					class="cta"
				>
					GitHub ›
				</a>
			</div>
		</div>
		<div class="reveal shot-wrap md:-mr-24" style="--vd: 0.15s">
			<img
				src="/images/shot-cbb.png"
				alt="CBB Composite rankings table"
				class="shot"
				loading="lazy"
			/>
		</div>
	</div>

	<!-- Mile A Day -->
	<div class="grid items-center gap-10 px-8 py-16 md:grid-cols-[1.3fr_1fr] md:px-16">
		<div class="reveal shot-wrap order-2 md:order-1 md:-ml-24" style="--vd: 0.15s">
			<img src="/images/shot-mileaday.png" alt="Mile A Day website" class="shot" loading="lazy" />
		</div>
		<div class="reveal order-1 md:order-2">
			<h2 class="text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
				A mile. Every day.
			</h2>
			<p class="mt-6 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]">
				An iOS running app built with a friend — streaks, challenges, and friendly competition that
				keep 50-plus runners moving daily.
			</p>
			<div class="mt-6 flex items-center gap-6 text-[15px]">
				<a
					href="https://apps.apple.com/us/app/mile-a-day/id6746970905"
					target="_blank"
					rel="noopener"
					class="cta"
				>
					App Store ›
				</a>
				<a href="https://mileaday.run" target="_blank" rel="noopener" class="cta">mileaday.run ›</a>
				<a
					href="https://github.com/robwizzie/Mile-A-Day"
					target="_blank"
					rel="noopener"
					class="cta"
				>
					GitHub ›
				</a>
			</div>
		</div>
	</div>

	<!-- Singing fish -->
	<div class="grid items-center gap-10 px-8 py-16 pb-24 md:grid-cols-[1fr_1.3fr] md:px-16">
		<div class="reveal">
			<h2 class="text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
				A fish with a Raspberry Pi.
			</h2>
			<p class="mt-6 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]">
				A Billy Bass rewired with a Raspberry Pi, new speakers, and a web UI — pick any YouTube
				video and choreograph the motors to sing along. Custom songs instead of the boring built-in
				ones.
			</p>
			<div class="mt-6 flex items-center gap-6 text-[15px]">
				<a
					href="https://www.youtube.com/watch?v=3paEeTIqVgU"
					target="_blank"
					rel="noopener"
					class="cta"
				>
					Watch the demo ›
				</a>
				<a
					href="https://github.com/DavidSimmerman/singing-fish"
					target="_blank"
					rel="noopener"
					class="cta"
				>
					GitHub ›
				</a>
			</div>
		</div>
		<div class="reveal shot-wrap md:-mr-24" style="--vd: 0.15s">
			<img
				src="/images/shot-fish.jpg"
				alt="Big Mouth Billy Bass, rewired"
				class="shot"
				loading="lazy"
			/>
		</div>
	</div>
</section>

<!-- ============================================================
     BAND 4 — GRAY (full width): other projects, one at a time
============================================================ -->
<section class="w-full px-8 py-20 md:px-16" style="background: var(--bg-elev)">
	<SpecLine label="Other projects" detail="the rest of the graveyard, alive and well" />
	<div class="reveal mt-10">
		<OtherProjects />
	</div>
</section>

<!-- ============================================================
     BAND 5 — about: full-bleed photo, hobbies, Posey
============================================================ -->
<section id="about">
	<!-- full-bleed photo, edge to edge -->
	<div class="relative">
		<img
			src="/images/hike-wide.png"
			alt="David and Posey on a mountain summit"
			class="parallax h-[70vh] w-full object-cover"
			loading="lazy"
		/>
		<div class="scrim absolute inset-0 flex flex-col justify-end px-8 pb-12 md:px-16">
			<div class="max-w-xs">
				<SpecLine label="Off the clock" />
			</div>
			<p
				class="reveal mt-4 max-w-lg text-[clamp(1.6rem,3.5vw,2.6rem)] leading-[1.15] font-semibold tracking-[-0.025em]"
				style="--vd: 0.1s"
			>
				The part of the site where I'm a person.
			</p>
		</div>
	</div>

	<!-- hobbies -->
	<div class="grid gap-12 px-8 py-20 md:grid-cols-[1fr_1.2fr] md:px-16">
		<div class="reveal">
			<h2 class="text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.1] font-semibold tracking-[-0.025em]">
				When I'm not shipping.
			</h2>
			<p class="mt-6 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]">
				Most of my free time goes to the same energy that started this whole thing — building stuff
				and following sports way too closely. The rest goes to the smoker, the home server rack, and
				a golden retriever with one very busy braincell.
			</p>
		</div>
		<div class="flex flex-col justify-center">
			{#each hobbies as h, i}
				<div
					class="reveal flex items-baseline justify-between gap-6 border-b py-4"
					style="border-color: var(--line-soft); --vd: {(i % 3) * 0.08}s"
				>
					<span class="text-[16px] font-semibold">{h.name}</span>
					<span class="text-right text-[13.5px] text-[color:var(--text-3)]">{h.note}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Posey -->
	<div class="px-8 pb-24 md:px-16">
		<SpecLine label="And this is Posey" detail="named after Buster" />
		<p class="reveal mt-6 max-w-2xl text-[16px] leading-[1.55] text-[color:var(--text-2)]">
			Loves every person she's ever met, keeps the neighbors company during yard work, steals shoes
			at other people's houses, and was formally downgraded to
			<span class="text-[color:var(--text)]">silver retriever</span> by the Retriever Committee for refusing
			to give the ball back. Will wait ten minutes for permission to eat dropped food. Sleeps in past
			me every morning.
		</p>
		<div class="reveal mt-10" style="--vd: 0.1s">
			<PoseyGallery />
		</div>
	</div>
</section>

<!-- ============================================================
     BAND 6 — closer
============================================================ -->
<section id="contact" class="px-8 pt-10 pb-14 md:px-16">
	<h2
		class="reveal max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
	>
		Let's build something.
	</h2>
	<div class="reveal mt-7 flex items-center gap-8 text-[15px]" style="--vd: 0.1s">
		<a href="mailto:david@simmerman.tech" class="cta">david@simmerman.tech ›</a>
		<a href="https://github.com/DavidSimmerman" target="_blank" rel="noopener" class="cta">
			GitHub ›
		</a>
		<a
			href="https://www.linkedin.com/in/david-simmerman"
			target="_blank"
			rel="noopener"
			class="cta"
		>
			LinkedIn ›
		</a>
	</div>
</section>

<style>
	.shot {
		border-radius: 14px;
		border: 1px solid #ffffff14;
		box-shadow: 0 30px 80px #000000a0;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.scrim {
		background: linear-gradient(to top, #08080ae6 0%, #08080a40 40%, transparent 65%);
	}

	/* CBB section scroll-in — left column cascades, cards fade.
	   Hidden states only apply once JS arms the section (.anim-ready),
	   so without JS / on hydration failure the content stays visible. */
	.c-anim {
		transition:
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: calc(var(--i, 0) * 55ms);
	}
	.anim-ready .c-anim {
		opacity: 0;
		transform: translateY(16px);
	}
	.anim-ready .c-anim.shown {
		opacity: 1;
		transform: translateY(0);
	}
	/* cards fade only — transform left free so the hover scale still works,
	   and the entrance delay applies to opacity only (not the hover) */
	.c-fade {
		transition:
			opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: calc(var(--i, 0) * 100ms), 0s;
	}
	.anim-ready .c-fade {
		opacity: 0;
	}
	.anim-ready .c-fade.shown {
		opacity: 1;
	}
	/* images gently settle from a slight zoom — its own element, so the
	   card's hover scale never conflicts; inherits --i from the card */
	.c-img {
		transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: calc(var(--i, 0) * 100ms);
	}
	.anim-ready .c-img {
		transform: scale(1.06);
	}
	.anim-ready .c-img.shown {
		transform: scale(1);
	}
	@media (prefers-reduced-motion: reduce) {
		.anim-ready .c-anim,
		.anim-ready .c-fade,
		.anim-ready .c-img {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}

	/* CBB bento — Apple-style caption cards with overlay text */
	.bento-card {
		position: relative;
		overflow: hidden;
		border-radius: 24px;
		border: 1px solid #ffffff14;
		background: var(--bg-elev);
		box-shadow: 0 30px 80px #00000060;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.bento-card:hover {
		transform: scale(1.02);
	}
	.bento-cap {
		position: absolute;
		inset: auto 0 0 0;
		padding: 3rem 1.5rem 1.4rem;
		font-size: clamp(1.05rem, 1.4vw, 1.35rem);
		font-weight: 600;
		line-height: 1.28;
		letter-spacing: -0.015em;
		color: var(--text);
		background: linear-gradient(to top, #050507f7 8%, #050507c8 42%, transparent 100%);
		/* fade in on scroll (Chrome/Edge); plays once on load elsewhere */
		animation: cap-fade 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-timeline: view();
		animation-range: entry 12% cover 32%;
	}
	@keyframes cap-fade {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bento-cap {
			animation: none;
		}
	}

	/* Mile A Day collage — phone shots cascade over the website shot */
	.mad-collage {
		position: relative;
		padding: 2rem 0 2.5rem;
	}
	.mad-base {
		position: relative;
		width: 94%;
	}
	.mad-phone-cycle {
		position: absolute;
		right: 8%;
		bottom: -8%;
		width: 27%;
		aspect-ratio: 230 / 498;
		z-index: 2;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.mad-phone-img {
		position: absolute;
		inset: 0;
		width: 100%;
		opacity: 0;
		transition: opacity 0.9s ease;
		box-shadow: 0 30px 80px #000000d0;
	}
	.mad-phone-img.active {
		opacity: 1;
	}
	/* hover either part of the collage → both shots expand together (no z-swap) */
	.mad-collage:hover .mad-base {
		transform: scale(1.04);
	}
	.mad-collage:hover .mad-phone-cycle {
		transform: scale(1.08);
	}
</style>
