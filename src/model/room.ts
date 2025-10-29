export enum RoomStatus {
    NOT_STARTED = 1,
    VOTING,
    VOITED,
    REVERTED,
}

export interface Room {
    id: string;
    ownerId: string;
    status: RoomStatus;
    currentItem: string;
}
