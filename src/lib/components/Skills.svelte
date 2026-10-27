<script lang="ts">
	import { inView } from '$lib/inView';
	import Icon from './Icon.svelte';

	const groups = [
		{
			label: 'AI & vision',
			icon: 'spark',
			items: [
				{ name: 'LLM agents & RAG', note: 'production systems at XGen' },
				{ name: 'Claude / OpenAI APIs', note: 'tool use, streaming, evals' },
				{ name: 'Prompt & eval pipelines', note: 'automated output testing' },
				{ name: 'MCP & tool integrations', note: 'connecting models to systems' },
				{ name: 'Claude Code & agent workflows', note: 'building with coding agents' },
				{ name: 'Computer vision', note: 'YOLO, OpenCV, tracking' }
			]
		},
		{
			label: 'Frontend & mobile',
			icon: 'window',
			items: [
				{ name: 'React & Next', note: 'primary stack at XGen' },
				{ name: 'Svelte & SvelteKit', note: 'this site, Wisely' },
				{ name: 'TypeScript', note: 'across the stack' },
				{ name: 'Tailwind & motion', note: 'styling and animation' },
				{ name: 'Swift & SwiftUI', note: 'iPhone and Apple Watch' }
			]
		},
		{
			label: 'Backend & data',
			icon: 'db',
			items: [
				{ name: 'Node.js', note: 'APIs and services' },
				{ name: 'Python & Django', note: 'models and scraping' },
				{ name: 'Postgres & SQLite', note: 'with Drizzle' },
				{ name: 'Predictive analytics', note: 'D1 basketball models' },
				{ name: 'Sports analytics', note: 'college basketball' },
				{ name: 'AWS', note: '' }
			]
		},
		{
			label: 'Testing & code quality',
			icon: 'check',
			items: [
				{ name: 'Playwright', note: 'end-to-end tests' },
				{ name: 'Vitest', note: 'unit tests' },
				{ name: 'Type checking', note: 'TypeScript, svelte-check' },
				{ name: 'Drizzle schemas', note: 'typed schemas and migrations' },
				{ name: 'Verification pipelines', note: 'checks on agent-written code' }
			]
		},
		{
			label: 'Hardware & self-hosting',
			icon: 'cpu',
			items: [
				{ name: 'Raspberry Pi', note: '' },
				{ name: 'Circuits & wiring', note: '' },
				{ name: 'Bluetooth devices', note: '' },
				{ name: 'Custom PCs', note: '' },
				{ name: 'Self-hosting', note: '' }
			]
		},
		{
			label: 'Beyond the code',
			icon: 'people',
			items: [
				{ name: 'Integrations architecture', note: 'client data pipelines at XGen' },
				{ name: 'Team leadership', note: 'dev to director in five years' },
				{ name: 'Enterprise delivery', note: '' }
			]
		}
	];

	let wrapEl: HTMLElement | undefined = $state();
	let shown = $state(false);
	// only collapse-before-animate once JS is running; no-JS/hydration-fail shows it open
	let armed = $state(false);
	// group under the pointer: its layer lifts and its row lights, the rest dim
	let hot = $state(-1);

	$effect(() => {
		if (!wrapEl) return;
		// reduced motion or no IO support → show everything immediately
		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			shown = true;
			return;
		}
		armed = true;
		// the stack pulls apart each time it scrolls in
		return inView(
			wrapEl,
			() => (shown = true),
			() => (shown = false),
			0.3
		);
	});
</script>

<!-- the groups as layers of one stack that pull apart as it scrolls in; every layer is
     the same size, so no group outranks another -->
<div bind:this={wrapEl} class="wrap" class:anim-ready={armed} class:shown>
	<div class="scene-box" aria-hidden="true">
		<div class="scene">
			{#each groups as g, i}
				<div
					class="slab"
					class:hot={hot === i}
					class:dim={hot !== -1 && hot !== i}
					style="--z: {groups.length - 1 - i}; --mid: {(groups.length - 1) / 2}"
					onmouseenter={() => (hot = i)}
					onmouseleave={() => (hot = -1)}
					role="presentation"
				>
					<div class="edge"></div>
					<div class="face"><Icon name={g.icon} size={58} /></div>
				</div>
			{/each}
		</div>
	</div>
	<div class="rows">
		{#each groups as g, i}
			<div
				class="row"
				class:hot={hot === i}
				class:dim={hot !== -1 && hot !== i}
				style="--i: {i}"
				onmouseenter={() => (hot = i)}
				onmouseleave={() => (hot = -1)}
				role="presentation"
			>
				<h3
					class="silver text-[clamp(1.25rem,2vw,1.4rem)] leading-[1.1] font-semibold tracking-[-0.02em]"
				>
					{g.label}
				</h3>
				<ul class="chips">
					{#each g.items as s}
						<li class="chip" title={s.note || undefined}>{s.name}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</div>

<style>
	.wrap {
		display: grid;
		gap: 1.75rem;
		align-items: center;
	}
	@media (min-width: 768px) {
		.wrap {
			grid-template-columns: minmax(0, 420px) auto;
			justify-content: center;
			gap: 2.5rem;
		}
	}

	/* ---------- the stack ---------- */
	.scene-box {
		height: 560px;
		display: grid;
		place-items: center;
	}
	@media (max-width: 767px) {
		.scene-box {
			height: 460px;
			margin: -20px 0;
			transform: scale(0.72);
		}
	}
	.scene {
		position: relative;
		width: 210px;
		height: 210px;
		transform-style: preserve-3d;
		transform: rotateX(58deg) rotateZ(-42deg);
	}
	.slab {
		--gap: 62px;
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		transform: translateZ(calc((var(--z) - var(--mid)) * var(--gap)));
		transition:
			transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--z) * 70ms),
			opacity 0.4s;
	}
	@media (max-width: 767px) {
		.slab {
			--gap: 56px;
		}
	}
	/* collapsed until it scrolls in — only once JS has armed it */
	.anim-ready:not(.shown) .slab {
		--gap: 10px;
	}
	.slab.hot {
		transform: translateZ(calc((var(--z) - var(--mid)) * var(--gap) + 22px));
		transition-delay: 0s;
	}
	.slab.dim {
		opacity: 0.45;
	}
	.face,
	.edge {
		position: absolute;
		inset: 0;
		border-radius: 22px;
	}
	.face {
		display: grid;
		place-items: center;
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--accent) 22%, transparent),
				color-mix(in srgb, var(--accent-2) 6%, transparent) 60%,
				#18181bdd
			),
			#121214e6;
		border: 1px solid color-mix(in srgb, var(--accent-2) 25%, transparent);
		box-shadow:
			inset 0 0 0 1px #ffffff0a,
			0 0 40px -10px color-mix(in srgb, var(--accent) 40%, transparent);
		transition:
			border-color 0.4s,
			box-shadow 0.4s;
	}
	.hot .face {
		border-color: color-mix(in srgb, var(--accent-2) 80%, transparent);
		box-shadow:
			inset 0 0 0 1px #ffffff14,
			0 0 60px -6px color-mix(in srgb, var(--accent) 67%, transparent);
	}
	/* a second plate just below the face gives each layer some thickness */
	.edge {
		transform: translateZ(-9px);
		background: color-mix(in srgb, var(--accent) 13%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
	}

	/* ---------- the rows ---------- */
	.rows {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.row {
		padding: 16px 18px;
		border-radius: 14px;
		border: 1px solid transparent;
		transition:
			opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) calc(0.3s + var(--i) * 90ms),
			translate 0.7s cubic-bezier(0.16, 1, 0.3, 1) calc(0.3s + var(--i) * 90ms),
			background 0.3s,
			border-color 0.3s;
	}
	/* phones have no hover highlight, so the rows line up with the section label */
	@media (max-width: 767px) {
		.row {
			padding-inline: 0;
		}
	}
	.anim-ready:not(.shown) .row {
		opacity: 0;
		translate: 24px 0;
	}
	.row.dim {
		opacity: 0.45;
		transition-delay: 0s;
	}
	.row.hot {
		background: #ffffff07;
		border-color: #ffffff12;
	}
	.chips {
		margin-top: 10px;
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}
	.chip {
		font-size: 14px;
		font-weight: 500;
		padding: 6px 12px;
		border-radius: 999px;
		background: #ffffff0a;
		border: 1px solid #ffffff10;
		color: var(--text-2);
		transition:
			border-color 0.3s,
			color 0.3s;
	}
	.hot .chip {
		border-color: color-mix(in srgb, var(--accent-2) 27%, transparent);
		color: var(--text);
	}

	@media (prefers-reduced-motion: reduce) {
		.slab,
		.row {
			transition: none;
		}
	}
</style>
