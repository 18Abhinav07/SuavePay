/**
 * Registers a new user with the provided email, password, and wallet address.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.walletAddress - The wallet address of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */

/**
 * Logs in an existing user based on the provided wallet address and password.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.walletAddress - The wallet address of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */

/**
 * Checks if a wallet address exists in the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.walletAddress - The wallet address to check.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user with wallet address and password
exports.register = async (req, res) => {
    const { email, password, walletAddress } = req.body;

    try {
        // Check if wallet address already exists
        const existingUser = await User.findOne({ walletAddress });
        if (existingUser) return res.status(400).json({ message: 'Wallet address already registered' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({ email, password: hashedPassword, walletAddress });
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login existing user based on wallet address and password
exports.login = async (req, res) => {
    const { walletAddress, password } = req.body;

    try {
        // Find user by wallet address
        const user = await User.findOne({ walletAddress });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id, walletAddress: user.walletAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Check if wallet address exists in the database
exports.checkWallet = async (req, res) => {
    const { walletAddress } = req.body;

    try {
        const user = await User.findOne({ walletAddress });
        res.status(200).json({ exists: !!user });
    } catch (error) {
        res.status(500).json({ message: 'Error checking wallet', error });
    }
};
