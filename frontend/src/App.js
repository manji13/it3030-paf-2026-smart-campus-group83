import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import Navbar from './components/Navbar';
import FacilityCatalogue from './pages/member1/FacilityCatalogue';
import FacilityForm from './pages/member1/FacilityForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/facilities" element={<FacilityCatalogue />} />
        <Route path="/facilities/new" element={<FacilityForm />} />
        <Route path="/facilities/edit/:id" element={<FacilityForm />} />
      </Routes>
    </Router>
  );
}

export default App;