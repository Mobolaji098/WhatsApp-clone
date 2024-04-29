import { useUser } from "@clerk/nextjs";
import { env } from "@/env";
import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";

export default function useInitializeChatClient() {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    
    if (!user) return;
    const client = StreamChat.getInstance(env.NEXT_PUBLIC_STREAM_KEY);
    client
      .connectUser(
        {
          id: user.id,
          name: user.fullName || user.id,
          image: user.imageUrl,
        },
        async () => {
          const response = await fetch("/api/get-token");
          if (!response.ok) {
            throw Error("Failed to get token");
          }
          const body = await response.json();
          return body.token;
        }
      )
      .catch((error) => {
      })
      .then(() => {
        setChatClient(client);

        return () => {
          setChatClient(null);
          client
            .disconnectUser()
            .catch((error) => {
            })
            .then(() => {
            });
        };
      });
  }, [user?.id]);
  return chatClient
}
