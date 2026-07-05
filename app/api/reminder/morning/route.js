import { sendNotification } from "@/lib/sendNotification";

export async function POST() {
  await sendNotification({
    title: "🌞 Good Morning",
    message:
      "Good morning princess ☀️\nSemoga harimu di villa seru yaa.\nJangan lupa sarapan biar ada tenaga 🤍",
  });

  return Response.json({ success: true });
}

