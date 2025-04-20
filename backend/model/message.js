const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    default: null
  },
  fileType: {
    type: String,
    default: null
  },
  originalName: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = messageSchema;