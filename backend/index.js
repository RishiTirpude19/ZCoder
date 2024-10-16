const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const dotenv = require("dotenv");
const db = require("./db");
const cors = require('cors');
const authRouter = require("./routes/auth-route");
const problemRouter = require("./routes/problem-route.js");
const dashboardRouter = require("./routes/dashboard-route.js");
const userRouter = require("./routes/user-route.js");
const solutionRouter = require("./routes/solution-route.js");
const blogRouter = require("./routes/blog-route.js")
const authMiddleware = require("./middlewares/auth-middelware.js");
const User = require("./models/user-model.js");
const { errorHandeler } = require("./utils/error.js");
const jwt = require("jsonwebtoken");
const socketHandler = require("./utils/SocketHandler.js"); 
dotenv.config();

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

app.use(cors({
    origin: 'http://localhost:5173',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

db.main().catch(err => console.log(err));


app.get("/myprofile/:userId" ,authMiddleware, async (req,res ,next)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate("otherBookMarkedProblems");
        res.status(200).json({user : user});
    } catch (error) {
        next(error)
    }
    
})

app.put("/myprofile/:userId/updateprofile", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user._id; 
        const user_id = req.params.userId;
        if(userId.toString() !== user_id.toString()){
            next(errorHandeler(404, "Bad Request , Not authorised to update this profile"));
        }
        const { favlanguage, rating, platform } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { favlanguage, rating, platform },
            { new: true } 
        );

        if (!updatedUser) {
            return next(errorHandeler(404, "User not found"));
        }

        res.status(200).json({ user: updatedUser });
    } catch (error) {
        next(error);
    }
});


app.use("/" , authRouter);
app.use("/" , problemRouter);
app.use("/" , dashboardRouter);
app.use("/" , userRouter);
app.use("/blogs" , blogRouter);
app.use("/problem/:problemId" , solutionRouter)

app.use((err , req ,res ,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";
    return res.status(statusCode).json({
        success : false,
        message,
        statusCode,
    })
})
socketHandler(io); 

const port = process.env.PORT; 
server.listen(port , ()=>{ 
    console.log(`Server is Listening on port : ${port}`);
});