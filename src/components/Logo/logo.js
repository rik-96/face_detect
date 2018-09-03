import React from 'react';
import Tilt from 'react-tilt';
import './logo.css';
import brain from './logo.png';

const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt className="Tilt" options={{ max : 55 }} style={{ height: 50, width: 50 }} >
        <div className="Tilt-inner"> <img alt="logo" src={brain} /> </div>
      </Tilt>
    </div>
  );
}

export default Logo;