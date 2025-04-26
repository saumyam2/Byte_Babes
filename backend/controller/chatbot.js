const Session = require('../model/chatbot');
const path = require('path');
const axios = require('axios');

const handleUserMessage = async (req, res) => {
    try {
      const session = req.session;
      const userMessage = req.body.message;
      const file = req.file;
  
      const messageEntry = {
        sender: 'user',
        message: userMessage || null,
        fileUrl: file ? `/uploads/${file.filename}` : null,
        fileType: file?.mimetype || null,
        originalName: file?.originalname || null
      };
  
      session.conversation.push(messageEntry);
  
      // Get intent classification
      let intent = 'general_chat';
      try {
        const intentResponse = await axios.post('https://jobsforher-bytebabes.onrender.com/classify-intent/', {
          message: userMessage
        });
        intent = intentResponse.data.intent;
        console.log('Classified intent:', intent);
      } catch (error) {
        console.error('Intent classification failed:', error);
      }

      // Store the user message and intent in the session
      session.conversation.push({ 
        sender: "user",
        message: userMessage,
        intent: intent
      });
  
      await session.save();
  
      // Return the intent to frontend where appropriate component will be rendered
      res.json({
        sessionId: req.sessionId,
        intent: intent
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