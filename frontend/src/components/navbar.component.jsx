import React, { useState } from 'react';
import logo from '../imgs/logo-one.png';
import { Link, Outlet } from 'react-router-dom';

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='flex-none w-14'>
          <img
            src={logo}
            alt='azarea company logo'
            className='flex-none w-full'
          />
        </Link>
        <div
          className={
            'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-none md:block md:relative md:w-auto md:inset-0 md:p-0 md:show ' +
            (searchBoxVisibility ? 'show' : 'hide')
          }
        >
          <input
            type='text'
            placeholder='search azarea articles'
            className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-lg placeholder:text-dark-grey md:pl-12'
          />
          <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey '></i>
        </div>
        <div className='flex items-center gap-3 md:gap-6 ml-auto '>
          <button
            className='md:hidden bg-grey w-12 h-12 rounded-lg  flex items-center justify-center'
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <i className='fi fi-rr-search text-dark-grey  text-xl'> </i>
          </button>

          <Link to='/editor' className='hidden md:flex gap-2 link rounded-lg'>
            <i className='fi fi-rr-file-edit'></i>
            <p>Write</p>
          </Link>
          <Link className='btn-dark py-2 rounded-lg' to='/signin'>
            Sign In
          </Link>
          <Link
            className='btn-light py-2 rounded-lg hidden md:block'
            to='/signup'
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* outlet allows you to render nested routes */}
      <Outlet />
    </>
  );
};

export default Navbar;
