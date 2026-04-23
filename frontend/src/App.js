import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Shared Components
import Navbar from './components/Navbar';
import Home from './pages/Home';


// Member 4 Pages
import Login from './pages/Member 4/Login';
import Register from './pages/Member 4/Registeer.js'; // Note: check if "Registeer.js" is a typo in your folder!
import UserManagement from './pages/Member 4/User.js';
import AdminDashboard from './pages/Member 4/AdminDashboard';
import StudentDashboard from './pages/Member 4/StudentDashboard';
import Notifications from './pages/Member 4/Notifications';
import UserNotifications from './pages/Member 4/UserNotifications';

// Member 1 Pages
import FacilityCatalogue from './pages/member1/FacilityCatalogue';
import FacilityForm from './pages/member1/FacilityForm';

//member3
import MyTickets from './pages/member3/MyTicket';
import TicketForm from './pages/member3/TicketForm';
import TicketList from './pages/member3/TicketList';

const GOOGLE_CLIENT_ID = '1092425987615-n1n08cqpr6eos82binob7var1q8nsqrr.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
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
          <Route path="/user-notifications" element={<UserNotifications />} />
          
          {/* Member 1 Routes */}
          <Route path="/facilities" element={<FacilityCatalogue />} />
          <Route path="/facilities/new" element={<FacilityForm />} />
          <Route path="/facilities/edit/:id" element={<FacilityForm />} />
          
          {/* Member 3 Routes */}
          <Route path="/ticketList" element={<TicketList />} />
          <Route path="/ticketForm" element={<TicketForm />} />
          <Route path="/my-tickets" element={<MyTickets />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;