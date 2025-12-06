import { Task } from "./task";

export interface Room {
    id: string;
    name: string;
    ownerId: string;
    isOwner: boolean;
    status: "waiting" | "voting" | "revealed";
    tasks: Map<string, Task>;
}
