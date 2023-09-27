import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => { 
  return (
    <>
      <Link className='logo' to='/home'>
        <img className='logoImg' src='./assets/ConcertAccountant_animated.gif' alt='Concert Accountant Logo with speaker playing music' />
      </Link>
    </>
  )
}

export default Logo;