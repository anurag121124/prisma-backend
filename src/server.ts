import { Server } from "socket.io";
import http from "http";
import app from "./app"; // Ensure this import points to the correct path of the app.ts file

const port = process.env.PORT || 4000;

// Wrap the Express app with an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
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
