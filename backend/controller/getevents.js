const axios = require('axios');
require('dotenv').config(); // Middleware to parse JSON bodies

const EVENT_API_KEY = process.env.EVENT_API_KEY;

// Build event search filter based on user input
function buildEventFilter(userInput) {
  const {
    q = "Events in India",  // Default query if 'q' is not provided
  } = userInput;

  return {
    q: q,  // Event query
    location: "india",  // Location (can be country or city, hardcoded as Austin)
    engine: 'google_events',  // SerpApi engine for event search
    api_key: EVENT_API_KEY,
    num: 10,  // Number of results to fetch
    timeframe: 365  // Timeframe (max number of days for event search, hardcoded as 365 days)
  };
}

// Function to fetch events using SerpApi
async function getEventsFromSerpApi(userInput) {
  const filters = buildEventFilter(userInput);

  const options = {
    method: "GET",
    url: "https://serpapi.com/search",
    params: filters
  };

  const response = await axios.request(options); 
  return response.data.events_results; 
}

// Express route controller for event search
const fetchEvents = async (req, res) => {
  try {
    const userInput = req.body;  // Only 'q' will be needed in the body
    const events = await getEventsFromSerpApi(userInput);
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Event fetch error:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch events" });
  }
};

module.exports = { fetchEvents };

