export interface User {
    id: string;
    name: string;
    isOwner: string;
    hasVoted: boolean;
    currentVote: number | undefined;
}
