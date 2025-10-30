// server.js
const { createServer } = require("http");
const next = require("next");
const { SocketHandler } = require("./lib/socket-server");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Инициализируем Next.js
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    // Создаем HTTP сервер
    const httpServer = createServer((req, res) => {
        return handler(req, res);
    });

    // Инициализируем Socket.io
    SocketHandler.initialize(httpServer);

    // Запускаем сервер
    httpServer
        .once("error", (err) => {
            console.error("Server error:", err);
            process.exit(1);
        })
        .listen(port, (err) => {
            if (err) throw err;
            console.log(`> 🚀 Ready on http://${hostname}:${port}`);
            console.log(
                `> 📡 WebSocket server running on path: /api/socket/io`
            );
        });
});

// Обработка graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    process.exit(0);
});
