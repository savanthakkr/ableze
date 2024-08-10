const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require("../middlewares/roleMiddleware");

const {loginUserOrcreate, sendPasswordOTP } = userController; 

router.post('/users/loginUserOrcreate', loginUserOrcreate);

router.post('/users/passwordOTP', sendPasswordOTP);



module.exports = router;
