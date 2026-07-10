<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const navLinks = [
		{ label: 'Work', href: '/#work' },
		{ label: 'Skills', href: '/#skills' },
		{ label: 'Projects', href: '/#projects' },
		{ label: 'About', href: '/#about' },
		{ label: 'Contact', href: '/#contact' }
	];

	let menuOpen = $state(false);
	let active = $state('');

	// highlight the section currently in the middle band of the viewport
	onMount(() => {
		if (typeof IntersectionObserver === 'undefined') return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) active = e.target.id;
			},
			{ rootMargin: '-40% 0px -55% 0px' }
		);
		for (const l of navLinks) {
			const el = document.getElementById(l.href.slice(2));
			if (el) io.observe(el);
		}
		return () => io.disconnect();
	});

	// no page scroll behind the mobile menu
	$effect(() => {
		document.documentElement.classList.toggle('overflow-hidden', menuOpen);
		return () => document.documentElement.classList.remove('overflow-hidden');
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>David Simmerman — Software Engineer</title>
	<meta
		name="description"
		content="Software engineer in Tampa, FL. AI platforms, basketball analytics, and one animatronic fish."
	/>
</svelte:head>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<div class="grain pointer-events-none fixed inset-0 z-50" aria-hidden="true"></div>

<nav
	class="sticky top-0 z-40 border-b border-white/[0.06] backdrop-blur-xl"
	style="background: color-mix(in srgb, var(--bg) 65%, transparent)"
>
	<div
		class="relative flex items-center justify-between px-6 py-3.5 text-[12px] md:justify-center md:gap-9"
	>
		<a href="/" class="font-semibold tracking-tight">David Simmerman</a>
		{#each navLinks as l}
			<a
				href={l.href}
				class="nav-link hidden md:inline"
				class:is-active={active === l.href.slice(2)}
			>
				{l.label}
			</a>
		{/each}
		<a href="/resume.pdf" class="cta hidden font-semibold md:inline">Resume</a>
		<button
			class="burger -mr-2 md:hidden"
			aria-expanded={menuOpen}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<span></span>
			<span></span>
		</button>
	</div>
	<div class="scroll-progress" aria-hidden="true"></div>
</nav>

{#if menuOpen}
	<div
		class="m-overlay fixed inset-0 z-30 flex flex-col justify-center px-8 md:hidden"
		transition:fade={{ duration: 180 }}
	>
		{#each [...navLinks, { label: 'Resume', href: '/resume.pdf' }] as l, i}
			<a href={l.href} class="m-link" style="--i: {i}" onclick={() => (menuOpen = false)}>
				{l.label}
			</a>
		{/each}
	</div>
{/if}

{@render children()}

<footer class="px-8 pb-10 md:px-16">
	<p class="text-[12px] text-[color:var(--text-4)]">
		Tampa, FL. Programming since the Minecraft server, 2012. © {new Date().getFullYear()} David Simmerman.
	</p>
</footer>

<style>
	.nav-link {
		color: var(--text-2);
		transition: color 0.25s;
	}
	.nav-link:hover {
		color: var(--text);
	}
	.nav-link.is-active {
		color: var(--text);
	}
	/* a small accent tick under the active section's link */
	.nav-link {
		position: relative;
	}
	.nav-link::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -6px;
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--accent);
		translate: -50% 0;
		opacity: 0;
		transition: opacity 0.25s;
	}
	.nav-link.is-active::after {
		opacity: 1;
	}

	/* reading-progress hairline (scroll-driven; simply absent elsewhere) */
	.scroll-progress {
		position: absolute;
		inset: auto 0 -1px 0;
		height: 1px;
		background: linear-gradient(90deg, var(--accent), #64d2ff);
		transform-origin: left;
		transform: scaleX(0);
	}
	@supports (animation-timeline: scroll()) {
		.scroll-progress {
			animation: progress-grow linear both;
			animation-timeline: scroll();
		}
	}
	@keyframes progress-grow {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	/* hamburger — two lines that fold into an X */
	.burger {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 10px 8px;
		cursor: pointer;
	}
	@media (min-width: 768px) {
		.burger {
			/* component display:flex would beat the md:hidden utility */
			display: none;
		}
	}
	.burger span {
		width: 18px;
		height: 1.5px;
		background: var(--text);
		transition:
			rotate 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			translate 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.burger[aria-expanded='true'] span:first-child {
		translate: 0 3.25px;
		rotate: 45deg;
	}
	.burger[aria-expanded='true'] span:last-child {
		translate: 0 -3.25px;
		rotate: -45deg;
	}

	/* mobile menu — frosted, links rise in with a stagger */
	.m-overlay {
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
	}
	.m-link {
		padding: 0.55rem 0;
		font-size: 2.4rem;
		font-weight: 600;
		letter-spacing: -0.03em;
		opacity: 0;
		translate: 0 18px;
		animation: m-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(var(--i, 0) * 55ms);
	}
	@keyframes m-in {
		to {
			opacity: 1;
			translate: 0 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.m-link {
			animation-duration: 0.01s;
			animation-delay: 0s;
		}
	}
</style>
