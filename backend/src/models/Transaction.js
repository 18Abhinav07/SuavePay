/**
 * Transaction Schema
 * 
 * This schema represents a transaction in the SuavePay system.
 * 
 * @typedef {Object} Transaction
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user making the transaction. References the User model.
 * @property {number} amount - The amount of the transaction.
 * @property {string} senderWalletAddress - The wallet address of the sender.
 * @property {string} receiverWalletAddress - The wallet address of the receiver.
 * @property {string} senderEmail - The email address of the sender.
 * @property {string} receiverEmail - The email address of the receiver.
 * @property {Date} date - The date of the transaction. Defaults to the current date and time.
 */
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    senderWalletAddress: { type: String, required: true },
    receiverWalletAddress: { type: String, required: true },
    senderEmail: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
