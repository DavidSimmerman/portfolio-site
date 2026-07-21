<script lang="ts">
	// small line icon for the hobby cards; color comes from the parent (currentColor)
	let { name }: { name: string } = $props();
</script>

<svg
	viewBox="0 0 24 24"
	width="22"
	height="22"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'tv'}
		<rect width="20" height="15" x="2" y="7" rx="2" />
		<polyline points="17 2 12 7 7 2" />
	{:else if name === 'film'}
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<path d="M7 3v18" />
		<path d="M3 7.5h4" />
		<path d="M3 12h18" />
		<path d="M3 16.5h4" />
		<path d="M17 3v18" />
		<path d="M17 7.5h4" />
		<path d="M17 16.5h4" />
	{:else if name === 'activity'}
		<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
	{:else if name === 'keyboard'}
		<rect width="20" height="16" x="2" y="4" rx="2" />
		<path d="M6 8h.001" />
		<path d="M10 8h.001" />
		<path d="M14 8h.001" />
		<path d="M18 8h.001" />
		<path d="M8 12h.001" />
		<path d="M12 12h.001" />
		<path d="M16 12h.001" />
		<path d="M7 16h10" />
	{:else if name === 'gamepad'}
		<line x1="6" x2="10" y1="12" y2="12" />
		<line x1="8" x2="8" y1="10" y2="14" />
		<line x1="15" x2="15.01" y1="13" y2="13" />
		<line x1="18" x2="18.01" y1="11" y2="11" />
		<rect width="20" height="12" x="2" y="6" rx="2" />
	{:else if name === 'home'}
		<path d="M3 9.5 12 3l9 6.5" />
		<path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
		<path d="M9 21v-6h6v6" />
	{/if}
</svg>
