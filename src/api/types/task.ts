export interface Task {
    id: string;
    link: string;
    votes: Record<string, number | null>; // userId -> vote
    estimate: number | null;
}
