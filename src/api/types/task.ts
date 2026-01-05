export interface Task {
    id: string;
    link: string;
    estimate: number | null;
    /*
        waiting - еще никто не голосовал
        voting - как минимум 1 проголосовал
        revealed - голосование окончено, карты вскрыты
        finished - голосование окончено + заморожено, карты закрыты
     */
    status: "waiting" | "voting" | "revealed" | "finished";
    preEstimate: number | null;
    votes: Record<string, string>; // userId -> voited
    // owner only
    userVotes: Record<string, number>; // userId -> vote
}
