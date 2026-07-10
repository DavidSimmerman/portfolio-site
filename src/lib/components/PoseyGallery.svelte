<script lang="ts">
	const photos = [
		{ src: '/images/posey-sunglasses.png', caption: 'Chief morale officer.', w: 1536, h: 2048 },
		{ src: '/images/posey-puppy.jpeg', caption: 'Day one.', w: 3024, h: 4032 },
		{ src: '/images/posey-mountain.png', caption: 'Summit crew, Appalachians.', w: 1536, h: 2048 },
		{ src: '/images/posey-snow.png', caption: 'First snow. Unbothered.', w: 1536, h: 2048 },
		{ src: '/images/posey-recliner.png', caption: "That's her chair now.", w: 1536, h: 2048 },
		{ src: '/images/posey-couch.png', caption: 'Fetch training going great.', w: 1536, h: 2048 },
		{
			src: '/images/posey-sit.png',
			caption: 'Waiting for the OK to eat the floor steak.',
			w: 1536,
			h: 2048
		}
	];

	let idx = $state(0);
	let leaving = $state<number | null>(null);
	const n = photos.length;
	// deterministic per-card tilt so the stack looks hand-placed
	const jitter = [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2, -2.6];

	const depth = (i: number) => (i - idx + n) % n;

	function next() {
		if (leaving !== null) return;
		leaving = idx % n;
		idx = (idx + 1) % n;
		setTimeout(() => (leaving = null), 750);
	}
</script>

<!-- polaroid deck: front photo on top, next ones peeking out behind; click to tuck
     the front card under the pile -->
<div class="wrap">
	<div
		class="stage"
		role="button"
		tabindex="0"
		aria-label="Next photo"
		onclick={next}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && next()}
	>
		{#each photos as p, i}
			{@const d = depth(i)}
			<figure
				class="polaroid d{Math.min(d, 3)}"
				class:tucking={leaving === i}
				style="--jit: {jitter[i % jitter.length]}deg; z-index: {leaving === i ? 50 : 40 - d}"
			>
				<img src={p.src} alt={p.caption} width={p.w} height={p.h} loading="lazy" draggable="false" />
				<figcaption>{p.caption}</figcaption>
			</figure>
		{/each}
	</div>
	<div class="controls">
		<button class="cta" onclick={next}>next →</button>
		<span class="count">{(idx % n) + 1} / {n}</span>
	</div>
</div>

<style>
	.stage {
		position: relative;
		width: min(21rem, 84vw);
		aspect-ratio: 3 / 3.85;
		margin: 0 auto;
		cursor: pointer;
		outline: none;
	}
	.stage:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 12px;
		border-radius: 8px;
	}

	.polaroid {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		padding: 12px 12px 0;
		background: #f6f3ec;
		border-radius: 4px;
		box-shadow:
			0 1px 2px #00000066,
			0 14px 34px #000000a6;
		transition:
			transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.45s ease;
		transform-origin: 50% 60%;
	}
	.polaroid img {
		width: 100%;
		aspect-ratio: 1 / 1.06;
		object-fit: cover;
		background: #ddd;
		user-select: none;
	}
	.polaroid figcaption {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		padding: 6px 4px 10px;
		font-family: 'Marker Felt', 'Segoe Print', 'Bradley Hand', cursive;
		font-size: 17px;
		line-height: 1.15;
		color: #26221c;
		transform: rotate(-1deg);
	}

	/* deck positions — front, two peeking behind, rest hidden */
	.d0 {
		transform: rotate(var(--jit));
	}
	.d1 {
		transform: translate(26px, -12px) rotate(4.5deg) scale(0.97);
	}
	.d2 {
		transform: translate(-24px, -18px) rotate(-3.5deg) scale(0.94);
	}
	.d3 {
		transform: translate(0, -20px) scale(0.88);
		opacity: 0;
		pointer-events: none;
	}

	/* front card swings down off the deck, then slides up BEHIND it
	   (z-index drops mid-flight) and settles into the back position */
	.tucking {
		animation: tuck-under 0.75s cubic-bezier(0.5, 0.05, 0.45, 1) both;
	}
	@keyframes tuck-under {
		0% {
			transform: rotate(var(--jit));
			opacity: 1;
			z-index: 50;
		}
		45% {
			transform: translate(6%, 62%) rotate(-10deg);
			opacity: 1;
			z-index: 50;
		}
		60% {
			z-index: 1;
		}
		100% {
			transform: translate(0, -20px) scale(0.88);
			opacity: 1;
			z-index: 1;
		}
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		margin-top: 26px;
		font-size: 14px;
	}
	.count {
		font-size: 12.5px;
		color: var(--text-4);
		font-variant-numeric: tabular-nums;
	}

	@media (prefers-reduced-motion: reduce) {
		.polaroid,
		.tucking {
			transition: none;
			animation: none;
		}
	}
</style>
