import { cookies } from "next/headers";
import { ACCESS_TOKEN_NAME, Room, roomStore, Task, User } from "@/api";
import { NextResponse } from "next/server";

const setNewUserCookies = async (userId: string) => {
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_NAME, userId, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 10 * 60 * 1000),
        sameSite: "lax",
        path: "/",
    });
};

const getUserToken = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_NAME) as
        | { value: string }
        | undefined;

    return accessToken?.value || null;
};

export const getUserTokenOrError = async () => {
    const accessToken = await getUserToken();

    if (!accessToken) {
        return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    return accessToken;
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

export const hideTaskVotes = (
    tasks: Task[],
    askingUser: User["id"] | undefined
) => {
    return tasks.map((task) => {
        const { votes, ...rest } = task;

        if (task.status === "revealed") {
            return task;
        }

        console.log("hide FOR", askingUser);
        console.log("VOTES", votes);

        const hidedVotes = Object.entries(votes).reduce(
            (acc, [userId, vote]) => {
                if (userId === askingUser) {
                    acc[askingUser] = vote;
                } else {
                    acc[userId] = "?";
                }

                return acc;
            },
            {} as Record<string, string>
        );

        return { ...rest, votes: hidedVotes };
    });
};

export const getBaseUrl = () => {
    if (process.env.VERCEL_ENV === "production") {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return "http://localhost:3000";
};
