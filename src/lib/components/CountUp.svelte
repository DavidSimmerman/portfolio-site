<script lang="ts">
	// a stat that counts up to its number ("−30%" runs −0% … −30%) each time `play` turns true.
	// Values without a number ("SDK") just show. SSR, no JS and reduced motion: the final value.
	let { value, from = 0, play = true }: { value: string; from?: number; play?: boolean } = $props();

	const parts = $derived(value.match(/^(\D*)(\d+)(.*)$/));
	let shown = $state<string | null>(null);

	$effect(() => {
		if (!parts || !play) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const [, pre, num, post] = parts;
		const to = Number(num);
		const at = (k: number) =>
			pre + Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))) + post;
		shown = at(0);
		const t0 = performance.now();
		let raf = 0;
		const tick = (now: number) => {
			const k = Math.min(1, (now - t0) / 1100);
			shown = at(k);
			if (k < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

{#if parts}<span aria-hidden="true">{shown ?? value}</span><span class="sr-only">{value}</span
	>{:else}{value}{/if}
