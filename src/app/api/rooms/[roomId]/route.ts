import { NextRequest, NextResponse } from "next/server";
import { GetRoomRequest, RoomDto, roomStore } from "@/api";
import { getUserToken } from "@api/helpers";

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
                { error: "Room not found" },
                { status: 404 }
            );
        }

        const token = await getUserToken();
        if (!token) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 403 }
            );
        }
        const user = roomStore.getUser(token as string);

        console.log("==>> GOT USER", user);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 403 }
            );
        }

        const { ownerId, ...rest } = room;

        const response: RoomDto = {
            ...rest,
            userId: user.id,
            isOwner: ownerId === user.id,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
