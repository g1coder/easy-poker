type PokerEventType =
    | "ping"
    | "user.joined"
    | "user.left"
    | "user.voted" // какой то юзер проголосовал по задаче, отображаем статус
    | "task.added" // добавлена новая задача, отрисовываем ее у юзеров
    | "task.revealed" // вскрыты карты для конкретной таски, отправляем юзерам инфу о голосовании
    | "task.reset"
    | "task.done"; // морозим голосовалку и отображаем

export interface PokerEvent {
    type: PokerEventType;
    // eslint-disable-next-line
    data: any;
}

export type VoteControlAction = "reveal" | "reset" | "done";
