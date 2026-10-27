<script lang="ts">
	// Bid War's 1v1 intro, ported from bidwar/src/lib/SplitBackground.svelte (count = 2):
	// the two players' halves slam together on the diagonal, flash, shake, then settle into
	// the dark tilted split the game is played on. Every piece is a slice of the same conic as
	// the resting state, so the settled frame matches it exactly. The BID WAR wordmark (the app's
	// Archivo 900 italic) slams down at the moment of impact and stays as the logo. Click to replay.
	let run = $state(0);
</script>

<button type="button" class="vs" onclick={() => run++} aria-label="Replay the Bid War 1v1 intro">
	{#key run}
		<!-- first play waits for the accordion panel to finish opening -->
		<span class="stage" style="--d: {run ? 0 : 0.35}s">
			<span class="resting"></span>
			<span class="half l"></span>
			<span class="half r"></span>
			<span class="flash"></span>
			<span class="mark">BID WAR</span>
		</span>
	{/key}
	<span class="tag" aria-hidden="true">↻ Replay</span>
</button>

<style>
	.vs {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: #0b0b12;
		cursor: pointer;
		overflow: hidden;
		container-type: inline-size;
		--c0: #5b8cff;
		--c1: #ff5f4d;
		--t0: color-mix(in srgb, var(--c0) 26%, #0b0b12);
		--t1: color-mix(in srgb, var(--c1) 26%, #0b0b12);
	}
	.vs:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}
	.stage {
		position: absolute;
		inset: -8%; /* overscan → the shake never reveals an edge */
		animation: shake 1.15s var(--d) both;
	}
	.stage > span {
		position: absolute;
		inset: 0;
	}
	/* stays black until the halves cover the box, then snaps solid underneath them */
	.resting {
		background: conic-gradient(from 25deg, var(--t1) 0 180deg, var(--t0) 180deg 360deg);
		animation: restIn 1.2s var(--d) both;
	}
	.l {
		background: conic-gradient(from 25deg, transparent 0 180deg, var(--c0) 180deg 360deg);
		animation:
			inL 0.5s cubic-bezier(0.2, 0.9, 0.3, 1) var(--d) both,
			fadeOutLate 1.2s var(--d) both;
	}
	.r {
		background: conic-gradient(from 25deg, var(--c1) 0 180deg, transparent 180deg 360deg);
		animation:
			inR 0.5s cubic-bezier(0.2, 0.9, 0.3, 1) var(--d) both,
			fadeOutLate 1.2s var(--d) both;
	}
	.flash {
		background: #fff;
		animation: flash 1.15s var(--d) both;
	}
	/* lands with the flash (~0.5s in): drops from oversized, overshoots small, settles */
	.mark {
		display: grid;
		place-items: center;
		color: #fff;
		font-family: 'Archivo', 'Switzer', ui-sans-serif, system-ui, sans-serif;
		font-size: 15cqw;
		font-style: italic;
		font-weight: 900;
		letter-spacing: -0.01em;
		text-shadow: 0 4px 22px rgba(0, 0, 0, 0.35);
		animation: markIn 0.5s cubic-bezier(0.2, 0.9, 0.2, 1.2) calc(var(--d) + 0.38s) both;
	}
	.tag {
		position: absolute;
		right: 0.6rem;
		bottom: 0.6rem;
		padding: 0.3rem 0.55rem;
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.45);
		color: #fff;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.75;
		transition: opacity 0.2s;
	}
	.vs:hover .tag {
		opacity: 1;
	}

	@keyframes inL {
		from {
			transform: translateX(-130%);
		}
		to {
			transform: translateX(0);
		}
	}
	@keyframes inR {
		from {
			transform: translateX(130%);
		}
		to {
			transform: translateX(0);
		}
	}
	@keyframes flash {
		0%,
		40% {
			opacity: 0;
		}
		48% {
			opacity: 0.5;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes shake {
		0%,
		40% {
			transform: translate(0, 0);
		}
		46% {
			transform: translate(-6px, 3px);
		}
		52% {
			transform: translate(6px, -3px);
		}
		60% {
			transform: translate(-3px, 2px);
		}
		68%,
		100% {
			transform: translate(0, 0);
		}
	}
	@keyframes markIn {
		0% {
			transform: scale(1.9);
			opacity: 0;
		}
		45% {
			transform: scale(0.94);
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes restIn {
		0%,
		44% {
			opacity: 0;
		}
		56%,
		100% {
			opacity: 1;
		}
	}
	@keyframes fadeOutLate {
		0%,
		74% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	/* reduced motion: just the settled split, nothing to replay */
	@media (prefers-reduced-motion: reduce) {
		.stage,
		.resting,
		.mark {
			animation: none;
		}
		.half,
		.flash,
		.tag {
			display: none;
		}
		.vs {
			cursor: default;
		}
	}
</style>
