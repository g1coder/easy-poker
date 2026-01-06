"use client";

import { createContext } from "use-context-selector";
import { FC, PropsWithChildren } from "react";
import { RoomDto, TaskDto, User } from "@/api";
import { useRoom } from "@/hooks/use-room";

export interface RoomContext {
    users: User[];
    tasks: TaskDto[];
}

export const RoomContext = createContext<RoomContext>({
    users: [],
    tasks: [],
});

export const RoomProvider: FC<PropsWithChildren<{ room: RoomDto }>> = ({
    room,
    children,
}) => {
    const { users, tasks } = useRoom({ room });

    return (
        <RoomContext.Provider value={{ users, tasks }}>
            {children}
        </RoomContext.Provider>
    );
};
