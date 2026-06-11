<script lang="ts">
	import SpecLine from '$lib/components/SpecLine.svelte';
	import ProjectRow from '$lib/components/ProjectRow.svelte';

	const moreProjects = [
		{
			name: 'Discovery',
			desc: 'Spotify shuffle you control',
			year: '2025',
			href: 'https://discovery.simmerman.tech'
		},
		{
			name: 'Movie SZN',
			desc: 'movie reviews with friends',
			year: '2024',
			href: 'https://movie-szn.simmerman.tech'
		},
		{
			name: 'Singing fish',
			desc: 'Billy Bass + Raspberry Pi + choreography',
			year: '2023',
			href: 'https://github.com/DavidSimmerman/singing-fish'
		},
		{
			name: 'Health dashboard',
			desc: 'every metric, one place, AI watching trends',
			year: '2025',
			href: 'https://github.com/DavidSimmerman/health-dashboard'
		},
		{
			name: 'Coupon clipper',
			desc: 'built for mom, now configurable for any store',
			year: '2024',
			href: 'https://github.com/DavidSimmerman/publix-cupon-clipper'
		},
		{
			name: 'Giddey',
			desc: 'NBA puzzle game from a weekend bet',
			year: '2024',
			href: 'https://giddey.simmerman.tech'
		}
	];
</script>

<!-- ====== hero ====== -->
<section class="px-8 pt-28 pb-24 md:px-16">
	<h1
		class="max-w-5xl text-[clamp(3.4rem,9vw,7.5rem)] leading-[0.98] font-semibold tracking-[-0.035em]"
	>
		<span class="rise block" style="--d: 0">David</span>
		<span class="rise block" style="--d: 1">Simmerman</span>
	</h1>
	<p
		class="rise mt-8 max-w-xl text-[clamp(1.3rem,2.6vw,1.9rem)] leading-[1.25] font-medium text-[color:var(--text-3)]"
		style="--d: 2"
	>
		Software engineer. I make complicated things feel
		<span style="color: var(--accent)">simple</span> — AI platforms, basketball analytics, and one animatronic
		fish.
	</p>
	<div class="rise mt-10 flex items-center gap-7 text-[15px]" style="--d: 3">
		<a href="/#work" class="cta">See the work ›</a>
		<a href="/#contact" class="cta">Get in touch ›</a>
	</div>
</section>

<!-- ====== Wisely ====== -->
<section
	id="work"
	class="mx-4 mb-5 rounded-[28px] px-8 py-16 md:mx-6 md:px-14"
	style="background: var(--bg-elev)"
>
	<SpecLine label="Now" detail="Wisely Optimize · Basketball engineer" />
	<div class="mt-10 grid gap-12 md:grid-cols-[1.2fr_1fr]">
		<div class="reveal">
			<h2 class="text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
				The transfer portal, decoded.
			</h2>
			<p class="mt-6 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]">
				Division 1 staffs make million-dollar roster decisions every spring. I build the tools they
				do it with — roster construction that follows NBA front-office process, NIL valuation, and
				an AI agent that drives the whole platform. I also redesigned its frontend from the ground
				up.
			</p>
			<p class="mt-6">
				<a href="https://wiselyoptimize.com" target="_blank" rel="noopener" class="cta text-[15px]">
					wiselyoptimize.com ›
				</a>
			</p>
		</div>
		<div class="flex flex-col justify-center gap-1">
			{#each ['Houston', 'Ole Miss', 'Baylor'] as team, i}
				<p
					class="team reveal text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
					style="--vd: {i * 0.1}s"
				>
					{team}
				</p>
			{/each}
			<p class="reveal mt-3 text-[13px] text-[color:var(--text-3)]" style="--vd: 0.3s">
				run their roster on it.
			</p>
		</div>
	</div>
</section>

<!-- ====== CBB Composite ====== -->
<section id="projects" class="overflow-hidden py-20">
	<div class="grid items-center gap-10 px-8 md:grid-cols-[1fr_1.3fr] md:px-16">
		<div class="reveal">
			<SpecLine label="After hours" detail="cbbcomposite.com" />
			<h2
				class="mt-8 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
			>
				Every ranking system. One number.
			</h2>
			<p class="mt-6 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]">
				KenPom, EvanMiya, BartTorvik and the rest, consolidated into a single composite — plus
				bracket tools that 150 people a day sweat over every March.
			</p>
			<p class="mt-6">
				<a href="https://cbbcomposite.com" target="_blank" rel="noopener" class="cta text-[15px]">
					cbbcomposite.com ›
				</a>
			</p>
		</div>
		<div class="reveal shot-wrap md:-mr-24" style="--vd: 0.15s">
			<img
				src="/images/shot-cbb.png"
				alt="CBB Composite rankings table"
				class="shot"
				loading="lazy"
			/>
		</div>
	</div>
</section>

<!-- ====== Mile A Day ====== -->
<section
	class="mx-4 mb-5 overflow-hidden rounded-[28px] py-16 md:mx-6"
	style="background: var(--bg-elev)"
>
	<div class="grid items-center gap-10 px-8 md:grid-cols-[1.3fr_1fr] md:px-14">
		<div class="reveal shot-wrap order-2 md:order-1 md:-ml-24" style="--vd: 0.15s">
			<img src="/images/shot-mileaday.png" alt="Mile A Day website" class="shot" loading="lazy" />
		</div>
		<div class="reveal order-1 md:order-2">
			<SpecLine label="After hours" detail="iOS · App Store" />
			<h2
				class="mt-8 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
			>
				A mile. Every day.
			</h2>
			<p class="mt-6 max-w-md text-[16px] leading-[1.55] text-[color:var(--text-2)]">
				A running app built with a friend that keeps 50-plus runners on streak daily — challenges,
				competitions, and just enough guilt.
			</p>
			<p class="mt-6">
				<a href="https://mileaday.run" target="_blank" rel="noopener" class="cta text-[15px]">
					mileaday.run ›
				</a>
			</p>
		</div>
	</div>
</section>

<!-- ====== XGen ====== -->
<section class="px-8 py-20 md:px-16">
	<SpecLine label="2020–2026" detail="XGen AI → acquired by Zoovu" />
	<h2
		class="reveal mt-8 max-w-3xl text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em]"
	>
		Enterprise AI, minus the PhD.
	</h2>
	<p class="reveal mt-6 max-w-xl text-[16px] leading-[1.55] text-[color:var(--text-2)]">
		From integrations developer to director — ending with a four-person team building a composable
		AI platform non-technical people could actually use, and a 30% cut to the AWS bill along the
		way. Shipped for:
	</p>
	<p
		class="reveal mt-10 max-w-4xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.25] font-semibold tracking-[-0.025em] text-[#48484d]"
	>
		{#each ['Gucci', 'Sonos', 'Valentino', 'Armani', 'Coach'] as brand, i}<span class="brand"
				>{brand}</span
			>{#if i < 4}<span class="mx-3 text-[#2c2c2e]">·</span>{/if}{/each}
	</p>
</section>

<!-- ====== off the clock ====== -->
<section id="about" class="relative mx-4 mb-5 overflow-hidden rounded-[28px] md:mx-6">
	<img
		src="/images/hike-wide.png"
		alt="David and Posey on a mountain summit"
		class="parallax h-[62vh] w-full object-cover"
		loading="lazy"
	/>
	<div class="scrim absolute inset-0 flex flex-col justify-end p-10 md:p-14">
		<div class="max-w-xs">
			<SpecLine label="Off the clock" />
		</div>
		<p
			class="reveal mt-4 max-w-lg text-[clamp(1.4rem,3vw,2.2rem)] leading-[1.2] font-semibold tracking-[-0.02em]"
			style="--vd: 0.1s"
		>
			College hoops, smoked brisket, and Posey — who was demoted to silver retriever for refusing to
			return the ball.
		</p>
	</div>
</section>

<!-- ====== more projects ====== -->
<section class="px-8 py-16 md:px-16">
	<SpecLine label="Also built" />
	<div class="mt-6">
		{#each moreProjects as p}
			<ProjectRow {...p} />
		{/each}
	</div>
</section>

<!-- ====== closer ====== -->
<section id="contact" class="px-8 pt-16 pb-14 md:px-16">
	<h2
		class="reveal max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
	>
		Let's build something.
	</h2>
	<div class="reveal mt-7 flex items-center gap-8 text-[15px]" style="--vd: 0.1s">
		<a href="mailto:david@simmerman.tech" class="cta">david@simmerman.tech ›</a>
		<a href="https://github.com/DavidSimmerman" target="_blank" rel="noopener" class="cta">
			GitHub ›
		</a>
		<a
			href="https://www.linkedin.com/in/david-simmerman"
			target="_blank"
			rel="noopener"
			class="cta"
		>
			LinkedIn ›
		</a>
	</div>
</section>

<style>
	.team {
		color: #58585d;
		transition: color 0.3s;
		cursor: default;
	}
	.team:hover {
		color: var(--accent);
	}
	.brand {
		transition: color 0.3s;
		cursor: default;
	}
	.brand:hover {
		color: var(--text);
	}
	.shot-wrap {
		perspective: 1200px;
	}
	.shot {
		border-radius: 14px;
		border: 1px solid #ffffff14;
		box-shadow: 0 30px 80px #000000a0;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.shot-wrap:hover .shot {
		transform: scale(1.015);
	}
	.scrim {
		background: linear-gradient(to top, #08080ae6 0%, #08080a40 40%, transparent 65%);
	}
</style>
