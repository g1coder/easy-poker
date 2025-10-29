import { getRandomValues } from "node:crypto";
import { randomUUID } from "crypto";
import { User } from "@model/user";
import { cryptoHelper } from "@/lib/crypto-helper";

const generateToken = () => {
    const arr = new Uint8Array(12);
    getRandomValues(arr);
    return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
};

class UserStore {
    #sessions: Map<ReturnType<typeof generateToken>, User>;

    constructor() {
        this.#sessions = new Map();
    }

    public async createSession(user: Omit<User, "id">) {
        const token = generateToken();
        const encryptedToken = await cryptoHelper.encryptKey(token);
        this.#sessions.set(encryptedToken, { ...user, id: randomUUID() });
        return encryptedToken;
    }

    public getUser(token: ReturnType<typeof generateToken>) {
        return this.#sessions.get(token) || null;
    }
}

export const userStore = new UserStore();
