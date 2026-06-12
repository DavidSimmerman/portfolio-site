<script lang="ts">
	const features = [
		{
			h: 'Roster construction',
			p: 'NBA front-office process + predictive analytics applied to college rosters'
		},
		{ h: 'Strengths & weaknesses', p: 'Reads a season of stats and calls out what to fix' },
		{ h: 'Platform AI agent', p: 'Natural-language navigation across the whole product' },
		{ h: 'Frontend redesign', p: 'Entire UI rebuilt from the ground up' }
	];
	const programs = [
		{ src: '/logos/houston.svg', alt: 'Houston Cougars' },
		{ src: '/logos/olemiss.svg', alt: 'Ole Miss Rebels' },
		{ src: '/logos/baylor.svg', alt: 'Baylor Bears' },
		{ src: '/logos/oklahoma.svg', alt: 'Oklahoma Sooners' },
		{ src: '/logos/okstate.svg', alt: 'Oklahoma State Cowboys' }
	];
</script>

<!-- black panel docked to the right screen edge; flies in from it on scroll -->
<div class="panel dock-right relative p-8 md:p-12">
	<div class="grid gap-10 md:grid-cols-[1fr_1.6fr]">
		<div>
			<h3 class="text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.1] font-semibold tracking-[-0.025em]">
				Wisely Optimize
			</h3>
			<p class="mt-3 text-[14px] leading-[1.5] text-[color:var(--text-3)]">
				Basketball intelligence for Division 1 programs. Part-time alongside Zoovu — year-round,
				deep in the sport.
			</p>
			<div class="mt-5 flex items-baseline gap-3">
				<span class="dot-solo"></span>
				<span class="text-[14px] font-medium">Basketball Engineer · part-time</span>
				<span class="ml-auto text-[12px] whitespace-nowrap text-[color:var(--text-4)]">
					Mar 2026 – present
				</span>
			</div>
			<div class="stat mt-8">
				<span class="stat-v">D1</span>
				<span class="stat-l">programs run their rosters on it</span>
			</div>
			<p class="mt-6">
				<a href="https://wiselyoptimize.com" target="_blank" rel="noopener" class="cta text-[14px]">
					wiselyoptimize.com ›
				</a>
			</p>
		</div>
		<div>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each features as f, i}
					<div class="hl stagger" style="--si: {i}">
						<div class="hl-h">{f.h}</div>
						<div class="hl-p">{f.p}</div>
					</div>
				{/each}
			</div>
			<div class="mt-7 border-t pt-5" style="border-color: var(--line-soft)">
				<div class="text-[11px] font-medium tracking-[0.12em] uppercase text-[color:var(--text-4)]">
					Some of the programs on it
				</div>
				<div class="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
					{#each programs as p}
						<img src={p.src} alt={p.alt} class="logo h-9 w-auto" loading="lazy" />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.panel {
		background: var(--bg);
		margin-left: max(2rem, 9vw);
		border-radius: 28px 0 0 28px;
		box-shadow: inset -4px 0 0 var(--accent);
		view-timeline: --panel;
		animation: from-right 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-timeline: --panel;
		animation-range: entry 40% cover 58%;
	}
	@keyframes from-right {
		from {
			opacity: 0;
			transform: translateX(140px) scale(0.96);
			filter: blur(6px);
		}
		to {
			opacity: 1;
			transform: none;
			filter: blur(0);
		}
	}

	/* feature tiles cascade in off the panel's timeline */
	.stagger {
		animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-timeline: --panel;
		animation-range: entry calc(48% + var(--si, 0) * 6%) cover calc(62% + var(--si, 0) * 6%);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.hl {
		padding: 14px 16px;
		border: 1px solid var(--line);
		border-radius: 14px;
	}
	.hl-h {
		font-size: 14px;
		font-weight: 600;
	}
	.hl-p {
		margin-top: 4px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--text-3);
	}

	.stat {
		display: flex;
		align-items: baseline;
		gap: 10px;
	}
	.stat-v {
		font-size: 30px;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--accent);
	}
	.stat-l {
		font-size: 13px;
		color: var(--text-3);
	}
	.logo {
		/* dark crimson/green marks need a nudge against the near-black panel */
		filter: brightness(1.15);
	}
	.dot-solo {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: var(--accent);
		align-self: center;
		flex-shrink: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.panel,
		.stagger {
			animation: none;
		}
	}
</style>
