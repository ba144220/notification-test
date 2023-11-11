import { NextResponse, NextRequest } from "next/server";
import webpush, { PushSubscription } from "web-push";
import { CONFIG } from "@/config";
import {
  getSubscriptionsFromDb,
  saveSubscriptionToDb,
} from "@/utils/in-memory-db";

webpush.setVapidDetails(
  "mailto:test@example.com",
  CONFIG.PUBLIC_KEY,
  CONFIG.PRIVATE_KEY
);

export async function POST(request: NextRequest) {
  const subscription = (await request.json()) as PushSubscription | null;

  if (!subscription) {
    console.error("No subscription was provided!");
    return;
  }

  const updatedDb = await saveSubscriptionToDb(subscription);

  return NextResponse.json({ message: "success", updatedDb });
}

export async function GET(_: NextRequest) {
  const subscriptions = await getSubscriptionsFromDb();

  subscriptions.forEach((s) => {
    const payload = JSON.stringify({
      title: "WebPush Notification!",
      body: "Hello World",
    });
    webpush.sendNotification(s, payload);
  });

  return NextResponse.json({
    message: `${subscriptions.length} messages sent!`,
  });
}
