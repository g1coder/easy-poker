export interface Item {
    id: string;
    votes: Map<string, number>; // userId: vote
}
