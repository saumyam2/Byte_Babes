const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatbot.js');
const { manageSession } = require('../middleware/session');
const authenticatetoken=require('../middleware/authenticate')

router.post('/message', manageSession, chatController.handleUserMessage);
router.get('/getmessage/:id',chatController.getSession);
router.get('/getusermessage',authenticatetoken,chatController.getUserSessions);

module.exports = router;
