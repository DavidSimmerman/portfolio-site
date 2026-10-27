# Deploying to Coolify behind a Cloudflare tunnel

Five steps. Do them in order; each one is finished before the next begins.

1. Create the application in Coolify
2. Set the environment variable
3. Deploy and check the PDF
4. Point a Cloudflare tunnel at it
5. Make the hostname public in Cloudflare Access

There is no database and nothing to seed. Mile A Day numbers and App Store reviews are
fetched live by the server and cached in memory.

---

## 1. Create the application

In Coolify: **Project → New Resource → Application → Public Repository**, pointed at:

```
https://github.com/DavidSimmerman/portfolio-site
```

- **Branch**: `main`
- **Build Pack**: `Dockerfile`
- **Port**: `3000`

The `Dockerfile` is in the repo root; Coolify finds it without configuration. The image is
Debian-based and carries a headless Chromium, so the first build takes a few minutes.

## 2. Set the environment variable

Under the application's **Environment Variables**:

| Variable | Value |
|---|---|
| `ORIGIN` | `https://simmerman.tech` |

Scheme included, no trailing slash. It has to equal the hostname in step 4.

Do **not** set `PORT`. The Dockerfile sets it to `3000`, and `/resume.pdf` prints the
resume page from `http://127.0.0.1:$PORT` inside the container, so it must stay the port
the server listens on.

## 3. Deploy

Hit **Deploy** and watch the logs. The container is up when it prints:

```
Listening on http://0.0.0.0:3000
```

Then open `/resume.pdf` once. The first request takes about a second while Chromium prints
the page; after that the same PDF is served for an hour. If the print fails, the log shows
`resume.pdf: print failed` with the reason, and the request returns a 503.

## 4. Point the Cloudflare tunnel at it

In **Cloudflare Zero Trust → Networks → Tunnels**, use your existing tunnel or create one.
Add a public hostname:

| Field | Value |
|---|---|
| Subdomain | leave blank (the site lives at the bare domain) |
| Domain | `simmerman.tech` |
| Service type | `HTTP` |
| URL | the app's internal address, e.g. `http://portfolio-site:3000` |

Use the container name and internal port. The app never needs a published port on the
host, and nothing has to be opened on your router.

If `cloudflared` runs on the host rather than inside Coolify's network, point it at
`http://localhost:<the port Coolify published>` instead; Coolify shows that port on the
application page.

## 5. Make it public in Cloudflare Access

If your account has an Access application that covers every hostname, the site will ask
visitors to log in. In **Zero Trust → Access → Applications**, add a self-hosted
application for `simmerman.tech` with one policy: **Action: Bypass**, **Include:
Everyone**.

Check it from a private window: the home page should load with no login screen.

---

## Notes

**Updating.** Push to `main`. If you enabled automatic deployments Coolify redeploys on its
own; otherwise hit Deploy.

**Scaling.** Run one instance. Each container keeps its own hour-long PDF and API caches;
two would just do the work twice.
