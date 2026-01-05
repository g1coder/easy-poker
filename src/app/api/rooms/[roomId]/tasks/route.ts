import { NextRequest, NextResponse } from "next/server";
import { Room, roomStore, userStore } from "@/api";
import {
    checkIsOwnerOrError,
    getRoomOrError,
    getUserTokenOrError,
    hideTaskVotes,
} from "@api/helpers";

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;

        const token = await getUserTokenOrError();
        const room = getRoomOrError(roomId) as Room;
        const user = userStore.getUser(token as string);

        checkIsOwnerOrError(room, user?.id);

        const tasks = hideTaskVotes(roomStore.getRoomTasks(roomId), user?.id);

        return NextResponse.json(tasks, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
