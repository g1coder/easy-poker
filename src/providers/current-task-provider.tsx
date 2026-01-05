"use client";

import {
    FC,
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { TaskDto } from "@/api";
import { RoomContext } from "@/providers";

interface CurrentTaskContextProps {
    currentTask: TaskDto | null;
    selectTask: (taskId: TaskDto["id"]) => void;
}

export const CurrentTaskContext = createContext<CurrentTaskContextProps>({
    currentTask: null,
    selectTask: () => {
        return;
    },
});

export const CurrentTaskProvider: FC<PropsWithChildren> = ({ children }) => {
    const [task, setTask] = useState<TaskDto | null>(null);
    const tasks = useContextSelector(RoomContext, (c) => c.tasks);

    const selectTaskHandler = useCallback(
        (id: string) => {
            const found = tasks.find((item) => item.id === id);
            setTask(found || null);
        },
        [tasks]
    );

    useEffect(() => {
        if (task) {
            selectTaskHandler(task?.id);
        }
    }, [tasks, selectTaskHandler]);

    const contextValue = useMemo<CurrentTaskContextProps>(
        () => ({
            currentTask: task,
            selectTask: selectTaskHandler,
        }),
        [task, selectTaskHandler]
    );

    return (
        <CurrentTaskContext.Provider value={contextValue}>
            {children}
        </CurrentTaskContext.Provider>
    );
};
