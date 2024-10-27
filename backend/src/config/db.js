const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Asynchronously connects to the MongoDB database using the connection URI
 * specified in the environment variable `MONGO_URI`.
 *
 * @async
 * @function
 * @throws Will throw an error if the connection to MongoDB fails.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
