<script lang="ts">
	let { label, detail = '' }: { label: string; detail?: string } = $props();
</script>

<div class="reveal flex items-baseline gap-4">
	<span
		class="grad-text text-[clamp(1.15rem,1.8vw,1.45rem)] font-semibold tracking-[-0.02em] whitespace-nowrap"
		>{label}</span
	>
	<span
		class="h-px flex-1 self-center"
		style="background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 40%, transparent), var(--line) 30%)"
	></span>
	{#if detail}
		<span class="text-[14px] font-medium text-[color:var(--text-2)]">{detail}</span>
	{/if}
</div>
