import { User } from "./user";

export interface Room {
    id: string;
    name: string;
    ownerId: string;
    users: User[];
    skipVote: boolean;
}
