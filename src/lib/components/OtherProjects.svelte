<script lang="ts">
	type Project = {
		name: string;
		year: string;
		platform: string;
		desc: string;
		github: string;
		live?: { label: string; href: string };
		/** representative screenshot, shown inside the expanded panel */
		shot?: { src: string; w: number; h: number };
		/** small centered glyph used when there's no screenshot */
		icon?: string;
	};

	const projects: Project[] = [
		{
			name: 'Discovery',
			year: '2025',
			platform: 'Mobile',
			desc: "Spotify's shuffle plays the same songs until they become your top songs, which makes it play them more. Discovery breaks the loop — you rate songs so it knows what you actually like, you control the shuffle algorithm, and it surfaces new music based on taste instead of listening patterns.",
			github: 'https://github.com/DavidSimmerman/discovery',
			live: { label: 'discovery.simmerman.tech', href: 'https://discovery.simmerman.tech' },
			shot: { src: '/images/op-discovery.png', w: 1206, h: 1812 }
		},
		{
			name: 'Movie SZN',
			year: '2024',
			platform: 'Web',
			desc: 'A movie review site for me and my friends — track what I watch, argue about ratings, and queue up suggestions for what I should suffer through next. The Season Awards shot updates automatically each week.',
			github: 'https://github.com/DavidSimmerman/movie-szn',
			live: { label: 'movie-szn.simmerman.tech', href: 'https://movie-szn.simmerman.tech' },
			shot: { src: '/images/op-movie-szn.png', w: 2048, h: 1220 }
		},
		{
			name: 'Health dashboard',
			year: '2025',
			platform: 'Web',
			desc: 'Activity, food macros, sleep, heart data, weight, workouts — every health metric I generate, collected in one place, with an AI agent watching for bad trends and suggesting fixes.',
			github: 'https://github.com/DavidSimmerman/health-dashboard'
		},
		{
			name: 'Coupon clipper',
			year: '2024',
			platform: 'Automation',
			desc: 'Originally built so my mom never misses a Publix coupon. She bragged to the family, requests rolled in, and now it works on any store site with a clip-to-apply coupon page.',
			github: 'https://github.com/DavidSimmerman/publix-cupon-clipper',
			icon: '/images/op-clipper-icon.png'
		},
		{
			name: 'Giddey',
			year: '2024',
			platform: 'Game',
			desc: 'An NBA take on the “Gridiron” football puzzle game, built in a weekend — my friend and I bet on who could ship the better version. This was my entry.',
			github: 'https://github.com/DavidSimmerman/giddey',
			live: { label: 'giddey.simmerman.tech', href: 'https://giddey.simmerman.tech' },
			shot: { src: '/images/op-giddey.png', w: 409, h: 885 }
		}
	];
	const num = (i: number) => String(i + 1).padStart(2, '0');

	// click-to-open accordion — one row open at a time (starts all closed)
	let open = $state<number | null>(null);
	const toggle = (i: number) => (open = open === i ? null : i);
</script>

<ul class="ix" role="list">
	{#each projects as p, i}
		<li class="ix-item" class:open={open === i}>
			<button
				type="button"
				class="ix-row"
				id="op-h-{i}"
				aria-expanded={open === i}
				aria-controls="op-p-{i}"
				onclick={() => toggle(i)}
			>
				<span class="ix-num">{num(i)}</span>
				<span class="ix-name">{p.name}</span>
				<span class="ix-meta">{p.platform} · {p.year}</span>
				<span class="ix-chev" aria-hidden="true"></span>
			</button>
			<div
				class="ix-panel"
				id="op-p-{i}"
				role="region"
				aria-labelledby="op-h-{i}"
				inert={open !== i}
			>
				<div class="ix-panel-inner">
					{#if open === i && (p.shot || p.icon)}
						<div class="ix-shot">
							{#if p.shot}
								<img
									src={p.shot.src}
									alt="{p.name} screenshot"
									width={p.shot.w}
									height={p.shot.h}
								/>
							{:else if p.icon}
								<img class="ix-ic" src={p.icon} alt="" width="64" height="64" />
							{/if}
						</div>
					{/if}
					<div class="ix-detail">
						<p>{p.desc}</p>
						<div class="ix-links">
							{#if p.live}
								<a href={p.live.href} target="_blank" rel="noopener" class="cta">{p.live.label} ↗</a
								>
							{/if}
							<a href={p.github} target="_blank" rel="noopener" class="cta">GitHub</a>
						</div>
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>

<style>
	.ix {
		border-top: 1px solid #ffffff12;
	}
	.ix-item {
		border-bottom: 1px solid #ffffff12;
	}
	.ix-row {
		width: 100%;
		display: grid;
		grid-template-columns: 2.6rem 1fr auto 1.5rem;
		align-items: baseline;
		gap: 1.4rem;
		padding: 1.35rem 0.4rem;
		background: none;
		border: 0;
		cursor: pointer;
		text-align: left;
		color: inherit;
		font: inherit;
		transition: padding-left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.ix-row:hover {
		padding-left: 1rem;
	}
	.ix-num {
		font-size: 0.8rem;
		color: var(--text-4);
		font-variant-numeric: tabular-nums;
		transition: color 0.25s;
	}
	.ix-item.open .ix-num {
		color: var(--accent);
	}
	.ix-name {
		font-size: clamp(1.2rem, 2.2vw, 1.7rem);
		font-weight: 600;
		letter-spacing: -0.02em;
	}
	.ix-meta {
		align-self: center;
		font-size: 0.8rem;
		color: var(--text-3);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		white-space: nowrap;
	}
	.ix-chev {
		align-self: center;
		justify-self: end;
		width: 0.62rem;
		height: 0.62rem;
		border-right: 1.5px solid var(--text-3);
		border-bottom: 1.5px solid var(--text-3);
		transform: rotate(45deg);
		transition:
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			border-color 0.25s;
	}
	.ix-item.open .ix-chev {
		transform: rotate(-135deg);
		border-color: var(--accent);
	}

	/* smooth open/close via grid-template-rows 0fr -> 1fr */
	.ix-panel {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.ix-item.open .ix-panel {
		grid-template-rows: 1fr;
	}
	.ix-panel-inner {
		overflow: hidden;
		min-height: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 1.75rem;
	}
	.ix-item.open .ix-panel-inner {
		padding: 0.2rem 0.4rem 1.9rem 4rem;
	}
	.ix-shot {
		flex: 0 0 22rem;
		max-width: 100%;
		height: 14rem;
		background: #0b0b0d;
		border: 1px solid #ffffff14;
		border-radius: 12px;
		display: grid;
		place-items: center;
		overflow: hidden;
	}
	.ix-shot img {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
		padding: 12px;
	}
	.ix-shot img.ix-ic {
		width: 64px;
		height: 64px;
		padding: 0;
	}
	.ix-detail {
		flex: 1 1 18rem;
		align-self: center;
	}
	.ix-detail p {
		font-size: 16px;
		line-height: 1.55;
		color: var(--text-2);
		max-width: 52ch;
	}
	.ix-links {
		margin-top: 1.1rem;
		display: flex;
		gap: 1.4rem;
		font-size: 15px;
	}

	@media (max-width: 640px) {
		.ix-meta {
			display: none;
		}
		.ix-item.open .ix-panel-inner {
			padding-left: 0.4rem;
		}
		.ix-shot {
			flex-basis: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ix-row,
		.ix-chev,
		.ix-panel {
			transition: none;
		}
	}
</style>
