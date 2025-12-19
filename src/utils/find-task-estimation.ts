export const findTaskEstimation = (votes: Record<string, string>) => {
    const scoreArray = Object.values(votes);
    if (scoreArray.length === 0) return null;

    const frequency = scoreArray.reduce(
        (acc, score) => {
            acc[+score] = (acc[+score] || 0) + 1;
            return acc;
        },
        {} as Record<number, number>
    );

    const maxFrequency = Math.max(...Object.values(frequency));

    const topScores = Object.entries(frequency)
        .filter(([_, count]) => count === maxFrequency)
        .map(([score]) => Number(score));

    return topScores.length === 1 ? topScores[0] : null;
};
