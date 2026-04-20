import React, { useEffect, useState } from 'react';
import { member2Api } from '../../api/member2Api';
import StatusBadge from '../../components/common/StatusBadge';

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await member2Api.getMyBookings();
      setBookings(response.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    await member2Api.cancelBooking(bookingId);
    loadBookings();
  };

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>My Bookings (member2)</h2>

      {loading ? (
        <p className="muted">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="muted">No booking records found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Resource</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.date}</td>
                  <td>
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td>{booking.resourceId}</td>
                  <td>
                    <StatusBadge status={booking.status} />
                  </td>
                  <td>
                    {booking.status === 'APPROVED' ? (
                      <button className="btn danger" onClick={() => cancelBooking(booking.id)}>
                        Cancel
                      </button>
                    ) : (
                      <span className="muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default MyBookingsPage;
