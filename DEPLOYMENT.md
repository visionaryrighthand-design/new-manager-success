# Deploying the website

The web app is **not at the repository root** — it lives at `apps/web`, and it
depends on three workspace packages (`@nms/brand`, `@nms/content`, `@nms/core`)
that must be compiled before Next.js builds.

Two settings have to be right. Getting either wrong produces the same
symptom — a 404 on every URL, with a build that **succeeds**, which is what
makes it confusing.

---

## Required settings

**Settings → Build and Deployment**

| Setting | Value |
|---|---|
| **Framework Preset** | **Next.js** |
| Root Directory | `apps/web` |
| Include files outside the root directory | Enabled |
| All Override toggles | Off |

Then **Deployments → ⋯ → Redeploy**, with **"Use existing Build Cache"
unchecked** on the first run after a change.

### Changing settings does not trigger a build

This trips people repeatedly. **"Skip deployments when there are no changes to
the root directory or its dependencies"** is Enabled by default. With Root
Directory set to `apps/web`, a commit that only touches `README.md`,
`DEPLOYMENT.md`, or a root-level config file is **skipped** — no new deployment
is produced, and production keeps serving the old broken build no matter how
many times you push.

So after changing any project setting, you must **Redeploy explicitly from the
dashboard**. Do not wait for a push to do it.

### The "Configuration Settings … differ" warning

That yellow banner means the live production deployment was built with
different settings than the project now has — it is a record of the *old*
build, not a description of the new one. It clears on the next successful
deployment. Expand **Production Overrides** to see what the live build actually
used; if it lists an `outputDirectory`, that deployment predates this fix.

---

## Why "Other" produces a 404

This was the actual cause here, and it is worth understanding because nothing
about it looks like an error.

With Framework Preset set to **Other**, Vercel does not run the Next.js runtime.
Its Output Directory default becomes *"`public` if it exists, or `.`"* — so it
runs the build, discards the `.next` output, and publishes `apps/web/public` as
a flat static site.

That folder contains only `favicon.svg`, `og-image.png`, and `app-icon.svg`.
There is no `index.html`, so `/` returns `NOT_FOUND` — and the build log shows
a clean success, because from Vercel's point of view nothing went wrong.

Setting the preset to **Next.js** is the fix. `apps/web/vercel.json` also pins
`"framework": "nextjs"` and the build command, which override the dashboard on
the next deployment — but setting the dropdown makes Project Settings and the
deployment agree, which clears the "Configuration Settings … differ" warning.

There is deliberately **no `vercel.json` at the repository root**. One existed
briefly and was removed: with Root Directory set to `apps/web`, Vercel reads
`apps/web/vercel.json` and ignores the root one, so a root file can only ever
be stale — and its `outputDirectory` was exactly the kind of override that
gets baked into a deployment and then disagrees with Project Settings.

## Why the Root Directory matters

Vercel builds from the repository root by default. There is no Next.js app
there, so it finds nothing to deploy. `apps/web` is where the app lives; the
"include files outside" toggle is what lets the build reach the lockfile and the
shared packages above it.

---

## Checking a deployment properly

**Use the production URL, not an old preview link.** URLs like
`new-manager-success-i333q0oqj-justin-richardson.vercel.app` are pinned to one
specific deployment and are immutable. If that deployment was built before the
fix, it will return 404 forever, no matter how many times you redeploy.

After redeploying, open the deployment from the Vercel dashboard, or use the
project's main domain.

A correct deployment serves `/`, `/learn`, `/learn/m1-r1`, `/enroll`, `/corner`,
`/curriculum`, and `/for-teams`.

---

## If it still 404s

Send the **build log** from the deployment. The useful parts:

1. Which directory the build ran in (first lines).
2. Whether `npm run build:packages` ran and succeeded.
3. Whether `next build` printed its route table — a successful build ends with a
   list including `/`, `/learn`, `/enroll`, `/corner`.
4. What Vercel reports as the output directory near the end.

Both build paths are verified working in this repository:

```bash
# Root Directory = apps/web  (the configuration above)
cd apps/web && npm run vercel-build

# Root Directory = repo root (fallback, uses the root vercel.json)
npm install && npm run build:packages && npm run build --workspace=@nms/web
```

Both produce `apps/web/.next` containing `routes-manifest.json`, which is what
Vercel serves when the framework preset is Next.js.

---

## Running it locally instead

For a demo, this needs no Vercel at all:

```bash
npm install
npm run build:packages
npm run web            # → http://localhost:3000
```

That serves the identical build.
