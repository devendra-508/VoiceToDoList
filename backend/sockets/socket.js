const jwt = require("jsonwebtoken");

// Each authenticated user joins a room keyed by their own user id, so
// controllers can emit real-time todo updates that sync across every
// open tab/device for that user without broadcasting to everyone.
function initSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);
    console.log(`Socket connected for user ${socket.userId}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected for user ${socket.userId}`);
    });
  });
}

module.exports = initSocket;
