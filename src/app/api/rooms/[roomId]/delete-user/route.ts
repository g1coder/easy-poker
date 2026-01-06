import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME, roomStore } from "@/api";
import { sendHidedTaskToRoom } from "@/app/api/events/route";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const { userId } = (await request.json()) as {
            userId: string;
        };

        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN_NAME) as
            | { value: string }
            | undefined;

        const room = roomStore.getRoom(roomId);
        if (!room) {
            return NextResponse.json(
                { error: "Room not found" },
                { status: 404 }
            );
        }

        if (room.ownerId !== accessToken?.value) {
            return NextResponse.json(
                { error: "User is not owner" },
                { status: 400 }
            );
        }

        roomStore.deleteUser(roomId, userId);

        sendHidedTaskToRoom(
            roomId,
            {
                type: "user.joined",
                data: {
                    tasks: roomStore.getRoomTasks(roomId),
                    users: roomStore.getRoomUsers(roomId),
                },
            },
            room.ownerId
        );

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
