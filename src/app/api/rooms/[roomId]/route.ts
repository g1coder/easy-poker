import { NextRequest, NextResponse } from "next/server";
import { GetRoomRequest, Room, RoomDto, userStore } from "@/api";
import { getRoomOrError, getUserTokenOrError } from "@api/helpers";

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

        const { ownerId, ...rest } = getRoomOrError(roomId) as Room;
        const token = await getUserTokenOrError();
        const user = userStore.getUser(token as string);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 403 }
            );
        }

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
