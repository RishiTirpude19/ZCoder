// SocketHandler.js
const jwt = require("jsonwebtoken");
const User = require("../models/user-model.js");
const Message = require("../models/message-model.js"); 

module.exports = (io) => {
    // Middleware for authenticating Socket.IO connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            console.log("Received token:", token); // Debugging

            if (!token) {
                console.error("Authentication error: Token not found");
                return next(new Error("Authentication error: Token not found"));
            }

            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            socket.user = user; // Attach user info to the socket
            console.log(socket.user);
            next(); // Proceed to the connection handler
        } catch (err) {
            console.error("Socket.IO authentication error:", err.message);
            next(new Error("Authentication error"));
        }
    });

    // Handle Socket.IO connections
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.username}`);

        // Handle joining a specific room
        socket.on("joinRoom", async (problemId) => {
            socket.join(problemId);
            console.log(`${socket.user.username} joined room: ${problemId}`);

            try {
                // Fetch recent messages for the room
                const recentMessages = await Message.find({ problem: problemId })
                    .sort({ timestamp: -1 })
                    .limit(50)
                    .populate('user', 'username') // Populate only the username
                    .lean();

                // Transform messages to ensure 'user' is a string
                const transformedMessages = recentMessages.map(msg => ({
                    user: msg.user.username, // Convert user object to username string
                    text: msg.text,
                    timestamp: msg.timestamp,
                }));

                // Send chat history to the user
                socket.emit("chatHistory", transformedMessages.reverse());

                // Notify others in the room about the new user
                socket.to(problemId).emit("message", {
                    user: "System",
                    text: `${socket.user.username} has joined the discussion.`,
                    timestamp: new Date(),
                });
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        });

        // Handle incoming chat messages
        socket.on("chatMessage", async (data) => {
            const { problemId, message } = data;
            try {
                // Create and save the new message
                const newMessage = new Message({
                    problem: problemId,
                    user: socket.user.id, // Ensure this matches your decoded token
                    text: message,
                });
                await newMessage.save();
                const newMess = await Message.findById(newMessage._id).populate("user" , "username")

                // Prepare the message to be broadcasted with 'user' as string
                const chatMessage = {
                    user: newMess.user.username, // Convert to string
                    text: newMess.text,
                    timestamp: newMess.timestamp,
                };

                // Emit the message to all users in the room
                io.to(problemId).emit("message", chatMessage);
            } catch (err) {
                console.error("Error saving chat message:", err);
            }
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user.username}`);
            // Optionally, notify rooms about the disconnection
        });
    });
};
