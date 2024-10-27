/**
 * Process a payment between sender and receiver
 * 
 * @async
 * @function processPayment
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {number} req.body.amount - Amount to be transferred
 * @param {string} req.body.senderWalletAddress - Sender's wallet address
 * @param {string} req.body.receiverWalletAddress - Receiver's wallet address
 * @param {string} req.body.senderEmail - Sender's email address
 * @param {string} req.body.receiverEmail - Receiver's email address
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */

/**
 * Get all transactions related to a specific wallet address
 * 
 * @async
 * @function getTransactions
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.walletAddress - Wallet address to fetch transactions for
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const Transaction = require('../models/Transaction');

// Process a payment between sender and receiver
exports.processPayment = async (req, res) => {
    const { amount, senderWalletAddress, receiverWalletAddress, senderEmail, receiverEmail } = req.body;

    try {
        // Create the transaction record
        const transaction = await Transaction.create({ amount, senderWalletAddress, receiverWalletAddress, senderEmail, receiverEmail });
        res.status(201).json({ message: 'Payment processed', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error });
    }
};

// Get all transactions related to a specific wallet address
exports.getTransactions = async (req, res) => {
    const { walletAddress } = req.params;

    try {
        // Find all transactions involving the wallet address
        const transactions = await Transaction.find({ $or: [{ senderWalletAddress: walletAddress }, { receiverWalletAddress: walletAddress }] });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};
