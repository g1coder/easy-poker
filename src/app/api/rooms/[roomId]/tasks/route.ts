import { NextRequest, NextResponse } from "next/server";
import { roomStore, userStore } from "@/api";
import { getUserToken, hideTaskVotes } from "@api/helpers";

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;

        const token = await getUserToken();
        if (!token) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 403 }
            );
        }
        const room = roomStore.getRoom(roomId);
        if (!room) {
            return NextResponse.json(
                { error: "Room not found" },
                { status: 404 }
            );
        }
        const user = userStore.getUser(token as string);

        if (room.ownerId !== user?.id) {
            return NextResponse.json(
                { error: "User is not owner" },
                { status: 403 }
            );
        }

        const tasks = hideTaskVotes(roomStore.getRoomTasks(roomId), user?.id);

        return NextResponse.json(tasks, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
