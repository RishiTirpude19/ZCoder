const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user-model");
const { errorHandeler } = require("../utils/error");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false, 
            message: "Please Login to access this resource"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password")
        if (!req.user) {
            return res.status(401).json({
                success: false, 
                message: "User not found, please login again"
            });
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false, 
            message: "Invalid token, please login again"
        });
    }
};

module.exports = authMiddleware;
