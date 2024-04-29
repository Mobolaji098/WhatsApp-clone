import { authMiddleware } from "@clerk/nextjs";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PushSubscription } from "../../../webpush";

export async function POST(req: Request) {
  try {
    const newSubcription:PushSubscription | undefined = await req.json();
    if (!newSubcription) {
      return NextResponse.json(
        {
          error: "Missing push subcription in body",
        },
        { status: 400 }
      );
    }
    const user = await currentUser();
    const {sessionId} = auth();

    if (!user || !sessionId) return;
    NextResponse.json({ error: "User not authenticated" }, { status: 401 });

    const userSubcriptions = user.privateMetadata.subscriptions || [];
    const updatedSubcriptions = userSubcriptions.filter((subcriptions) => {
      subcriptions.endpoint !== newSubcription.endpoint;
    });
    updatedSubcriptions.push({...newSubcription,sessionId});
    await clerkClient.users.updateUser(user.id, {
      privateMetadata: { subscriptions: updatedSubcriptions },
    });
    return NextResponse.json(
      { message: "Push subcription saved" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const subcriptionToDelete: PushSubscription | undefined = await req.json();
    if (!subcriptionToDelete) {
      return NextResponse.json(
        {
          error: "Missing push subcription in body",
        },
        { status: 400 }
      );
    }
    const user = await currentUser();
    if (!user) return;
    NextResponse.json({ error: "User not authenticated" }, { status: 401 });

    const userSubcriptions = user.privateMetadata.subscriptions || [];
    const updatedSubcriptions = userSubcriptions.filter((subcriptions) => {
      subcriptions.endpoint !== subcriptionToDelete.endpoint;
    });
    await clerkClient.users.updateUser(user.id, {
      privateMetadata: { subscriptions: updatedSubcriptions },
    });
    return NextResponse.json(
      { message: "Push subcription deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
