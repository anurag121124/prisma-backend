"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app")); // Ensure this import points to the correct path of the app.ts file
const port = process.env.PORT || 4000;
// Wrap the Express app with an HTTP server
const server = http_1.default.createServer(app_1.default);
// Initialize Socket.IO with the HTTP server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Adjust this as per your CORS policy
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
    socket.on("message", (msg) => {
        console.log("Message received:", msg);
        io.emit("message", msg); // Broadcast the message to all clients
    });
});
// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
