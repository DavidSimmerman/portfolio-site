<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const navLinks = [
		{ label: 'Work', href: '/#work' },
		{ label: 'Skills', href: '/#skills' },
		{ label: 'Projects', href: '/#projects' },
		{ label: 'About', href: '/#about' },
		{ label: 'Contact', href: '/#contact' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>David Simmerman — Software Engineer</title>
	<meta
		name="description"
		content="Software engineer in Tampa, FL. AI platforms, basketball analytics, and one animatronic fish."
	/>
</svelte:head>

<div class="grain pointer-events-none fixed inset-0 z-50" aria-hidden="true"></div>

<nav
	class="sticky top-0 z-40 flex items-center justify-center gap-9 border-b border-white/[0.06] py-3.5 text-[12px] backdrop-blur-xl"
	style="background: color-mix(in srgb, var(--bg) 65%, transparent)"
>
	<a href="/" class="font-semibold tracking-tight">David Simmerman</a>
	{#each navLinks as l}
		<a
			href={l.href}
			class="hidden text-[color:var(--text-2)] transition-colors hover:text-white md:inline"
		>
			{l.label}
		</a>
	{/each}
	<a href="/resume.pdf" class="cta font-semibold">Resume</a>
</nav>

{@render children()}

<footer class="px-8 pb-10 md:px-16">
	<p class="text-[12px] text-[color:var(--text-4)]">
		Tampa, FL. Programming since the Minecraft server, 2012. © {new Date().getFullYear()} David Simmerman.
	</p>
</footer>
