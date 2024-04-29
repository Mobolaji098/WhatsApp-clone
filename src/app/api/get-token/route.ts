import { env } from "@/env";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function GET() {
  try {
    // Define values.
    const user = await currentUser();
    const api_key = env.NEXT_PUBLIC_STREAM_KEY;
    const api_secret = env.STREAM_SECRET;
    if (!user) return;
    NextResponse.json({ error: "User not authenticated" }, { status: 401 });

    // Initialize a Server Client
    const serverClient = StreamChat.getInstance(api_key, api_secret);

    // Set expiration date

    const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60;
    const issuedAt =  Math.floor(Date.now() / 1000) - 60
    // Create User Token
    const token = serverClient.createToken(user.id,expirationDate,issuedAt);
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
