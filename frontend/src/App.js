import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Shared Components

import ProtectedRoute from './routes/ProtectedRoute';

// Member 4 Pages
import Login from './pages/Member 4/Login';
import Register from './pages/Member 4/Registeer.js';
import UserManagement from './pages/Member 4/User.js';
import AdminDashboard from './pages/Member 4/AdminDashboard';
import StudentDashboard from './pages/Member 4/StudentDashboard';
import Notifications from './pages/Member 4/Notifications';
import UserNotifications from './pages/Member 4/UserNotifications';

// Member 1 Pages
import FacilityCatalogue from './pages/member1/FacilityCatalogue';
import FacilityForm from './pages/member1/FacilityForm';
import AdminFacilitiesPage from './pages/member1/AdminFacilitiesPage';
import UserResourcesPage from './pages/member1/UserResourcesPage';

// Member 2 Pages
import BookingList from './pages/member2/BookingList';
import BookingForm from './pages/member2/BookingForm';
import AdminBookingList from './pages/member2/AdminBookingList';

// Member 3 Pages
import MyTickets from './pages/member3/MyTicket';
import TicketForm from './pages/member3/TicketForm';
import TicketList from './pages/member3/TicketList';
import TechnicianTickets from './pages/member3/TechnicianTickets';
import TechnicianNotifications from './pages/member3/TechnicianNotifications';

const GOOGLE_CLIENT_ID = '1092425987615-n1n08cqpr6eos82binob7var1q8nsqrr.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Routes>
        {/* Main Route */}
        <Route path="/" element={<Login />} />

        {/* Member 4 Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/admin-page" element={<AdminDashboard />} />
        <Route path="/student-page" element={<StudentDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/user-notifications" element={<UserNotifications />} />

        {/* Member 1 Routes */}
        <Route path="/facilities" element={<FacilityCatalogue />} />
        <Route path="/facilities/new" element={<FacilityForm />} />
        <Route path="/facilities/edit/:id" element={<FacilityForm />} />
        <Route path="/admin-facilities" element={<AdminFacilitiesPage />} />
        <Route path="/user-resources" element={<UserResourcesPage />} />

        {/* Member 2 Routes - Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/booking" element={<BookingList />} />
          <Route path="/booking/new" element={<BookingForm />} />
          <Route path="/bookings" element={<AdminBookingList />} />
        </Route>

        {/* Member 3 Routes */}
        <Route path="/ticketList" element={<TicketList />} />
        <Route path="/ticketForm" element={<TicketForm />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/technician-tickets" element={<TechnicianTickets />} />
        <Route path="/technician-notifications" element={<TechnicianNotifications />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;