import { NextRequest, NextResponse } from "next/server";
import { sendToRoom } from "@/app/api/events/route";
import { Room, roomStore, userStore, VoteControlAction } from "@/api";
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
        const { action, taskId } = await request.json();

        const token = await getUserTokenOrError();
        const room = getRoomOrError(roomId) as Room;
        const user = userStore.getUser(token as string);

        checkIsOwnerOrError(room, user?.id);

        let eventData;
        let success = false;

        switch (action as VoteControlAction) {
            case "reveal":
                const results = roomStore.revealVotes(roomId, taskId);
                if (results) {
                    success = true;
                    eventData = {
                        task: roomStore.getRoomTask(roomId, taskId),
                    };
                }
                break;

            case "reset":
                success = roomStore.resetVotes(roomId, taskId);
                eventData = {
                    task: roomStore.getRoomTask(roomId, taskId),
                };
                break;

            case "done":
                success = roomStore.freezeVoting(roomId, taskId);
                eventData = {
                    task: roomStore.getRoomTask(roomId, taskId),
                };
                break;

            default:
                return NextResponse.json(
                    { error: "Unknown action" },
                    { status: 400 }
                );
        }

        if (!success) {
            return NextResponse.json(
                { error: "Action failed" },
                { status: 400 }
            );
        }

        sendToRoom(roomId, {
            type:
                action === "start"
                    ? "vote-started"
                    : action === "reveal"
                      ? "votes-revealed"
                      : "vote-reset",
            data: eventData,
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
