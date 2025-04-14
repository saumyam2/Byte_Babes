const express = require('express');
const router = express.Router();
const feedbackController = require('../controller/feedback.js');
const { manageSession } = require('../middleware/session');


router.post('/feedback', manageSession, feedbackController.handleUserFeedback);

module.exports = router;
