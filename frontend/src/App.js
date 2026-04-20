import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Member 4/Login';
import Register from './pages/Member 4/Registeer.js';
import UserManagement from './pages/Member 4/User.js';
import AdminDashboard from './pages/Member 4/AdminDashboard';
import StudentDashboard from './pages/Member 4/StudentDashboard';

function App() {
  return (
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
  );
}

export default App;