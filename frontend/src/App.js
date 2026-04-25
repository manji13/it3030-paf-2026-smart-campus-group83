import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Shared Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TicketForm from './pages/member3/TicketForm';
import TicketList from './pages/member3/TicketList';
import ProtectedRoute from './routes/ProtectedRoute';

// Member 4 Pages
import Login from './pages/Member 4/Login';
import Register from './pages/Member 4/Registeer.js'; // Note: check if "Registeer.js" is a typo in your folder!
import UserManagement from './pages/Member 4/User.js';
import AdminDashboard from './pages/Member 4/AdminDashboard';
import StudentDashboard from './pages/Member 4/StudentDashboard';
import Notifications from './pages/Member 4/Notifications';

// Member 1 Pages
import FacilityCatalogue from './pages/member1/FacilityCatalogue';
import FacilityForm from './pages/member1/FacilityForm';

// Member 2 Pages
import BookingList from './pages/member2/BookingList';
import BookingForm from './pages/member2/BookingForm';
import AdminBookingList from './pages/member2/AdminBookingList';

const GOOGLE_CLIENT_ID = '1092425987615-n1n08cqpr6eos82binob7var1q8nsqrr.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Routes>
        {/* Main Route */}
        <Route path="/" element={<Home />} />

        {/* Member 4 Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/admin-page" element={<AdminDashboard />} />
        <Route path="/student-page" element={<StudentDashboard />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Member 1 Routes */}
        <Route path="/facilities" element={<FacilityCatalogue />} />
        <Route path="/facilities/new" element={<FacilityForm />} />
        <Route path="/facilities/edit/:id" element={<FacilityForm />} />

        {/* Member 2 Routes - Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/booking" element={<BookingList />} />
          <Route path="/booking/new" element={<BookingForm />} />
          <Route path="/bookings" element={<AdminBookingList />} />
        </Route>

        {/* Member 3 Routes */}
        <Route path="/ticketList" element={<TicketList />} />
        <Route path="/ticketForm" element={<TicketForm />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
