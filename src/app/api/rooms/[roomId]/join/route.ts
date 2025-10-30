import { NextRequest, NextResponse } from "next/server";
import { roomManager } from "@/lib/rooms";
import { sendToRoom } from "@/app/api/events/route";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const { userName } = await request.json();

        if (!userName) {
            return NextResponse.json(
                { error: "User name is required" },
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

        // Создаем пользователя
        const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const user = roomManager.addUser(userId, userName, roomId);

        // Уведомляем всех о новом пользователе
        const roomUsers = roomManager.getRoomUsers(roomId);
        sendToRoom(roomId, {
            type: "user-joined",
            data: {
                room,
                users: roomUsers,
            },
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            user,
            userId,
            room,
        });
    } catch (error) {
        console.error("Error joining room:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
