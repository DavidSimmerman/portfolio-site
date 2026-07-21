<script lang="ts">
	const groups = [
		{
			label: 'AI & LLMs',
			items: [
				{ name: 'LLM agents & RAG', note: 'production systems at XGen' },
				{ name: 'Claude / OpenAI APIs', note: 'tool use, streaming, evals' },
				{ name: 'Prompt & eval pipelines', note: 'automated output testing' },
				{ name: 'MCP & tool integrations', note: 'connecting models to systems' }
			]
		},
		{
			label: 'Frontend',
			items: [
				{ name: 'React & Next', note: 'primary stack at XGen' },
				{ name: 'Svelte & SvelteKit', note: 'this site, Wisely' },
				{ name: 'TypeScript', note: 'across the stack' },
				{ name: 'Tailwind & motion', note: 'styling and animation' }
			]
		},
		{
			label: 'Backend & data',
			items: [
				{ name: 'Node.js', note: 'APIs and services' },
				{ name: 'Python', note: 'models and scraping' },
				{ name: 'Postgres', note: 'with Drizzle' },
				{ name: 'Predictive analytics', note: 'D1 basketball models' }
			]
		},
		{
			label: 'Beyond the code',
			items: [
				{ name: 'Integrations architecture', note: 'client data pipelines at XGen' },
				{ name: 'Team leadership', note: 'dev to director in five years' },
				{ name: 'Enterprise delivery', note: 'Gucci, Sonos, Armani' },
				{ name: 'Hardware tinkering', note: 'Raspberry Pi, custom PCs' }
			]
		}
	];

	let gridEl: HTMLElement | undefined = $state();
	let shown = $state(false);
	// only hide-before-animate once JS is running; no-JS/hydration-fail stays visible
	let armed = $state(false);

	$effect(() => {
		if (!gridEl) return;
		// reduced motion or no IO support → show everything immediately
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			shown = true;
			return;
		}
		armed = true;
		// replay every time: show when it scrolls in, reset when it scrolls out
		const io = new IntersectionObserver(
			(entries) => {
				shown = entries[0].isIntersecting;
			},
			{ threshold: 0.12 }
		);
		io.observe(gridEl);
		return () => io.disconnect();
	});

	// stagger order: left+right group pairs cascade together, top pair before bottom
	const titleI = (gi: number) => Math.floor(gi / 2) * 5;
	const rowI = (gi: number, si: number) => Math.floor(gi / 2) * 5 + 1 + si;
</script>

<div
	bind:this={gridEl}
	class="mt-12 grid gap-x-16 gap-y-12 md:mt-0 md:grid-cols-2"
	class:anim-ready={armed}
>
	{#each groups as g, gi}
		<div>
			<h3
				class="s-anim text-[clamp(1.25rem,2.2vw,1.6rem)] leading-[1.1] font-semibold tracking-[-0.025em]"
				class:shown
				style="--i: {titleI(gi)}"
			>
				{g.label}
			</h3>
			<div class="mt-4 flex flex-col">
				{#each g.items as s, si}
					<div
						class="s-anim flex items-baseline justify-between gap-6 border-b py-3.5"
						class:shown
						style="--i: {rowI(gi, si)}; border-color: var(--line-soft)"
					>
						<span class="text-[15.5px] font-semibold">{s.name}</span>
						<span class="text-right text-[13px] text-[color:var(--text-3)]">{s.note}</span>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	/* hidden state only applies once JS arms the grid (.anim-ready), so
	   without JS / on hydration failure the skills stay visible */
	.s-anim {
		transition:
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: calc(var(--i, 0) * 55ms);
	}
	.anim-ready .s-anim {
		opacity: 0;
		transform: translateY(16px);
	}
	.anim-ready .s-anim.shown {
		opacity: 1;
		transform: translateY(0);
	}
	@media (prefers-reduced-motion: reduce) {
		.anim-ready .s-anim {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
