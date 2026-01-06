const MIN_USERS = 5;

export const findTaskEstimation = (
    votes: Record<string, string>, // userId -> оценка
    users: string[],
    isOwnerVoting: boolean,
    ignoreQuorum = false
) => {
    const totalUsers = users.length - (isOwnerVoting ? 0 : 1);
    const majorityThreshold = Math.ceil(totalUsers / 2); // > 50%

    // 2. Собираем только валидные голоса
    const userVotes = users
        .map((userId) => votes[userId])
        .filter((vote) => vote && vote.trim().length > 0);

    // 3. Проверяем, что есть достаточное количество голосов или если игнорим кворум
    if (!ignoreQuorum && userVotes.length < majorityThreshold) {
        return null;
    }

    // 4. Подсчитываем голоса
    const voteCount: Record<string, number> = {};
    userVotes.forEach((vote) => {
        voteCount[vote] = (voteCount[vote] || 0) + 1;
    });

    // 5. Ищем победителя
    let winner: string | null = null;
    let maxCount = 0;

    Object.entries(voteCount).forEach(([vote, count]) => {
        if (count > maxCount) {
            maxCount = count;
            winner = vote;
        }
    });

    // выдаем average
    if (ignoreQuorum) {
        const numericVotes = users
            .map((userId) => Number(votes[userId] || ""))
            .filter((vote) => !isNaN(vote));
        return findMostFrequent(numericVotes);
    }

    // 6. Проверяем условие большинства
    if (users.length >= MIN_USERS && winner && maxCount >= majorityThreshold) {
        return winner;
    }

    return null;
};

function findMostFrequent(arr: number[]) {
    const frequencyMap = new Map();
    for (const num of arr) {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
    }
    const maxCount = Math.max(...frequencyMap.values());

    const mostFrequentNumbers: number[] = [];
    for (const [num, count] of frequencyMap) {
        if (count === maxCount) {
            mostFrequentNumbers.push(num);
        }
    }

    return mostFrequentNumbers.length === 1
        ? String(mostFrequentNumbers[0])
        : null;
}
