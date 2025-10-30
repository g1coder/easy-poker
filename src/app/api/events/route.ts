import { NextRequest } from "next/server";
import { roomManager } from "@/lib/rooms";
import { PokerEvent } from "@/types";

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
    const userId = request.nextUrl.searchParams.get("userId");

    if (!roomId || !userId) {
        return new Response("Missing roomId or userId", { status: 400 });
    }

    // Проверяем существование комнаты
    const room = roomManager.getRoom(roomId);
    if (!room) {
        return new Response("Room not found", { status: 404 });
    }

    // Обновляем статус подключения пользователя
    roomManager.setUserConnection(userId, true);

    const stream = new ReadableStream({
        start(controller) {
            const clientId = `${roomId}-${userId}`;

            clients.set(clientId, {
                roomId,
                userId,
                controller,
            });

            console.log(`🔗 SSE connected: ${clientId}`);

            // Отправляем начальное состояние
            const roomUsers = roomManager.getRoomUsers(roomId);
            const initialEvent: PokerEvent = {
                type: "user-joined",
                data: {
                    room,
                    users: roomUsers,
                },
                timestamp: new Date().toISOString(),
            };

            sendToClient(controller, initialEvent);

            // Ping каждые 30 секунд
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

            // Обработка отключения
            request.signal.addEventListener("abort", () => {
                console.log(`🔴 SSE disconnected: ${clientId}`);
                clearInterval(pingInterval);
                clients.delete(clientId);
                roomManager.setUserConnection(userId, false);
            });
        },

        cancel() {
            console.log(`❌ SSE stream cancelled for user ${userId}`);
            clients.delete(`${roomId}-${userId}`);
            roomManager.setUserConnection(userId, false);
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
