import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import TicketForm from './pages/member3/TicketForm';
import TicketList from './pages/member3/TicketList';


function App() {
  return (
    <Router>
      {/* ONLY Page Navigation Paths go here. No UI! */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ticketList" element={<TicketList />} />
        <Route path="/ticketForm" element={<TicketForm />} /> 

      </Routes>
    </Router>
  );
}

export default App;