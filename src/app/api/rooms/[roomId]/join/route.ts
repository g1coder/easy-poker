import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendHidedTaskToRoom } from "@/app/api/events/route";
import { ACCESS_TOKEN_NAME, roomStore } from "@/api";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
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

        const room = roomStore.getRoom(roomId);
        if (!room) {
            return NextResponse.json(
                { error: "Room not found" },
                { status: 404 }
            );
        }

        let user = accessToken ? roomStore.getUser(accessToken.value) : null;
        if (!user) {
            user = roomStore.createUser(userName);

            cookieStore.set(ACCESS_TOKEN_NAME, user.id, {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 10 * 60 * 1000),
                sameSite: "lax",
                path: "/",
            });
        }

        roomStore.joinUser(roomId, user);

        sendHidedTaskToRoom(roomId, {
            type: "user.joined",
            data: {
                tasks: roomStore.getRoomTasks(roomId),
                users: roomStore.getRoomUsers(roomId),
            },
        });

        return NextResponse.json(
            {
                name: room.name,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
