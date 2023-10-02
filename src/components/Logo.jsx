import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from "../assets/ConcertAccountant_animated.gif";

const Logo = () => { 
  return (
    <>
      <Link className='logoStart' to='/home'>
        <img className='logoImg' src={logoImg} alt='Concert Accountant Logo with speaker playing music' />
      </Link>
    </>
  )
}

export default Logo;