import { NextRequest, NextResponse } from "next/server";
import { roomManager } from "@/lib/rooms";
import { sendToRoom } from "@/app/api/events/route";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const { userId, vote } = await request.json();

        if (!userId || vote === undefined) {
            return NextResponse.json(
                { error: "User ID and vote are required" },
                { status: 400 }
            );
        }

        const success = roomManager.submitVote(roomId, userId, vote);
        if (!success) {
            return NextResponse.json(
                { error: "Cannot submit vote" },
                { status: 400 }
            );
        }

        const room = roomManager.getRoom(roomId);
        const roomUsers = roomManager.getRoomUsers(roomId);

        // Уведомляем о новом голосе
        sendToRoom(roomId, {
            type: "vote-received",
            data: {
                room,
                users: roomUsers,
                votedUserId: userId,
            },
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error submitting vote:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
