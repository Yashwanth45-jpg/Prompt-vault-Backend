// const jwt = require('jsonwebtoken')
// const userModel = require('../models/user.models')

// //par bar bar token check karna bahut hecktike hai isliye hame middleware folder banathe hai

// async function authMiddleware(req, res, next) {
//     const token = req.cookies.token;

//     if(!token) {
//         return res.status(401).json({
//             msg:"Unauthorized access, pls login!!"
//         })
//     }

//     //we will first verify kya token hamne create kiya hai 
//     //aur koi dusra server create kiya hai

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
//         const user = await userModel.findOne({
//             _id:decoded.id
//         })

//         req.user = user;
//         next();
//     }
//     catch(err) {
//         return res.status(401).json({
//             msg:"token not from our server"
//         })
//     }

// }

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.models'); // Make sure the path to your user model is correct

const authMiddleware = async (req, res, next) => {
  let token;

  // 1. Check the Authorization header for a "Bearer" token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token string from the header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token is valid
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // 4. Find the user from the token's ID and attach them to the request
      req.user = await UserModel.findById(decoded.id).select('-password');

      if (!req.user) {
          return res.status(401).json({ msg: 'User not found, authorization denied' });
      }

      // 5. If everything is successful, proceed to the route controller
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  // This runs if the Authorization header is missing entirely
  if (!token) {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

// The export needs to be an object to be imported correctly with { authMiddleware }
module.exports = { authMiddleware };
