<script lang="ts">
	import SpecLine from '$lib/components/SpecLine.svelte';
	import WorkXGen from '$lib/components/WorkXGen.svelte';
	import WorkWisely from '$lib/components/WorkWisely.svelte';
	import OtherProjects from '$lib/components/OtherProjects.svelte';
	import PoseyGallery from '$lib/components/PoseyGallery.svelte';

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
		class="rise mt-8 max-w-xl text-[clamp(1.3rem,2.6vw,1.9rem)] leading-[1.25] font-medium text-[color:var(--text-3)]"
		style="--d: 2"
	>
		Software engineer. I make complicated things feel
		<span style="color: var(--accent)">simple</span> — AI platforms, basketball analytics, and one animatronic
		fish.
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
	<SpecLine label="The short version" />
	<p
		class="reveal mx-auto mt-10 max-w-3xl text-center text-[clamp(1.4rem,3vw,2.1rem)] leading-[1.35] font-medium text-[color:var(--text-3)]"
	>
		<span class="text-[color:var(--text)]">Started programming at 12</span> to run a Minecraft
		server with friends. A bootcamp in 2020 turned the hobby into a job;
		<span class="text-[color:var(--text)]">XGen AI turned the job into a career</span> —
		integrations developer to director in five years, building AI for some of the world's biggest
		brands.
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
		<div class="relative">
			<svg class="ghost ghost-w" viewBox="0 0 100 110" fill="none" aria-hidden="true">
				<path
					class="draw"
					pathLength="1"
					d="M6 6 L24 6 L34 61 L43 22 L57 22 L66 61 L76 6 L94 6 L77 104 L60 104 L50 69 L40 104 L23 104 Z"
				/>
			</svg>
			<WorkWisely />
		</div>
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
	/* ---------- work band: ghost monograms, drawn in by scroll ---------- */
	.ghost {
		position: absolute;
		top: 50%;
		width: clamp(14rem, 28vw, 24rem);
		transform: translateY(-50%);
		pointer-events: none;
		user-select: none;
		view-timeline: --ghost;
	}
	.ghost-w {
		left: -2.5rem;
	}
	.draw {
		stroke: #ffffff1a;
		/* width in viewBox units — non-scaling-stroke breaks dash math vs pathLength */
		stroke-width: 0.55;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw-in 1s linear both;
		animation-timeline: --ghost;
		/* sketches in early, before the panel flies in */
		animation-range: entry 25% entry 95%;
	}
	@keyframes draw-in {
		to {
			stroke-dashoffset: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.draw {
			animation: none;
			stroke-dashoffset: 0;
		}
	}

	.shot-wrap {
		perspective: 1200px;
	}
	.shot {
		border-radius: 14px;
		border: 1px solid #ffffff14;
		box-shadow: 0 30px 80px #000000a0;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.shot-wrap:hover .shot {
		transform: scale(1.015);
	}
	.scrim {
		background: linear-gradient(to top, #08080ae6 0%, #08080a40 40%, transparent 65%);
	}
</style>
