const Session = require('../model/chatbot');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const manageSession = async (req, res, next) => {
    let sessionId = req.headers['session-id'];
    let token = req.headers['authorization'];
    let userId = null;

    console.log("Received token:", token);

    if (!sessionId) {
        sessionId = uuidv4();
        req.newSession = true;
    }

    if (token) {
        if (!token.startsWith('Bearer ')) {
            console.log('Token format is invalid');
            return res.status(400).json({ message: "Token format is invalid" });
        }

        token = token.split(' ')[1];  

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decoded;  // Store the entire decoded token in req.user
            console.log("Decoded user:", req.user);
        } catch (err) {
            console.log("Invalid token:", err.message);
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        }
    }

    let session = await Session.findOne({ sessionId });
    if (!session) {
        session = new Session({ sessionId, userId: req.user?._id || null });
        await session.save();
        console.log("New session created:", session);
    }

    req.session = session;
    req.sessionId = sessionId;
    next();
};


module.exports = { manageSession };
