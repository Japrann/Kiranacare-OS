import { sendNotification } from "@/lib/sendNotification";

export async function POST() {
  await sendNotification({
    title: "🍱 Lunch Time",
    message:
      "Udah jam makan siang nih.\nJangan lupa makan yaa, nanti aku khawatir 🤍",
  });

  return Response.json({ success: true });
}

