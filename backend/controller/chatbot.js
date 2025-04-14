const Session = require('../model/chatbot');

const handleUserMessage = async (req, res) => {
    try {
        const userMessage = req.body.message; 
        const session = req.session;  
        console.log("User:", req.user?._id); // Access userId from req.user

        // Save the user message in the session
        session.conversation.push({ sender: "user", message: userMessage });

        let botResponse = "I'm here to help!";
        if (userMessage.toLowerCase().includes("job")) {
            botResponse = "What type of job are you looking for?";
        } else if (userMessage.toLowerCase().includes("remote")) {
            botResponse = "Are you looking for remote jobs?";
        }

        // Save bot response
        session.conversation.push({ sender: "bot", message: botResponse });

        // Save session
        await session.save();

        // Return chatbot response
        res.json({
            sessionId: req.sessionId,
            botResponse: botResponse,
        });

    } catch (error) {
        console.error("Error in chat controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getSession=async (req,res)=>{
    try {
        const sessionId=req.params.id;
        const session = await Session.findOne({ sessionId });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.json({
            sessionId: session.sessionId,
            conversation: session.conversation,
            createdAt: session.createdAt
        });
    } catch (error) {
        
    }
}

const getUserSessions = async (req, res) => {
    try {
        const userId = req.user._id; 
        const sessions = await Session.find({ userId });
        res.json(sessions);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching sessions:");
    }
};


module.exports={handleUserMessage,getSession,getUserSessions}