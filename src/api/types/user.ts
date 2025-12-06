export interface User {
    id: string;
    name: string;
    voted: boolean;
    vote?: number;
    connected: boolean;
}
