import { NextRequest, NextResponse } from "next/server";
import { sendToRoom } from "@/app/api/events/route";
import { roomStore } from "@/api";
import { getUserToken } from "@api/helpers";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const { tasks } = await request.json();

        const token = await getUserToken();
        if (!token) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 403 }
            );
        }
        const user = roomStore.getUser(token as string);
        const room = roomStore.getRoom(roomId);
        if (!room) {
            return NextResponse.json(
                { error: "Room not found" },
                { status: 404 }
            );
        }

        if (room.ownerId !== user?.id) {
            return NextResponse.json(
                { error: "User is not owner" },
                { status: 403 }
            );
        }

        roomStore.addTasks(roomId, tasks);

        sendToRoom(roomId, {
            type: "task.added",
            data: {
                tasks: roomStore.getRoomTasks(roomId),
            },
        });

        return NextResponse.json(null, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
