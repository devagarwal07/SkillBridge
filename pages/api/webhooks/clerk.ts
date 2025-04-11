import { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import { buffer } from "micro";
import connectDB from "@/lib/mongoose";
import User from "@/lib/db/models/User";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ClerkWebhookEvent = {
  type: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const payload = buf.toString();

  const svixHeaders = {
    "svix-id": req.headers["svix-id"] as string,
    "svix-timestamp": req.headers["svix-timestamp"] as string,
    "svix-signature": req.headers["svix-signature"] as string,
  };

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(payload, svixHeaders) as ClerkWebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return res.status(400).send("Invalid webhook signature");
  }

  const { type, data } = evt;

  console.log("📩 Received event type:", type);
  console.log("📦 Clerk user data:", JSON.stringify(data, null, 2));

  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");

    if (type === "user.created" || type === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address || "";

      if (!email) {
        console.warn("⚠️ No email found in Clerk user data");
        return res.status(400).json({ error: "Missing email in user data" });
      }

      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            email,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          },
        },
        { upsert: true, new: true }
      );

      console.log(
        `✅ User ${type === "user.created" ? "created" : "updated"}: ${email}`
      );
    }

    if (type === "user.deleted") {
      const email = data.email_addresses?.[0]?.email_address;

      if (email) {
        await User.findOneAndDelete({ email });
        console.log(`🗑️ User deleted: ${email}`);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("❌ Database error:", err.message);
    return res.status(500).json({ error: "Failed to handle webhook" });
  }
}
