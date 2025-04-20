const express = require('express');
const router = express.Router();
const upload=require('../middleware/multer')
const chatController = require('../controller/chatbot.js');
const { manageSession } = require('../middleware/session');
const authenticatetoken=require('../middleware/authenticate')

router.post('/message', manageSession,upload.single('file'), chatController.handleUserMessage);
router.get('/getmessage/:id',chatController.getSession);
router.get('/getusermessage',authenticatetoken,chatController.getUserSessions);


module.exports = router;
