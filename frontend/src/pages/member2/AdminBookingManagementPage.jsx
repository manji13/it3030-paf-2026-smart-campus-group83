import React, { useEffect, useState } from 'react';
import { member2Api } from '../../api/member2Api';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import StatusBadge from '../../components/common/StatusBadge';
import BookingStatusActionsMember2 from '../../components/member2/BookingStatusActionsMember2';
import { BOOKING_STATUS_OPTIONS } from '../../types/statusOptions';

const initialFilters = {
  resourceId: '',
  userId: '',
  status: '',
  date: ''
};

function AdminBookingManagementPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [bookings, setBookings] = useState([]);

  const loadBookings = async (activeFilters = filters) => {
    const payload = Object.fromEntries(
      Object.entries(activeFilters).filter(([, value]) => value !== '' && value !== null)
    );
    const response = await member2Api.getAdminBookings(payload);
    setBookings(response.data.data || []);
  };

  useEffect(() => {
    loadBookings(initialFilters);
  }, []);

  const handleDecision = async (bookingId, payload) => {
    await member2Api.decideBooking(bookingId, payload);
    loadBookings();
  };

  return (
    <div className="grid">
      <h2 style={{ marginTop: 0 }}>Admin Booking Management (member2)</h2>

      <SearchFilterBar
        fields={[
          { name: 'resourceId', label: 'Resource ID' },
          { name: 'userId', label: 'User ID' },
          { name: 'status', label: 'Status', type: 'select', options: BOOKING_STATUS_OPTIONS },
          { name: 'date', label: 'Date', type: 'date' }
        ]}
        values={filters}
        onChange={(name, value) => setFilters((prev) => ({ ...prev, [name]: value }))}
        onSubmit={(event) => {
          event.preventDefault();
          loadBookings(filters);
        }}
        onReset={() => {
          setFilters(initialFilters);
          loadBookings(initialFilters);
        }}
      />

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Resource</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.userId}</td>
                  <td>{booking.resourceId}</td>
                  <td>{booking.date}</td>
                  <td>
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td>
                    <StatusBadge status={booking.status} />
                  </td>
                  <td>
                    <BookingStatusActionsMember2 booking={booking} onDecision={handleDecision} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminBookingManagementPage;
