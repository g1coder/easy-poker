// lib/socket-server.js
const { Server: SocketIOServer } = require("socket.io");

const users = new Map();
const rooms = new Map();

class SocketHandler {
    static io = null;

    static initialize(httpServer) {
        if (this.io) {
            return this.io;
        }

        console.log("Initializing Socket.io server...");

        this.io = new SocketIOServer(httpServer, {
            path: "/api/socket/io",
            addTrailingSlash: false,
            cors: {
                origin:
                    process.env.NODE_ENV === "production"
                        ? ["https://yourdomain.com"]
                        : ["http://localhost:3000", "http://127.0.0.1:3000"],
                methods: ["GET", "POST"],
            },
        });

        this.setupEventHandlers();
        return this.io;
    }

    static setupEventHandlers() {
        if (!this.io) return;

        this.io.on("connection", (socket) => {
            console.log(`✅ User connected: ${socket.id}`);

            // Обработчик присоединения к комнате
            socket.on("join-room", (data) => {
                try {
                    const { roomId, username } = data;

                    const user = {
                        id: socket.id,
                        username: username || `User-${socket.id.slice(0, 6)}`,
                        roomId,
                    };

                    users.set(socket.id, user);
                    socket.data = {
                        username: user.username,
                        userId: socket.id,
                        roomId,
                    };

                    // Выходим из предыдущих комнат
                    const previousRooms = Array.from(socket.rooms).filter(
                        (room) => room !== socket.id
                    );
                    previousRooms.forEach((room) => {
                        socket.leave(room);
                        if (rooms.has(room)) {
                            rooms.get(room).delete(socket.id);
                        }
                    });

                    // Добавляем в новую комнату
                    if (!rooms.has(roomId)) {
                        rooms.set(roomId, new Set());
                    }
                    rooms.get(roomId).add(socket.id);

                    socket.join(roomId);

                    // Получаем пользователей комнаты
                    const roomUsers = Array.from(rooms.get(roomId) || [])
                        .map((userId) => users.get(userId))
                        .filter(Boolean);

                    // Уведомляем о новом пользователе
                    socket.to(roomId).emit("user-joined", {
                        user,
                        users: roomUsers,
                    });

                    // Отправляем список пользователей
                    socket.emit("room-users", { users: roomUsers });

                    console.log(
                        `👤 User ${user.username} joined room ${roomId}`
                    );
                } catch (error) {
                    console.error("Error in join-room:", error);
                }
            });

            // Обработчик отправки сообщения
            socket.on("send-message", (data) => {
                try {
                    const user = users.get(socket.id);
                    if (!user) return;

                    const message = {
                        id: `${socket.id}-${Date.now()}`,
                        text: data.text,
                        userId: socket.id,
                        username: user.username,
                        timestamp: new Date(),
                        roomId: data.roomId,
                    };

                    // Отправляем сообщение всем в комнате
                    this.io.to(data.roomId).emit("receive-message", message);
                    console.log(
                        `💬 Message sent to room ${data.roomId}: ${data.text}`
                    );
                } catch (error) {
                    console.error("Error in send-message:", error);
                }
            });

            // Обработчик начала набора текста
            socket.on("typing-start", (data) => {
                socket.to(data.roomId).emit("user-typing", {
                    username: data.username,
                    roomId: data.roomId,
                });
            });

            // Обработчик окончания набора текста
            socket.on("typing-stop", (data) => {
                socket.to(data.roomId).emit("user-stop-typing", {
                    roomId: data.roomId,
                });
            });

            // Обработчик отключения
            socket.on("disconnect", () => {
                try {
                    const user = users.get(socket.id);
                    if (user) {
                        const { roomId } = user;

                        // Удаляем пользователя из комнаты
                        if (rooms.has(roomId)) {
                            rooms.get(roomId).delete(socket.id);
                            if (rooms.get(roomId).size === 0) {
                                rooms.delete(roomId);
                            }
                        }

                        users.delete(socket.id);

                        // Получаем обновленный список
                        const roomUsers = Array.from(rooms.get(roomId) || [])
                            .map((userId) => users.get(userId))
                            .filter(Boolean);

                        // Уведомляем о выходе
                        socket.to(roomId).emit("user-left", {
                            user,
                            users: roomUsers,
                        });

                        console.log(
                            `👋 User ${user.username} left room ${roomId}`
                        );
                    }
                    console.log(`❌ User disconnected: ${socket.id}`);
                } catch (error) {
                    console.error("Error in disconnect:", error);
                }
            });

            // Обработка ошибок
            socket.on("error", (error) => {
                console.error(`Socket error for ${socket.id}:`, error);
            });
        });
    }

    static getIO() {
        if (!this.io) {
            throw new Error("Socket.io not initialized");
        }
        return this.io;
    }
}

module.exports = { SocketHandler };
