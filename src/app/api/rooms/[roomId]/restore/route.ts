import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    ACCESS_TOKEN_NAME,
    RoomDto,
    roomStore,
    TaskDto,
    userStore,
} from "@/api";

export async function POST(
    request: NextRequest,
    { params: _ }: { params: Promise<{ roomId: string }> }
) {
    try {
        // const { roomId } = await params;
        const { room, tasks } = (await request.json()) as {
            room: RoomDto;
            tasks: TaskDto[];
        };

        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN_NAME) as
            | { value: string }
            | undefined;

        if (!accessToken?.value) {
            return NextResponse.json(
                { error: "User name is required" },
                { status: 400 }
            );
        }

        console.log("start", room.users);

        room.users.forEach((user) => {
            userStore.restoreUser(user);
        });

        console.log("restoreRoom", room, tasks);

        const { ownerId, ...rest } = roomStore.restoreRoom(room, tasks);
        const userId = accessToken?.value as string;

        const response: RoomDto = {
            ...rest,
            userId,
            isOwner: ownerId === userId,
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
