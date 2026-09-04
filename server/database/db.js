const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async (url) => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        cachedConnection = conn;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        cachedConnection = null;
        console.error('Database connection error:', error.message);
        throw error;
    }
}

module.exports = connectDB;
