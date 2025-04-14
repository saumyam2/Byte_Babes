const axios = require('axios');

const fetchJobListings = async (req, res) => {
  try {
    const response = await axios.get('https://api.freewebapi.com/job-search', {
      headers: {
        'Authorization': `Bearer YOUR_API_KEY`
      },
      params: {
        query: 'software engineer',
        location: 'Mumbai',
        remote: true,
        full_time: true
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).send('Failed to fetch job listings');
  }
};

module.exports={fetchJobListings}