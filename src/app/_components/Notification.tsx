"use client";

import { CONFIG } from "@/config";

const registerServiceWorker = async () => {
  return navigator.serviceWorker.register("/service.js");
};

const saveSubscription = async (subscription: PushSubscription) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/push`;

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
};

const subscribe = async () => {
  await unregisterServiceWorkers();

  const swRegistration = await registerServiceWorker();
  await window?.Notification.requestPermission();

  try {
    const options = {
      applicationServerKey: CONFIG.PUBLIC_KEY,
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);

    await saveSubscription(subscription);

    console.log({ subscription });
  } catch (err) {
    console.error("Error", err);
  }
};
const notificationsSupported = () =>
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

export default function Notification() {
  if (!notificationsSupported()) {
    return <h3>Please install the PWA first!</h3>;
  }
  return (
    <>
      <h3>WebPush PWA</h3>
      <button onClick={subscribe}>Ask permission and subscribe!</button>
    </>
  );
}
