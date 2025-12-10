export interface Task {
    id: string;
    link: string;
    estimate: string | null;
    votes: Record<string, string | null>; // userId -> vote
}
