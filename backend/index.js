const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("./db");
const cors = require('cors');
const authRouter = require("./routes/auth-route");

const problemRouter = require("./routes/problem-route.js");
const dashboardRouter = require("./routes/dashboard-route.js");
const userRouter = require("./routes/user-route.js");
const solutionRouter = require("./routes/solution-route.js");
const blogRouter = require("./routes/blog-route.js");
const askAiRouter = require("./routes/askai-route.js");
const chatRouter = require("./routes/chatRoute.js");
const messageRoute = require("./routes/message-route.js");
const authMiddleware = require("./middlewares/auth-middelware.js");
const User = require("./models/user-model.js");
const { errorHandeler } = require("./utils/error.js");
dotenv.config();



const app = express();

app.use(cors({
  origin: ['https://z-coder-6nwp.vercel.app', 'https://z-coder.vercel.app'],  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

db.main().catch(err => console.log(err));

// Profile routes
app.get("/" , (req, res) => {
  res.send("Welcome to Zcoder API");
})

app.get("/myprofile/:userId", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("otherBookMarkedProblems");
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

app.put("/myprofile/:userId/updateprofile", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user_id = req.params.userId;

    if (userId.toString() !== user_id.toString()) {
      return next(errorHandeler(403, "Unauthorized: You are not allowed to update this profile."));
    }

    const { favlanguage, rating, platform, gitHub, projectslinks, skills, collaborator } = req.body;

    const updateData = {
      ...(favlanguage && { favlanguage }),
      ...(rating && { rating }),
      ...(platform && { platform }),
      ...(gitHub && { gitHub }),
      ...(projectslinks && { projectslinks }),
      ...(skills && { skills }),
      ...(typeof collaborator === "boolean" && { collaborator })
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return next(errorHandeler(404, "User not found"));
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
});

app.use("/", authRouter);
app.use("/", problemRouter);
app.use("/", dashboardRouter);
app.use("/", userRouter);
app.use("/blogs", blogRouter);
app.use("/problem/:problemId", solutionRouter);
app.use("/askai", askAiRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['https://z-coder-6nwp.vercel.app', 'https://z-coder.vercel.app'],
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Connected to socket:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(`User ${userData._id} connected`);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`Joined chat room: ${room}`);
  });

  socket.on("send message", (newMessageReceived) => {
    const chat = newMessageReceived.updatedChat;
    if (!chat.users) return console.log("Chat users not defined");

    chat.users.forEach((user) => {
      if (user.toString() !== newMessageReceived.newMessage.sender.toString()) {
        socket.in(parseInt(user)).emit("receive message", newMessageReceived);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});