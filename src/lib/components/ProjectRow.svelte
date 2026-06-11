<script lang="ts">
	let {
		name,
		desc,
		year,
		href = ''
	}: { name: string; desc: string; year: string; href?: string } = $props();
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{...href ? { href, target: '_blank', rel: 'noopener' } : {}}
	class="project-row reveal group flex cursor-pointer items-baseline justify-between gap-6 border-b py-5"
	style="border-color: var(--line-soft)"
>
	<span
		class="text-[clamp(1.2rem,2.4vw,1.7rem)] font-semibold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-2"
	>
		{name}
	</span>
	<span class="hidden flex-1 text-[14px] text-[color:var(--text-3)] md:block">{desc}</span>
	<span class="text-[13px] text-[color:var(--text-4)]">{year}</span>
</svelte:element>

<style>
	.project-row:hover > span:first-child {
		color: var(--accent);
	}
</style>
