import { defineConfig } from '@playwright/test';

export default defineConfig({
	// builds to its own folder: build/ belongs to the live server (see vite.config.ts)
	webServer: {
		command: 'ADAPTER_OUT=.svelte-kit/e2e-build npm run build && npm run preview',
		port: 4173
	},
	testMatch: '**/*.e2e.{ts,js}'
});
