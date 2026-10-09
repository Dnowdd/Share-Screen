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

const sharers = new Map();

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Socket connected ", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected ", socket.id);

    const roomId = socket.data.roomId;
    if (!roomId) return;

    if (sharers.get(roomId) === socket.id) {
      sharers.delete(roomId);
      io.to(roomId).emit("screen:stopped");
    }

    const active = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
    io.to(roomId).emit("users:active", active);
  });

  socket.on("room:join", (roomId: unknown) => {
    if (typeof roomId !== "string" || roomId.length !== 6) return;

    socket.join(roomId);
    socket.data.roomId = roomId;

    const active = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
    io.to(roomId).emit("users:active", active);

    if (sharers.get(roomId)) {
      socket.emit("screen:started", sharers.get(roomId));
    }

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

  socket.on("screen:start", () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    if (sharers.get(roomId)) return;

    sharers.set(roomId, socket.id);
    socket.to(roomId).emit("screen:started", socket.id);
  });

  socket.on("screen:stop", () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    if (!sharers.get(roomId) || sharers.get(roomId) !== socket.id) return;

    sharers.delete(roomId);
    socket.to(roomId).emit("screen:stopped");
  });

  socket.on("rtc:signal", (payload: { to: string; data: unknown }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const { to, data } = payload;
    if (typeof to !== "string") return;
    if (!io.sockets.adapter.rooms.get(roomId)?.has(to)) return;

    io.to(to).emit("rtc:signal", { from: socket.id, data });
  });
});

httpServer.listen(port, () => {
  console.log(`> Running in http://localhost:${port}`);
});
