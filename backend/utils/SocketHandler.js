// SocketHandler.js
const jwt = require("jsonwebtoken");
const User = require("../models/user-model.js");
const Message = require("../models/message-model.js"); 
const CollaborationRequest = require("../models/collaborationRequest-schema.js");

module.exports = (io) => {
    
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
                    user: newMess.user.username,
                    text: newMess.text,
                    timestamp: newMess.timestamp,
                };

                
                io.to(problemId).emit("message", chatMessage);
            } catch (err) {
                console.error("Error saving chat message:", err);
            }
        });
        // Handle sending an invite notification
        socket.on("sendInvite", async (data) => {
            const { recipientId, projectDetails, paymentOffer } = data;

            try {
                // Create a new collaboration request in the database
                const newInvite = new CollaborationRequest({
                    requester: socket.user._id,
                    recipient: recipientId,
                    projectDetails,
                    paymentOffer,
                });
                await newInvite.save();

                // Emit notification to the recipient
                io.to(recipientId).emit("inviteNotification", {
                    message: `You received a collaboration invite from ${socket.user.username}`,
                    projectDetails,
                    paymentOffer,
                    inviteId: newInvite._id,
                });
            } catch (error) {
                console.error("Error sending invite:", error);
            }
        });

        // Handle accepting an invite
        socket.on("acceptInvite", async (inviteId) => {
            try {
                const invite = await CollaborationRequest.findById(inviteId);
                if (invite) {
                    invite.status = 'Accepted';
                    await invite.save();

                    // Notify the requester that the invite was accepted
                    io.to(invite.requester.toString()).emit("inviteNotification", {
                        message: `${socket.user.username} has accepted your collaboration invite!`,
                        inviteId,
                    });
                }
            } catch (error) {
                console.error("Error accepting invite:", error);
            }
        });

        // Handle declining an invite
        socket.on("declineInvite", async (inviteId) => {
            try {
                const invite = await CollaborationRequest.findById(inviteId);
                if (invite) {
                    invite.status = 'Declined';
                    await invite.save();

                    // Notify the requester that the invite was declined
                    io.to(invite.requester.toString()).emit("inviteNotification", {
                        message: `${socket.user.username} has declined your collaboration invite.`,
                        inviteId,
                    });
                }
            } catch (error) {
                console.error("Error declining invite:", error);
            }
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.user.username}`);
            // Optionally, notify rooms about the disconnection
        });
    });
};
