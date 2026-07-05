import { sendNotification } from "@/lib/sendNotification";

export async function POST() {
  await sendNotification({
    title: "💧 Hydration Time",
    message: "Break bentar yuk.\nMinum air putih dulu ya princess 💙",
  });

  return Response.json({ success: true });
}

