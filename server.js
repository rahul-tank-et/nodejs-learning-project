require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const connectToDB = require("./database/db");
const bookRoutes = require("./routes/book-routes");
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");
const uploadImageRoutes = require("./routes/image-routes");
const productRoutes = require("./routes/product-routes");
const newBookRoutes = require("./routes/new-book-routes");

const app = express();

const PORT = process.env.PORT || 3000;

// Connect to database
connectToDB();

// Put the upload image route before express.json() middleware as it uses multipart/form-data
app.use("/api/image", uploadImageRoutes);

// Middleware -> express.json()
app.use(express.json());

// routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/new-book", newBookRoutes);

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);

const io = socketIo(server);

app.use(express.static("public"));

const users = new Set();

io.on("connection", (socket) => {
  console.log("A user is now connected");

  // handle users when they will join
  socket.on("join", (userName) => {
    users.add(userName);
    socket.userName = userName;

    //  brodcast to all users that a new user has joined
    io.emit("userJoined", userName);

    // send the updated user list to all clients
    io.emit("userList", Array.from(users));
  });

  // handle incoming chat messages
  socket.on("chatMessage", (message) => {
    // brodcast the message to all connected clients
    io.emit("chatMessage", message);
  });

  // handle disconnection
  socket.on("disconnect", () => {
    console.log("A user has disconnected");
    users.forEach((user) => {
      if (user === socket.userName) {
        users.delete(user);
        io.emit("userLeft", user);

        io.emit("userList", Array.from(users));
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
