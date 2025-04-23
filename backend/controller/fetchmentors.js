const axios = require('axios');

// Function to fetch LinkedIn profiles based on search input
async function getLinkedInProfiles(userInput) {
  const {
    keywords = 'ml', // default search
    geoUrns = '103644278,101728296', // default to India locations
    count = 10
  } = userInput;

  const options = {
    method: 'POST',
    url: 'https://linkedin-data-scraper.p.rapidapi.com/search_person',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': 'linkedin-data-scraper.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPIDAPI_KEY // Store your key in .env
    },
    data: {
      keywords,
      geoUrns,
      count
    }
  };

  const response = await axios.request(options);
  return response.data;
}

// Express route controller for LinkedIn search
const fetchMentors = async (req, res) => {
  try {
    const userInput = req.body; 
    const data = await getLinkedInProfiles(userInput);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("LinkedIn fetch error:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch LinkedIn data" });
  }
};

module.exports = { fetchMentors };
