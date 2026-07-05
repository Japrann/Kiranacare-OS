import { sendNotification } from "@/lib/sendNotification";

export async function POST() {
  await sendNotification({
    title: "🌙 Good Night",
    message:
      "Udah malam.\nIstirahat yang cukup yaa.\nSemoga mimpi indah 🤍",
  });

  return Response.json({ success: true });
}

