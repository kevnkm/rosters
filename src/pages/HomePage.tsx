import React from 'react';
import { Link } from "react-router-dom";
import '../App.css';

function HomePage() {
  return (
    <div>
      <Link to="/about">Home</Link>
    </div>
  );
}

export default HomePage;
