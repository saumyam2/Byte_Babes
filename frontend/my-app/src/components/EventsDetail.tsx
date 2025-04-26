import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { Message } from '@/types';

interface Venue {
  name: string;
  rating?: number;
  reviews?: number;
}

interface EventDate {
  start_date?: string;
  when?: string;
}

interface Event {
  title: string;
  thumbnail?: string;
  date?: EventDate;
  venue?: Venue;
  address?: string[];
  description?: string;
  link?: string;
}

interface EventsComponentProps {
  onSearch?: (message: Message) => void;
}

export default function EventsComponent({ onSearch }: EventsComponentProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('Events in Mumbai');

  useEffect(() => {
    // Fetch events when component mounts or search query changes
    fetchEvents();
  }, []);

  const fetchEvents = async (query = searchQuery) => {
    try {
      setLoading(true);
      
      // Make API call to your backend endpoint
      const response = await axios.post('https://asha-ai-hackathon-xbkm.onrender.com/events/getevents', {
        q: query
      });

      if (response.data.success) {
        setEvents(response.data.data);
      } else {
        setError("Failed to fetch events");
      }
    } catch (err) {
      setError("An error occurred while fetching events");
      if (err instanceof Error) {
        console.error("Event fetch error:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchEvents(searchQuery);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Events Explorer</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for events (e.g., Events in Mumbai)"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
              {event.thumbnail ? (
                <img 
                  src={event.thumbnail} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/api/placeholder/400/320";
                    target.alt = "Event placeholder";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              
              {/* Date Badge */}
              {event.date && event.date.start_date && (
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-md text-sm font-medium">
                  {event.date.start_date}
                </div>
              )}
            </div>
            
            {/* Event Content */}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">{event.title}</h2>
              
              {/* Date & Time */}
              {event.date && event.date.when && (
                <div className="flex items-start mb-2">
                  <Clock className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{event.date.when}</span>
                </div>
              )}
              
              {/* Venue */}
              {event.venue && (
                <div className="flex items-start mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-gray-600 text-sm">{event.venue.name}</span>
                    {event.venue.rating && (
                      <div className="flex items-center mt-1">
                        {/* Rating Stars */}
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(event.venue?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">{event.venue.rating} ({event.venue.reviews} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Location */}
              {event.address && event.address.length > 0 && (
                <div className="flex items-start mb-4">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 text-sm line-clamp-2">{event.address[event.address.length - 1]}</span>
                </div>
              )}
              
              {/* Description (truncated) */}
              {event.description && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                </div>
              )}
              
              {/* Button */}
              {event.link && (
                <a 
                  href={event.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2"
                >
                  View Event
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {events.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-600">
          No events found. Try adjusting your search.
        </div>
      )}
    </div>
  );
}