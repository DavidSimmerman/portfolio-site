<script lang="ts">
	import { onMount } from 'svelte';
	import SpecLine from '$lib/components/SpecLine.svelte';
	import WorkXGen from '$lib/components/WorkXGen.svelte';
	import WorkWisely from '$lib/components/WorkWisely.svelte';
	import OtherProjects from '$lib/components/OtherProjects.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import PoseyGallery from '$lib/components/PoseyGallery.svelte';
	import HobbyIcon from '$lib/components/HobbyIcon.svelte';

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

	// App Store reviews — crossfade through all of them (dots let you jump)
	let madReviewIdx = $state(0);
	$effect(() => {
		if (madReviews.length <= 1) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const t = setInterval(() => {
			madReviewIdx = (madReviewIdx + 1) % madReviews.length;
		}, 6000);
		return () => clearInterval(t);
	});

	// The stack container animates its height to the ACTIVE card's natural height,
	// so cycling to a shorter/taller review never leaves trailing space or jumps.
	// bind:offsetHeight keeps each card's measurement fresh through resizes.
	let reviewHeights = $state<number[]>([]);
	let reviewStackReady = $state(false); // arm the height transition only after first paint
	const reviewStackH = $derived(reviewHeights[madReviewIdx] ?? 0);
	$effect(() => {
		if (reviewStackReady || !reviewStackH) return;
		// let the first measured height land without a transition, then arm it
		const raf = requestAnimationFrame(() => (reviewStackReady = true));
		return () => cancelAnimationFrame(raf);
	});

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
				if (Array.isArray(d?.reviews))
					madReviews = d.reviews.filter((r: { rating: number }) => r.rating === 5);
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

	// Off-the-clock banner parallax — image is taller than its frame and both zooms out
	// (scale 1.45 → 1.0) and drifts vertically as the frame scrolls through the viewport.
	// Plain scroll listener so it works everywhere (CSS animation-timeline is Chromium-only).
	// Scale stays >= 1 (object-cover at full width would gap horizontally below 1); the drift
	// uses 80% of the vertical slack, so the frame stays fully covered at every position.
	let parallaxEl: HTMLImageElement | undefined = $state();
	$effect(() => {
		const img = parallaxEl;
		const box = img?.parentElement;
		if (!img || !box) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const update = () => {
			const slack = img.offsetHeight - box.offsetHeight; // extra height to drift within
			if (slack <= 0) {
				img.style.transform = '';
				return;
			}
			if (reduce) {
				img.style.transform = `translate3d(0, ${-slack / 2}px, 0)`; // static, centered
				return;
			}
			const r = box.getBoundingClientRect();
			const vh = window.innerHeight;
			// 0 as the frame enters from the bottom → 0.5 dead-center → 1 exiting past the top
			const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
			// finish the effect by the time the frame is centered, then hold (don't keep going)
			const q = Math.min(1, p * 2);
			const scale = 1.45 - 0.45 * q; // zoom out as you scroll down, done at center
			img.style.transform = `translate3d(0, ${-q * slack * 0.8}px, 0) scale(${scale})`;
		};
		update();
		if (reduce) return;
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				update();
				ticking = false;
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
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

	// Off-the-clock "fun facts" rail — personal trivia, kept distinct from the status cards
	const funFacts = [
		{ k: 'Favorite food', v: 'Brisket' },
		{ k: 'Ice cream order', v: 'Dark-chocolate mint with Oreos' },
		{
			k: 'Favorite movies',
			v: 'Memento · Lord of the Rings · The Dark Knight · Into the Spider-Verse'
		},
		{ k: 'On the TV', v: 'Invincible · Breaking Bad · Attack on Titan' },
		{ k: 'Favorite artist', v: 'Quinn XCII' },
		{ k: 'Sports hot take', v: 'Replace the refs with computers' },
		{ k: 'Random skill', v: 'Naming where every NBA player went to college' },
		{ k: 'Career Plan B', v: 'Something in movies or music' }
	];

	// Hobbies board — one card per thing I actually do off the clock
	const hobbyCards = [
		{
			t: 'Watching sports',
			icon: 'tv',
			d: 'Once fall hits, every minute of every Saturday the TV is on with four college games split-screen. Sundays are NFL RedZone from 1:00 until SNF ends. Weeknights I binge as many CBB games at once as I can.'
		},
		{
			t: 'Critiquing movies',
			icon: 'film',
			d: "Once March Madness ends and there's no more sports to watch, my nights flip to movie season — I catch up on as many films as I can to make up for the ones I miss all fall."
		},
		{
			t: 'Fitness & activity',
			icon: 'activity',
			d: 'I like being active: at least a mile every day, a workout on my lunch break, and a desk treadmill to sneak in extra steps through the work day.'
		},
		{
			t: 'Keyboards',
			icon: 'keyboard',
			d: "I build custom mechanical keyboards — way too much time and money — but nothing beats the key clacks of a finished build. I've got 14 in rotation right now."
		},
		{
			t: 'Gaming',
			icon: 'gamepad',
			d: "I don't play as much anymore, but I was a big Counter-Strike guy. These days it's mostly sports games — the CFB and NBA 2K series."
		},
		{
			t: 'Smart home',
			icon: 'home',
			d: 'I overcomplicate everything, which means an intricate smart home. I automate what I can and script routines so I can be lazy and never get up to turn off the lights.'
		}
	];

	// vibe tags below the hobby cards (rendered uppercase)
	const aboutTags = [
		'Techie',
		'Over-engineer',
		'Night owl',
		'Sports junky',
		'SD4L',
		'Overly-competitive',
		'Nolan enthusiast',
		'Marvel hater'
	];
</script>

<!-- ============================================================
     BAND 1 — BLACK: hero
============================================================ -->
<section id="hero" class="relative flex min-h-svh flex-col justify-center px-8 py-20 md:px-16">
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
	<div class="scroll-cue" aria-hidden="true"></div>
</section>

<!-- ============================================================
     BAND 1.5 — BLACK: the short version (bio)
============================================================ -->
<section class="flex min-h-svh flex-col px-8 py-24 md:px-16">
	<SpecLine label="My story" />
	<div class="flex flex-1 items-center">
		<p
			class="reveal mx-auto max-w-3xl text-center text-[clamp(1.4rem,3vw,2.1rem)] leading-[1.35] font-medium text-[color:var(--text-3)]"
		>
			<span class="text-[color:var(--text)]">Started programming at 12</span> to build a Minecraft
			server with friends. Began a computer science degree at Michigan State, but left due to
			medical issues — took online courses instead and
			<span class="text-[color:var(--text)]">joined XGen AI at 19</span>. Integrations developer to
			director in five years, building AI for some of the world's biggest brands.
			<span class="text-[color:var(--text)]">Zoovu acquired XGen in 2026.</span> These days I split
			my time between enterprise AI and
			<span class="text-[color:var(--text)]">Division 1 basketball analytics</span> at Wisely Optimize.
		</p>
	</div>
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
     BAND 2.5 — BLACK: skills, the toolbox
============================================================ -->
<section id="skills" class="flex min-h-svh flex-col px-8 py-20 md:px-16">
	<SpecLine label="Skills" detail="the toolbox" />
	<div class="flex flex-1 flex-col justify-center">
		<Skills />
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
	<div
		bind:this={cbbEl}
		class="grid items-center gap-10 px-8 py-16 md:grid-cols-[1fr_1.3fr] md:px-16"
		class:anim-ready={cbbArmed}
	>
		<div>
			<h2
				class="c-anim text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
				class:shown={cbbShown}
				style="--i: 0"
			>
				CBB Composite Rankings
			</h2>
			<ul class="mt-7 flex max-w-md flex-col gap-3.5">
				{#each cbbFeatures as f, i}
					<li
						class="c-anim flex gap-3 text-[15.5px] leading-[1.5] text-[color:var(--text-2)]"
						class:shown={cbbShown}
						style="--i: {i + 1}"
					>
						<span
							class="mt-[0.55em] h-1.5 w-1.5 flex-none rounded-full"
							style="background: var(--accent)"
						></span>
						<span>{f}</span>
					</li>
				{/each}
			</ul>
			<p
				class="c-anim mt-9 max-w-md text-[clamp(1.2rem,1.9vw,1.5rem)] leading-[1.3] font-semibold tracking-[-0.02em]"
				class:shown={cbbShown}
				style="--i: 7"
			>
				Over <span style="color: var(--accent)">150 users</span> perfected their brackets on CBB Composite
				last March.
			</p>
			<div
				class="c-anim mt-7 flex items-center gap-6 text-[15px]"
				class:shown={cbbShown}
				style="--i: 8"
			>
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
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="flex flex-col gap-4">
				<div class="bento-card c-fade" class:shown={cbbShown} style="--i: 0">
					<img
						src="/images/shot-cbb.png"
						alt="CBB Composite rankings table"
						width="1440"
						height="900"
						class="c-img block w-full"
						class:shown={cbbShown}
						loading="lazy"
					/>
					<p class="bento-cap">Composite rankings from the top sites.</p>
				</div>
				<div class="bento-card c-fade flex flex-1 flex-col" class:shown={cbbShown} style="--i: 1">
					<div
						class="c-img flex min-h-0 flex-1 flex-col justify-center gap-2.5"
						class:shown={cbbShown}
					>
						<img
							src="/images/shot-cbb-realism-bold.png"
							alt="CBB Composite bracket realism score — bold picks with six findings"
							width="820"
							height="488"
							class="block w-full"
							loading="lazy"
						/>
						<img
							src="/images/shot-cbb-realism-perfect.png"
							alt="CBB Composite bracket realism score — almost perfect bracket with four findings"
							width="820"
							height="354"
							class="block w-full"
							loading="lazy"
						/>
					</div>
					<p class="bento-cap">Bracket builder and evaluation tool.</p>
				</div>
			</div>
			<div class="bento-card c-fade flex flex-col" class:shown={cbbShown} style="--i: 2">
				<img
					src="/images/shot-cbb-team.png"
					alt="CBB Composite team profile — ratings, schedule, and March projections"
					width="1099"
					height="1974"
					class="c-img block min-h-0 w-full flex-1 object-cover object-top"
					class:shown={cbbShown}
					loading="lazy"
				/>
				<p class="bento-cap">Individual team profiles with March projections.</p>
			</div>
		</div>
	</div>

	<!-- Mile A Day -->
	<div
		bind:this={madEl}
		class="grid items-center gap-12 px-8 py-16 md:grid-cols-2 md:gap-x-20 md:px-16"
		class:anim-ready={madArmed}
	>
		<div
			class="c-fade mad-collage order-2 md:order-1 md:-ml-24"
			class:shown={madShown}
			style="--i: 0"
		>
			<img
				src="/images/shot-mileaday.png"
				alt="Mile A Day website"
				width="1440"
				height="900"
				class="shot mad-base"
				loading="lazy"
			/>
			<div class="mad-phone-cycle">
				{#each madPhones as ph, i}
					<img
						src={ph.src}
						alt={i === madPhoneIdx ? ph.alt : ''}
						aria-hidden={i !== madPhoneIdx}
						width="230"
						height="498"
						class="shot mad-phone-img"
						class:active={i === madPhoneIdx}
						loading="lazy"
					/>
				{/each}
			</div>
		</div>
		<div class="order-1 md:order-2">
			<h2
				class="c-anim text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
				class:shown={madShown}
				style="--i: 1"
			>
				Mile A Day
			</h2>
			<p
				class="c-anim mt-6 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]"
				class:shown={madShown}
				style="--i: 2"
			>
				An iOS running app built with a friend. It started as a bet to push each other to run more —
				but after months of neither of us missing a day, it turned into a lifestyle.
				<span class="text-[color:var(--text)]">One mile. Every day. No exceptions.</span>
			</p>
			<p
				class="c-anim mt-4 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]"
				class:shown={madShown}
				style="--i: 3"
			>
				Now it's built to get anyone out the door for their daily mile — run or walk. It tracks your
				streak, hands out medals for milestones worth chasing, and pits you against friends so you
				push each other to stay active.
			</p>
			{#if madStreak || madUsers || madRating}
				<div
					class="c-anim flex flex-wrap gap-x-10 gap-y-4 pt-7"
					class:shown={madShown}
					style="--i: 4"
				>
					{#if madStreak}
						<div>
							<div
								class="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-[-0.03em]"
								style="color: var(--accent)"
							>
								{madStreak}
							</div>
							<div class="mt-0.5 text-[13px] text-[color:var(--text-3)]">
								day streak — mine, live from the app
							</div>
						</div>
					{/if}
					{#if madUsers}
						<div>
							<div
								class="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-[-0.03em]"
								style="color: var(--accent)"
							>
								{madUsers}
							</div>
							<div class="mt-0.5 text-[13px] text-[color:var(--text-3)]">runners on the app</div>
						</div>
					{/if}
					{#if madRating}
						<div>
							<div
								class="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-[-0.03em]"
								style="color: var(--accent)"
							>
								{madRating.stars.toFixed(1)}★
							</div>
							<div class="mt-0.5 text-[13px] text-[color:var(--text-3)]">
								App Store, {madRating.reviews} review{madRating.reviews === 1 ? '' : 's'}
							</div>
						</div>
					{/if}
				</div>
			{/if}
			<div
				class="c-anim mt-6 flex items-center gap-6 text-[15px]"
				class:shown={madShown}
				style="--i: 5"
			>
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
			{#if madReviews.length}
				<div class="c-anim mt-8 max-w-md" class:shown={madShown} style="--i: 6">
					<div
						class="review-stack"
						class:h-anim={reviewStackReady}
						style:height={reviewStackH ? `${reviewStackH}px` : undefined}
					>
						{#each madReviews as r, i}
							<figure
								class="review-card rounded-2xl border p-5"
								class:active={i === madReviewIdx}
								aria-hidden={i !== madReviewIdx}
								style="border-color: var(--line-soft); background: var(--bg-elev)"
								bind:offsetHeight={reviewHeights[i]}
							>
								<div class="flex items-center gap-2">
									<span class="text-[13px] tracking-[0.15em]" style="color: var(--accent)"
										>{'★'.repeat(r.rating)}</span
									>
									<span class="text-[13px] font-semibold">{r.title}</span>
								</div>
								<blockquote class="mt-2 text-[14.5px] leading-[1.55] text-[color:var(--text-2)]">
									“{r.content}”
								</blockquote>
								<figcaption class="mt-2 text-[12.5px] text-[color:var(--text-4)]">
									{r.author} · App Store review
								</figcaption>
							</figure>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Singing fish -->
	<div
		bind:this={fishEl}
		class="grid items-center gap-10 px-8 py-16 pb-24 md:grid-cols-[1fr_1.3fr] md:gap-x-16 md:px-16"
		class:anim-ready={fishArmed}
	>
		<div>
			<h2
				class="c-anim text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
				class:shown={fishShown}
				style="--i: 0"
			>
				Animatronic Singing Fish
			</h2>
			<p
				class="c-anim mt-6 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]"
				class:shown={fishShown}
				style="--i: 1"
			>
				My mom saw a video of a customized singing fish belting out a sea shanty and knew she had to
				have one of her own. She bought a Big Mouth Billy Bass and handed it to me to reprogram.
			</p>
			<p
				class="c-anim mt-4 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]"
				class:shown={fishShown}
				style="--i: 2"
			>
				I rewired it to run on a Raspberry Pi and built a site where she can paste any YouTube link
				to load a song — then choreograph it with
				<span class="text-[color:var(--text)]">three tracks, one per motor</span>, to her heart's
				delight.
			</p>
			<p
				class="c-anim mt-4 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]"
				class:shown={fishShown}
				style="--i: 3"
			>
				The wiring diagrams and a full build guide are on GitHub if anyone wants to make their own.
			</p>
			<div
				class="c-anim mt-6 flex items-center gap-6 text-[15px]"
				class:shown={fishShown}
				style="--i: 4"
			>
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
		<div class="grid gap-4">
			<!-- YouTube embed — the player shows its own thumbnail + play button -->
			<div class="bento-card fish-video c-fade aspect-video" class:shown={fishShown} style="--i: 0">
				<iframe
					class="h-full w-full"
					src="https://www.youtube.com/embed/3paEeTIqVgU?rel=0"
					title="Singing Fish demo"
					allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="bento-card c-fade flex flex-col" class:shown={fishShown} style="--i: 1">
					<img
						src="/images/fish-wiring-diagram.svg"
						alt="Singing Fish wiring diagram — Raspberry Pi, H-bridge, and motor connections"
						width="1060"
						height="780"
						class="c-img block min-h-0 w-full flex-1 object-cover object-left-top"
						class:shown={fishShown}
						loading="lazy"
					/>
					<p class="bento-cap">The wiring diagram.</p>
				</div>
				<div class="bento-card c-fade flex flex-col" class:shown={fishShown} style="--i: 2">
					<img
						src="/images/fish-ui.png"
						alt="Singing Fish web UI — the timeline editor with three motor tracks"
						width="1906"
						height="938"
						class="c-img block min-h-0 w-full flex-1 object-cover object-left-top"
						class:shown={fishShown}
						loading="lazy"
					/>
					<p class="bento-cap">The track editor.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ============================================================
     BAND 4 — GRAY (full width): other projects, one at a time
============================================================ -->
<section
	class="flex min-h-svh w-full flex-col px-8 py-20 md:px-16"
	style="background: var(--bg-elev)"
>
	<SpecLine label="Other projects" detail="the rest of the graveyard, alive and well" />
	<div class="reveal flex flex-1 flex-col justify-center">
		<OtherProjects />
	</div>
</section>

<!-- ============================================================
     BAND 5 — about: full-bleed photo, hobbies, Posey
============================================================ -->
<section id="about">
	<!-- full-bleed photo, edge to edge -->
	<div class="relative h-[26vh] overflow-hidden md:h-[70vh]">
		<img
			bind:this={parallaxEl}
			src="/images/hike-wide.png"
			alt="David and Posey on a mountain summit"
			width="1206"
			height="531"
			class="parallax h-[34vh] w-full object-cover md:h-[84vh]"
			loading="lazy"
		/>
		<div class="scrim absolute inset-0 flex flex-col justify-end px-8 pb-12 md:px-16">
			<p
				class="reveal text-[clamp(1.15rem,1.8vw,1.45rem)] font-semibold tracking-[-0.02em] text-[color:var(--accent)]"
			>
				About me
			</p>
			<p
				class="reveal mt-4 max-w-lg text-[clamp(1.6rem,3.5vw,2.6rem)] leading-[1.15] font-semibold tracking-[-0.025em]"
				style="--vd: 0.1s"
			>
				Hobbies, sports, and one golden retriever.
			</p>
		</div>
	</div>

	<!-- off-the-clock board: fun-facts rail (sticky through Posey) + hobbies + Posey -->
	<div class="px-8 py-20 md:px-16">
		<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
			<!-- fun facts — sticks alongside the whole right column, releases past Posey -->
			<aside class="reveal lg:sticky lg:top-24 lg:self-start">
				<p class="ab-fcap">Fun facts</p>
				{#each funFacts as f}
					<div class="ab-frow">
						<span class="ab-fk">{f.k}</span>
						<span class="ab-fv">{f.v}</span>
					</div>
				{/each}
			</aside>

			<!-- right column: hobbies board, then Posey (keeps them under the sticky rail) -->
			<div class="reveal" style="--vd: 0.06s">
				<h2 class="text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
					Hobbies
				</h2>
				<p class="mt-5 max-w-2xl text-[16px] leading-[1.6] text-[color:var(--text-2)]">
					Most of my free time still goes into building projects — but when I'm not programming,
					this is what I'm into. You'll notice a lot of those projects trace straight back to these.
				</p>

				<div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each hobbyCards as c}
						<div class="ab-card">
							<div class="ab-head">
								<span class="ab-ic"><HobbyIcon name={c.icon} /></span>
								<h3 class="ab-title">{c.t}</h3>
							</div>
							<p class="ab-desc">{c.d}</p>
						</div>
					{/each}
				</div>

				<div class="mt-6 flex flex-wrap gap-2 sm:gap-2.5">
					{#each aboutTags as t}<span class="ab-pill">{t}</span>{/each}
				</div>

				<!-- Posey -->
				<div class="mt-10 border-t pt-10" style="border-color: var(--line-soft)">
					<div class="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
						<div>
							<SpecLine label="Posey" detail="the golden retriever" />
							<p class="mt-6 max-w-2xl text-[16px] leading-[1.55] text-[color:var(--text-2)]">
								Golden retriever, one very busy braincell. Loves every person she's ever met, keeps
								the neighbors company during yard work, steals shoes at other people's houses, and
								was formally downgraded to <span class="text-[color:var(--text)]"
									>silver retriever</span
								> by the Retriever Committee for refusing to give the ball back. Will wait ten minutes
								for permission to eat dropped food. Sleeps in past me every morning.
							</p>
						</div>
						<div class="mx-auto lg:mx-8">
							<PoseyGallery stageWidth="min(17rem, 72vw)" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ============================================================
     BAND 6 — closer
============================================================ -->
<section id="contact" class="relative flex min-h-svh flex-col justify-center px-8 py-24 md:px-16">
	<h2
		class="reveal max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
	>
		Let's build something.
	</h2>
	<a
		href="mailto:david@simmerman.tech"
		class="mega-mail reveal mt-7 self-start text-[clamp(1.5rem,4.2vw,3.4rem)] leading-[1.1]"
		style="--vd: 0.08s"
	>
		david@simmerman.tech
	</a>
	<div class="reveal mt-12 flex items-center gap-8 text-[15px]" style="--vd: 0.16s">
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
		<a href="/resume" class="cta">Resume ›</a>
	</div>
</section>

<style>
	/* ---- off-the-clock board ---- */
	.ab-fcap {
		padding-bottom: 0.7rem;
		border-bottom: 1px solid var(--line);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.ab-frow {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.7rem 0;
		border-bottom: 1px solid var(--line-soft);
	}
	.ab-fk {
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--text-4);
	}
	.ab-fv {
		font-size: 14px;
		line-height: 1.4;
		color: var(--text-2);
	}
	.ab-card {
		display: flex;
		flex-direction: column;
		background: var(--bg-elev);
		border: 1px solid var(--line-soft);
		border-radius: 12px;
		padding: 1.3rem 1.4rem;
	}
	.ab-head {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 0.4rem;
	}
	.ab-ic {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 9px;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 13%, transparent);
	}
	.ab-title {
		font-size: 1.15rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--text);
	}
	.ab-desc {
		margin-top: 0.55rem;
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--text-3);
	}
	.ab-pill {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent);
		border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
		border-radius: 999px;
		padding: 0.4rem 0.8rem;
	}
	@media (max-width: 640px) {
		.ab-pill {
			font-size: 10px;
			letter-spacing: 0.03em;
			padding: 0.3rem 0.62rem;
		}
	}

	/* the big email link — gradient underline sweeps in on hover/focus */
	.mega-mail {
		position: relative;
		display: inline-block;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: var(--text);
	}
	.mega-mail::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -0.08em;
		height: 2px;
		width: 100%;
		background: linear-gradient(90deg, var(--accent), #64d2ff);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.mega-mail:hover::after,
	.mega-mail:focus-visible::after {
		transform: scaleX(1);
	}

	/* Scroll cue — hairline that pulses downward, fades away once you scroll */
	.scroll-cue {
		position: absolute;
		left: 50%;
		bottom: 1.9rem;
		width: 1px;
		height: 54px;
		background: #f5f5f716;
		opacity: 0;
		animation: cue-in 1s ease 1.6s forwards;
	}
	.scroll-cue::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, transparent, #f5f5f7a0);
		transform-origin: top;
		animation: cue-drop 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	@keyframes cue-in {
		to {
			opacity: 1;
		}
	}
	@keyframes cue-drop {
		0% {
			transform: scaleY(0);
			opacity: 0;
		}
		35% {
			opacity: 1;
		}
		70% {
			transform: scaleY(1);
			opacity: 1;
		}
		100% {
			transform: scaleY(1);
			opacity: 0;
		}
	}
	@supports (animation-timeline: scroll()) {
		.scroll-cue {
			animation:
				cue-in 1s ease 1.6s forwards,
				cue-fade linear both;
			animation-timeline: auto, scroll();
			animation-range:
				normal,
				0 240px;
		}
	}
	@keyframes cue-fade {
		to {
			opacity: 0;
			visibility: hidden;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.scroll-cue,
		.scroll-cue::after {
			animation: none;
		}
		.scroll-cue {
			opacity: 1;
		}
	}

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
		transition:
			transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			border-color 0.5s ease;
	}
	.bento-card:hover {
		transform: scale(1.02);
		border-color: #ffffff30;
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

	/* Singing fish video — signal it's clickable. Skip the card's hover scale:
	   re-rasterizing the scaled iframe leaves a faint tile seam across its middle. */
	.fish-video {
		cursor: pointer;
	}
	.fish-video:hover {
		transform: none;
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

	/* App Store review crossfade — all cards share one grid cell at their natural
	   height (align-self: start); the container's inline height animates to the
	   active card so short reviews never trail empty space */
	.review-stack {
		display: grid;
		overflow: hidden;
	}
	.review-stack.h-anim {
		transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.review-stack > .review-card {
		grid-area: 1 / 1;
		align-self: start;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 0.7s ease,
			visibility 0.7s;
	}
	.review-card.active {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}
	@media (prefers-reduced-motion: reduce) {
		.review-stack.h-anim {
			transition: none;
		}
		.review-stack > .review-card {
			transition: none;
		}
	}
</style>
