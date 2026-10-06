import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer((req, res) => {
  handle(req, res);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Socket connected ", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected ", socket.id);
  });

  socket.on("room:join", (roomId: unknown) => {
    if (typeof roomId !== "string" || roomId.length !== 6) return;

    socket.join(roomId);
    socket.data.roomId = roomId;

    console.log(`${socket.id} joined in room ${roomId}`);
  });

  socket.on("chat:message", (text: unknown) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    if (typeof text !== "string") return;
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 500) return;

    io.to(roomId).emit("chat:message", {
      id: crypto.randomUUID(),
      text: trimmed,
      authorId: socket.id,
      sentAt: Date.now(),
    });
  });
});

httpServer.listen(port, () => {
  console.log(`> Running in http://localhost:${port}`);
});
