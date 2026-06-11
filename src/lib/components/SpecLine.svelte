<script lang="ts">
	let { label, detail = '' }: { label: string; detail?: string } = $props();
</script>

<div class="reveal flex items-baseline gap-3.5 text-[13px] font-medium">
	<span class="whitespace-nowrap" style="color: var(--accent)">{label}</span>
	<span class="h-px flex-1 self-center" style="background: var(--line)"></span>
	{#if detail}
		<span class="text-[color:var(--text-2)]">{detail}</span>
	{/if}
</div>
