import DisappearingMessage from "@/components/DisappearingMessage";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/notifications/pushService";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { BellOff, BellRing, Moon, Sun, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "stream-chat-react";
import { useTheme } from "../themeProvider";

interface MenuBarProps {
  onUserMenuClick: () => void;
}

export default function MenuBar({ onUserMenuClick }: MenuBarProps) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex-roll flex items-center justify-between gap-3 border-e border-e-[#DBDDE1] bg-white p-6 dark:border-e-gray-800 dark:bg-[#17191c]">
      <UserButton
        afterSignOutUrl="/"
        appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
      />
      <div className="flex-roll flex gap-6">
        <PushSubscriptionToggleButton />
        <span title="Show users">
          <Users onClick={onUserMenuClick} className="cursor-pointer" />
        </span>
        <ThemeToggleButton />
      </div>
    </div>
  );
}

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  if (theme === "dark")
    return (
      <span title="Enable light theme">
        <Moon
          className="cursor-pointer"
          onClick={() => {
            setTheme("light");
          }}
        />
      </span>
    );
  return (
    <span title="Enable dark theme">
      <Sun
        className="cursor-pointer"
        onClick={() => {
          setTheme("dark");
        }}
      />
    </span>
  );
}

function PushSubscriptionToggleButton() {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();

  const [loading, setLoading] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string>();
  useEffect(() => {
    async function getActivePushSubscription() {
      const subcription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subcription);
    }
    getActivePushSubscription();
  }, []);

  async function setPushNotificationEnabled(enabled: boolean) {
    if (loading) return;
    setLoading(true);
    setConfirmationMessage(undefined);
    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setConfirmationMessage(
        "Push notifications " + (enabled ? "enabled" : "disabled")
      );
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Please enaable push notification is browser");
      } else {
        alert("Something went wrong please try again");
      }
    } finally {
      setLoading(false);
    }
  }

  if (hasActivePushSubscription === undefined) return null;
  return (
    <div className="relative">
      {loading && (
        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 ">
          <LoadingIndicator />
        </span>
      )}

      {confirmationMessage && (
        <DisappearingMessage className="absolute left-1/2 top-8 z-10 -translate-x-1/2 rounded-lg bg-white px-2 py-1 shadow-md dark:bg-black">
          {confirmationMessage}
        </DisappearingMessage>
      )}
      {hasActivePushSubscription ? (
        <span title="Enable push notifications">
          <BellOff
            onClick={() => {
              setPushNotificationEnabled(false);
            }}
            className={`${loading ? "opacity-10" : " "} cursor-pointer`}
          />
        </span>
      ) : (
        <span title="Disable push notifications">
          <BellRing
            onClick={() => {
              setPushNotificationEnabled(true);
            }}
            className={`${loading ? "opacity-10" : " "} cursor-pointer`}
          />
        </span>
      )}
    </div>
  );
}
