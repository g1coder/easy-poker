import { User } from "./user";

export interface Room {
    id: string;
    name: string;
    ownerId: string;
    status: "waiting" | "voting" | "revealed";
    users: User[];
}
