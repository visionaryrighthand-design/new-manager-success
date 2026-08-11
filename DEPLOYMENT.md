# Deploying the website

The web app is **not at the repository root** — it lives at `apps/web`, and it
depends on three workspace packages (`@nms/brand`, `@nms/content`, `@nms/core`)
that must be compiled before Next.js builds.

That is the whole reason for a 404 on a fresh Vercel import: Vercel builds from
the root by default, finds no Next.js app there, deploys nothing, and every URL
returns `NOT_FOUND`. The build does not fail loudly — there is simply nothing to
serve.

---

## The fix (one setting, 30 seconds)

In the Vercel dashboard, on the project:

**Settings → Build and Deployment → Root Directory**

Set it to:

```
apps/web
```

Leave **"Include files outside of the root directory in the build step"**
switched **ON** — it is on by default, and it is required here, because the
lockfile and the shared packages live above `apps/web`.

Then **Deployments → ⋯ on the latest deployment → Redeploy**, with
"Use existing Build Cache" **unchecked** for the first run after the change.

That is it. Everything else is already in the repository:

- `apps/web/package.json` has a `vercel-build` script, which Vercel prefers over
  `build`. It compiles the three workspace packages first, then runs
  `next build`.
- `apps/web/vercel.json` pins the framework so detection cannot drift.

---

## If you cannot change the Root Directory

There is a fallback already committed: `vercel.json` at the repository root sets
`buildCommand` and `outputDirectory` to reach into `apps/web`. It only applies
when Root Directory is the repo root.

This path works but is the less-supported one for Next.js — Vercel's own
guidance for monorepos is the Root Directory setting above. Prefer that.

---

## Checking a deployment properly

**Use the production URL, not an old preview link.** URLs like
`new-manager-success-i333q0oqj-justin-richardson.vercel.app` are pinned to one
specific deployment and are immutable. If that deployment was built before the
fix, it will return 404 forever, no matter how many times you redeploy.

After redeploying, open the deployment from the Vercel dashboard, or use the
project's main domain.

---

## If it still 404s

Send the **build log** from the failing deployment. The useful part is:

1. Which directory the build ran in (first lines of the log).
2. Whether `npm run build:packages` ran and succeeded.
3. Whether `next build` printed its route table — the successful build ends with
   a list including `/`, `/learn`, `/enroll`, `/corner`, `/curriculum`.

Both build paths are verified working in this repository:

```bash
# what Vercel runs with Root Directory = repo root
npm install && npm run build:packages && npm run build --workspace=@nms/web

# what Vercel runs with Root Directory = apps/web
cd apps/web && npm run vercel-build
```

Both produce `apps/web/.next` containing `routes-manifest.json`, which is what
Vercel serves.

---

## Running it locally instead

For a demo, this needs no Vercel at all:

```bash
npm install
npm run build:packages
npm run web            # → http://localhost:3000
```

That serves the identical build.
