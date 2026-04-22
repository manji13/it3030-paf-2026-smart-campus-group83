import React, { useEffect, useState } from 'react';

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

  if (loading) return <div className="text-center my-5">Loading tickets...</div>;
  if (error) return <div className="text-red-500 text-center my-5">{error}</div>;

  return (
    <div className="max-w-[1200px] mx-auto my-5 px-5">
      <h2 className="text-2xl font-bold mb-4">All Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                {ticket.resource} - {ticket.location}
              </h3>

              <p><strong>Category:</strong> {ticket.category}</p>
              <p><strong>Description:</strong> {ticket.description}</p>

              <p>
                <strong>Priority:</strong>
                <span
                  className="inline-block px-2 py-0.5 rounded ml-2 font-bold"
                  style={{
                    backgroundColor:
                      ticket.priority === 'HIGH' ? '#ffcccc' :
                      ticket.priority === 'MEDIUM' ? '#fff3cd' : '#d4edda'
                  }}
                >
                  {ticket.priority}
                </span>
              </p>

              <p><strong>Contact:</strong> {ticket.contactDetails}</p>

              {ticket.imageUrls?.length > 0 && (
                <div className="mt-2">
                  <strong>Images:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ticket.imageUrls.map((url, idx) => {
                      const fullUrl = getImageUrl(url);
                      return (
                        <a key={idx} href={fullUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={fullUrl}
                            alt={`ticket-img-${idx}`}
                            className="w-16 h-16 object-cover rounded border border-gray-300"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleDelete(ticket.id)}
                className="mt-3 px-3 py-1 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;