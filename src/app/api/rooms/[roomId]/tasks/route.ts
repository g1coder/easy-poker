import { NextRequest, NextResponse } from "next/server";
import { sendToRoom } from "@/app/api/events/route";
import { AddRoomTasksRequest, Room, roomStore, userStore } from "@/api";
import {
    checkIsOwnerOrError,
    getRoomOrError,
    getUserTokenOrError,
} from "@api/helpers";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<AddRoomTasksRequest> }
) {
    try {
        const { roomId } = await params;
        const { tasks } = await request.json();

        const token = await getUserTokenOrError();
        const room = getRoomOrError(roomId) as Room;
        const user = userStore.getUser(token as string);

        checkIsOwnerOrError(room, user?.id);

        roomStore.addTasks(roomId, tasks);

        sendToRoom(roomId, {
            type: "new-tasks",
            data: {
                room: roomStore.getRoom(roomId),
            },
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json("", { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
