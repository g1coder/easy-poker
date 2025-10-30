import { NextRequest, NextResponse } from "next/server";
import { roomManager } from "@/lib/rooms";

export async function POST(request: NextRequest) {
    try {
        const { roomId, roomName, ownerName, cards } = await request.json();

        if (!roomId || !roomName || !ownerName) {
            return NextResponse.json(
                { error: "Room ID, name and owner name are required" },
                { status: 400 }
            );
        }

        // Создаем комнату
        const ownerId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const room = roomManager.createRoom(roomId, roomName, ownerId, cards);

        // Добавляем владельца
        roomManager.addUser(ownerId, ownerName, roomId, true);

        return NextResponse.json({
            success: true,
            room,
            userId: ownerId,
        });
    } catch (error) {
        console.error("Error creating room:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
