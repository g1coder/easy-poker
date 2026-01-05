import { useState, useEffect, useCallback, useRef } from "react";
import { PokerEvent, User } from "@/api/types";
import { TaskDto } from "@/api";

interface UseRoomOptions {
    roomId: string;
}

export const useRoom = (options: UseRoomOptions) => {
    const [tasks, setTasks] = useState<TaskDto[]>([]);
    const [users, setUsers] = useState<User[]>([]);
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
                    if (pokerEvent.data?.ping) return;

                    switch (pokerEvent.type) {
                        case "user.joined":
                        case "user.left":
                            setTasks(pokerEvent.data.tasks);
                            setUsers(pokerEvent.data.users);
                            break;
                        case "user.voted":
                        case "task.added":
                        case "task.revealed":
                        case "task.reset":
                        case "task.done":
                            setTasks(pokerEvent.data.tasks);
                    }
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

    return {
        tasks,
        users,
        isConnected,
        reconnect: connectSSE,
    };
};
