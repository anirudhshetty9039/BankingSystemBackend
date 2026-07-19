const express  = require('express');
const authController = require('../controller/auth.controller');

const router =  express.Router();

/*Post /api/auth/register*/
router.post("/register", authController.userRegisterController);

module.exports = router;
