// OneSignal Web Push integration (Web SDK v16).
//
// Set NEXT_PUBLIC_ONESIGNAL_APP_ID in your environment (locally in .env.local,
// on Vercel under Project Settings -> Environment Variables) to activate this.
// Without it, everything here quietly no-ops so the rest of the OS still works.
//
// Two separate steps, on purpose:
//   1. initOneSignal()          -> loads the SDK, registers the service
//                                   worker at /OneSignalSDKWorker.js, and
//                                   calls OneSignal.init() as soon as the app
//                                   loads. This does NOT prompt the browser's
//                                   permission dialog.
//   2. requestPushPermission()  -> only called when the person taps
//                                   "Allow ❤️". This asks the browser for
//                                   permission AND explicitly opts the user
//                                   in, which is what actually creates the
//                                   PushSubscription and makes them show up
//                                   in OneSignal's Audience.
//
// Requires /public/OneSignalSDKWorker.js to exist (see that file) — without
// it, the SDK has nothing to register and no subscription can ever be
// created, even if the browser's Notification permission is "granted".

const STORAGE_KEY = "kirana-care-os:subscription-status";
const SDK_URL = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";

let loadPromise = null;

function getAppId() {
  return process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
}

/**
 * Loads the OneSignal SDK and initializes it (which registers
 * /OneSignalSDKWorker.js as a service worker at the site root scope). Safe to
 * call multiple times — subsequent calls reuse the same promise. Never
 * triggers a permission prompt by itself.
 *
 * @returns {Promise<OneSignal|null>} the global OneSignal object, or null if
 *   it isn't configured / failed to load.
 */
export function initOneSignal() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (loadPromise) return loadPromise;

  const appId = getAppId();
  if (!appId) {
    console.info(
      "[Kirana Care OS] No NEXT_PUBLIC_ONESIGNAL_APP_ID set — skipping push init. " +
        "Add it to your environment variables to enable real notifications."
    );
    loadPromise = Promise.resolve(null);
    return loadPromise;
  }

  window.OneSignalDeferred = window.OneSignalDeferred || [];

  loadPromise = new Promise((resolve) => {
    const attach = () => {
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.init({
            appId,
            allowLocalhostAsSecureOrigin: true,
            // File lives at /public/OneSignalSDKWorker.js -> served at the
            // site root, which is also the SDK's default, but we're explicit
            // so this keeps working if the file ever moves.
            serviceWorkerPath: "OneSignalSDKWorker.js",
            serviceWorkerParam: { scope: "/" },
          });

          if (typeof window !== "undefined") {
            window.__oneSignal = OneSignal;
          }

          resolve(OneSignal);
        } catch (err) {
          console.error("[Kirana Care OS] OneSignal init failed:", err);
          resolve(null);
        }
      });
    };

    if (document.getElementById("onesignal-sdk")) {
      attach();
      return;
    }

    const script = document.createElement("script");
    script.id = "onesignal-sdk";
    script.src = SDK_URL;
    script.defer = true;
    script.onload = attach;
    script.onerror = () => {
      console.error("[Kirana Care OS] Failed to load the OneSignal SDK.");
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * Requests browser notification permission AND explicitly opts the user in
 * to push. Only call this in direct response to a user gesture (e.g. the
 * "Allow ❤️" button).
 *
 * Calling both requestPermission() and PushSubscription.optIn() matters:
 * requestPermission() alone can leave a user with browser permission
 * "granted" but no actual OneSignal PushSubscription created (e.g. if
 * permission was already granted previously, or the SDK's auto-subscribe
 * didn't fire) — which is exactly the "Audience stays at 0" symptom.
 * optIn() is what guarantees a subscription record gets created.
 *
 * @returns {Promise<{granted: boolean, status: string, subscriptionId: string|null}>}
 */
export async function requestPushPermission() {
  const OneSignal = await initOneSignal();

  if (!OneSignal) {
    setSubscriptionStatus("unavailable");
    return { granted: false, status: "unavailable", subscriptionId: null };
  }

  try {
    await OneSignal.Notifications.requestPermission();

    const permissionGranted =
      typeof window !== "undefined" &&
      "Notification" in window &&
      window.Notification.permission === "granted";

    if (permissionGranted) {
      // Explicitly create/confirm the push subscription. This is required
      // for PushSubscription.id to populate and for the user to appear in
      // OneSignal's Audience — permission alone isn't enough.
      await OneSignal.User.PushSubscription.optIn();
    }

    // Give the SDK a brief moment to finish registering the subscription
    // with OneSignal's backend before we read the id back out.
    const subscriptionId = await waitForSubscriptionId(OneSignal);

    const status = permissionGranted && subscriptionId ? "subscribed" : "denied";
    setSubscriptionStatus(status);
    return { granted: status === "subscribed", status, subscriptionId };
  } catch (err) {
    console.error("[Kirana Care OS] Permission request failed:", err);
    setSubscriptionStatus("error");
    return { granted: false, status: "error", subscriptionId: null };
  }
}

/** Polls briefly for OneSignal to finish assigning a PushSubscription.id. */
async function waitForSubscriptionId(OneSignal, attempts = 6, delayMs = 400) {
  for (let i = 0; i < attempts; i++) {
    const id = OneSignal?.User?.PushSubscription?.id;
    if (id) return id;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return OneSignal?.User?.PushSubscription?.id || null;
}

/** Persists the subscription status so we don't re-prompt on every visit. */
export function setSubscriptionStatus(status) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, status);
  } catch (err) {
    // localStorage may be unavailable (private browsing etc.) — non-fatal.
  }
}

/** Reads the last known subscription status, if any. */
export function getSubscriptionStatus() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    return null;
  }
}
