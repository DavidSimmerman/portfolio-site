// Plays an entrance each time its element comes back: `onEnter` fires once `threshold` of it is on
// screen, `onLeave` once it's fully off screen, so the reset never happens where you can see it.
// With `enterLine` (a fraction of the screen height, e.g. 0.2) it instead enters once its top has
// scrolled that far up from the bottom edge — later, so a slow scroll still sees it play.
// Returns a cleanup. Without IntersectionObserver it just calls onEnter.
export function inView(
	node: Element,
	onEnter: () => void,
	onLeave: () => void,
	threshold = 0.3,
	enterLine?: number
): () => void {
	if (typeof IntersectionObserver === 'undefined') {
		onEnter();
		return () => {};
	}
	let shown = false;
	if (enterLine !== undefined) {
		const enter = new IntersectionObserver(
			(entries) => {
				if (!shown && entries[entries.length - 1].isIntersecting) {
					shown = true;
					onEnter();
				}
			},
			{ rootMargin: `0px 0px ${-enterLine * 100}% 0px` }
		);
		const leave = new IntersectionObserver((entries) => {
			if (shown && !entries[entries.length - 1].isIntersecting) {
				shown = false;
				onLeave();
			}
		});
		enter.observe(node);
		leave.observe(node);
		return () => {
			enter.disconnect();
			leave.disconnect();
		};
	}
	const io = new IntersectionObserver(
		(entries) => {
			const e = entries[entries.length - 1];
			if (!shown && e.isIntersecting && e.intersectionRatio >= threshold) {
				shown = true;
				onEnter();
			} else if (shown && !e.isIntersecting) {
				shown = false;
				onLeave();
			}
		},
		{ threshold: [0, threshold] }
	);
	io.observe(node);
	return () => io.disconnect();
}
