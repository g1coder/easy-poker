import { Task } from "@/api";

export interface User {
    id: string;
    name: string;
    isOwner: boolean;
    voted: boolean;
    vote?: number;
    connected: boolean;
}

export interface Room {
    id: string;
    name: string;
    ownerId: string;
    isOwner: boolean;
    status: "waiting" | "voting" | "revealed";
    votes: Record<string, number>;
    average?: number;
    cards: number[];
    tasks: Map<string, Task>;
}

export interface PokerEvent {
    type:
        | "user-joined"
        | "user-left"
        | "vote-started"
        | "vote-received"
        | "votes-revealed"
        | "vote-reset";
    // eslint-disable-next-line
    data: any;
    timestamp: string;
}

export interface VoteResult {
    userId: string;
    userName: string;
    vote: number;
}
