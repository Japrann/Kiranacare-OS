// OneSignal Web Push integration.
//
// Set NEXT_PUBLIC_ONESIGNAL_APP_ID in your environment (locally in .env.local,
// on Vercel under Project Settings -> Environment Variables) to activate this.
// Without it, everything here quietly no-ops so the rest of the OS still works.
//
// Two separate steps, on purpose:
//   1. initOneSignal()      -> loads the SDK + calls OneSignal.init() as soon
//                               as the app loads. This does NOT prompt the
//                               browser's permission dialog.
//   2. requestPushPermission() -> only called when the person taps
//                               "Allow ❤️". This is the one place that
//                               actually asks the browser for permission.

const STORAGE_KEY = "kirana-care-os:subscription-status";
const SDK_URL = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";

let loadPromise = null;

function getAppId() {
  return process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
}

/**
 * Loads the OneSignal SDK and initializes it. Safe to call multiple times —
 * subsequent calls reuse the same in-flight/resolved promise. Never triggers
 * a permission prompt by itself.
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
            // We drive the permission prompt ourselves from the "Allow ❤️"
            // button, so we don't want OneSignal's own auto-prompt slider.
            promptOptions: { slidedown: { prompts: [] } },
          });
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
 * Requests browser notification permission through OneSignal. Only call this
 * in direct response to a user gesture (e.g. the "Allow ❤️" button).
 *
 * @returns {Promise<{granted: boolean, status: "subscribed"|"denied"|"unavailable"|"error"}>}
 */
export async function requestPushPermission() {
  const OneSignal = await initOneSignal();

  if (!OneSignal) {
    setSubscriptionStatus("unavailable");
    return { granted: false, status: "unavailable" };
  }

  try {
    await OneSignal.Notifications.requestPermission();

    const granted =
      typeof window !== "undefined" &&
      "Notification" in window &&
      window.Notification.permission === "granted";

    const status = granted ? "subscribed" : "denied";
    setSubscriptionStatus(status);
    return { granted, status };
  } catch (err) {
    console.error("[Kirana Care OS] Permission request failed:", err);
    setSubscriptionStatus("error");
    return { granted: false, status: "error" };
  }
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
