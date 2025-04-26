const mongoose = require('mongoose');
const messageSchema = require('./message.js');

const feedbackSchema = new mongoose.Schema({
    feedbackId: { 
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
    category:{
        type:String,
        enum: ['inaccuarte', 'biased','irrelevant'],
    },
    details:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '60m'
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);


