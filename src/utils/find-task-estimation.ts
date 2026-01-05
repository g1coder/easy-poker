const MIN_USERS = 5;

export const findTaskEstimation = (
    votes: Record<string, string>, // userId -> оценка
    users: string[],
    ignoreQuorum = false
) => {
    const totalUsers = users.length;
    const majorityThreshold = Math.ceil(totalUsers / 2); // > 50%

    // 2. Собираем только валидные голоса
    const userVotes = users
        .map((userId) => votes[userId])
        .filter((vote) => vote && vote.trim().length > 0);

    // 3. Проверяем, что есть достаточное количество голосов
    if (userVotes.length < majorityThreshold) {
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

    // 6. Проверяем условие большинства
    if (ignoreQuorum) {
        return winner;
    }

    if (users.length >= MIN_USERS && winner && maxCount >= majorityThreshold) {
        return winner;
    }

    return null;
};
