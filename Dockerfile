# Two stages so the runtime image carries the build output and production deps only.
# Debian, not Alpine: /resume.pdf is printed by Playwright's Chromium, which has no musl build.
FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm prune --prod

FROM node:24-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
# Chromium for /resume.pdf, plus the system libraries and fonts it needs. Installed to a
# shared path as root so the unprivileged runtime user can launch it.
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN node node_modules/playwright/cli.js install --with-deps --only-shell chromium \
	&& rm -rf /var/lib/apt/lists/*
COPY --from=build /app/build ./build
# adapter-node listens here; Coolify maps its proxy to it. The PDF route prints the page
# from http://127.0.0.1:$PORT, so PORT must be the port the server actually listens on.
EXPOSE 3000
ENV PORT=3000 HOST=0.0.0.0
# Not root: nothing in here needs to write to the image.
USER node
CMD ["node", "build"]
