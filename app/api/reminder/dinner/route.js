import { sendNotification } from "@/lib/sendNotification";

export async function POST() {
  await sendNotification({
    title: "🍜 Dinner Time",
    message: "Dinner dulu yaa.\nSemoga hari ini menyenangkan buat kamu 🤍",
  });

  return Response.json({ success: true });
}

