const Feedback = require('../model/feedback');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const manageFeedback = async (req, res, next) => {
    let feedbackId = req.headers['feedback-id'];
    let token = req.headers['authorization'];
    let userId = null;

    console.log("Received token:", token);

    if (!feedbackId) {
        feedbackId = uuidv4();
        req.newFeedback = true;
    }

    if (token) {
        if (!token.startsWith('Bearer ')) {
            console.log('Token format is invalid');
            return res.status(400).json({ message: "Token format is invalid" });
        }

        token = token.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decoded;
            console.log("Decoded user:", req.user);
        } catch (err) {
            console.log("Invalid token:", err.message);
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        }
    }

    let feedback = await Feedback.findOne({ feedbackId });
    if (!feedback) {
        feedback = new Feedback({ feedbackId, userId: req.user?._id || null });
        await feedback.save();
        console.log("New feedback created:", feedback);
    }

    req.feedback = feedback;
    req.feedbackId = feedbackId;
    next();
};

module.exports = { manageFeedback };
