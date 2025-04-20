const axios = require("axios");
require('dotenv').config();
const FREE_JOB_API_KEY = process.env.FREE_JOB_API_KEY;

// Build job search filter based on user input
function buildFilter(userInput) {
  const {
    skills = [],
    titles = [],
    location = "IN",
    remote = true,
    days = 7
  } = userInput;

  return {
    page: 0,
    limit: 10,
    posted_at_max_age_days: days,
    job_country_code_or: [location],
    job_title_or: titles,
    job_technology_slug_or: skills,
    remote: remote,
    discovered_at_gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  };
}

// Call TheirStack API with the given filters
async function getJobsFromTheirStack(userInput) {
  const filters = buildFilter(userInput);

  const options = {
    method: "POST",
    url: "https://api.theirstack.com/v1/jobs/search",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FREE_JOB_API_KEY}`
    },
    data: filters
  };

  const response = await axios.request(options);
  return response.data.data;
}

// Express route controller for job search
const fetchJobs = async (req, res) => {
  try {
    const jobs = await getJobsFromTheirStack(req.body);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Job fetch error:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch jobs" });
  }
};

module.exports = { fetchJobs };
