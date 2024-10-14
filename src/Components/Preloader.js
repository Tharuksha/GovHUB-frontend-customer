import React from 'react';
import './Preloader.css';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="loader">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default Preloader;