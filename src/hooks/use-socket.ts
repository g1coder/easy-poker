// hooks/useSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@/model/socket";

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export const useSocket = () => {
    const [socket, setSocket] = useState<SocketType | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Socket подключается к тому же хосту
        const socketInstance: SocketType = io({
            path: "/api/socket/io",
            addTrailingSlash: false,
            transports: ["websocket", "polling"],
        });

        const onConnect = () => {
            console.log("✅ Connected to WebSocket server");
            setIsConnected(true);
        };

        const onDisconnect = () => {
            console.log("❌ Disconnected from WebSocket server");
            setIsConnected(false);
        };

        const onError = (error: Error) => {
            console.error("WebSocket error:", error);
        };

        socketInstance.on("connect", onConnect);
        socketInstance.on("disconnect", onDisconnect);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        socketInstance.on("error", onError);

        setSocket(socketInstance);

        return () => {
            socketInstance.off("connect", onConnect);
            socketInstance.off("disconnect", onDisconnect);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            socketInstance.off("error", onError);
            socketInstance.disconnect();
        };
    }, []);

    return {
        socket,
        isConnected,
    };
};
