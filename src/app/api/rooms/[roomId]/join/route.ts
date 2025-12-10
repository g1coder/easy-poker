import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendToRoom } from "@/app/api/events/route";
import {
    ACCESS_TOKEN_NAME,
    JoinRoomRequest,
    Room,
    roomStore,
    userStore,
} from "@/api";
import { roomManager } from "@lib/rooms";
import { getRoomOrError } from "@api/helpers";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<JoinRoomRequest> }
) {
    try {
        const { roomId } = await params;
        const { userName } = await request.json();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN_NAME) as
            | { value: string }
            | undefined;

        if (!userName && !accessToken?.value) {
            return NextResponse.json(
                { error: "User name is required" },
                { status: 400 }
            );
        }

        const room = getRoomOrError(roomId) as Room;

        let user = accessToken ? userStore.getUser(accessToken.value) : null;
        if (!user) {
            user = userStore.createUser(userName);

            cookieStore.set(ACCESS_TOKEN_NAME, user.id, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 10 * 60 * 1000),
                sameSite: "lax",
                path: "/",
            });
        }

        roomStore.joinUser(roomId, user);

        // уведомляем всех о новом пользователе
        const roomUsers = roomManager.getRoomUsers(roomId);
        const { ownerId, ...response } = room;
        response.isOwner = ownerId === user.id;

        sendToRoom(roomId, {
            type: "user.ts-joined",
            data: {
                room: response,
                users: roomUsers,
            },
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json("", { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
