import { useState, useEffect, useCallback, useRef } from "react";
import { Room, PokerEvent } from "@/api/types";

interface UseRoomOptions {
    roomId: string;
    onEvent?: (event: PokerEvent) => void;
}

export const useRoom = (options: UseRoomOptions) => {
    const [room, setRoom] = useState<Room | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const eventSourceRef = useRef<EventSource | null>(null);
    const optionsRef = useRef(options);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const connectSSE = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        const params = new URLSearchParams({
            roomId: optionsRef.current.roomId,
        });

        const url = `/api/events?${params.toString()}`;

        console.log("🔄 Connecting to SSE...");

        try {
            const es = new EventSource(url);
            eventSourceRef.current = es;

            es.onopen = () => {
                console.log("✅ Poker SSE connected");
                setIsConnected(true);
            };

            es.onmessage = (event) => {
                try {
                    const pokerEvent: PokerEvent = JSON.parse(event.data);

                    console.log("GOT MSG", pokerEvent);

                    if (pokerEvent.data?.ping) return;

                    console.log("📨 Poker event:", pokerEvent.type);

                    switch (pokerEvent.type) {
                        case "user.ts-joined":
                        case "user.ts-left":
                        case "vote-started":
                        case "vote-reset":
                            setRoom(pokerEvent.data.room);
                            break;

                        case "vote-received":
                            setRoom(pokerEvent.data.room);
                            break;

                        case "votes-revealed":
                            setRoom(pokerEvent.data.room);
                            break;
                        case "new-tasks":
                            setRoom(pokerEvent.data.room);
                            break;
                    }

                    optionsRef.current.onEvent?.(pokerEvent);
                } catch (error) {
                    console.error("Error parsing poker event:", error);
                }
            };

            es.onerror = (error) => {
                console.error("❌ Poker SSE error:", error);
                setIsConnected(false);

                reconnectTimeoutRef.current = setTimeout(() => {
                    if (
                        eventSourceRef.current?.readyState !== EventSource.OPEN
                    ) {
                        connectSSE();
                    }
                }, 3000);
            };
        } catch (error) {
            console.error("Error creating EventSource:", error);
            setIsConnected(false);
        }
    }, []);

    const disconnectSSE = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        setIsConnected(false);
    }, []);

    useEffect(() => {
        connectSSE();

        return () => {
            disconnectSSE();
        };
    }, [connectSSE, disconnectSSE]);

    // const submitVote = useCallback(
    //     async (vote: number) => {
    //         try {
    //             const response = await fetch(
    //                 `/api/rooms/${options.roomId}/vote`,
    //                 {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({
    //                         userId: options.userId,
    //                         vote,
    //                     }),
    //                 }
    //             );
    //
    //             return response.ok;
    //         } catch (error) {
    //             console.error("Error submitting vote:", error);
    //             return false;
    //         }
    //     },
    //     [options.roomId, options.userId]
    // );
    //
    // const startVoting = useCallback(async () => {
    //     try {
    //         const response = await fetch(
    //             `/api/rooms/${options.roomId}/session`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     action: "start",
    //                     userId: options.userId,
    //                 }),
    //             }
    //         );
    //
    //         return response.ok;
    //     } catch (error) {
    //         console.error("Error starting voting:", error);
    //         return false;
    //     }
    // }, [options.roomId, options.userId]);
    //
    // const revealVotes = useCallback(async () => {
    //     try {
    //         const response = await fetch(
    //             `/api/rooms/${options.roomId}/session`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     action: "reveal",
    //                     userId: options.userId,
    //                 }),
    //             }
    //         );
    //
    //         return response.ok;
    //     } catch (error) {
    //         console.error("Error revealing votes:", error);
    //         return false;
    //     }
    // }, [options.roomId, options.userId]);
    //
    // const resetVotes = useCallback(async () => {
    //     try {
    //         const response = await fetch(
    //             `/api/rooms/${options.roomId}/session`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     action: "reset",
    //                     userId: options.userId,
    //                 }),
    //             }
    //         );
    //
    //         return response.ok;
    //     } catch (error) {
    //         console.error("Error resetting votes:", error);
    //         return false;
    //     }
    // }, [options.roomId, options.userId]);

    return {
        room,
        isConnected,
        // submitVote,
        // startVoting,
        // revealVotes,
        // resetVotes,
        reconnect: connectSSE,
    };
};
