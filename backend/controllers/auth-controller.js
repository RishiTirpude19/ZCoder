const User = require("../models/user-model");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const {errorHandeler} = require("../utils/error"); 

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body; 
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt); 
        const user = new User({
            username,
            email,
            password: hashPassword,
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
        const { password: savedPassword, ...rest } = user._doc;
        res.cookie("token", token, {  httpOnly: true,
        secure: true, sameSite: 'none'}).status(200).json({ message: "User created successfully", token , user: { _id: user._id, username: user.username, email: user.email }});
    } catch (error) {
        next(error);
    }
}

module.exports.signin = async (req,res,next)=>{
    try {
        const {email , password} = req.body;
        let validUser = await User.findOne({ email });
        if(!validUser){
            return res.status(404).json({message: "User not found"});
        }
        const validPassword = await bcryptjs.compare(password , validUser.password);
        if(!validPassword) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = jwt.sign({id: validUser._id }, JWT_SECRET, { expiresIn: '24h' });
        const {password : hashPassword , ...rest} = validUser._doc;
        res.cookie("token" , token , {httpOnly :true , secure: true, sameSite: 'none'}).status(200).json({ message: "User created successfully", token , user: { _id: validUser._id, username: validUser.username, email: validUser.email }});
    } catch (error) {
        next(error);
    }
}

module.exports.logout = async(req,res,next)=>{
    try {
        res.clearCookie("token" ,{httpOnly: true,sameSite: 'lax',}).status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}

module.exports.checkAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ user: req.user });
}