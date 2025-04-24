const express = require('express');
const upload=require('../middleware/multer')
const { manageFeedback } = require('../middleware/feedback');
const { handleUserFeedback, getFeedback, getUserFeedbacks } = require('../controller/feedback');
const authenticatetoken=require('../middleware/authenticate')

const router = express.Router();

router.post('/feedback',manageFeedback,upload.single('file'), handleUserFeedback);
router.get('/feedback/:id', getFeedback);
router.get('/Userfeedback',authenticatetoken, getUserFeedbacks);

module.exports = router;
