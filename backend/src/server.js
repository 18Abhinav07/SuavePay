/**
 * @fileoverview Main server file for the SuavePay backend.
 * @requires dotenv - Loads environment variables from a .env file into process.env.
 * @requires express - Fast, unopinionated, minimalist web framework for Node.js.
 * @requires cors - Middleware to enable Cross-Origin Resource Sharing (CORS).
 * @requires ./config/db - Module to connect to MongoDB.
 * @requires ./routes/authRoutes - Authentication routes.
 * @requires ./routes/paymentRoutes - Payment routes.
 */

 /**
    * Express application instance.
    * @const {Object} app - The Express application.
    */

 /**
    * Port number on which the server will listen.
    * @const {number|string} PORT - The port number from environment variables or default to 5000.
    */

 /**
    * Connect to MongoDB.
    * @function
    */

 /**
    * Middleware to enable CORS.
    * @function
    */

 /**
    * Middleware to parse incoming JSON requests.
    * @function
    */

 /**
    * Authentication routes.
    * @name /api/auth
    * @function
    */

 /**
    * Payment routes.
    * @name /api/payment
    * @function
    */

 /**
    * Starts the server and listens on the specified port.
    * @function
    * @param {number|string} PORT - The port number on which the server listens.
    * @returns {void}
    */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
