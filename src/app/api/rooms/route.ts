import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    ACCESS_TOKEN_NAME,
    GetRoomResponse,
    roomStore,
    userStore,
} from "@/api";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN_NAME) as
            | { value: string }
            | undefined;

        const { roomName, ownerName } = await request.json();

        if (!roomName || (!accessToken?.value && !ownerName)) {
            return NextResponse.json(
                { error: "Room ID, name and owner name are required" },
                { status: 400 }
            );
        }

        let user = accessToken ? userStore.getUser(accessToken.value) : null;
        if (!user) {
            user = userStore.createUser(ownerName);
            cookieStore.set(ACCESS_TOKEN_NAME, user.id, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 10 * 60 * 1000),
                sameSite: "lax",
                path: "/",
            });
        }
        const room = roomStore.createRoom(roomName, user);
        const { ownerId, tasks, ...rest } = room;
        const response: GetRoomResponse = {
            ...rest,
            isOwner: ownerId === user.id,
            tasks: [...tasks.values()],
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
