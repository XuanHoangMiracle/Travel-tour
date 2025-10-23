import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';

const BookIcon = () => (
  <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19v4a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14Z"/>
  </svg>
);

const Navbar = () => {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tours', path: '/tours' },
    { name: 'Liên hệ', path: '/contact' },
    { name: 'Về chúng tôi', path: '/about' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full bg-amber-400 text-white flex items-center justify-between px-4 md:px-16 
    lg:px-24 xl:px-32 py-4 md:py-6 transition-all duration-300 z-50 shadow-sm ">

      {/* Logo */}
      <Link to='/'>
        <img src={assets.logo} alt="logo" className="h-14" />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} className="group flex flex-col gap-0.5">
            {link.name}
            <div className="bg-white h-0.5 w-0 group-hover:w-full transition-all duration-300" />
          </Link>
        ))}
        {/* <button
          className="border border-white px-4 py-1 text-sm font-light rounded-full cursor-pointer hover:bg-white hover:text-amber-500 transition-all"
          onClick={() => navigate('/admin')}
        >
          Dashboard
        </button> */}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="My Tours" labelIcon={<BookIcon />} onClick={() => navigate('/mybookings')} />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="px-8 py-2.5 rounded-full ml-4 border border-white bg-transparent text-white hover:bg-white hover:text-amber-500 transition-all duration-300"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        {user && (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="My Tours" labelIcon={<BookIcon />} onClick={() => navigate('/mybookings')} />
            </UserButton.MenuItems>
          </UserButton>
        )}
        <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={assets.menuIcon} alt="menu" className="h-4" />
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden 
        items-center justify-center gap-6 font-medium text-gray-800 transition-transform duration-500 ${isMenuOpen ?
         "translate-x-0" : "-translate-x-full"}`}>
        <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
          <img src={assets.closeIcon} alt="close-menu" className="h-6" />
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {/* {user && (
          <button
            className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
            onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}
          >
            Dashboard
          </button>
        )} */}

        {!user && (
          <button onClick={openSignIn} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-300">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;