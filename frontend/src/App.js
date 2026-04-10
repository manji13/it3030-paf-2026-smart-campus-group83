import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';


function App() {
  return (
    <Router>
      {/* ONLY Page Navigation Paths go here. No UI! */}
      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;