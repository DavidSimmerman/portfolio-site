<script lang="ts">
	type Role = { title: string; dates: string };
	let {
		company,
		summary,
		roles,
		bullets,
		link
	}: {
		company: string;
		summary: string;
		roles: Role[];
		bullets: string[];
		link?: { label: string; href: string };
	} = $props();
</script>

<!-- black card on the gray band -->
<div class="reveal rounded-[24px] p-8 md:p-12" style="background: var(--bg)">
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
				{#each bullets as b}
					<li class="flex gap-3 text-[14.5px] leading-[1.5] text-[color:var(--text-2)]">
						<span class="mt-2 size-1 shrink-0 rounded-full" style="background: var(--accent)"
						></span>
						<span>{b}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
