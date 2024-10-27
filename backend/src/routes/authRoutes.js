/**
 * @file authRoutes.js
 * @description This file contains the routes for authentication-related operations.
 * @module routes/authRoutes
 */

 /**
    * @name /register
    * @description Route to register a new user.
    * @function
    * @memberof module:routes/authRoutes
    * @inner
    * @param {Object} req - Express request object.
    * @param {Object} res - Express response object.
    */

 /**
    * @name /login
    * @description Route to log in an existing user.
    * @function
    * @memberof module:routes/authRoutes
    * @inner
    * @param {Object} req - Express request object.
    * @param {Object} res - Express response object.
    */

 /**
    * @name /check-wallet
    * @description Route to check if a wallet address exists (for pre-login check).
    * @function
    * @memberof module:routes/authRoutes
    * @inner
    * @param {Object} req - Express request object.
    * @param {Object} res - Express response object.
    */

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Route to check if wallet address exists (for pre-login check)
router.post('/check-wallet', authController.checkWallet);

module.exports = router;
