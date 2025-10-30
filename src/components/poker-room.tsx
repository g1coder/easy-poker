"use client";

import { usePoker } from "@/hooks/use-pocker";

interface PokerRoomProps {
    roomId: string;
    userId: string;
    userName: string;
}

export default function PokerRoom({
    roomId,
    userId,
    userName,
}: PokerRoomProps) {
    const {
        room,
        users,
        isConnected,
        submitVote,
        startVoting,
        revealVotes,
        resetVotes,
    } = usePoker({
        roomId,
        userId,
        onEvent: (event) => {
            console.log("Poker event received:", event.type);
        },
    });

    const currentUser = users.find((u) => u.id === userId);
    const isOwner = currentUser?.isOwner || false;

    if (!room) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <div>Loading room...</div>
                <div
                    style={{
                        marginTop: "10px",
                        color: isConnected ? "green" : "red",
                    }}
                >
                    Status: {isConnected ? "Connected" : "Disconnected"}
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #eee",
                }}
            >
                <div>
                    <h1 style={{ margin: 0 }}>{room.name}</h1>
                    <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                        Room ID: {roomId} | Your name: {userName}
                        {isOwner && " (Owner)"}
                    </p>
                </div>
                <div
                    style={{
                        padding: "8px 16px",
                        backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
                        color: isConnected ? "#155724" : "#721c24",
                        borderRadius: "4px",
                        fontSize: "14px",
                    }}
                >
                    {isConnected ? "Connected" : "Disconnected"}
                </div>
            </div>

            <div style={{ display: "flex", gap: "30px" }}>
                {/* Участники */}
                <div style={{ flex: "0 0 300px" }}>
                    <h2 style={{ marginBottom: "15px" }}>
                        Participants ({users.length})
                    </h2>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        {users.map((user) => (
                            <div
                                key={user.id}
                                style={{
                                    padding: "12px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    backgroundColor: user.connected
                                        ? "#fff"
                                        : "#f8f9fa",
                                    opacity: user.connected ? 1 : 0.6,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        {user.name}
                                        {user.isOwner && " 👑"}
                                        {user.id === userId && " (You)"}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: user.connected
                                                ? "#28a745"
                                                : "#6c757d",
                                        }}
                                    >
                                        {user.connected ? "online" : "offline"}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        marginTop: "8px",
                                        fontSize: "14px",
                                        color: "#666",
                                    }}
                                >
                                    {room.status === "revealed" &&
                                    user.voted ? (
                                        <span>Voted: {user.vote}</span>
                                    ) : user.voted ? (
                                        <span style={{ color: "#28a745" }}>
                                            ✅ Voted
                                        </span>
                                    ) : room.status === "voting" ? (
                                        <span style={{ color: "#dc3545" }}>
                                            ❌ Not voted
                                        </span>
                                    ) : (
                                        <span>Waiting...</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Основная область */}
                <div style={{ flex: 1 }}>
                    {/* Статус сессии */}
                    <div
                        style={{
                            padding: "20px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            textAlign: "center",
                        }}
                    >
                        <h2 style={{ margin: "0 0 10px 0" }}>
                            {room.status === "waiting" && "Waiting to start..."}
                            {room.status === "voting" &&
                                "Voting in progress..."}
                            {room.status === "revealed" && "Votes revealed!"}
                        </h2>

                        {room.status === "revealed" &&
                            room.average !== undefined && (
                                <p
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        margin: 0,
                                    }}
                                >
                                    Average: {room.average}
                                </p>
                            )}
                    </div>

                    {/* Карточки для голосования */}
                    {room.status === "voting" && (
                        <div style={{ marginBottom: "30px" }}>
                            <h3
                                style={{
                                    textAlign: "center",
                                    marginBottom: "15px",
                                }}
                            >
                                Select your estimate:
                            </h3>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                }}
                            >
                                {room.cards.map((card) => (
                                    <button
                                        key={card}
                                        onClick={() => submitVote(card)}
                                        disabled={currentUser?.voted}
                                        style={{
                                            width: "80px",
                                            height: "120px",
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                            border: "2px solid #007bff",
                                            borderRadius: "8px",
                                            backgroundColor: currentUser?.voted
                                                ? "#f8f9fa"
                                                : "white",
                                            color: "#007bff",
                                            cursor: currentUser?.voted
                                                ? "not-allowed"
                                                : "pointer",
                                            opacity: currentUser?.voted
                                                ? 0.6
                                                : 1,
                                        }}
                                    >
                                        {card}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Управление для владельца */}
                    {isOwner && (
                        <div
                            style={{
                                padding: "20px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                backgroundColor: "#f8f9fa",
                            }}
                        >
                            <h3 style={{ marginTop: 0 }}>Room Controls</h3>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                }}
                            >
                                {room.status === "waiting" && (
                                    <button
                                        onClick={startVoting}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Start Voting
                                    </button>
                                )}

                                {room.status === "voting" && (
                                    <button
                                        onClick={revealVotes}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#28a745",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Reveal Votes
                                    </button>
                                )}

                                {room.status === "revealed" && (
                                    <button
                                        onClick={resetVotes}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#6c757d",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        New Round
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
