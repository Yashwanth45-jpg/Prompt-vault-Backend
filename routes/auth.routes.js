const express  = require('express')
const {registerController,loginController,logoutController, getProfile} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();


router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/profile', authMiddleware, getProfile);

module.exports = router