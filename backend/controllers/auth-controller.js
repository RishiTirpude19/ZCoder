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
        console.log(user);
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        const { password: savedPassword, ...rest } = user._doc;
        res.cookie("token", token, { httpOnly: true }).status(200).json({ ...rest, token });
    } catch (error) {
        next(error);
    }
}

module.exports.signin = async (req,res,next)=>{
    try {
        if (req.cookies.token) {
            return next(errorHandeler(400, "User already signed in"));
        }
        const {email , password} = req.body;
        let validUser = await User.findOne({ email });
        if(!validUser){
            return next(errorHandeler(404 , "User not Found"));
        }
        const validPassword = await bcryptjs.compare(password , validUser.password);
        if(!validPassword) {
            return next(errorHandeler(404 , "Invalid Creadentials"));
        }
        const token = jwt.sign({id: validUser._id }, JWT_SECRET, { expiresIn: '1h' });
        const {password : hashPassword , ...rest} = validUser._doc;
        res.cookie("token" , token , {httpOnly :true}).status(200).json({...rest , token});
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