import { NextRequest } from "next/server";
import { roomStore, userStore } from "@/api";
import { PokerEvent } from "@/api/types";
import {
    getRoomOrError,
    getUserTokenOrError,
    hideTaskVotes,
} from "@api/helpers";

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

    getRoomOrError(roomId);
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

            const initialEvent: PokerEvent = {
                type: "user.joined",
                data: {
                    tasks: hideTaskVotes(
                        roomStore.getRoomTasks(roomId),
                        userId
                    ),
                    users: roomStore.getRoomUsers(roomId),
                },
            };

            sendToClient(controller, initialEvent);

            const pingInterval = setInterval(() => {
                try {
                    if (clients.has(clientId)) {
                        const pingEvent: PokerEvent = {
                            type: "ping",
                            data: { ping: true },
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
    const message = `data: ${JSON.stringify({ ...event, timestamp: new Date().toISOString() })}\n\n`;
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

export function sendHidedTaskToRoom(roomId: string, event: PokerEvent) {
    let sentCount = 0;

    clients.forEach((client, clientId) => {
        if (client.roomId === roomId) {
            const payload = {
                ...event,
                data: {
                    ...event.data,
                    tasks: hideTaskVotes(event.data.tasks, client.userId),
                },
                timestamp: new Date().toISOString(),
            };

            const message = `data: ${JSON.stringify(payload)}\n\n`;
            const encoder = new TextEncoder();
            const encodedMessage = encoder.encode(message);

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
