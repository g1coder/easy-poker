import { User } from "./user";

export interface Room {
    id: string;
    name: string;
    status: "waiting" | "voting" | "revealed";
    ownerId: string;
    users: User[];
}
