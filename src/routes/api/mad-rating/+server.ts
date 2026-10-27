import { json } from '@sveltejs/kit';
import { getMadRating } from '$lib/server/madRating';
import type { RequestHandler } from './$types';

// Proxies the App Store rating + written reviews for Mile A Day. Apple's APIs
// have a flaky CORS cache (they echo whichever Origin they cached first), so
// the browser can't call them directly — we do it server-side.
export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=3600' });
	return json(await getMadRating());
};
