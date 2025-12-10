import { NextRequest, NextResponse } from "next/server";
import { roomManager } from "@lib/rooms";
import { sendToRoom } from "@/app/api/events/route";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const { action, userId } = await request.json();

        if (!action || !userId) {
            return NextResponse.json(
                { error: "Action and user.ts ID are required" },
                { status: 400 }
            );
        }

        const room = roomManager.getRoom(roomId);
        if (!room) {
            return NextResponse.json(
                { error: "Room not found" },
                { status: 404 }
            );
        }

        if (room.ownerId !== userId) {
            return NextResponse.json(
                { error: "Only room owner can perform this action" },
                { status: 403 }
            );
        }

        let eventData;
        let success = false;

        switch (action) {
            case "start":
                success = roomManager.startVoting(roomId);
                eventData = {
                    room: roomManager.getRoom(roomId),
                    users: roomManager.getRoomUsers(roomId),
                };
                break;

            case "reveal":
                const results = roomManager.revealVotes(roomId);
                if (results) {
                    success = true;
                    eventData = {
                        room: roomManager.getRoom(roomId),
                        users: roomManager.getRoomUsers(roomId),
                        results,
                        average: roomManager.getRoom(roomId)?.average,
                    };
                }
                break;

            case "reset":
                success = roomManager.resetVotes(roomId);
                eventData = {
                    room: roomManager.getRoom(roomId),
                    users: roomManager.getRoomUsers(roomId),
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
        console.error("Error managing session:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
