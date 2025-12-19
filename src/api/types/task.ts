export interface Task {
    id: string;
    link: string;
    estimate: number | null;
    votes: Record<string, string>; // userId -> vote
    status: "waiting" | "voting" | "revealed" | "finished";
}
