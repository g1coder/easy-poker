"use client";

import { createContext } from "use-context-selector";
import { FC, PropsWithChildren } from "react";
import { TaskDto, User } from "@/api";
import { useRoom } from "@/hooks/use-room";

export interface RoomContext {
    users: User[];
    tasks: TaskDto[];
}

export const RoomContext = createContext<RoomContext>({
    users: [],
    tasks: [],
});

export const RoomProvider: FC<PropsWithChildren<{ roomId: string }>> = ({
    roomId,
    children,
}) => {
    const { users, tasks } = useRoom({ roomId });

    return (
        <RoomContext.Provider value={{ users, tasks }}>
            {children}
        </RoomContext.Provider>
    );
};
