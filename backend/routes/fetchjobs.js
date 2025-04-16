const express = require("express");
const router = express.Router();
const { fetchJobs } = require("../controller/fetchjobs");

router.post("/search", fetchJobs);


module.exports = router;
