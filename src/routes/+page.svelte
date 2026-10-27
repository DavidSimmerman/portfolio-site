<script lang="ts">
	import SpecLine from '$lib/components/SpecLine.svelte';
	import WorkXGen from '$lib/components/WorkXGen.svelte';
	import WorkWisely from '$lib/components/WorkWisely.svelte';
	import OtherProjects from '$lib/components/OtherProjects.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import PersonalProjects from '$lib/components/PersonalProjects.svelte';
	import PoseyGallery from '$lib/components/PoseyGallery.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { inView } from '$lib/inView';

	let { data } = $props();

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

	// Contact closes the page on the hero's horizon: the line draws and the sunrise swells when
	// the section arrives. Without JS or with reduced motion they're simply there.
	let contactEl: HTMLElement | undefined = $state();
	let contactArmed = $state(false);
	let contactIn = $state(false);
	$effect(() => {
		if (!contactEl) return;
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;
		contactArmed = true;
		return inView(
			contactEl,
			() => (contactIn = true),
			() => (contactIn = false),
			0.35
		);
	});

	// Hobbies: the cards rise in one after another, then the tags; replays on every return.
	// Without JS or with reduced motion they're simply there.
	let hobbiesEl: HTMLElement | undefined = $state();
	let hobbiesArmed = $state(false);
	let hobbiesIn = $state(false);
	$effect(() => {
		if (!hobbiesEl) return;
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;
		hobbiesArmed = true;
		return inView(
			hobbiesEl,
			() => (hobbiesIn = true),
			() => (hobbiesIn = false),
			0.15
		);
	});

	// the hero's entrance (name, line, sunrise) replays when you scroll back up to it: the
	// animations are switched off while it's fully off screen, so they restart on return
	let heroEl: HTMLElement | undefined = $state();
	let heroAway = $state(false);
	$effect(() => {
		if (!heroEl) return;
		return inView(
			heroEl,
			() => (heroAway = false),
			() => (heroAway = true),
			0.01
		);
	});

	// "My story" as four milestones, one big number each. `u` is the small unit set after it
	// (so 12 and 19 read as ages); `from` is where the count-up starts: the age picks up where
	// the first left off, and the year ticks through the XGen years (joined Nov 2020) to the
	// acquisition.
	const milestones = [
		{
			n: 12,
			u: 'years old',
			from: 0,
			t: 'Started programming',
			d: 'Learned to code so my friends and I could run our own Minecraft server — and it sparked a lifelong obsession with technology.'
		},
		{
			n: 19,
			u: 'years old',
			from: 12,
			t: 'Joined XGen AI',
			d: "Medical issues derailed my college plans, so I took online courses instead. A friend's referral got me in the door at XGen AI, then a startup."
		},
		{
			n: 5,
			u: 'years',
			from: 0,
			t: 'Developer to director',
			d: 'Worked my way up from integrations developer to director, leading the team that built the platform behind AI for brands like Gucci and Sonos.'
		},
		{
			n: 2026,
			u: '',
			from: 2020,
			t: 'Zoovu acquired XGen',
			d: 'I stayed on through the acquisition. These days I split my time between enterprise AI and Division 1 basketball analytics at Wisely Optimize.'
		}
	];
	// Pinned sideways scroll, all 1:1 with vertical scroll. The row is padded so the first and
	// last milestones sit centered. One line runs under the whole row and its lit part grows
	// with every pixel scrolled while pinned:
	//   1. the row holds; the line draws from the first milestone's left edge to its middle
	//   2. the line's end reaches screen center and stays there while the row slides left
	//   3. the last milestone is centered, the row holds; the line draws to its right edge
	// Then the pin releases. A milestone lights up (number counts up) when the line reaches it.
	// Reduced motion: still slides, final numbers, no fades.
	let storyWrap: HTMLElement | undefined = $state();
	let storyEl: HTMLElement | undefined = $state();
	let storyArmed = $state(false);
	let storyX = $state(0);
	let storyFill = $state(0); // px of the line that's lit
	let msLit = $state(milestones.map(() => false));
	let msShown = $state(milestones.map((m) => m.n));
	$effect(() => {
		const wrap = storyWrap;
		const track = storyEl;
		if (!wrap || !track) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!reduce) {
			storyArmed = true;
			msShown = milestones.map((m) => m.from);
		}
		const cards = track.getElementsByClassName('ms') as HTMLCollectionOf<HTMLElement>;
		const litAt: number[] = milestones.map(() => -1);
		let entered = false;
		let travel = 0;
		let raf = 0;
		const count = (now: number) => {
			let done = true;
			msShown = milestones.map((m, i) => {
				if (litAt[i] < 0) {
					done = false;
					return m.from;
				}
				const p = Math.min(1, Math.max(0, (now - litAt[i]) / 1100));
				if (p < 1) done = false;
				return Math.round(m.from + (m.n - m.from) * (1 - Math.pow(1 - p, 3)));
			});
			raf = done ? 0 : requestAnimationFrame(count);
		};
		const measure = () => {
			travel = Math.max(0, track.scrollWidth - (track.parentElement?.clientWidth ?? 0));
			// + one card: half to draw into the first milestone, half to draw out of the last
			wrap.style.height = `calc(100svh + ${travel + (cards[0]?.offsetWidth ?? 0)}px)`;
			update();
		};
		const update = () => {
			const r = wrap.getBoundingClientRect();
			const first = cards[0];
			const last = cards[cards.length - 1];
			const w = track.parentElement!.clientWidth;
			const len = last.offsetLeft + last.offsetWidth - first.offsetLeft; // whole line
			const scrolled = Math.min(len, Math.max(0, -r.top)); // px scrolled while pinned
			storyFill = scrolled;
			storyX = Math.min(travel, Math.max(0, scrolled - first.offsetWidth / 2));
			// where the line ends, in row coordinates
			const head = first.offsetLeft + scrolled;
			// fully off screen: reset so it plays again next time
			if (r.bottom < 0 || r.top > window.innerHeight) {
				if (entered && !reduce) {
					entered = false;
					msLit = milestones.map(() => false);
					litAt.fill(-1);
					msShown = milestones.map((m) => m.from);
				}
				return;
			}
			if (!entered) {
				if (r.top > window.innerHeight * 0.7) return;
				entered = true;
			}
			if (reduce) return;
			// scroll-tied side fade: d is how many slots a milestone sits from center (+ right,
			// − left). It slides in from the right and fades up as it nears center, then fades out
			// drifting left as it leaves.
			const step = cards.length > 1 ? cards[1].offsetLeft - first.offsetLeft : 1;
			const center = storyX + w / 2;
			for (const c of cards) {
				const d = (c.offsetLeft + c.offsetWidth / 2 - center) / step;
				const t = Math.min(1, Math.max(0, (Math.abs(d) - 0.25) / 0.75));
				const e = t * t * (3 - 2 * t); // smoothstep
				c.style.opacity = String(1 - e);
				c.style.transform = `translate3d(${Math.sign(d) * e * 120}px, 0, 0)`;
			}
			const now = performance.now();
			let lit = false;
			for (let i = 0; i < cards.length; i++) {
				// the first lights as the section arrives; the rest when the line reaches them
				if (msLit[i] || (i > 0 && cards[i].offsetLeft > head)) continue;
				msLit[i] = true;
				litAt[i] = now + (i === 0 ? 200 : 0);
				lit = true;
			}
			if (lit && !raf) raf = requestAnimationFrame(count);
		};
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				update();
				ticking = false;
			});
		};
		const ro = new ResizeObserver(measure);
		ro.observe(track);
		ro.observe(wrap.firstElementChild as Element);
		measure();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			ro.disconnect();
			window.removeEventListener('scroll', onScroll);
			cancelAnimationFrame(raf);
		};
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
			t: 'Running & fitness',
			icon: 'activity',
			d: 'I enjoy running and working out, and pushing myself to keep getting better. That means at least a mile every day and a workout on my lunch break.'
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
<section
	id="hero"
	bind:this={heroEl}
	class:away={heroAway}
	class="relative isolate flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-center px-8 py-20 md:px-16"
>
	<h1
		class="max-w-5xl text-[clamp(3.4rem,9vw,7.5rem)] leading-[0.98] font-semibold tracking-[-0.035em]"
	>
		<span class="rise block" style="--d: 0"><span class="silver">David</span></span>
		<span class="rise block" style="--d: 1"><span class="silver">Simmerman</span></span>
	</h1>
	<p
		class="rise mt-8 max-w-3xl text-[clamp(1.3rem,2.6vw,1.9rem)] leading-[1.25] font-medium text-[color:var(--text-3)]"
		style="--d: 2"
	>
		Software engineer. I make complicated things feel
		<span class="grad-text">simple</span>, automate the tedious, and build tools for everyday life —
		AI platforms, basketball analytics, and ecommerce.
	</p>
	<div class="rise mt-10 flex items-center gap-7 text-[15px]" style="--d: 3">
		<a href="/#work" class="cta">See the work ›</a>
		<a href="/#contact" class="cta">Get in touch ›</a>
	</div>
	<!-- a line of light along the bottom, then a faint sunrise off it -->
	<div class="horizon" aria-hidden="true"></div>
	<div class="sunrise" aria-hidden="true"></div>
</section>

<!-- ============================================================
     BAND 1.5 — BLACK: the short version (bio)
============================================================ -->
<!-- pinned: vertical scroll slides the milestones sideways (wrap height set from the row width) -->
<section bind:this={storyWrap} class="story-wrap" style="--n: {milestones.length}">
	<div class="sticky top-0 flex h-svh flex-col overflow-hidden py-24">
		<div class="px-8 md:px-16"><SpecLine label="My story" /></div>
		<div class="story-stage flex flex-1 items-center">
			<ol
				bind:this={storyEl}
				class="story-track relative mt-12 flex w-max gap-x-8 sm:mt-0 sm:gap-x-16"
				class:armed={storyArmed}
				style="transform: translate3d({-storyX}px, 0, 0)"
			>
				<li class="story-line" aria-hidden="true">
					<span class="story-fill" style="width: {storyFill}px"></span>
				</li>
				{#each milestones as m, i}
					<li class="ms" class:ms-first={i === 0} class:lit={msLit[i]}>
						<div class="ms-head">
							<div class="ms-num grad-num">
								<span aria-hidden="true">{msShown[i]}</span><span class="sr-only">{m.n} {m.u}</span
								>{#if m.u}<span class="ms-u" aria-hidden="true">{m.u}</span>{/if}
							</div>
						</div>
						<div class="ms-words">
							<h3 class="mt-4 text-[20px] font-semibold tracking-[-0.01em] sm:text-[22px]">
								{m.t}
							</h3>
							<p class="mt-2 text-[15px] leading-[1.5] text-[color:var(--text-3)] sm:text-[17px]">
								{m.d}
							</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
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
	<SpecLine label="Skills" />
	<div class="mt-12 flex flex-1 flex-col justify-center">
		<Skills />
	</div>
</section>

<!-- ============================================================
     BAND 3 — BLACK: personal projects (top 3)
============================================================ -->
<section id="projects" class="overflow-hidden px-8 pt-20 pb-12 md:px-16">
	<SpecLine label="Personal projects" />
	<PersonalProjects rating={data.madRating} live={data.madLive} />
</section>

<!-- ============================================================
     BAND 4 — GRAY (full width): other projects, one at a time
============================================================ -->
<section
	class="flex min-h-svh w-full flex-col px-8 py-20 md:px-16"
	style="background: var(--bg-elev)"
>
	<SpecLine label="Other projects" />
	<div class="reveal mt-12 flex flex-1 flex-col justify-center">
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
				class="grad-text reveal w-fit text-[clamp(1.15rem,1.8vw,1.45rem)] font-semibold tracking-[-0.02em]"
			>
				About me
			</p>
			<p
				class="reveal mt-4 max-w-lg text-[clamp(1.6rem,3.5vw,2.6rem)] leading-[1.15] font-semibold tracking-[-0.025em]"
				style="--vd: 0.1s"
			>
				<span class="silver">Hobbies, sports, and one golden retriever.</span>
			</p>
		</div>
	</div>

	<!-- off-the-clock board: fun-facts rail (sticky through Posey) + hobbies + Posey -->
	<div class="px-8 py-20 md:px-16">
		<div class="grid gap-10 lg:grid-cols-[15rem_1fr]">
			<!-- fun facts — sticks alongside the whole right column, releases past Posey -->
			<aside class="reveal lg:sticky lg:top-24 lg:self-start">
				<p class="ab-fcap"><span class="grad-text">Fun facts</span></p>
				{#each funFacts as f}
					<div class="ab-frow">
						<span class="ab-fk">{f.k}</span>
						<span class="ab-fv">{f.v}</span>
					</div>
				{/each}
			</aside>

			<!-- right column: hobbies board, then Posey (keeps them under the sticky rail) -->
			<div class="reveal" style="--vd: 0.06s">
				<h2
					class="silver text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
				>
					Hobbies
				</h2>
				<p class="mt-5 max-w-2xl text-[16px] leading-[1.6] text-[color:var(--text-2)]">
					Most of my free time still goes into building projects — but when I'm not programming,
					this is what I'm into. You'll notice a lot of those projects trace straight back to these.
				</p>

				<div bind:this={hobbiesEl} class:hb-armed={hobbiesArmed} class:hb-in={hobbiesIn}>
					<div class="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each hobbyCards as c, i}
							<div class="ab-card hb-anim" style="--i: {i}">
								<div class="ab-head">
									<span class="ab-ic"><Icon name={c.icon} /></span>
									<h3 class="ab-title">{c.t}</h3>
								</div>
								<p class="ab-desc">{c.d}</p>
							</div>
						{/each}
					</div>

					<div class="mt-6 flex flex-wrap gap-2 sm:gap-2.5">
						{#each aboutTags as t, i}<span
								class="ab-pill hb-anim"
								style="--i: {hobbyCards.length + 1 + i * 0.5}"
								><span class="grad-text">{t}</span></span
							>{/each}
					</div>
				</div>

				<!-- Posey -->
				<div class="mt-10 border-t pt-10" style="border-color: var(--line-soft)">
					<!-- text and photo centered on each other, sitting close instead of at opposite edges -->
					<div class="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
						<div>
							<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
								<h2
									class="posey-name silver text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
								>
									Posey
								</h2>
								<span class="posey-tag">chief morale officer</span>
							</div>
							<p class="mt-6 max-w-2xl text-[16px] leading-[1.55] text-[color:var(--text-2)]">
								Golden retriever, one very busy braincell. Loves every person she's ever met, keeps
								the neighbors company during yard work, steals shoes at other people's houses, and
								was formally downgraded to <span class="silver font-medium">silver retriever</span> by
								the Retriever Committee for refusing to give the ball back. Will wait ten minutes for
								permission to eat dropped food. Sleeps in past me every morning.
							</p>
						</div>
						<div class="posey-photo mx-auto">
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
<section
	id="contact"
	bind:this={contactEl}
	class="relative isolate flex min-h-svh flex-col justify-center px-8 py-24 md:px-16"
	class:c-armed={contactArmed}
	class:c-in={contactIn}
>
	<p
		class="grad-text reveal w-fit text-[clamp(1.15rem,1.8vw,1.45rem)] font-semibold tracking-[-0.02em]"
	>
		Contact
	</p>
	<h2
		class="reveal mt-3 max-w-4xl text-[clamp(2.6rem,7vw,5.4rem)] leading-[1] font-semibold tracking-[-0.04em]"
		style="--vd: 0.05s"
	>
		<span class="silver">Let's build something.</span>
	</h2>
	<a
		href="mailto:david@simmerman.tech"
		class="mega-mail reveal mt-8 self-start text-[clamp(1.5rem,4.2vw,3.4rem)] leading-[1.1]"
		style="--vd: 0.1s"
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
	<!-- the hero's horizon again, so the page opens and closes on the same sunrise -->
	<div class="horizon" aria-hidden="true"></div>
	<div class="sunrise" aria-hidden="true"></div>
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
	/* lit card: a faint top-down sheen and a bright top edge; lifts on hover */
	.ab-card {
		display: flex;
		flex-direction: column;
		background: linear-gradient(180deg, #18181b 0%, #121214 60%);
		border: 1px solid #ffffff0f;
		border-radius: 12px;
		padding: 1.3rem 1.4rem;
		box-shadow:
			inset 0 1px 0 #ffffff12,
			0 1px 2px #00000066;
		transition:
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			border-color 0.35s,
			box-shadow 0.35s;
	}
	.ab-card:hover {
		transform: translateY(-3px);
		border-color: #ffffff1f;
		box-shadow:
			inset 0 1px 0 #ffffff1a,
			0 14px 30px -12px #000000cc;
	}
	@media (prefers-reduced-motion: reduce) {
		.ab-card:hover {
			transform: none;
		}
	}
	/* hobbies entrance: opacity + translate only, so the card's hover lift (transform) is untouched */
	.hb-anim {
		transition:
			opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i, 0) * 80ms),
			translate 0.7s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i, 0) * 80ms),
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			border-color 0.35s,
			box-shadow 0.35s;
	}
	.hb-armed:not(.hb-in) .hb-anim {
		opacity: 0;
		translate: 0 18px;
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
		background: linear-gradient(135deg, rgba(10, 132, 255, 0.24), rgba(100, 210, 255, 0.08));
		box-shadow: inset 0 0 0 1px rgba(100, 210, 255, 0.14);
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
	/* Posey: silver name like the other headings, a tinted tag, and a soft pool of blue light
	   under the polaroids */
	.posey-tag {
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-2);
		padding: 5px 12px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--accent) 14%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 32%, transparent);
	}
	.posey-photo {
		position: relative;
		isolation: isolate;
	}
	.posey-photo::before {
		content: '';
		position: absolute;
		inset: 10% -20% 0;
		z-index: -1;
		background: radial-gradient(
			closest-side,
			color-mix(in srgb, var(--accent) 28%, transparent),
			transparent
		);
		filter: blur(20px);
		pointer-events: none;
	}
	.ab-pill {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		/* gradient hairline: the page color fills the padding box over a gradient border box */
		border: 1px solid transparent;
		background:
			linear-gradient(var(--bg), var(--bg)) padding-box,
			linear-gradient(90deg, rgba(10, 132, 255, 0.55), rgba(100, 210, 255, 0.4)) border-box;
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

	/* the big email link — underlined in the gradient, drawn in with the horizon; blue on hover */
	.mega-mail {
		position: relative;
		display: inline-block;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: var(--text);
		transition: color 0.3s;
	}
	.mega-mail:hover,
	.mega-mail:focus-visible {
		color: var(--cta);
	}
	.mega-mail::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -0.08em;
		height: 2px;
		width: 100%;
		background: var(--accent-grad);
		transform-origin: left;
	}
	.c-armed .mega-mail::after {
		transform: scaleX(0);
	}
	.c-in .mega-mail::after {
		transform: none;
		transition: transform 0.9s cubic-bezier(0.65, 0, 0.35, 1) 0.5s;
	}

	/* contact plays the hero's horizon and sunrise when it arrives, not on load */
	#contact .horizon,
	#contact .sunrise {
		animation: none;
		opacity: 1;
		transform: none;
	}
	#contact.c-armed .horizon {
		transform: scaleX(0);
	}
	#contact.c-armed .sunrise {
		opacity: 0;
		transform: scale(0.3, 0.35);
	}
	#contact.c-in .horizon {
		transform: none;
		transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
	}
	#contact.c-in .sunrise {
		opacity: 1;
		transform: none;
		transition:
			transform 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s,
			opacity 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
	}

	/* Scroll cue — hairline that pulses downward, fades away once you scroll */
	/* My story: a row of milestones slid sideways by scroll while the section is pinned. Half a
	   screen of padding each side (less half a card) centers the first and last milestones. One
	   faint line runs under the row; the lit blue → cyan part grows along it with the scroll. */
	/* pinned height = a screen + the sideways travel ((n − 1) × (card + gap)) + one card. JS
	   measures and sets the exact value; this CSS estimate makes the page its real height from
	   the first paint, so the scroll position SvelteKit restores on reload lands where you were. */
	.story-wrap {
		--gap: 2rem;
		position: relative;
		height: calc(100svh + var(--n) * min(34rem, 80vw) + (var(--n) - 1) * var(--gap));
	}
	@media (min-width: 640px) {
		.story-wrap {
			--gap: 4rem;
		}
	}
	/* centering is measured against the stage, not 100vw (which includes the scrollbar) */
	.story-stage {
		container-type: inline-size;
	}
	.story-track {
		--card: min(34rem, 80cqw);
		padding-inline: calc(50cqw - var(--card) / 2);
		will-change: transform;
	}
	.story-line {
		position: absolute;
		top: 0;
		left: calc(50cqw - var(--card) / 2);
		right: calc(50cqw - var(--card) / 2);
		height: 1px;
		background: var(--line);
	}
	.story-fill {
		position: absolute;
		left: 0;
		top: 0;
		height: 1.5px;
		margin-top: -0.25px;
		background: linear-gradient(90deg, var(--accent), var(--accent-2));
		box-shadow: 0 0 10px color-mix(in srgb, var(--accent-2) 45%, transparent);
	}
	.ms {
		position: relative;
		flex: 0 0 var(--card);
		padding-top: 1.6rem;
	}
	/* the unit, small and gray beside the number ("12 years old"), like Apple's spec numbers */
	.ms-u {
		margin-left: 0.5rem;
		font-size: 18px;
		font-weight: 500;
		letter-spacing: -0.01em;
		-webkit-text-fill-color: var(--text-2);
	}
	@media (min-width: 640px) {
		.ms-u {
			font-size: 22px;
		}
	}
	.ms-num {
		font-size: clamp(3.5rem, 8vw, 6rem);
		line-height: 1;
		font-weight: 600;
		letter-spacing: -0.04em;
		/* room under the baseline: the gradient only paints inside the box, so without this the
		   descender of the y in "yrs" was clipped */
		padding-bottom: 0.14em;
		margin-bottom: -0.14em;
	}
	/* the rest fade in from the side as you scroll (JS, inline); the first is already centered
	   when the section arrives, so it rises in as it lights instead */
	.armed .ms-first .ms-head,
	.armed .ms-first .ms-words {
		opacity: 0;
		transform: translateY(14px);
	}
	.armed .ms-first.lit .ms-head,
	.armed .ms-first.lit .ms-words {
		opacity: 1;
		transform: none;
		transition:
			opacity 0.6s ease 0.1s,
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
	}
	.armed .ms-first.lit .ms-words {
		transition-delay: 0.25s;
	}

	/* one line of blue→cyan light just above the fold, drawn out from the center after the
	   name lands, with a faint sunrise swelling off it at the same time; then it all holds still.
	   Behind the text (z -1 inside the isolated hero). */
	.horizon {
		position: absolute;
		left: 4%;
		right: 4%;
		bottom: var(--horizon-y);
		z-index: -1;
		height: 1.5px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--accent) 22%,
			var(--accent-2) 50%,
			var(--accent) 78%,
			transparent
		);
		transform: scaleX(0);
		animation: horizon-draw 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;
	}
	/* hero fully off screen: entrance switched off, so it replays on the way back */
	#hero.away :global(.rise),
	#hero.away .horizon,
	#hero.away .sunrise {
		animation: none;
	}
	.sunrise {
		position: absolute;
		left: 0;
		right: 0;
		bottom: var(--horizon-y);
		z-index: -1;
		height: min(70svh, 420px);
		pointer-events: none;
		/* brightest just above the line, cyan at the core like the line's center */
		background: radial-gradient(
			62% 100% at 50% 100%,
			rgba(100, 210, 255, 0.14) 0%,
			rgba(10, 132, 255, 0.1) 35%,
			transparent 72%
		);
		/* grows up and out from the line, in step with it — scaled from its bottom edge, so it
		   never shows below the line (no slide) */
		transform-origin: 50% 100%;
		opacity: 0;
		transform: scale(0.3, 0.35);
		animation: sunrise 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;
	}
	@keyframes horizon-draw {
		to {
			transform: scaleX(1);
		}
	}
	@keyframes sunrise {
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.horizon,
		.sunrise {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
	.scrim {
		background: linear-gradient(to top, #08080ae6 0%, #08080a40 40%, transparent 65%);
	}
</style>
