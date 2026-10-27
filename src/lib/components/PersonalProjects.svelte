<script lang="ts">
	import { inView } from '$lib/inView';
	import type { MadLive, MadRating } from '$lib/server/madRating';
	// The three personal projects, each laid out like an Apple product page: label, silver name,
	// a line or two, one big number, links, a visual, then a row of feature cards. The projects
	// alternate sides. Each block plays its entrance once, the first time it scrolls in; without JS
	// or with reduced motion everything is simply there.
	import Icon from './Icon.svelte';
	import CountUp from './CountUp.svelte';

	const cbbFeatures = [
		{
			icon: 'layers',
			t: 'Composite ranking',
			d: 'KenPom, EvanMiya, BartTorvik and NET compiled into a single ranking.'
		},
		{ icon: 'user', t: 'Team profiles', d: 'Advanced stats and history for every team.' },
		{
			icon: 'calendar',
			t: 'March profiles',
			d: 'How similar teams performed in past March Madness runs.'
		},
		{
			icon: 'bracket',
			t: 'Bracket Builder',
			d: 'Evaluates your bracket and flags picks made against historic trends.'
		},
		{
			icon: 'repeat',
			t: 'Bracket Simulator',
			d: 'Uses historical data to chase the first perfect bracket.'
		},
		{ icon: 'news', t: 'Game coverage', d: 'Predictions, previews and recaps.' }
	];

	// the app's three screens, one per feature
	const madFeatures = [
		{
			icon: 'flame',
			t: 'Streaks',
			d: 'Tracks your streak, run or walk.',
			img: '/images/mad-phone-streak.png',
			alt: 'Mile A Day streak screen — current streak and daily progress'
		},
		{
			icon: 'medal',
			t: 'Medals',
			d: 'Medals for milestones worth chasing.',
			img: '/images/mad-phone-medals.png',
			alt: 'Mile A Day medals screen — milestones and personal records'
		},
		{
			icon: 'swords',
			t: 'Friends',
			d: 'Compete with friends so you push each other to stay active.',
			img: '/images/mad-phone-compete.png',
			alt: 'Mile A Day compete screen — clashes and weekly streaks with friends'
		}
	];

	const fishFeatures = [
		{ icon: 'cpu', t: 'Raspberry Pi', d: 'Rewired to run on a Raspberry Pi.' },
		{ icon: 'music', t: 'Any song', d: 'Paste any YouTube link to load a song.' },
		{ icon: 'book', t: 'Build your own', d: 'Wiring diagrams and a full build guide on GitHub.' }
	];

	// Mile A Day live stats, rating and reviews come rendered with the page (+page.server.ts), so
	// they're in place before the browser restores your scroll position on reload. Each renders
	// only if it loaded; anything the server didn't get in time is fetched here instead.
	let { rating, live }: { rating?: MadRating | null; live?: MadLive | null } = $props();
	// svelte-ignore state_referenced_locally
	let madStreak = $state<number | null>(live?.streak ?? null);
	// svelte-ignore state_referenced_locally
	let madUsers = $state<number | null>(live?.users ?? null);
	const fiveStar = (r: MadRating) => r.reviews.filter((x) => x.rating === 5);
	// svelte-ignore state_referenced_locally
	let madRating = $state<{ stars: number; reviews: number } | null>(
		rating?.stars ? { stars: rating.stars, reviews: rating.ratingCount ?? 0 } : null
	);
	// svelte-ignore state_referenced_locally
	let madReviews = $state<{ rating: number; title: string; author: string; content: string }[]>(
		rating ? fiveStar(rating) : []
	);
	$effect(() => {
		if (!live?.streak)
			fetch('https://mad.mindgoblin.tech/public/streak/dave')
				.then((r) => (r.ok ? r.json() : null))
				.then((d) => {
					if (d?.current_streak) madStreak = d.current_streak;
				})
				.catch(() => {});
		if (!live?.users)
			fetch('https://mad.mindgoblin.tech/public/users')
				.then((r) => (r.ok ? r.json() : null))
				.then((d) => {
					if (d?.count) madUsers = d.count;
				})
				.catch(() => {});
		// only if the server couldn't get them in time
		if (rating) return;
		fetch('/api/mad-rating')
			.then((r) => (r.ok ? r.json() : null))
			.then((d) => {
				if (d?.stars) madRating = { stars: d.stars, reviews: d.ratingCount ?? 0 };
				if (Array.isArray(d?.reviews))
					madReviews = d.reviews.filter((r: { rating: number }) => r.rating === 5);
			})
			.catch(() => {});
	});

	// App Store reviews — crossfade through all of them
	let madReviewIdx = $state(0);
	$effect(() => {
		if (madReviews.length <= 1) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const t = setInterval(() => {
			madReviewIdx = (madReviewIdx + 1) % madReviews.length;
		}, 6000);
		return () => clearInterval(t);
	});

	// entrances: hidden states apply only once JS arms them, and each block plays once
	let armed = $state(false);
	// each project has two zones that play on their own: the top (words + visual) and the
	// feature cards below, so a slow scroll still catches the cards
	let seen = $state([false, false, false]);
	let seenFeats = $state([false, false, false]);
	$effect(() => {
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			seen = [true, true, true];
			seenFeats = [true, true, true];
			return;
		}
		armed = true;
	});
	// plays each time a zone comes back on screen, once its top is a fifth of the way up the
	// screen (resets once it's fully off)
	function reveal(node: HTMLElement, i: number) {
		return {
			destroy: inView(
				node,
				() => (seen[i] = true),
				() => (seen[i] = false),
				0,
				0.2
			)
		};
	}
	function revealFeats(node: HTMLElement, i: number) {
		return {
			destroy: inView(
				node,
				() => (seenFeats[i] = true),
				() => (seenFeats[i] = false),
				0,
				0.2
			)
		};
	}
</script>

{#snippet feature(f: { icon: string; t: string; d: string }, i: number)}
	<div class="feat lit-card" style="--i: {i}">
		<span class="icon-badge"><Icon name={f.icon} /></span>
		<div class="feat-words">
			<h3 class="text-[17px] font-semibold tracking-[-0.01em]">{f.t}</h3>
			<p class="mt-1 text-[14px] leading-[1.5] text-[color:var(--text-3)]">{f.d}</p>
		</div>
	</div>
{/snippet}

<div class:armed>
	<!-- CBB Composite -->
	<article class="proj theme-cbb">
		<div class="proj-top" class:in={seen[0]} use:reveal={0}>
			<div class="words">
				<p class="eyebrow grad-text w-fit">Basketball analytics · Web</p>
				<h2 class="name silver">CBB Composite Rankings</h2>
				<p class="pitch">
					A college basketball site: one composite ranking, team profiles, and tools for building a
					bracket.
				</p>
				<div class="big-stat">
					<span class="big-num grad-num"
						><CountUp value="150" play={seen[0]} /><span class="unit">+</span></span
					>
					<span class="big-label">users perfected their brackets on it last March</span>
				</div>
				<div class="links">
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
			<div class="vis cbb-shots">
				<img
					class="s1"
					src="/images/shot-cbb.png"
					alt="CBB Composite rankings table"
					width="1440"
					height="900"
					loading="lazy"
				/>
				<img
					class="s2"
					src="/images/shot-cbb-team.png"
					alt="CBB Composite team profile — ratings, schedule, and March projections"
					width="1099"
					height="1974"
					loading="lazy"
				/>
				<img
					class="s3"
					src="/images/shot-cbb-realism-bold.png"
					alt="CBB Composite bracket realism score — bold picks with six findings"
					width="820"
					height="488"
					loading="lazy"
				/>
			</div>
		</div>
		<div class="feats cols-3" class:in={seenFeats[0]} use:revealFeats={0}>
			{#each cbbFeatures as f, i}{@render feature(f, i)}{/each}
		</div>
	</article>

	<!-- Mile A Day: visual left, words right -->
	<article class="proj theme-mad">
		<div class="proj-top flip" class:in={seen[1]} use:reveal={1}>
			<div class="words">
				<p class="eyebrow grad-text w-fit">Running · iOS</p>
				<h2 class="name silver">Mile A Day</h2>
				<p class="pitch">
					An iOS running app built with a friend. It started as a bet to push each other to run more
					— but after months of neither of us missing a day, it turned into a lifestyle.
				</p>
				{#if madStreak}
					<div class="big-stat">
						<span class="big-num grad-num"
							><CountUp value={String(madStreak)} play={seen[1]} /></span
						>
						<span class="big-label">day streak — mine, live from the app</span>
					</div>
				{/if}
				{#if madUsers || madRating}
					<div class="mt-5 flex flex-wrap gap-x-10 gap-y-4">
						{#if madUsers}
							<div>
								<div class="mid-num grad-num w-fit">
									<CountUp value={String(madUsers)} play={seen[1]} />
								</div>
								<div class="mt-1 text-[13px] text-[color:var(--text-3)]">runners on the app</div>
							</div>
						{/if}
						{#if madRating}
							<div>
								<div class="mid-num grad-num w-fit">{madRating.stars.toFixed(1)}★</div>
								<div class="mt-1 text-[13px] text-[color:var(--text-3)]">
									App Store, {madRating.reviews} review{madRating.reviews === 1 ? '' : 's'}
								</div>
							</div>
						{/if}
					</div>
				{/if}
				<div class="links">
					<a
						href="https://apps.apple.com/us/app/mile-a-day/id6746970905"
						target="_blank"
						rel="noopener"
						class="cta"
					>
						App Store ›
					</a>
					<a href="https://mileaday.run" target="_blank" rel="noopener" class="cta">
						mileaday.run ›
					</a>
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
			<div class="vis mad-site">
				<img
					src="/images/shot-mileaday.png"
					alt="Mile A Day website"
					width="1440"
					height="900"
					loading="lazy"
				/>
			</div>
		</div>
		<div class="feats cols-4" class:in={seenFeats[1]} use:revealFeats={1}>
			{#each madFeatures as f, i}
				<div class="feat lit-card phone-feat" style="--i: {i}">
					<span class="icon-badge"><Icon name={f.icon} /></span>
					<div class="feat-words">
						<h3 class="text-[17px] font-semibold tracking-[-0.01em]">{f.t}</h3>
						<p class="mt-1 text-[14px] leading-[1.5] text-[color:var(--text-3)]">{f.d}</p>
					</div>
					<div class="screen-well">
						<img class="screen" src={f.img} alt={f.alt} width="230" height="498" loading="lazy" />
					</div>
				</div>
			{/each}
			{#if madReviews.length}
				<!-- every review shares one grid cell; the tallest sets the height, so nothing shifts -->
				<div class="feat lit-card review-stack" style="--i: 3">
					{#each madReviews as r, i}
						<figure
							class="review"
							class:active={i === madReviewIdx}
							aria-hidden={i !== madReviewIdx}
						>
							<div class="grad-text w-fit text-[13px] tracking-[0.15em]">
								{'★'.repeat(r.rating)}
							</div>
							<div class="mt-3 text-[17px] font-semibold tracking-[-0.01em]">{r.title}</div>
							<blockquote
								class="mt-2 line-clamp-6 text-[14.5px] leading-[1.55] text-[color:var(--text-2)]"
							>
								“{r.content}”
							</blockquote>
							<figcaption class="mt-auto pt-4 text-[12.5px] text-[color:var(--text-4)]">
								{r.author} · App Store review
							</figcaption>
						</figure>
					{/each}
				</div>
			{/if}
		</div>
	</article>

	<!-- Singing fish -->
	<article class="proj theme-fish">
		<div class="proj-top" class:in={seen[2]} use:reveal={2}>
			<div class="words">
				<p class="eyebrow grad-text w-fit">Hardware · Raspberry Pi</p>
				<h2 class="name silver">Animatronic Singing Fish</h2>
				<p class="pitch">
					My mom saw a video of a customized singing fish belting out a sea shanty and knew she had
					to have one of her own. She bought a Big Mouth Billy Bass and handed it to me to
					reprogram.
				</p>
				<div class="big-stat">
					<span class="big-num grad-num"><CountUp value="3" play={seen[2]} /></span>
					<span class="big-label">tracks, one per motor, choreographed by hand</span>
				</div>
				<div class="links">
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
			<div class="vis fish-vis">
				<!-- YouTube embed — the player shows its own thumbnail + play button -->
				<div class="fish-video lit-card">
					<iframe
						src="https://www.youtube.com/embed/3paEeTIqVgU?rel=0"
						title="Singing Fish demo"
						allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						loading="lazy"
					></iframe>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<figure class="thumb lit-card">
						<img
							src="/images/fish-wiring-diagram.svg"
							alt="Singing Fish wiring diagram — Raspberry Pi, H-bridge, and motor connections"
							width="1060"
							height="780"
							loading="lazy"
						/>
						<figcaption>The wiring diagram.</figcaption>
					</figure>
					<figure class="thumb lit-card">
						<img
							src="/images/fish-ui.png"
							alt="Singing Fish web UI — the timeline editor with three motor tracks"
							width="1906"
							height="938"
							loading="lazy"
						/>
						<figcaption>The track editor.</figcaption>
					</figure>
				</div>
			</div>
		</div>
		<div class="feats cols-3" class:in={seenFeats[2]} use:revealFeats={2}>
			{#each fishFeatures as f, i}{@render feature(f, i)}{/each}
		</div>
	</article>
</div>

<style>
	/* each project wears its own colors: everything accented inside (eyebrow, numbers, icons,
	   stars) reads these. Links stay the site's blue. */
	.theme-cbb {
		--accent: #bf5af2;
		--accent-2: #e0a3ff;
	}
	/* Mile A Day's crimson, from the app */
	.theme-mad {
		--accent: #d94059;
		--accent-2: #ff8a9b;
	}
	.theme-fish {
		--accent: #30d158;
		--accent-2: #a3f0b5;
	}
	/* the root resolves --accent-grad with the blue, so rebuild it from the overrides */
	.theme-cbb,
	.theme-mad,
	.theme-fish {
		--accent-grad: linear-gradient(90deg, var(--accent), var(--accent-2));
	}
	.proj {
		padding: 4rem 0;
	}
	.proj + .proj {
		/* a hairline that fades out at both ends between projects */
		border-top: 1px solid transparent;
		border-image: linear-gradient(90deg, transparent, #ffffff14 20%, #ffffff14 80%, transparent) 1;
		margin-top: 2rem;
		padding-top: 6rem;
	}
	.proj-top {
		display: grid;
		gap: 2.5rem;
		align-items: center;
	}
	@media (min-width: 768px) {
		.proj-top {
			grid-template-columns: 1fr 1.15fr;
			gap: 3.5rem;
		}
		/* Mile A Day: visual on the left */
		.proj-top.flip {
			grid-template-columns: 1.15fr 1fr;
		}
		.proj-top.flip .vis {
			order: -1;
		}
	}

	.eyebrow {
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.name {
		margin-top: 0.75rem;
		font-size: clamp(2.2rem, 4.6vw, 3.5rem);
		line-height: 1.02;
		font-weight: 600;
		letter-spacing: -0.035em;
	}
	.pitch {
		margin-top: 1rem;
		max-width: 28rem;
		font-size: clamp(1.05rem, 1.4vw, 1.2rem);
		line-height: 1.45;
		color: var(--text-2);
	}
	.big-stat {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		margin-top: 2rem;
	}
	.big-num {
		font-size: clamp(3.2rem, 5vw, 4.5rem);
		line-height: 1;
		font-weight: 600;
		letter-spacing: -0.04em;
		padding-bottom: 0.12em;
		margin-bottom: -0.12em;
	}
	.mid-num {
		font-size: clamp(1.8rem, 2.6vw, 2.1rem);
		line-height: 1;
		font-weight: 600;
		letter-spacing: -0.03em;
		padding-bottom: 0.12em;
		margin-bottom: -0.12em;
	}
	.unit {
		margin-left: 0.15rem;
		font-size: 0.42em;
		font-weight: 500;
		letter-spacing: -0.01em;
		-webkit-text-fill-color: var(--text-2);
	}
	.big-label {
		max-width: 14rem;
		font-size: 15px;
		line-height: 1.35;
		color: var(--text-3);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
		margin-top: 1.75rem;
		font-size: 15px;
	}

	/* ---- visuals ---- */
	.vis img,
	.fish-video,
	.thumb {
		border-radius: 12px;
	}
	/* CBB: three screenshots layered, rising in one after another */
	.cbb-shots {
		position: relative;
		aspect-ratio: 560 / 460;
	}
	.cbb-shots img {
		position: absolute;
		border: 1px solid #ffffff1a;
		box-shadow: 0 30px 60px -20px #000000d0;
	}
	.cbb-shots .s1 {
		left: 0;
		top: 8.7%;
		width: 92%;
	}
	.cbb-shots .s2 {
		right: 0;
		top: 0;
		width: 32%;
	}
	.cbb-shots .s3 {
		left: 6%;
		bottom: 0;
		width: 52%;
	}
	.mad-site img {
		width: 100%;
		border: 1px solid #ffffff1a;
		box-shadow: 0 30px 60px -20px #000000d0;
	}
	.fish-vis {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.fish-video {
		overflow: hidden;
		aspect-ratio: 16 / 9;
	}
	.fish-video:hover,
	.thumb:hover {
		/* re-rasterizing the lifted iframe leaves a seam across it; these stay put */
		transform: none;
	}
	.fish-video iframe {
		display: block;
		width: 100%;
		height: 100%;
	}
	.thumb {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16 / 10;
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: left top;
	}
	.thumb figcaption {
		position: absolute;
		inset: auto 0 0 0;
		padding: 1.5rem 0.7rem 0.55rem;
		font-size: 12.5px;
		font-weight: 600;
		background: linear-gradient(180deg, transparent, #050507e6);
	}
	@media (min-width: 640px) {
		.thumb figcaption {
			padding: 2rem 0.9rem 0.7rem;
			font-size: 14px;
		}
	}

	/* ---- feature cards ---- */
	.feats {
		display: grid;
		gap: 0.75rem;
		margin-top: 3.5rem;
	}
	@media (min-width: 640px) {
		.feats {
			grid-template-columns: 1fr 1fr;
			gap: 1rem;
		}
	}
	@media (min-width: 1024px) {
		.feats.cols-3 {
			grid-template-columns: repeat(3, 1fr);
		}
		.feats.cols-4 {
			grid-template-columns: repeat(4, 1fr);
		}
	}
	.feat {
		display: flex;
		gap: 1rem;
		padding: 1.1rem 1.2rem;
	}
	@media (min-width: 640px) {
		.feat {
			flex-direction: column;
			padding: 1.5rem;
		}
	}
	/* Mile A Day: each card carries its phone screen, rising from the card's bottom edge */
	.phone-feat {
		position: relative;
		flex-direction: column;
		overflow: hidden;
		height: 22rem;
		padding: 1.5rem;
	}
	@media (min-width: 640px) {
		.phone-feat {
			height: 26rem;
		}
	}
	/* the screen starts just under the words and runs off the card's bottom edge */
	.screen-well {
		position: relative;
		flex: 1;
		min-height: 0;
		margin-top: 1.25rem;
	}
	.phone-feat .screen {
		position: absolute;
		left: 50%;
		top: 0;
		width: min(62%, 11rem);
		translate: -50% 0;
		border: 1px solid #ffffff1a;
		border-radius: 18px;
		box-shadow: 0 -10px 40px -10px #000000c0;
	}
	.review-stack {
		display: grid;
	}
	.review {
		grid-area: 1 / 1;
		display: flex;
		flex-direction: column;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.7s ease,
			visibility 0.7s;
	}
	.review.active {
		opacity: 1;
		visibility: visible;
	}

	/* ---- entrance (armed by JS; the top and the feature cards of each project play separately) ---- */
	.armed .words > *,
	.armed .vis,
	.armed .feat {
		opacity: 0;
		translate: 0 18px;
	}
	.armed .cbb-shots {
		opacity: 1;
		translate: none;
	}
	.armed .cbb-shots img {
		opacity: 0;
		translate: 0 40px;
	}
	.armed .in .words > *,
	.armed .in .vis,
	.armed .in .feat,
	.armed .in .cbb-shots img {
		opacity: 1;
		translate: 0 0;
	}
	.armed .in .words > * {
		transition:
			opacity 0.6s ease,
			translate 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.armed .in .words > :nth-child(2) {
		transition-delay: 0.06s;
	}
	.armed .in .words > :nth-child(3) {
		transition-delay: 0.12s;
	}
	.armed .in .words > :nth-child(4) {
		transition-delay: 0.18s;
	}
	.armed .in .words > :nth-child(n + 5) {
		transition-delay: 0.24s;
	}
	.armed .in .vis {
		transition:
			opacity 0.9s ease 0.15s,
			translate 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
	}
	.armed .in .cbb-shots img {
		transition:
			opacity 0.9s ease,
			translate 1.1s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.armed .in .cbb-shots .s2 {
		transition-delay: 0.15s;
	}
	.armed .in .cbb-shots .s3 {
		transition-delay: 0.3s;
	}
	/* cards fade in one after another; their hover lift keeps its own (transform) timing */
	.armed .in .feat {
		transition:
			opacity 0.7s ease calc(0.1s + var(--i) * 80ms),
			translate 0.8s cubic-bezier(0.16, 1, 0.3, 1) calc(0.1s + var(--i) * 80ms),
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			border-color 0.35s,
			box-shadow 0.35s;
	}
	@media (prefers-reduced-motion: reduce) {
		.review {
			transition: none;
		}
	}
</style>
