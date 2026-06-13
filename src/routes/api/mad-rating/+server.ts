import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const APP_ID = '6746970905';

type Review = { rating: number; title: string; author: string; content: string };

// Proxies the App Store rating + written reviews for Mile A Day. Apple's APIs
// have a flaky CORS cache (they echo whichever Origin they cached first), so
// the browser can't call them directly — we do it server-side.
export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	// Apple's reviews RSS only returns entries for a browser-like User-Agent;
	// undici's default UA (used by server fetch) gets an empty feed.
	const ua =
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
	const [lookupRes, reviewsRes] = await Promise.all([
		fetch(`https://itunes.apple.com/lookup?id=${APP_ID}`),
		// the global (no-country) feed surfaces reviews the US feed sometimes omits
		fetch(`https://itunes.apple.com/rss/customerreviews/id=${APP_ID}/json`, {
			headers: { 'User-Agent': ua }
		})
	]);

	const app = lookupRes.ok ? (await lookupRes.json())?.results?.[0] : null;

	let reviews: Review[] = [];
	if (reviewsRes.ok) {
		const feed = (await reviewsRes.json())?.feed?.entry;
		const entries = Array.isArray(feed) ? feed : feed ? [feed] : [];
		reviews = entries
			.filter((e: Record<string, any>) => e['im:rating'])
			.map((e: Record<string, any>) => ({
				rating: Number(e['im:rating'].label) || 0,
				title: e.title?.label ?? '',
				author: e.author?.name?.label ?? '',
				content: e.content?.label ?? ''
			}));
	}

	setHeaders({ 'cache-control': 'public, max-age=3600' });
	return json({
		stars: app?.averageUserRating ?? null,
		ratingCount: app?.userRatingCount ?? null,
		reviews
	});
};
