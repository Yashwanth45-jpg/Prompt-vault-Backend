const UserModel = require('../models/user.models');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');


async function registerController(req, res) {
    try{const {username, password, email} = req.body;

    const ifuserExits = await UserModel.findOne({username})
    console.log(ifuserExits)
    if(ifuserExits) {
        return res.status(409).json({
            msg:"User Already Exits"
        })
    }
    const user = await UserModel.create({
        username,
        password : await bcrypt.hash(password, 10),
        email
    })

    const token = await jwt.sign({
        id:user._id,
    }, process.env.JWT_SECRET_KEY)

    res.cookie(token,"token");

    res.status(201).json({
        msg:"User registered Successfully",
        user,
        token
    })}
     catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ msg: "Server error during registration." });
    }
}

async function loginController(req, res) {
    const {username, password} = req.body;

    const user = await UserModel.findOne({
        username
    })

    if(!user) {
        return res.status(400).json({
            msg:"User Not Found"
        })
    }

    const isPasswordExits =  await bcrypt.compare(password, user.password);

    if(!isPasswordExits) {
        // I also fixed a small bug here where the status code was missing
        return res.status(401).json({
            msg:"Password is Incorrect"
        })
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY);

    res.cookie("token", token);

    // This is the corrected response. It now includes the token.
    res.status(201).json({
        msg:"User LoggedIn Successfully",
        user,
        token // <-- THE FIX IS HERE
    })
}

async function logoutController(req, res) {
    res.clearCookie('token');

    res.status(200).json({
        msg: "Logged out successfully"
    })
}

async function getProfile(req, res){
  // The authMiddleware already found the user and attached it to req.user
  res.status(200).json({ user: req.user });
};

module.exports = {registerController, loginController, logoutController, getProfile};