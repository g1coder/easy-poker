import { NextRequest, NextResponse } from "next/server";
import { sendToRoom } from "@/app/api/events/route";
import { Room, roomStore, userStore } from "@/api";
import {
    checkIsOwnerOrError,
    getRoomOrError,
    getUserTokenOrError,
} from "@api/helpers";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const { tasks } = await request.json();

        const token = await getUserTokenOrError();
        const user = userStore.getUser(token as string);
        const room = getRoomOrError(roomId) as Room;

        checkIsOwnerOrError(room, user?.id);

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
