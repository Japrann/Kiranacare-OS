export async function sendNotification({ title, message }) {
  const appId = process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_API_KEY;

  if (!appId) {
    throw new Error("Missing env var: ONESIGNAL_APP_ID");
  }
  if (!apiKey) {
    throw new Error("Missing env var: ONESIGNAL_API_KEY");
  }

  const res = await fetch("https://api.onesignal.com/notifications?c=push", {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_id: appId,
      included_segments: ["Subscribed Users"],
      headings: { en: title },
      contents: { en: message },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `OneSignal request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`
    );
  }
}

