const APP_ID = '6746970905';

export type Review = { rating: number; title: string; author: string; content: string };
export type MadRating = { stars: number | null; ratingCount: number | null; reviews: Review[] };

// Apple's reviews RSS only returns entries for a browser-like User-Agent;
// undici's default UA (used by server fetch) gets an empty feed.
const UA =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function load(): Promise<MadRating> {
	const [lookupRes, reviewsRes] = await Promise.all([
		fetch(`https://itunes.apple.com/lookup?id=${APP_ID}`),
		// the global (no-country) feed surfaces reviews the US feed sometimes omits
		fetch(`https://itunes.apple.com/rss/customerreviews/id=${APP_ID}/json`, {
			headers: { 'User-Agent': UA }
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

	return {
		stars: app?.averageUserRating ?? null,
		ratingCount: app?.userRatingCount ?? null,
		reviews
	};
}

// one fetch to Apple per hour, shared by every page render and the API route
const TTL = 60 * 60 * 1000;
let cached: { at: number; value: Promise<MadRating> } | null = null;

export function getMadRating(): Promise<MadRating> {
	if (!cached || Date.now() - cached.at > TTL) {
		const value = load();
		cached = { at: Date.now(), value };
		// a failed fetch shouldn't stick for an hour
		value.catch(() => (cached = null));
	}
	return cached.value;
}

// Mile A Day's own live numbers (David's streak, runner count); refreshed every five minutes
export type MadLive = { streak: number | null; users: number | null };
const LIVE_TTL = 5 * 60 * 1000;
let liveCached: { at: number; value: Promise<MadLive> } | null = null;

async function loadLive(): Promise<MadLive> {
	const get = (url: string) =>
		fetch(url)
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null);
	const [s, u] = await Promise.all([
		get('https://mad.mindgoblin.tech/public/streak/dave'),
		get('https://mad.mindgoblin.tech/public/users')
	]);
	return { streak: s?.current_streak || null, users: u?.count || null };
}

export function getMadLive(): Promise<MadLive> {
	if (!liveCached || Date.now() - liveCached.at > LIVE_TTL) {
		const value = loadLive();
		liveCached = { at: Date.now(), value };
	}
	return liveCached.value;
}
