import { NextRequest, NextResponse } from "next/server";
import { sendHidedTaskToRoom } from "@/app/api/events/route";
import { roomStore, userStore } from "@/api";
import { getUserTokenOrError } from "@api/helpers";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params;
        const { vote, taskId } = await request.json();

        const token = await getUserTokenOrError();
        const user = userStore.getUser(token as string);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const success = roomStore.submitVote(roomId, user, taskId, vote);

        if (!success) {
            return NextResponse.json(
                { error: "Cannot submit vote" },
                { status: 400 }
            );
        }

        const tasks = roomStore.getRoomTasks(roomId);

        sendHidedTaskToRoom(roomId, { type: "user.voted", data: { tasks } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error submitting vote:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
