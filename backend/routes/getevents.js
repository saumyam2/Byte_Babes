const express = require("express");
const router = express.Router();
const { fetchEvents } = require("../controller/getevents");

router.post("/getevents", fetchEvents);

module.exports = router;
