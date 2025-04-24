const Feedback = require('../model/feedback');

const handleUserFeedback = async (req, res) => {
    try {
        const feedback = req.feedback;
        const userMessage = req.body.message;

        feedback.conversation.push({ sender: 'user', message: userMessage });
        let botResponse = "Thank you for your feedback!";
    
        feedback.conversation.push({ sender: 'bot', message: botResponse });
        await feedback.save();
        res.json({
            feedbackId: req.feedbackId,
            botResponse: botResponse
        });

    } catch (error) {
        console.error("Error in feedback controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// // Set category and optional details
// const updateFeedbackCategory = async (req, res) => {
//     try {
//         const { category, details } = req.body;
//         const feedback = req.feedback;

//         if (!['inaccuarte', 'biased', 'irrelevant'].includes(category)) {
//             return res.status(400).json({ message: 'Invalid feedback category' });
//         }

//         feedback.category = category;
//         feedback.details = details || '';
//         await feedback.save();

//         res.json({ message: 'Feedback category updated successfully' });

//     } catch (error) {
//         console.error("Error updating feedback category:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// Get a feedback conversation by ID
const getFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const feedback = await Feedback.findOne({ feedbackId });

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.json({
            feedbackId: feedback.feedbackId,
            conversation: feedback.conversation,
            category: feedback.category,
            details: feedback.details,
            createdAt: feedback.createdAt
        });

    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all feedbacks for a user
const getUserFeedbacks = async (req, res) => {
    try {
        const userId = req.user._id;
        const feedbacks = await Feedback.find({ userId });

        res.json(feedbacks);

    } catch (error) {
        console.error("Error fetching user feedbacks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    handleUserFeedback,
    getFeedback,
    getUserFeedbacks
};
