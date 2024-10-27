/**
 * Middleware to authenticate a user using JWT.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 *
 * @description
 * This middleware function checks for a JWT token in the 'Authorization' header of the request.
 * If the token is present and valid, it attaches the decoded user information to the request object
 * and calls the next middleware function. If the token is missing or invalid, it responds with an
 * appropriate error message and status code.
 *
 * @throws {Error} If the token is invalid or missing.
 */
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token', error });
    }
};
