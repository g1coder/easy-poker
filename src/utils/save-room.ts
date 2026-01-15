import { Room, RoomDto, TaskDto } from "@/api";

export const saveRoom = (room: Room, tasks: TaskDto[]) => {
    const payload = {
        room,
        tasks,
    };

    localStorage.setItem(room.id, JSON.stringify(payload));
};

export const restoreRoom = (roomId: string) => {
    const stored = localStorage.getItem(roomId);
    if (stored && stored) {
        return JSON.parse(stored) as {
            room: RoomDto;
            tasks: TaskDto[];
        };
    }

    return null;
};
