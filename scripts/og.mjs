// Link-preview image: the hero's name over its horizon line and sunrise, played as the homepage
// entrance. Writes static/images/og.gif (animated, for Discord/Slack/Telegram) and og.png (the
// finished frame). `node scripts/og.mjs`
//
// Many apps (iMessage, X, LinkedIn) show only a GIF's first frame, so the loop starts on the
// finished card: hold, fade out, entrance, back to the hold.
import { chromium } from '@playwright/test';
import gifenc from 'gifenc';
const { GIFEncoder, quantize, applyPalette } = gifenc;
import { readFileSync, writeFileSync } from 'node:fs';

const W = 1200;
const H = 630;
const FPS = 25;
const HOLD_MS = 3000;
const FADE_MS = 400;
const ENTRANCE_MS = 3400; // sunrise ends at 0.9s + 2.4s

const font = (w) =>
	`url(data:font/woff2;base64,${readFileSync(`static/fonts/switzer-${w}.woff2`).toString('base64')})`;

// same values as the hero in +page.svelte and layout.css
const html = `<!doctype html><html><head><style>
@font-face { font-family: Switzer; font-weight: 600; src: ${font(600)} format('woff2'); }
html, body { margin: 0; width: ${W}px; height: ${H}px; background: #08080a; overflow: hidden; }
.card { position: relative; width: 100%; height: 100%; isolation: isolate; }
h1 {
	position: absolute; left: 0; right: 0; top: 218px; margin: 0; text-align: center;
	font: 600 128px/1 Switzer, sans-serif; letter-spacing: -0.035em;
}
.silver {
	background: linear-gradient(180deg, #ffffff 15%, #a1a1a6 100%);
	-webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
	padding-bottom: 0.12em;
}
.rise { display: inline-block; animation: line-in 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
.horizon {
	position: absolute; left: 4%; right: 4%; top: 420px; z-index: -1; height: 2px;
	background: linear-gradient(90deg, transparent, #0a84ff 22%, #64d2ff 50%, #0a84ff 78%, transparent);
	transform: scaleX(0);
	animation: horizon-draw 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;
}
.sunrise {
	position: absolute; left: 0; right: 0; top: 0; height: 420px; z-index: -1;
	background: radial-gradient(62% 100% at 50% 100%,
		rgba(100, 210, 255, 0.16) 0%, rgba(10, 132, 255, 0.11) 35%, transparent 72%);
	transform-origin: 50% 100%; opacity: 0; transform: scale(0.3, 0.35);
	animation: sunrise 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards;
}
@keyframes line-in {
	from { opacity: 0; transform: translateY(40px); clip-path: inset(0 0 100% 0); }
	to { opacity: 1; transform: translateY(0); clip-path: inset(-10% 0 -10% 0); }
}
@keyframes horizon-draw { to { transform: scaleX(1); } }
@keyframes sunrise { to { opacity: 1; transform: none; } }
</style></head><body><div class="card">
	<h1><span class="rise"><span class="silver">David Simmerman</span></span></h1>
	<div class="horizon"></div><div class="sunrise"></div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));

const seek = (ms) =>
	page.evaluate((t) => document.getAnimations().forEach((a) => (a.currentTime = t)), ms);
const grab = async () => {
	const buf = await page.screenshot({ type: 'png' });
	const img = await page.evaluate(async (b64) => {
		const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
		const c = new OffscreenCanvas(bmp.width, bmp.height);
		const ctx = c.getContext('2d');
		ctx.drawImage(bmp, 0, 0);
		// raw pixels back as base64: a plain array of 3M numbers takes seconds per frame to cross
		const blob = new Blob([ctx.getImageData(0, 0, bmp.width, bmp.height).data]);
		const url = await new Promise((r) => {
			const fr = new FileReader();
			fr.onload = () => r(fr.result);
			fr.readAsDataURL(blob);
		});
		return url.slice(url.indexOf(',') + 1);
	}, buf.toString('base64'));
	return { png: buf, rgba: new Uint8ClampedArray(Buffer.from(img, 'base64')) };
};

const step = 1000 / FPS;
const entrance = [];
for (let t = 0; t <= ENTRANCE_MS; t += step) {
	await seek(t);
	entrance.push(await grab());
}
const done = entrance.at(-1);
writeFileSync('static/images/og.png', done.png);

// one palette for every frame, so colors don't flicker. Built from the whole entrance, not just
// the finished card: the half-drawn line and young glow are dimmer blues that card doesn't have.
const sample = entrance.filter((_, i) => i % 6 === 0).concat(done);
const all = new Uint8ClampedArray(sample.length * done.rgba.length);
sample.forEach((f, i) => all.set(f.rgba, i * done.rgba.length));
const palette = quantize(all, 256);

// 4x4 ordered dither: smooths the glow's gradient without the frame-to-frame crawl of error diffusion
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const dither = (rgba, k = 1) => {
	const out = new Uint8ClampedArray(rgba.length);
	for (let i = 0; i < rgba.length; i += 4) {
		const p = i >> 2;
		const d = (BAYER[((p / W) & 3) * 4 + ((p % W) & 3)] / 16 - 0.5) * 6;
		// k < 1 fades toward the page background, #08080a
		out[i] = 8 + (rgba[i] - 8) * k + d;
		out[i + 1] = 8 + (rgba[i + 1] - 8) * k + d;
		out[i + 2] = 10 + (rgba[i + 2] - 10) * k + d;
		out[i + 3] = 255;
	}
	return out;
};

const gif = GIFEncoder();
const write = (rgba, delay) =>
	gif.writeFrame(applyPalette(rgba, palette), W, H, { palette, delay, repeat: 0 });

write(dither(done.rgba), HOLD_MS);
for (let t = step; t <= FADE_MS; t += step) write(dither(done.rgba, 1 - t / FADE_MS), step);
for (const f of entrance.slice(1, -1)) write(dither(f.rgba), step);
gif.finish();
writeFileSync('static/images/og.gif', gif.bytes());

await browser.close();
console.log(
	`og.gif ${(gif.bytes().length / 1024).toFixed(0)} KB, ${entrance.length} entrance frames`
);
