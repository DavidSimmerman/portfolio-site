<script lang="ts">
	// line icons (hobbies, skills, project features), stroked in the blue→cyan gradient. Each icon
	// carries its own gradient (userSpaceOnUse, so straight lines still paint) under a per-instance id.
	let { name, size = 22 }: { name: string; size?: number } = $props();
	const uid = $props.id();
	const gid = `icon-grad-${uid}`;
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="none"
	stroke="url(#{gid})"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<defs>
		<linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
			<stop offset="0" style="stop-color: var(--accent)" />
			<stop offset="1" style="stop-color: var(--accent-2)" />
		</linearGradient>
	</defs>
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
	{:else if name === 'spark'}
		<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
		<path d="M19 3v4M17 5h4" />
	{:else if name === 'window'}
		<rect x="3" y="4" width="18" height="16" rx="2" />
		<path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
	{:else if name === 'db'}
		<ellipse cx="12" cy="5" rx="8" ry="3" />
		<path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
	{:else if name === 'people'}
		<circle cx="9" cy="8" r="3.5" />
		<path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
	{:else if name === 'layers'}
		<path d="M12 3 2 8l10 5 10-5z" />
		<path d="M2 13l10 5 10-5" />
	{:else if name === 'user'}
		<circle cx="12" cy="8" r="4" />
		<path d="M4 21a8 8 0 0 1 16 0" />
	{:else if name === 'calendar'}
		<rect x="3" y="5" width="18" height="16" rx="2" />
		<path d="M8 3v4M16 3v4M3 10h18" />
	{:else if name === 'bracket'}
		<path d="M3 5h5v6h5M3 17h5v-6M13 11h8" />
	{:else if name === 'repeat'}
		<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" />
	{:else if name === 'news'}
		<rect x="3" y="4" width="18" height="16" rx="2" />
		<path d="M7 8h10M7 12h10M7 16h6" />
	{:else if name === 'pulse'}
		<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
	{:else if name === 'flame'}
		<path
			d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
		/>
	{:else if name === 'medal'}
		<path
			d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"
		/>
		<path d="M11 12 5.12 2.2" /><path d="m13 12 5.88-9.8" /><path d="M8 7h8" />
		<circle cx="12" cy="17" r="5" />
	{:else if name === 'swords'}
		<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" x2="19" y1="19" y2="13" />
		<line x1="16" x2="20" y1="16" y2="20" /><line x1="19" x2="21" y1="21" y2="19" />
		<polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" /><line x1="5" x2="9" y1="14" y2="18" />
		<line x1="7" x2="4" y1="17" y2="20" /><line x1="3" x2="5" y1="19" y2="21" />
	{:else if name === 'music'}
		<path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
	{:else if name === 'sliders'}
		<line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" />
		<line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" />
		<line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" />
		<line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line
			x1="16"
			x2="16"
			y1="18"
			y2="22"
		/>
	{:else if name === 'book'}
		<path d="M12 7v14" />
		<path
			d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
		/>
	{:else if name === 'check'}
		<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z" />
		<path d="m9 12 2 2 4-4" />
	{:else if name === 'cpu'}
		<rect width="16" height="16" x="4" y="4" rx="2" />
		<rect width="6" height="6" x="9" y="9" rx="1" />
		<path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
	{/if}
</svg>
