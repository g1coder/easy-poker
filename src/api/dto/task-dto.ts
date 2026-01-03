export interface TaskDto {
    id: string;
    link: string;
    estimate: number | null;
    status: "waiting" | "voting" | "revealed" | "finished";
    preEstimate: number | null;
    votes: Record<string, string>; // userId -> vote
}
