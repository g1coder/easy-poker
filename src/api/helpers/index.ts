import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME, Room, roomStore } from "@/api";
import { NextResponse } from "next/server";

export const getUserTokenOrError = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_NAME) as
        | { value: string }
        | undefined;

    if (!accessToken?.value) {
        return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    return accessToken.value;
};

export const getRoomOrError = (roomId: string) => {
    const room = roomStore.getRoom(roomId);
    if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return room;
};

export const checkIsOwnerOrError = (room: Room, userId: string | undefined) => {
    const isOwner = room.ownerId === userId;

    if (!isOwner) {
        return NextResponse.json(
            { error: "User is not owner" },
            { status: 403 }
        );
    }
};
