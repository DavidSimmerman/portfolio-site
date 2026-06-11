<script lang="ts">
	const photos = [
		{ src: '/images/posey-sunglasses.png', caption: 'Chief morale officer.' },
		{ src: '/images/posey-puppy.jpeg', caption: 'Day one.' },
		{ src: '/images/posey-mountain.png', caption: 'Summit crew, Appalachians.' },
		{ src: '/images/posey-snow.png', caption: 'First snow. Unbothered.' },
		{ src: '/images/posey-recliner.png', caption: "That's her chair now." },
		{ src: '/images/posey-couch.png', caption: 'Fetch training going great.' },
		{ src: '/images/posey-sit.png', caption: 'Waiting for the OK to eat the floor steak.' }
	];
</script>

<!-- Apple product-gallery pattern: horizontal scroll-snap strip -->
<div class="gallery -mx-8 flex gap-5 overflow-x-auto px-8 pb-4 md:-mx-16 md:px-16">
	{#each photos as p}
		<figure class="shrink-0 snap-center">
			<img
				src={p.src}
				alt={p.caption}
				class="h-72 w-auto rounded-2xl object-cover md:h-80"
				loading="lazy"
			/>
			<figcaption class="mt-2.5 text-[13px] text-[color:var(--text-3)]">{p.caption}</figcaption>
		</figure>
	{/each}
</div>

<style>
	.gallery {
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}
	.gallery::-webkit-scrollbar {
		display: none;
	}
</style>
