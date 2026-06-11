<script lang="ts">
	type Role = { title: string; dates: string };
	let {
		company,
		summary,
		roles,
		bullets,
		link,
		dock = 'left'
	}: {
		company: string;
		summary: string;
		roles: Role[];
		bullets: string[];
		link?: { label: string; href: string };
		dock?: 'left' | 'right';
	} = $props();
</script>

<!-- black panel docked to one screen edge; flies in from that edge on scroll -->
<div class="panel relative p-8 md:p-12 {dock === 'left' ? 'dock-left' : 'dock-right'}">
	<div class="grid gap-10 md:grid-cols-[1fr_1.6fr]">
		<div>
			<h3 class="text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.1] font-semibold tracking-[-0.025em]">
				{company}
			</h3>
			<div class="mt-6 flex flex-col gap-3">
				{#each roles as r, i}
					<div class="flex items-baseline gap-3">
						<span
							class="mt-0.5 size-1.5 shrink-0 self-center rounded-full"
							style="background: {i === 0 ? 'var(--accent)' : 'var(--line)'}"
						></span>
						<span class="text-[14px] font-medium {i === 0 ? '' : 'text-[color:var(--text-3)]'}">
							{r.title}
						</span>
						<span class="ml-auto text-[12px] whitespace-nowrap text-[color:var(--text-4)]">
							{r.dates}
						</span>
					</div>
				{/each}
			</div>
			{#if link}
				<p class="mt-6">
					<a href={link.href} target="_blank" rel="noopener" class="cta text-[14px]">
						{link.label} ›
					</a>
				</p>
			{/if}
		</div>
		<div>
			<p class="text-[16px] leading-[1.55] text-[color:var(--text-2)]">{summary}</p>
			<ul class="mt-6 flex flex-col gap-3">
				{#each bullets as b, i}
					<li
						class="stagger flex gap-3 text-[14.5px] leading-[1.5] text-[color:var(--text-2)]"
						style="--si: {i}"
					>
						<span class="mt-2 size-1 shrink-0 rounded-full" style="background: var(--accent)"
						></span>
						<span>{b}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	.panel {
		background: var(--bg);
		view-timeline: --panel;
		animation-duration: 0.9s;
		animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
		animation-fill-mode: both;
		animation-timeline: --panel;
		/* start once ~40% of the panel is in view, settle just past viewport
		   center — late enough that the motion plays while you're looking */
		animation-range: entry 40% cover 58%;
	}
	.dock-left {
		margin-right: max(2rem, 9vw);
		border-radius: 0 28px 28px 0;
		box-shadow: inset 4px 0 0 var(--accent);
		animation-name: from-left;
	}
	.dock-right {
		margin-left: max(2rem, 9vw);
		border-radius: 28px 0 0 28px;
		box-shadow: inset -4px 0 0 var(--accent);
		animation-name: from-right;
	}
	@keyframes from-left {
		from {
			opacity: 0;
			transform: translateX(-140px) scale(0.96);
			filter: blur(6px);
		}
		to {
			opacity: 1;
			transform: none;
			filter: blur(0);
		}
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

	/* bullets cascade in just behind the panel — same timeline, ranges offset
	   per index (time-based animation-delay is ignored on scroll timelines) */
	.stagger {
		animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-timeline: --panel;
		animation-range: entry calc(48% + var(--si, 0) * 5%) cover calc(62% + var(--si, 0) * 5%);
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

	@media (prefers-reduced-motion: reduce) {
		.panel,
		.stagger {
			animation: none;
		}
	}
</style>
