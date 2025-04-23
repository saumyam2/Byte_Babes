const express = require("express");
const router = express.Router();
const { fetchMentors } = require("../controller/fetchmentors");

router.post("/search", fetchMentors);

module.exports = router;
