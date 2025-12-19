import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME, GetRoomRequest, roomStore, userStore } from "@/api";

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<GetRoomRequest> }
) {
    try {
        const { roomId } = await params;

        if (!roomId) {
            return NextResponse.json(
                { error: `Room ID ${roomId} is required` },
                { status: 400 }
            );
        }

        const room = roomStore.getRoom(roomId);
        if (!room) {
            return NextResponse.json(
                { error: `Room ID ${roomId} not found` },
                { status: 404 }
            );
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN_NAME) as
            | { value: string }
            | undefined;

        console.log("===>>", accessToken);
        const user = accessToken ? userStore.getUser(accessToken.value) : null;
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 403 }
            );
        }
        const response = {
            ...room,
            isOwner: room.ownerId === user.id,
            tasks: roomStore.getRoomTasks(roomId),
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
