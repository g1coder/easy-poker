import { NextRequest } from "next/server";
import { Room, roomStore, userStore } from "@/api";
import { PokerEvent } from "@/api/types";
import { getRoomOrError, getUserTokenOrError } from "@api/helpers";

const clients = new Map<
    string,
    {
        roomId: string;
        userId: string;
        controller: ReadableStreamDefaultController;
    }
>();

export async function GET(request: NextRequest) {
    const roomId = request.nextUrl.searchParams.get("roomId");
    const token = await getUserTokenOrError();
    const userId = userStore.getUser(token as string)?.id as string;

    if (!roomId) {
        return new Response("roomId not found", { status: 404 });
    }

    const room = getRoomOrError(roomId) as Room;
    userStore.setUserConnection(userId, true);

    const stream = new ReadableStream({
        start(controller) {
            const clientId = `${roomId}-${userId}`;

            clients.set(clientId, {
                roomId,
                userId,
                controller,
            });

            console.log(`🔗 SSE connected: ${clientId}`);

            const roomUsers = roomStore.getRoomUsers(roomId);
            const initialEvent: PokerEvent = {
                type: "user.ts-joined",
                data: {
                    room: { ...room, isOwner: room.ownerId === userId },
                    users: roomUsers,
                    tasks: roomStore.getRoomTasks(roomId),
                },
                timestamp: new Date().toISOString(),
            };

            sendToClient(controller, initialEvent);

            const pingInterval = setInterval(() => {
                try {
                    if (clients.has(clientId)) {
                        const pingEvent: PokerEvent = {
                            type: "vote-received",
                            data: { ping: true },
                            timestamp: new Date().toISOString(),
                        };
                        sendToClient(controller, pingEvent);
                    } else {
                        clearInterval(pingInterval);
                    }
                } catch (_) {
                    clearInterval(pingInterval);
                }
            }, 30000);

            request.signal.addEventListener("abort", () => {
                console.log(`🔴 SSE disconnected: ${clientId}`);
                clearInterval(pingInterval);
                clients.delete(clientId);
                userStore.setUserConnection(userId, false);
            });
        },

        cancel() {
            console.log(`❌ SSE stream cancelled for user ${userId}`);
            clients.delete(`${roomId}-${userId}`);
            userStore.setUserConnection(userId, false);
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        },
    });
}

function sendToClient(
    controller: ReadableStreamDefaultController,
    event: PokerEvent
) {
    const encoder = new TextEncoder();
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

export function sendToRoom(roomId: string, event: PokerEvent) {
    const message = `data: ${JSON.stringify(event)}\n\n`;
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);

    let sentCount = 0;

    clients.forEach((client, clientId) => {
        if (client.roomId === roomId) {
            try {
                client.controller.enqueue(encodedMessage);
                sentCount++;
            } catch (error) {
                console.error(`Error sending to client ${clientId}:`, error);
                clients.delete(clientId);
            }
        }
    });

    console.log(
        `📤 Sent ${event.type} to ${sentCount} clients in room ${roomId}`
    );
}
