# New Manager Success — mobile

Expo (React Native) app for iOS and Android. Shares `@nms/content`,
`@nms/core`, and `@nms/brand` with the web app, so lesson content,
scoring, streaks, and colour come from one source on every platform.

## Run it

```bash
npm install                       # from the repo root
npm run start --workspace=@nms/mobile
```

Then press `i` for the iOS simulator, `a` for Android, or scan the QR code with
Expo Go on a real device.

## What's in here

```
app/                    expo-router file routes
  _layout.tsx           providers + stack config
  index.tsx             home: streak, XP, module progress, up-next
  rep/[repId].tsx       the feed — one full-screen card per script beat
src/
  theme.ts              native theme derived from @nms/brand tokens
  progress-store.tsx    on-device progress, persisted via AsyncStorage
  components/Mark.tsx   the logo, as SVG
assets/                 generated app icons (see below)
```

## Notes for whoever picks this up

**Progress is local-first.** The device owns progress and the server is a sync
target, not the source of truth. A manager doing a Rep on a factory floor, a
hospital ward, or the Tube needs their streak to survive a dead connection — a
streak that resets because a request failed is worse than no streak. The rules
all live in `@nms/core`, so device and server compute identical results
from the same events.

**Dark only.** `userInterfaceStyle: "dark"` in `app.json`. The feed is a
cinema, not a page, and it is essentially the whole app.

**Icons are generated, not hand-drawn.** `assets/icon.png`,
`adaptive-icon.png`, and `splash.png` are rendered from the vector master at
`packages/brand/assets/app-icon.svg`. `icon.png` is deliberately opaque —
Apple rejects icons with an alpha channel. `adaptive-icon.png` is transparent
and sized to clear Android's 66% safe circle.

**`babel.config.js` has a workaround with a comment on it.** Read it before
touching dependency versions — it exists because the web app pins React 19 and
Expo SDK 52 pins React 18.3.1, which changes how npm hoists the tree.

## Verified so far

- `npm run typecheck --workspace=@nms/mobile` — clean
- `npx expo export --platform ios` / `--platform android` — both bundle
  (1,129 modules, all imports resolve)

**Not yet verified:** nothing has run on a real device or simulator. This
container has no iOS/Android toolchain — release exports also need `hermesc`,
which ships with the platform SDKs. Treat "renders correctly on a phone" as
untested until someone runs it. Building for the stores needs an EAS account
and signing credentials; see `docs/product/MVP_SPEC.md § Shipping`.
