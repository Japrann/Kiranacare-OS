# Kirana Care OS 🌸

A soft, cozy "operating system" whose only job is reminding Kirana to take
care of herself at the villa. Built with Next.js (App Router), Tailwind CSS,
and Framer Motion.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's inside

- **Boot animation** — `components/BootScreen.js`. Sequenced lines, spring
  easing, progress bar, then a soft blur-fade into the home screen.
- **Time-based greeting** — `lib/messages.js` → `getGreeting()`.
- **Care note card, Today's Care Checklist (with confetti), Secret Message
  (rotates every 3 hours), Cat Corner (Cila & Zoro)** — one component each in
  `components/`.
- **Notification permission modal** — appears 2s after boot, wired to the
  browser Notification API and OneSignal.

## Turning on real push notifications (OneSignal)

1. Create a free app at https://onesignal.com (Web Push platform) and grab
   your **OneSignal App ID**.
2. Locally: copy `.env.local.example` to `.env.local` and fill in the ID.
   On Vercel: **Settings → Environment Variables**, add:
   ```
   NEXT_PUBLIC_ONESIGNAL_APP_ID = your-app-id-here
   ```
3. Redeploy (or restart `npm run dev`).

How the flow works (`lib/onesignal.js` + `app/page.js`):

- **On app load**, `initOneSignal()` loads the OneSignal Web SDK and calls
  `OneSignal.init()`. This registers the app but does **not** show the
  browser's permission prompt.
- **Only when the person taps "Allow ❤️"** does `requestPushPermission()`
  run, which calls `OneSignal.Notifications.requestPermission()` — the one
  and only place the permission dialog is triggered.
- The result is saved to `localStorage` (`kirana-care-os:subscription-status`,
  one of `subscribed` / `denied` / `unavailable` / `error`) so returning
  visitors who already answered aren't asked again.
- On success, the modal swaps to: *"You're all set! I'll quietly remind you
  to take care of yourself while you're away."*

Without the env var set, the modal still works exactly the same — it just
logs a console note and skips the real SDK, so nothing breaks.

## Adding real cat photos

`components/CatCorner.js` currently uses emoji avatars so the site works out
of the box with no assets required. To use real photos of Cila and Zoro:

1. Drop `cila.jpg` and `zoro.jpg` into `public/cats/`.
2. In `CatAvatar` (inside `CatCorner.js`), swap the emoji `<div>` for a
   `next/image` `<Image src="/cats/cila.jpg" ... className="rounded-full object-cover" />`.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new, import the repo.
3. Framework preset: **Next.js** (auto-detected). No extra build config needed.
4. Add the `NEXT_PUBLIC_ONESIGNAL_APP_ID` env var if you want live push
   notifications.
5. Deploy. That's it — it's a static-friendly Next.js app, so it deploys
   cleanly on Vercel's free tier.

## Design notes

- Palette: cream `#FBF6EF`, beige `#F1E7D8`, blush `#F8DCE1`, rose `#EBAEB8`,
  warm ink `#4A3F3C` — all defined in `tailwind.config.js`.
- Type: **Fraunces** (display/italic, for the warm handwritten-note feel) +
  **Plus Jakarta Sans** (body/UI).
- Motion: everything uses spring transitions (`type: "spring"`) rather than
  linear easing, per the brief — no harsh cuts anywhere.
- Respects `prefers-reduced-motion`.
