export interface PokerEvent {
    type:
        | "user.ts-joined"
        | "user.ts-left"
        | "vote-started"
        | "vote-received"
        | "votes-revealed"
        | "vote-reset"
        | "new-tasks";
    // eslint-disable-next-line
    data: any;
    timestamp: string;
}

export interface VoteResult {
    userId: string;
    userName: string;
    vote: number;
}
