const encryptKey = async (token: string) => {
    const secretKey = process.env.SESSION_SECRET;
    if (!secretKey) {
        throw new Error("SESSION_SECRET didn't set in environment variables");
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    if (keyData.length !== 32) {
        throw new Error("SESSION_SECRET should be 32 bytes (256 bits)");
    }

    const key = await crypto.subtle.importKey("raw", keyData, "AES-GCM", true, [
        "encrypt",
        "decrypt",
    ]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const payload = JSON.stringify(token);
    const payloadBytes = encoder.encode(payload);

    const encryptedArrayBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        payloadBytes
    );

    const encryptedBytes = new Uint8Array(encryptedArrayBuffer);
    const encryptedHex = Array.from(encryptedBytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    const ivHex = Array.from(iv)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

    return btoa(`${ivHex}:${encryptedHex}`);
};

const decryptKey = async (token?: string) => {
    try {
        if (!token) {
            return;
        }

        const [ivHex, encryptedHex] = atob(token).split(":");
        const secretKey = process.env.SESSION_SECRET;
        if (!secretKey) {
            throw new Error(
                "SESSION_SECRET didn't set in environment variables"
            );
        }

        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        if (keyData.length !== 32) {
            throw new Error("SESSION_SECRET should be 32 bytes (256 bits)");
        }

        const key = await crypto.subtle.importKey(
            "raw",
            keyData,
            "AES-GCM",
            true,
            ["encrypt", "decrypt"]
        );
        const iv = new Uint8Array(
            (ivHex.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16))
        );
        const encryptedBytes = new Uint8Array(
            (encryptedHex.match(/.{1,2}/g) || []).map((byte) =>
                parseInt(byte, 16)
            )
        );

        const decryptedArrayBuffer = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv,
            },
            key,
            encryptedBytes
        );

        const decoder = new TextDecoder();
        const decryptedText = decoder.decode(decryptedArrayBuffer);

        return JSON.parse(decryptedText) as string;
    } catch (error) {
        console.error(error);
        throw new Error("Token encryption error");
    }
};

export const cryptoHelper = {
    encryptKey,
    decryptKey,
} as const;
