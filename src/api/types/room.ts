import { Task } from "./task";
import { User } from "./user";

export interface Room {
    id: string;
    name: string;
    ownerId: string;
    isOwner: boolean;
    status: "waiting" | "voting" | "revealed";
    tasks: Task[];
    users: User[];
}
