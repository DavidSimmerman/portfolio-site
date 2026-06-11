<script lang="ts">
	import { fade } from 'svelte/transition';

	type Project = {
		name: string;
		year: string;
		desc: string;
		github: string;
		live?: { label: string; href: string };
	};

	const projects: Project[] = [
		{
			name: 'Discovery',
			year: '2025',
			desc: "Spotify's shuffle plays the same songs until they become your top songs, which makes it play them more. Discovery breaks the loop — you rate songs so it knows what you actually like, you control the shuffle algorithm, and it surfaces new music based on taste instead of listening patterns.",
			github: 'https://github.com/DavidSimmerman/discovery',
			live: { label: 'discovery.simmerman.tech', href: 'https://discovery.simmerman.tech' }
		},
		{
			name: 'Movie SZN',
			year: '2024',
			desc: 'A movie review site for me and my friends — track what I watch, argue about ratings, and queue up suggestions for what I should suffer through next.',
			github: 'https://github.com/DavidSimmerman/movie-szn',
			live: { label: 'movie-szn.simmerman.tech', href: 'https://movie-szn.simmerman.tech' }
		},
		{
			name: 'Health dashboard',
			year: '2025',
			desc: 'Activity, food macros, sleep, heart data, weight, workouts — every health metric I generate, collected in one place, with an AI agent watching for bad trends and suggesting fixes.',
			github: 'https://github.com/DavidSimmerman/health-dashboard'
		},
		{
			name: 'Coupon clipper',
			year: '2024',
			desc: 'Originally built so my mom never misses a Publix coupon. She bragged to the family, requests rolled in, and now it works on any store site with a clip-to-apply coupon page.',
			github: 'https://github.com/DavidSimmerman/publix-cupon-clipper'
		},
		{
			name: 'Giddey',
			year: '2024',
			desc: 'An NBA take on the "Gridiron" football puzzle game, built in a weekend — my friend and I bet on who could ship the better version. This was my entry.',
			github: 'https://github.com/DavidSimmerman/giddey',
			live: { label: 'giddey.simmerman.tech', href: 'https://giddey.simmerman.tech' }
		}
	];

	let selected = $state(0);
</script>

<!-- segmented control -->
<div
	class="inline-flex max-w-full flex-wrap gap-1 rounded-full p-1"
	style="background: #1d1d1f"
	role="tablist"
>
	{#each projects as p, i}
		<button
			role="tab"
			aria-selected={selected === i}
			class="cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-200"
			style={selected === i ? 'background: var(--text); color: var(--bg)' : 'color: var(--text-2)'}
			onclick={() => (selected = i)}
		>
			{p.name}
		</button>
	{/each}
</div>

<!-- one project at a time -->
<div class="relative mt-8 min-h-44">
	{#key selected}
		{@const p = projects[selected]!}
		<div class="absolute inset-0" in:fade={{ duration: 250 }}>
			<div class="flex items-baseline gap-4">
				<h3 class="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.02em]">
					{p.name}
				</h3>
				<span class="text-[13px] text-[color:var(--text-4)]">{p.year}</span>
			</div>
			<p class="mt-4 max-w-2xl text-[16px] leading-[1.55] text-[color:var(--text-2)]">
				{p.desc}
			</p>
			<div class="mt-5 flex items-center gap-6 text-[14px]">
				{#if p.live}
					<a href={p.live.href} target="_blank" rel="noopener" class="cta">
						{p.live.label} ›
					</a>
				{/if}
				<a href={p.github} target="_blank" rel="noopener" class="cta">GitHub ›</a>
			</div>
		</div>
	{/key}
</div>
