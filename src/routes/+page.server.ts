import { getMadLive, getMadRating } from '$lib/server/madRating';
import type { PageServerLoad } from './$types';

// Mile A Day's live numbers and App Store reviews are rendered into the page, not fetched after
// it loads: SvelteKit restores your scroll position on reload before any script runs, so blocks
// that appeared later pushed everything below them down and you landed in the wrong place.
// Never holds the page up for long — anything slower than 1.5 s is fetched by the browser instead.
const within = <T>(p: Promise<T>) =>
	Promise.race([p.catch(() => null), new Promise<null>((r) => setTimeout(() => r(null), 1500))]);

export const load: PageServerLoad = async () => {
	const [madRating, madLive] = await Promise.all([within(getMadRating()), within(getMadLive())]);
	return { madRating, madLive };
};
