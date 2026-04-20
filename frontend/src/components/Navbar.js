import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '15px', backgroundColor: '#282c34', display: 'flex', gap: '20px' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
      <Link to="/facilities" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Facility Catalogue</Link>
      <Link to="/booking" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Facility Booking</Link>
    </nav>
  );
}

export default Navbar;