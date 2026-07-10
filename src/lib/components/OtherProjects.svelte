<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	type Project = {
		name: string;
		year: string;
		platform: string;
		desc: string;
		github: string;
		live?: { label: string; href: string };
		/** 'portrait' lays shots beside the text; 'landscape' stacks them */
		orientation: 'portrait' | 'landscape';
		/** preview screenshots, fully shown (never cropped) */
		shots: { src: string; w: number; h: number }[];
		/** small centered glyph used when there are no screenshots */
		icon?: string;
		/** fallback / accent gradient */
		grad: string;
	};

	const projects: Project[] = [
		{
			name: 'Discovery',
			year: '2025',
			platform: 'Mobile',
			desc: "Spotify's shuffle plays the same songs until they become your top songs, which makes it play them more. Discovery breaks the loop — you rate songs so it knows what you actually like, you control the shuffle algorithm, and it surfaces new music based on taste instead of listening patterns.",
			github: 'https://github.com/DavidSimmerman/discovery',
			live: { label: 'discovery.simmerman.tech', href: 'https://discovery.simmerman.tech' },
			orientation: 'portrait',
			shots: [{ src: '/images/op-discovery.png', w: 1206, h: 1812 }],
			grad: 'linear-gradient(135deg,#1DB954,#0a3d20)'
		},
		{
			name: 'Movie SZN',
			year: '2024',
			platform: 'Web',
			desc: 'A movie review site for me and my friends — track what I watch, argue about ratings, and queue up suggestions for what I should suffer through next. The Season Awards shot updates automatically each week.',
			github: 'https://github.com/DavidSimmerman/movie-szn',
			live: { label: 'movie-szn.simmerman.tech', href: 'https://movie-szn.simmerman.tech' },
			orientation: 'landscape',
			// op-movie-szn.png (Season Awards) is refreshed by scripts/shoot-awards.mjs
			shots: [
				{ src: '/images/op-movie-szn.png', w: 2048, h: 1220 },
				{ src: '/images/op-movie-szn-hero.png', w: 980, h: 480 }
			],
			grad: 'linear-gradient(135deg,#e50914,#3a0a0d)'
		},
		{
			name: 'Health dashboard',
			year: '2025',
			platform: 'Web',
			desc: 'Activity, food macros, sleep, heart data, weight, workouts — every health metric I generate, collected in one place, with an AI agent watching for bad trends and suggesting fixes.',
			github: 'https://github.com/DavidSimmerman/health-dashboard',
			orientation: 'landscape',
			shots: [],
			grad: 'linear-gradient(135deg,#0a84ff,#0a2540)'
		},
		{
			name: 'Coupon clipper',
			year: '2024',
			platform: 'Automation',
			desc: 'Originally built so my mom never misses a Publix coupon. She bragged to the family, requests rolled in, and now it works on any store site with a clip-to-apply coupon page.',
			github: 'https://github.com/DavidSimmerman/publix-cupon-clipper',
			orientation: 'landscape',
			shots: [],
			icon: '/images/op-clipper-icon.png',
			grad: 'linear-gradient(135deg,#1f6feb,#0a2540)'
		},
		{
			name: 'Giddey',
			year: '2024',
			platform: 'Game',
			desc: 'An NBA take on the "Gridiron" football puzzle game, built in a weekend — my friend and I bet on who could ship the better version. This was my entry.',
			github: 'https://github.com/DavidSimmerman/giddey',
			live: { label: 'giddey.simmerman.tech', href: 'https://giddey.simmerman.tech' },
			orientation: 'portrait',
			shots: [
				{ src: '/images/op-giddey.png', w: 409, h: 885 },
				{ src: '/images/op-giddey-2.png', w: 409, h: 885 }
			],
			grad: 'linear-gradient(135deg,#e8833a,#5c2a06)'
		}
	];

	let active = $state(0);

	// active card first so it occupies the top-left 2×2 cell
	const ordered = $derived([projects[active], ...projects.filter((_, i) => i !== active)]);
	const idxOf = (p: Project) => projects.indexOf(p);
</script>

<div class="bento grid grid-cols-2 gap-4 lg:grid-cols-4">
	{#each ordered as p (p.name)}
		{@const i = idxOf(p)}
		{@const isActive = i === active}
		{@const hasShots = p.shots.length > 0}
		<div
			animate:flip={{ duration: 420 }}
			class="card group relative overflow-hidden rounded-3xl border border-white/[0.07] transition-colors duration-300 hover:border-white/20"
			class:feature={isActive}
			style="background: var(--bg)"
		>
			{#if isActive}
				<!-- FEATURED: text beside the screenshots -->
				<div class="flex h-full flex-col md:grid md:grid-cols-[1fr_1.15fr]">
					<div class="order-2 flex flex-col justify-center p-6 md:order-1 md:p-8">
						<div class="flex items-center gap-2 text-[12px] text-[color:var(--text-4)]">
							<span>{p.platform}</span><span>·</span><span>{p.year}</span>
						</div>
						<h3 class="mt-1 text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold tracking-[-0.02em]">
							{p.name}
						</h3>
						<div in:fade={{ duration: 250, delay: 120 }}>
							<p class="mt-3 max-w-md text-[15px] leading-[1.55] text-[color:var(--text-2)]">
								{p.desc}
							</p>
							<div class="mt-4 flex items-center gap-5 text-[14px]">
								{#if p.live}
									<a href={p.live.href} target="_blank" rel="noopener" class="cta"
										>{p.live.label} ›</a
									>
								{/if}
								<a href={p.github} target="_blank" rel="noopener" class="cta">GitHub ›</a>
							</div>
						</div>
					</div>
					<div
						class="relative order-1 flex min-h-0 flex-1 items-stretch gap-3 p-4 md:order-2 md:p-5 {p.orientation ===
						'portrait'
							? 'flex-row justify-center'
							: 'flex-col'}"
						style="background: {hasShots ? '#0b0b0d' : p.grad}"
					>
						{#if hasShots}
							{#each p.shots as shot}
								<div class="relative min-h-0 min-w-0 flex-1">
									<img
										src={shot.src}
										alt="{p.name} screenshot"
										width={shot.w}
										height={shot.h}
										loading="lazy"
										class="absolute inset-0 h-full w-full object-contain"
									/>
								</div>
							{/each}
						{:else if p.icon}
							<img src={p.icon} alt="" width="48" height="48" class="m-auto w-20 opacity-95" />
						{/if}
					</div>
				</div>
			{:else}
				<!-- COLLAPSED -->
				<button
					type="button"
					class="absolute inset-0 z-10 h-full w-full cursor-pointer"
					onclick={() => (active = i)}
					aria-label="Feature {p.name}"
				></button>

				{#if p.orientation === 'portrait' && hasShots}
					<!-- tall shot: image beside caption -->
					<div class="flex h-full">
						<div class="relative w-[44%] shrink-0 p-3" style="background: #0b0b0d">
							<img
								src={p.shots[0].src}
								alt="{p.name} preview"
								width={p.shots[0].w}
								height={p.shots[0].h}
								loading="lazy"
								class="absolute inset-0 h-full w-full object-contain p-1"
							/>
						</div>
						<div class="flex flex-1 flex-col justify-center border-l border-white/[0.06] p-5">
							<div class="text-[12px] text-[color:var(--text-4)]">{p.platform} · {p.year}</div>
							<h3 class="mt-1 text-[18px] font-semibold tracking-[-0.02em]">{p.name}</h3>
						</div>
					</div>
				{:else}
					<!-- wide shot or fallback: image above caption -->
					<div class="flex h-full flex-col">
						<div
							class="relative min-h-0 flex-1 overflow-hidden"
							style="background: {hasShots ? '#0b0b0d' : p.grad}"
						>
							{#if hasShots}
								<img
									src={p.shots[0].src}
									alt="{p.name} preview"
									width={p.shots[0].w}
									height={p.shots[0].h}
									loading="lazy"
									class="absolute inset-0 h-full w-full object-contain p-3"
								/>
							{:else if p.icon}
								<img
									src={p.icon}
									alt=""
									width="48"
									height="48"
									class="absolute top-1/2 left-1/2 w-16 -translate-x-1/2 -translate-y-1/2 opacity-95"
								/>
							{/if}
						</div>
						<div class="shrink-0 border-t border-white/[0.06] p-5">
							<div class="text-[12px] text-[color:var(--text-4)]">{p.platform} · {p.year}</div>
							<h3 class="mt-1 text-[18px] font-semibold tracking-[-0.02em]">{p.name}</h3>
						</div>
					</div>
				{/if}

				<!-- multi-shot hint + enlarge -->
				<div class="pointer-events-none absolute top-3 right-3 z-20 flex items-center gap-2">
					{#if p.shots.length > 1}
						<span
							class="rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur"
						>
							{p.shots.length} shots
						</span>
					{/if}
					<span
						class="flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur transition group-hover:bg-black/70"
					>
						Enlarge ⤢
					</span>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.bento {
		grid-auto-rows: 280px;
	}
	.card {
		grid-column: span 1;
		grid-row: span 1;
	}
	.card.feature {
		grid-column: span 2;
		grid-row: span 2;
	}
	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}
	}
</style>
