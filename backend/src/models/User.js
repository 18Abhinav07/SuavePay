/**
 * @file User.js
 * @description Mongoose model for the User collection.
 */

 /**
    * @typedef {Object} User
    * @property {string} email - The email of the user. It is required and must be unique.
    * @property {string} password - The password of the user. It is required.
    * @property {string} walletAddress - The wallet address of the user. It must be unique.
    */

 /**
    * @module User
    * @requires mongoose
    */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletAddress: { type: String, unique: true },
});

module.exports = mongoose.model('User', userSchema);
