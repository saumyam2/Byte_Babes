const mongoose = require('mongoose');
const messageSchema = require('./message.js');

const chatbotSchema = new mongoose.Schema({
    sessionId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null 
    },
    conversation: {
        type: [messageSchema], 
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '60m'
    }
});

module.exports = mongoose.model('Chatbot', chatbotSchema);

// {
//     "sessionId": "abc123-xyz789",
//     "conversation": [
//       {
//         "sender": "user",
//         "message": "Hi, I'm looking for a remote job.",
//         "timestamp": "2025-04-03T10:30:00Z"
//       },
//       {
//         "sender": "bot",
//         "message": "Sure! What kind of role are you interested in?",
//         "timestamp": "2025-04-03T10:30:02Z"
//       }
//     ],
//     "createdAt": "2025-04-03T10:30:00Z"
//   }
