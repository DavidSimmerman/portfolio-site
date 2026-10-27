import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// sandbox: serve through the Cloudflare tunnel (Vite host-check + HMR over wss:443)
	server: {
		host: true,
		port: 5182,
		strictPort: true,
		allowedHosts: ['.simmerman.cc'],
		hmr: { protocol: 'wss', clientPort: 443 }
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-node: production runs `node build` behind the tunnel at portfolio.simmerman.cc.
			// The live server reads build/ on demand, so rebuilding it underneath breaks every page;
			// tests and scratch builds set ADAPTER_OUT to build somewhere else.
			adapter: adapter({ out: process.env.ADAPTER_OUT ?? 'build' })
		})
	]
});
