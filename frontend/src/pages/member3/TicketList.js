import React, { useEffect, useState } from 'react';
import AdminNav from '../../components/AdminNav'; // Adjust path if necessary

const API_BASE_URL = 'http://localhost:8000/api/tickets';
const BACKEND_BASE = 'http://localhost:8000';  // your backend origin

const TicketList = ({ refreshTrigger }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTickets(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Delete failed');
        fetchTickets();
      } catch (err) {
        console.error(err);
        alert('Delete failed');
      }
    }
  };

  const getImageUrl = (relativeUrl) => {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    return `${BACKEND_BASE}${relativeUrl}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Admin Navigation Bar */}
      <AdminNav />

      <div className="max-w-[1200px] mx-auto my-5 px-5">
        <h2 className="text-2xl font-bold mb-4">All Tickets</h2>

        {/* Loading State */}
        {loading && (
          <div className="text-center my-10 text-lg font-medium">Loading tickets...</div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-lg text-center my-5">
            {error}
          </div>
        )}

        {/* Tickets Content */}
        {!loading && !error && (
          <>
            {tickets.length === 0 ? (
              <div className="text-center my-10 text-gray-500 dark:text-gray-400">
                <p>No tickets found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
                    <h3 className="text-lg font-semibold mb-2">
                      {ticket.resource} - {ticket.location}
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300"><strong>Category:</strong> {ticket.category}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>Description:</strong> {ticket.description}</p>

                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      <strong>Priority:</strong>
                      <span
                        className="inline-block px-2 py-0.5 rounded ml-2 font-bold text-gray-900"
                        style={{
                          backgroundColor:
                            ticket.priority === 'HIGH' ? '#ffcccc' :
                            ticket.priority === 'MEDIUM' ? '#fff3cd' : '#d4edda'
                        }}
                      >
                        {ticket.priority}
                      </span>
                    </p>

                    <p className="mt-2 text-gray-700 dark:text-gray-300"><strong>Contact:</strong> {ticket.contactDetails}</p>

                    {ticket.imageUrls?.length > 0 && (
                      <div className="mt-3">
                        <strong className="text-gray-700 dark:text-gray-300">Images:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {ticket.imageUrls.map((url, idx) => {
                            const fullUrl = getImageUrl(url);
                            return (
                              <a key={idx} href={fullUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={fullUrl}
                                  alt={`ticket-img-${idx}`}
                                  className="w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-600 hover:opacity-80 transition-opacity"
                                />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="mt-4 px-4 py-2 bg-red-600 text-white font-medium rounded-lg cursor-pointer hover:bg-red-700 transition w-full sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TicketList;