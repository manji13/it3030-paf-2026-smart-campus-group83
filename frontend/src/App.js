import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Home from './pages/Home';
import Login from './pages/Member 4/Login';
import Register from './pages/Member 4/Registeer.js';
import UserManagement from './pages/Member 4/User.js';
import AdminDashboard from './pages/Member 4/AdminDashboard';
import StudentDashboard from './pages/Member 4/StudentDashboard';

const GOOGLE_CLIENT_ID = '1092425987615-n1n08cqpr6eos82binob7var1q8nsqrr.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/admin-page" element={<AdminDashboard />} />
          <Route path="/student-page" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;