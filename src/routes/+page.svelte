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
     BAND 2.5 — BLACK: skills, the toolbox
============================================================ -->
<section id="skills" class="flex min-h-svh flex-col justify-center px-8 py-20 md:px-16">
	<SpecLine label="Skills" detail="the toolbox" />
	<div class="mt-12">
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
							class="block w-full"
							loading="lazy"
						/>
						<img
							src="/images/shot-cbb-realism-perfect.png"
							alt="CBB Composite bracket realism score — almost perfect bracket with four findings"
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
				class="shot mad-base"
				loading="lazy"
			/>
			<div class="mad-phone-cycle">
				{#each madPhones as ph, i}
					<img
						src={ph.src}
						alt={i === madPhoneIdx ? ph.alt : ''}
						aria-hidden={i !== madPhoneIdx}
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
				{@const r = madReviews[0]}
				<figure
					class="c-anim mt-8 max-w-md rounded-2xl border p-5"
					class:shown={madShown}
					style="--i: 6; border-color: var(--line-soft); background: var(--bg-elev)"
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
			{/if}
		</div>
	</div>

	<!-- Singing fish -->
	<div
		bind:this={fishEl}
		class="grid items-center gap-10 px-8 py-16 pb-24 md:grid-cols-[1fr_1.3fr] md:gap-x-16 md:px-16"
		class:anim-ready={fishArmed}
	>
		<div class="order-2 md:order-1">
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
		<div class="order-1 grid gap-4 md:order-2">
			<!-- YouTube embed — the player shows its own thumbnail + play button -->
			<div class="bento-card c-fade aspect-video" class:shown={fishShown} style="--i: 0">
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
	<div class="relative overflow-hidden">
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
