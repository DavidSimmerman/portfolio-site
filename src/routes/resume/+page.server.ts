import { getMadLive, getMadRating } from '$lib/server/madRating';
import type { PageServerLoad } from './$types';

// Mile A Day's runner count and App Store rating are live, so the resume (and the PDF printed
// from it) never goes stale. Slower than 3 s or failed → the page falls back to last-known values.
const within = <T>(p: Promise<T>) =>
	Promise.race([p.catch(() => null), new Promise<null>((r) => setTimeout(() => r(null), 3000))]);

export const load: PageServerLoad = async () => {
	const [rating, live] = await Promise.all([within(getMadRating()), within(getMadLive())]);
	return { madStars: rating?.stars ?? null, madUsers: live?.users ?? null };
};
