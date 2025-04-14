const Feedback = require('../model/feedback');

const handleUserFeedback=async (req, res) => {
    try {
        const userMessage = req.body.message; 
        const feedback = req.feedback;  
       
        // Save the user message in the feedback
        feedback.conversation.push({ sender: "user", message: userMessage });

        let botResponse = "I'm here to help!";
        if (userMessage.toLowerCase().includes("job")) {
            botResponse = "What type of job are you looking for?";
        } else if (userMessage.toLowerCase().includes("remote")) {
            botResponse = "Are you looking for remote jobs?";
        }

        // Save bot response
        feedback.conversation.push({ sender: "bot", message: botResponse });

        // Save feedback
        await feedback.save();

        // Return chatbot response
        res.json({
            feedbackId: req.feedbackId,
            botResponse: botResponse,
        });

    } catch (error) {
        console.error("Error in chat controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports={handleUserFeedback}