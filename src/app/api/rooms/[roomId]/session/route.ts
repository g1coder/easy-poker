import { NextRequest, NextResponse } from "next/server";
import { sendToRoom } from "@/app/api/events/route";
import { PokerEvent, roomStore, userStore, VoteControlAction } from "@/api";
import { getUserToken } from "@api/helpers";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const { action, taskId } = await request.json();

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

        let eventType: PokerEvent["type"] = "ping";
        let success = false;

        switch (action as VoteControlAction) {
            case "reveal":
                const results = roomStore.revealVotes(roomId, taskId);
                if (results) {
                    success = true;
                }
                eventType = "task.revealed";
                break;

            case "reset":
                success = roomStore.resetVotes(roomId, taskId);
                eventType = "task.reset";
                break;

            case "done":
                success = roomStore.freezeVoting(roomId, taskId);
                eventType = "task.done";
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
            type: eventType,
            data: {
                tasks: roomStore.getRoomTasks(roomId),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
