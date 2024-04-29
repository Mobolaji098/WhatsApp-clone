import { getReadyServiceWorker } from "@/app/utils/serviceWorker";
import { env } from "../env";

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  const sw = await getReadyServiceWorker();
  return sw.pushManager.getSubscription();
}

export async function registerPushNotifications() {

  if (!("PushManager" in window)) {
    throw new Error("Push Notifications are not supported by this browser");
  }

  const existingSubscription = await getCurrentPushSubscription();

  if (existingSubscription) {
    throw Error("Existing push notifications");
  }
  const sw = await getReadyServiceWorker();

  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  });
  await sendPushSubscriptionToServer(subscription);
}

export async function unregisterPushNotifications() {
  const existingSubscription = await getCurrentPushSubscription();

  if (!existingSubscription) {
    throw Error("No existing push subcription found");
  }

  await deletePushSubscriptionfromServer(existingSubscription);

  await existingSubscription.unsubscribe();
}

export async function sendPushSubscriptionToServer(
  subcription: PushSubscription
) {

  const response = await fetch("/api/register-push", {
    method:'POST',
    body:JSON.stringify(subcription)
  })
  if(!response.ok) {
    throw Error('Failed to send push notification to server')
  }
}

export async function deletePushSubscriptionfromServer(
  subcription: PushSubscription
) {
    const response = await fetch("/api/register-push", {
        method:'DELETE',
        body:JSON.stringify(subcription)
      })
      if(!response.ok) {
        throw Error('Failed to delete push notification from server')
      }
}
