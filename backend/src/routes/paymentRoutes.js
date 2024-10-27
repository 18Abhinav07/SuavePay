/**
 * @fileoverview Routes for payment processing and transaction history.
 * @module routes/paymentRoutes
 */

 /**
    * Express router to mount payment related functions on.
    * @type {object}
    * @const
    * @namespace paymentRouter
    */

 /**
    * Route serving payment processing.
    * @name post/pay
    * @function
    * @memberof module:routes/paymentRoutes~paymentRouter
    * @inner
    * @param {string} path - Express path
    * @param {callback} middleware - Express middleware.
    * @param {callback} middleware - Express middleware.
    */

 /**
    * Route serving transaction history for a specific wallet address.
    * @name get/transactions/:walletAddress
    * @function
    * @memberof module:routes/paymentRoutes~paymentRouter
    * @inner
    * @param {string} path - Express path
    * @param {callback} middleware - Express middleware.
    * @param {callback} middleware - Express middleware.
    */
const express = require('express');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Payment processing route with authentication
router.post('/pay', authenticate, paymentController.processPayment);

// Get transaction history for a specific wallet address
router.get('/transactions/:walletAddress', authenticate, paymentController.getTransactions);

module.exports = router;
